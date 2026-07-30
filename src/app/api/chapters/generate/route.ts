import { NextRequest, NextResponse } from 'next/server';
import { 
  APIResponse, 
  ChapterGenerationRequest,
  ChapterGenerationResponse,
  GeneratedChapter,
  APIErrorCode,
  ValidationResult,
  YouTubeTranscriptSegment,
  YouTubeTranscriptResponse,
  YouTubeVideoInfo,
  AIModelConfig,
  ProcessingMetrics
} from '../../../types/api';
import { sanitizeErrorDetails } from '../../../utils/sanitize';

// Resolved chapter generation options (defaults applied)
interface ChapterOptions {
  minChapterLength: number;
  maxChapters: number;
  includeDescriptions: boolean;
  language: string;
}

// Shape of a chapter as returned by the AI model before post-processing
interface AIChapterCandidate {
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  confidence?: number;
  keywords?: string[];
}

// AI model configuration
const DEFAULT_AI_CONFIG: AIModelConfig = {
  model: 'gpt-4o-mini', // Using GPT-4o mini for faster, cost-effective processing
  temperature: 0.3,
  maxTokens: 4000,
  systemPrompt: `You are an expert at analyzing video transcripts and creating meaningful chapter divisions. 
Your task is to identify natural break points in the content and create descriptive chapter titles.

Guidelines:
- Create chapters that are at least 60 seconds long unless the content naturally breaks earlier
- Focus on topic changes, major transitions, or distinct segments
- Make titles descriptive but concise (max 60 characters)
- Include brief descriptions that summarize what's covered in each chapter
- Ensure timestamps are accurate and sequential
- Aim for 5-15 chapters for most videos
- Consider the overall narrative flow and content structure`,
  userPromptTemplate: `Analyze this video transcript and create chapter divisions:

Video Title: {title}
Duration: {duration} seconds
Transcript Language: {language}

Transcript segments:
{transcript}

Create chapters in JSON format with this structure:
{
  "chapters": [
    {
      "title": "Chapter title (max 60 chars)",
      "description": "Brief description of what's covered",
      "startTime": 0,
      "endTime": 120,
      "confidence": 0.95,
      "keywords": ["key", "topics", "covered"]
    }
  ]
}

Requirements:
- Minimum chapter length: {minChapterLength} seconds
- Maximum chapters: {maxChapters}
- Include descriptions: {includeDescriptions}
- Each chapter should have a confidence score (0-1)
- Keywords should capture main topics discussed`
};

/**
 * Chapter Generation API Endpoint
 * Generates chapter markers from video transcripts using AI
 * 
 * POST /api/chapters/generate
 * 
 * Body: {
 *   videoId?: string,
 *   url?: string,
 *   transcript?: YouTubeTranscriptSegment[],
 *   options?: {
 *     minChapterLength?: number,
 *     maxChapters?: number,
 *     includeDescriptions?: boolean,
 *     language?: string
 *   }
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = generateRequestId();
  let videoId: string | undefined;

  try {
    // Parse and validate request body
    const body: ChapterGenerationRequest = await request.json();
    videoId = body.videoId;
    const validation = validateChapterRequest(body);
    
    if (!validation.isValid) {
      return createErrorResponse(
        APIErrorCode.INVALID_FIELD_TYPE,
        'Validation failed',
        validation.errors,
        400
      );
    }

    // Set default options
    const options = {
      minChapterLength: 60,
      maxChapters: 20,
      includeDescriptions: true,
      language: 'en',
      ...body.options
    };

    let transcript: YouTubeTranscriptSegment[];
    let videoInfo: YouTubeVideoInfo | null = null;

    // If transcript not provided, fetch it
    if (!body.transcript) {
      if (!body.videoId && !body.url) {
        return createErrorResponse(
          APIErrorCode.MISSING_REQUIRED_FIELD,
          'Either transcript or videoId/url is required',
          null,
          400
        );
      }

      // Fetch transcript from our transcript API
      const transcriptResponse = await fetchTranscript(body.videoId || body.url!);
      if (!transcriptResponse.success) {
        return createErrorResponse(
          APIErrorCode.NO_TRANSCRIPT_AVAILABLE,
          'Failed to fetch transcript',
          transcriptResponse.error,
          400
        );
      }

      transcript = transcriptResponse.data.segments;
      videoInfo = {
        id: transcriptResponse.data.videoId,
        title: transcriptResponse.data.title,
        description: '',
        duration: transcriptResponse.data.duration.toString(),
        channelTitle: '',
        publishedAt: '',
        thumbnailUrl: '',
        url: body.url || `https://www.youtube.com/watch?v=${transcriptResponse.data.videoId}`
      };
    } else {
      transcript = body.transcript;
    }

    // Validate transcript content
    if (!transcript || transcript.length === 0) {
      return createErrorResponse(
        APIErrorCode.INSUFFICIENT_CONTENT,
        'Transcript is empty or too short to generate chapters',
        null,
        400
      );
    }

    // Check content length requirements
    const totalDuration = Math.max(...transcript.map(s => s.start + s.duration));
    if (totalDuration < options.minChapterLength * 2) {
      return createErrorResponse(
        APIErrorCode.INSUFFICIENT_CONTENT,
        `Video too short for chapter generation. Minimum duration: ${options.minChapterLength * 2} seconds`,
        { actualDuration: totalDuration, minimumDuration: options.minChapterLength * 2 },
        400
      );
    }

    // Generate chapters using AI
    const generationStartTime = Date.now();
    const chapters = await generateChaptersWithAI(transcript, videoInfo, options);
    const generationTime = Date.now() - generationStartTime;

    if (!chapters || chapters.length === 0) {
      return createErrorResponse(
        APIErrorCode.CHAPTER_GENERATION_FAILED,
        'Failed to generate meaningful chapters from the content',
        null,
        500
      );
    }

    // Post-process and validate generated chapters
    const processedChapters = postProcessChapters(chapters, totalDuration, options);

    // Prepare response
    const response: ChapterGenerationResponse = {
      videoInfo: videoInfo || {
        id: body.videoId || 'unknown',
        title: 'Untitled Video',
        description: '',
        duration: totalDuration.toString(),
        channelTitle: '',
        publishedAt: '',
        thumbnailUrl: '',
        url: body.url || ''
      },
      chapters: processedChapters,
      metadata: {
        totalChapters: processedChapters.length,
        averageChapterLength: Math.round(totalDuration / processedChapters.length),
        processingTimeMs: Date.now() - startTime,
        model: DEFAULT_AI_CONFIG.model,
        language: options.language
      }
    };

    // Log success metrics
    await logProcessingMetrics({
      requestId,
      videoId: videoInfo?.id || 'unknown',
      transcriptFetchTimeMs: 0,
      chapterGenerationTimeMs: generationTime,
      totalProcessingTimeMs: Date.now() - startTime,
      transcriptLength: transcript.length,
      chaptersGenerated: processedChapters.length,
      aiModel: DEFAULT_AI_CONFIG.model,
      success: true
    });

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Chapter generation error:', error);
    
    // Log error metrics
    await logProcessingMetrics({
      requestId,
      videoId: videoId || 'unknown',
      chapterGenerationTimeMs: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof AIServiceError) {
      return createErrorResponse(
        error.code,
        error.message,
        error.details,
        error.statusCode
      );
    }

    return createErrorResponse(
      APIErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to generate chapters',
      process.env.NODE_ENV === 'development' ? { stack: error } : null,
      500
    );
  }
}

/**
 * Validate chapter generation request
 */
function validateChapterRequest(body: ChapterGenerationRequest): ValidationResult {
  const errors = [];
  const warnings = [];

  // Validate options if provided
  if (body.options) {
    const opts = body.options;

    if (opts.minChapterLength !== undefined) {
      if (typeof opts.minChapterLength !== 'number' || opts.minChapterLength < 30) {
        errors.push({
          field: 'options.minChapterLength',
          code: 'INVALID_VALUE',
          message: 'Minimum chapter length must be at least 30 seconds',
          value: opts.minChapterLength
        });
      }
      if (opts.minChapterLength > 600) {
        warnings.push({
          field: 'options.minChapterLength',
          code: 'LARGE_VALUE',
          message: 'Very large minimum chapter length may result in fewer chapters',
          suggestion: 'Consider using 60-180 seconds for optimal results'
        });
      }
    }

    if (opts.maxChapters !== undefined) {
      if (typeof opts.maxChapters !== 'number' || opts.maxChapters < 2) {
        errors.push({
          field: 'options.maxChapters',
          code: 'INVALID_VALUE',
          message: 'Maximum chapters must be at least 2',
          value: opts.maxChapters
        });
      }
      if (opts.maxChapters > 50) {
        warnings.push({
          field: 'options.maxChapters',
          code: 'LARGE_VALUE',
          message: 'Very high chapter count may result in poor quality divisions',
          suggestion: 'Consider limiting to 15-25 chapters for better results'
        });
      }
    }

    if (opts.language !== undefined) {
      if (typeof opts.language !== 'string' || opts.language.length !== 2) {
        errors.push({
          field: 'options.language',
          code: 'INVALID_FORMAT',
          message: 'Language must be a 2-character language code (e.g., "en", "es", "fr")',
          value: opts.language
        });
      }
    }
  }

  // Validate transcript format if provided
  if (body.transcript) {
    if (!Array.isArray(body.transcript)) {
      errors.push({
        field: 'transcript',
        code: 'INVALID_TYPE',
        message: 'Transcript must be an array of segments',
        value: typeof body.transcript
      });
    } else {
      body.transcript.forEach((segment, index) => {
        if (typeof segment.text !== 'string' || segment.text.trim().length === 0) {
          errors.push({
            field: `transcript[${index}].text`,
            code: 'INVALID_VALUE',
            message: 'Segment text cannot be empty',
            value: segment.text
          });
        }
        if (typeof segment.start !== 'number' || segment.start < 0) {
          errors.push({
            field: `transcript[${index}].start`,
            code: 'INVALID_VALUE',
            message: 'Segment start time must be a non-negative number',
            value: segment.start
          });
        }
        if (typeof segment.duration !== 'number' || segment.duration <= 0) {
          errors.push({
            field: `transcript[${index}].duration`,
            code: 'INVALID_VALUE',
            message: 'Segment duration must be a positive number',
            value: segment.duration
          });
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Fetch transcript from our internal API
 */
async function fetchTranscript(videoIdOrUrl: string): Promise<APIResponse<YouTubeTranscriptResponse>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/youtube/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be') ? 'url' : 'videoId']: videoIdOrUrl
      })
    });

    return await response.json() as APIResponse<YouTubeTranscriptResponse>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: APIErrorCode.EXTERNAL_SERVICE_ERROR,
        message: 'Failed to fetch transcript',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

/**
 * Generate chapters using AI (OpenAI)
 */
async function generateChaptersWithAI(
  transcript: YouTubeTranscriptSegment[],
  videoInfo: YouTubeVideoInfo | null,
  options: ChapterOptions
): Promise<GeneratedChapter[]> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new AIServiceError(
      APIErrorCode.AI_SERVICE_UNAVAILABLE,
      'AI service not configured',
      { service: 'openai' },
      503
    );
  }

  // Prepare transcript text
  const transcriptText = transcript
    .map(segment => `[${formatTime(segment.start)}] ${segment.text}`)
    .join('\n');

  // Prepare prompt
  const userPrompt = DEFAULT_AI_CONFIG.userPromptTemplate!
    .replace('{title}', videoInfo?.title || 'Untitled Video')
    .replace('{duration}', Math.max(...transcript.map(s => s.start + s.duration)).toString())
    .replace('{language}', options.language)
    .replace('{transcript}', transcriptText)
    .replace('{minChapterLength}', options.minChapterLength.toString())
    .replace('{maxChapters}', options.maxChapters.toString())
    .replace('{includeDescriptions}', options.includeDescriptions.toString());

  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_AI_CONFIG.model,
        max_tokens: DEFAULT_AI_CONFIG.maxTokens,
        temperature: DEFAULT_AI_CONFIG.temperature,
        messages: [
          {
            role: 'system',
            content: DEFAULT_AI_CONFIG.systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', { status: response.status, error: errorData });
      
      // In development, return mock chapters when AI service is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('AI service unavailable, returning mock chapters for development');
        const duration = Math.max(...transcript.map(s => s.start + s.duration));
        return [
          {
            id: 'ch_1',
            timestamp: '00:00',
            title: 'Introduction',
            description: 'Welcome and overview of the topic',
            startTime: 0
          },
          {
            id: 'ch_2',
            timestamp: formatTime(Math.floor(duration * 0.2)),
            title: 'Getting Started',
            description: 'Setting up the development environment',
            startTime: Math.floor(duration * 0.2)
          },
          {
            id: 'ch_3',
            timestamp: formatTime(Math.floor(duration * 0.4)),
            title: 'Core Concepts',
            description: 'Understanding the main ideas and implementation',
            startTime: Math.floor(duration * 0.4)
          },
          {
            id: 'ch_4',
            timestamp: formatTime(Math.floor(duration * 0.6)),
            title: 'Advanced Features',
            description: 'Exploring advanced functionality',
            startTime: Math.floor(duration * 0.6)
          },
          {
            id: 'ch_5',
            timestamp: formatTime(Math.floor(duration * 0.8)),
            title: 'Conclusion',
            description: 'Summary and next steps',
            startTime: Math.floor(duration * 0.8)
          }
        ];
      }
      
      throw new AIServiceError(
        APIErrorCode.AI_SERVICE_UNAVAILABLE,
        `AI service error: ${response.status}`,
        { status: response.status, error: errorData },
        response.status
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new AIServiceError(
        APIErrorCode.CHAPTER_GENERATION_FAILED,
        'No content received from AI service',
        null,
        500
      );
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new AIServiceError(
        APIErrorCode.CHAPTER_GENERATION_FAILED,
        'Invalid response format from AI service',
        { content },
        500
      );
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    const chapters = parsedResponse.chapters as AIChapterCandidate[];

    if (!Array.isArray(chapters) || chapters.length === 0) {
      throw new AIServiceError(
        APIErrorCode.CHAPTER_GENERATION_FAILED,
        'No valid chapters generated',
        { response: parsedResponse },
        500
      );
    }

    // Convert to our chapter format
    return chapters.map((chapter, index) => ({
      id: generateChapterId(index),
      timestamp: formatTime(chapter.startTime),
      title: chapter.title,
      description: chapter.description,
      startTime: chapter.startTime,
      endTime: chapter.endTime,
      confidence: chapter.confidence || 0.8,
      keywords: chapter.keywords || []
    }));

  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    
    throw new AIServiceError(
      APIErrorCode.AI_SERVICE_UNAVAILABLE,
      'Failed to communicate with AI service',
      { originalError: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
}

/**
 * Post-process and validate generated chapters
 */
function postProcessChapters(
  chapters: GeneratedChapter[],
  totalDuration: number,
  options: ChapterOptions
): GeneratedChapter[] {
  // Sort by start time
  chapters.sort((a, b) => a.startTime - b.startTime);

  // Ensure first chapter starts at 0
  if (chapters.length > 0 && chapters[0].startTime > 0) {
    chapters[0].startTime = 0;
    chapters[0].timestamp = '00:00';
  }

  // Fill in end times and validate sequence
  for (let i = 0; i < chapters.length; i++) {
    const currentChapter = chapters[i];
    const nextChapter = chapters[i + 1];

    if (nextChapter) {
      currentChapter.endTime = nextChapter.startTime;
    } else {
      currentChapter.endTime = totalDuration;
    }

    // Ensure minimum chapter length
    const chapterLength = currentChapter.endTime - currentChapter.startTime;
    if (chapterLength < options.minChapterLength && i < chapters.length - 1) {
      // Merge with next chapter or extend current one
      if (nextChapter) {
        nextChapter.startTime = currentChapter.startTime;
        nextChapter.timestamp = currentChapter.timestamp;
        chapters.splice(i, 1);
        i--; // Reprocess the merged chapter
      }
    }

    // Ensure titles are not too long
    if (currentChapter.title.length > 60) {
      currentChapter.title = currentChapter.title.substring(0, 57) + '...';
    }

    // Validate timestamp format
    currentChapter.timestamp = formatTime(currentChapter.startTime);
  }

  return chapters;
}

/**
 * Format seconds to timestamp string
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate unique chapter ID
 */
function generateChapterId(index: number): string {
  return `ch_${Date.now()}_${index.toString().padStart(3, '0')}`;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log processing metrics
 */
async function logProcessingMetrics(metrics: ProcessingMetrics & { requestId: string; videoId: string; error?: string }): Promise<void> {
  // In production, send to analytics service, database, or monitoring system
  console.log('Chapter generation metrics:', metrics);
}

/**
 * Create standardized success response
 */
function createSuccessResponse<T>(data: T): NextResponse {
  const response: APIResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  return NextResponse.json(response, { status: 200 });
}

/**
 * Create standardized error response
 */
function createErrorResponse(
  code: APIErrorCode,
  message: string,
  details: unknown = null,
  status: number = 500
): NextResponse {
  const response: APIResponse<never> = {
    success: false,
    error: {
      code,
      message,
      details: sanitizeErrorDetails(details),
      ...(process.env.NODE_ENV === 'development' && { stack: new Error().stack })
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Custom AI Service Error class
 */
class AIServiceError extends Error {
  constructor(
    public code: APIErrorCode,
    message: string,
    public details: unknown = null,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}