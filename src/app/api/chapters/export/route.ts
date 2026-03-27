import { NextRequest, NextResponse } from 'next/server';
import {
  APIResponse,
  ExportRequest,
  ExportResponse,
  ExportFormat,
  ExportOptions,
  GeneratedChapter,
  YouTubeVideoInfo,
  APIErrorCode,
  ValidationResult
} from '../../../types/api';
import { requireAuth, checkUserRateLimit } from '../../../lib/auth-utils';

// Export format configurations
const EXPORT_FORMATS: Record<ExportFormat, {
  mimeType: string;
  extension: string;
  name: string;
  description: string;
}> = {
  youtube: {
    mimeType: 'text/plain',
    extension: 'txt',
    name: 'YouTube Description',
    description: 'Formatted for YouTube video descriptions'
  },
  text: {
    mimeType: 'text/plain',
    extension: 'txt',
    name: 'Plain Text',
    description: 'Simple text format with timestamps'
  },
  json: {
    mimeType: 'application/json',
    extension: 'json',
    name: 'JSON',
    description: 'Structured JSON data'
  },
  csv: {
    mimeType: 'text/csv',
    extension: 'csv',
    name: 'CSV',
    description: 'Comma-separated values for spreadsheets'
  },
  srt: {
    mimeType: 'text/srt',
    extension: 'srt',
    name: 'SRT Subtitles',
    description: 'SubRip subtitle format'
  },
  vtt: {
    mimeType: 'text/vtt',
    extension: 'vtt',
    name: 'WebVTT',
    description: 'Web Video Text Tracks format'
  },
  xml: {
    mimeType: 'application/xml',
    extension: 'xml',
    name: 'XML',
    description: 'Extensible Markup Language format'
  },
  markdown: {
    mimeType: 'text/markdown',
    extension: 'md',
    name: 'Markdown',
    description: 'Markdown format for documentation'
  }
};

/**
 * Chapter Export API Endpoint
 * Formats and exports chapters in various formats
 * 
 * POST /api/chapters/export
 * 
 * Body: {
 *   chapters: GeneratedChapter[],
 *   format: ExportFormat,
 *   videoInfo?: YouTubeVideoInfo,
 *   options?: ExportOptions
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  try {
    // Require authentication
    const session = await requireAuth(request);
    const userId = session.user.id;

    // Check rate limiting for authenticated user
    const rateLimitCheck = await checkUserRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: APIErrorCode.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded. Please try again later.',
            details: {
              limit: rateLimitCheck.limit,
              remaining: rateLimitCheck.remaining,
              retryAfter: rateLimitCheck.retryAfter,
            }
          },
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimitCheck.limit),
            'X-RateLimit-Remaining': String(rateLimitCheck.remaining),
            'Retry-After': String(rateLimitCheck.retryAfter || 0),
          }
        }
      );
    }

    // Parse and validate request body
    const body: ExportRequest = await request.json();
    const validation = validateExportRequest(body);
    
    if (!validation.isValid) {
      return createErrorResponse(
        APIErrorCode.INVALID_FIELD_TYPE,
        'Validation failed',
        validation.errors,
        400
      );
    }

    // Set default options
    const options: Required<ExportOptions> = {
      includeTimestamps: true,
      includeDescriptions: true,
      includeVideoInfo: false,
      customTemplate: '',
      timezone: 'UTC',
      ...body.options
    };

    // Validate format
    if (!EXPORT_FORMATS[body.format]) {
      return createErrorResponse(
        APIErrorCode.UNSUPPORTED_FORMAT,
        `Unsupported export format: ${body.format}`,
        { supportedFormats: Object.keys(EXPORT_FORMATS) },
        400
      );
    }

    // Generate content based on format
    const content = await generateExportContent(body.chapters, body.format, body.videoInfo, options);
    
    if (!content) {
      return createErrorResponse(
        APIErrorCode.EXPORT_FAILED,
        'Failed to generate export content',
        null,
        500
      );
    }

    // Generate filename
    const filename = generateFilename(body.videoInfo, body.format);
    
    // Calculate content size
    const contentSize = Buffer.byteLength(content, 'utf8');
    
    // Check if content is too large (10MB limit)
    if (contentSize > 10 * 1024 * 1024) {
      return createErrorResponse(
        APIErrorCode.FILE_TOO_LARGE,
        'Generated file exceeds size limit',
        { size: contentSize, limit: 10 * 1024 * 1024 },
        413
      );
    }

    // Prepare response
    const formatConfig = EXPORT_FORMATS[body.format];
    const response: ExportResponse = {
      content,
      filename,
      mimeType: formatConfig.mimeType,
      size: contentSize
    };

    // Log export metrics
    await logExportMetrics({
      requestId,
      format: body.format,
      chaptersCount: body.chapters.length,
      contentSize,
      processingTimeMs: Date.now() - startTime,
      success: true
    });

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Export error:', error);
    
    // Log error metrics
    await logExportMetrics({
      requestId,
      format: body?.format || 'unknown',
      chaptersCount: body?.chapters?.length || 0,
      processingTimeMs: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return createErrorResponse(
      APIErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to export chapters',
      process.env.NODE_ENV === 'development' ? { stack: error } : null,
      500
    );
  }
}

/**
 * GET endpoint to list available export formats
 */
export async function GET(): Promise<NextResponse> {
  const formats = Object.entries(EXPORT_FORMATS).map(([key, config]) => ({
    id: key,
    ...config
  }));

  return createSuccessResponse({
    formats,
    count: formats.length
  });
}

/**
 * Validate export request
 */
function validateExportRequest(body: ExportRequest): ValidationResult {
  const errors = [];
  const warnings = [];

  // Validate chapters
  if (!body.chapters || !Array.isArray(body.chapters)) {
    errors.push({
      field: 'chapters',
      code: 'MISSING_REQUIRED',
      message: 'Chapters array is required',
      value: body.chapters
    });
  } else if (body.chapters.length === 0) {
    errors.push({
      field: 'chapters',
      code: 'EMPTY_ARRAY',
      message: 'At least one chapter is required',
      value: body.chapters.length
    });
  } else {
    // Validate each chapter
    body.chapters.forEach((chapter, index) => {
      if (!chapter.title || typeof chapter.title !== 'string') {
        errors.push({
          field: `chapters[${index}].title`,
          code: 'INVALID_VALUE',
          message: 'Chapter title is required and must be a string',
          value: chapter.title
        });
      }
      
      if (typeof chapter.startTime !== 'number' || chapter.startTime < 0) {
        errors.push({
          field: `chapters[${index}].startTime`,
          code: 'INVALID_VALUE',
          message: 'Chapter start time must be a non-negative number',
          value: chapter.startTime
        });
      }

      if (!chapter.timestamp || typeof chapter.timestamp !== 'string') {
        errors.push({
          field: `chapters[${index}].timestamp`,
          code: 'INVALID_VALUE',
          message: 'Chapter timestamp is required and must be a string',
          value: chapter.timestamp
        });
      }
    });

    // Check for duplicate start times
    const startTimes = body.chapters.map(c => c.startTime);
    const duplicates = startTimes.filter((time, index) => startTimes.indexOf(time) !== index);
    if (duplicates.length > 0) {
      warnings.push({
        field: 'chapters',
        code: 'DUPLICATE_TIMESTAMPS',
        message: 'Some chapters have duplicate start times',
        suggestion: 'Ensure each chapter has a unique start time'
      });
    }
  }

  // Validate format
  if (!body.format || typeof body.format !== 'string') {
    errors.push({
      field: 'format',
      code: 'MISSING_REQUIRED',
      message: 'Export format is required',
      value: body.format
    });
  }

  // Validate options if provided
  if (body.options) {
    const opts = body.options;
    
    if (opts.customTemplate && typeof opts.customTemplate !== 'string') {
      errors.push({
        field: 'options.customTemplate',
        code: 'INVALID_TYPE',
        message: 'Custom template must be a string',
        value: typeof opts.customTemplate
      });
    }

    if (opts.timezone && typeof opts.timezone !== 'string') {
      errors.push({
        field: 'options.timezone',
        code: 'INVALID_TYPE',
        message: 'Timezone must be a string',
        value: typeof opts.timezone
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
 * Generate export content based on format
 */
async function generateExportContent(
  chapters: GeneratedChapter[],
  format: ExportFormat,
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): Promise<string> {
  // Sort chapters by start time
  const sortedChapters = [...chapters].sort((a, b) => a.startTime - b.startTime);

  switch (format) {
    case 'youtube':
      return generateYouTubeFormat(sortedChapters, videoInfo, options!);
    
    case 'text':
      return generateTextFormat(sortedChapters, videoInfo, options!);
    
    case 'json':
      return generateJSONFormat(sortedChapters, videoInfo, options!);
    
    case 'csv':
      return generateCSVFormat(sortedChapters, videoInfo, options!);
    
    case 'srt':
      return generateSRTFormat(sortedChapters, videoInfo, options!);
    
    case 'vtt':
      return generateVTTFormat(sortedChapters, videoInfo, options!);
    
    case 'xml':
      return generateXMLFormat(sortedChapters, videoInfo, options!);
    
    case 'markdown':
      return generateMarkdownFormat(sortedChapters, videoInfo, options!);
    
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate YouTube description format
 */
function generateYouTubeFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  let content = '';

  if (options?.includeVideoInfo && videoInfo) {
    content += `📹 ${videoInfo.title}\n`;
    if (videoInfo.channelTitle) {
      content += `👤 ${videoInfo.channelTitle}\n`;
    }
    content += '\n';
  }

  content += '⏰ CHAPTERS:\n';
  
  chapters.forEach(chapter => {
    content += `${chapter.timestamp} ${chapter.title}\n`;
  });

  if (options?.includeDescriptions && chapters.some(ch => ch.description)) {
    content += '\n📋 CHAPTER DESCRIPTIONS:\n';
    chapters.forEach(chapter => {
      if (chapter.description) {
        content += `\n${chapter.timestamp} - ${chapter.title}\n${chapter.description}\n`;
      }
    });
  }

  return content;
}

/**
 * Generate plain text format
 */
function generateTextFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  let content = '';

  if (options?.includeVideoInfo && videoInfo) {
    content += `Title: ${videoInfo.title}\n`;
    if (videoInfo.channelTitle) {
      content += `Channel: ${videoInfo.channelTitle}\n`;
    }
    if (videoInfo.duration) {
      content += `Duration: ${videoInfo.duration}\n`;
    }
    content += '\n';
  }

  content += 'CHAPTERS:\n\n';
  
  chapters.forEach((chapter, index) => {
    content += `${index + 1}. ${chapter.timestamp} - ${chapter.title}\n`;
    if (options?.includeDescriptions && chapter.description) {
      content += `   ${chapter.description}\n`;
    }
    content += '\n';
  });

  return content.trim();
}

/**
 * Generate JSON format
 */
function generateJSONFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  const data: any = {
    chapters: chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      ...(options?.includeTimestamps && { timestamp: chapter.timestamp }),
      startTime: chapter.startTime,
      ...(chapter.endTime !== undefined && { endTime: chapter.endTime }),
      ...(options?.includeDescriptions && chapter.description && { description: chapter.description }),
      ...(chapter.confidence !== undefined && { confidence: chapter.confidence }),
      ...(chapter.keywords && chapter.keywords.length > 0 && { keywords: chapter.keywords })
    })),
    metadata: {
      totalChapters: chapters.length,
      exportedAt: new Date().toISOString(),
      format: 'json',
      options
    }
  };

  if (options?.includeVideoInfo && videoInfo) {
    data.videoInfo = videoInfo;
  }

  return JSON.stringify(data, null, 2);
}

/**
 * Generate CSV format
 */
function generateCSVFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  const headers = [
    'Index',
    'Timestamp',
    'Title',
    'Start Time (seconds)',
    ...(chapter => chapter.endTime !== undefined ? ['End Time (seconds)'] : [])(),
    ...(options?.includeDescriptions ? ['Description'] : []),
    ...(chapters.some(ch => ch.confidence !== undefined) ? ['Confidence'] : []),
    ...(chapters.some(ch => ch.keywords && ch.keywords.length > 0) ? ['Keywords'] : [])
  ];

  const csvRows = [headers.join(',')];

  chapters.forEach((chapter, index) => {
    const row = [
      index + 1,
      `"${chapter.timestamp}"`,
      `"${chapter.title.replace(/"/g, '""')}"`,
      chapter.startTime,
      ...(chapter.endTime !== undefined ? [chapter.endTime] : []),
      ...(options?.includeDescriptions ? [`"${(chapter.description || '').replace(/"/g, '""')}"`] : []),
      ...(chapter.confidence !== undefined ? [chapter.confidence] : []),
      ...(chapter.keywords && chapter.keywords.length > 0 ? [`"${chapter.keywords.join(', ')}"`] : [])
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

/**
 * Generate SRT subtitle format
 */
function generateSRTFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  const srtEntries: string[] = [];

  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const endTime = chapter.endTime || nextChapter?.startTime || (chapter.startTime + 300); // 5min default
    
    const startSRT = formatTimeForSRT(chapter.startTime);
    const endSRT = formatTimeForSRT(endTime);

    const entry = [
      index + 1,
      `${startSRT} --> ${endSRT}`,
      chapter.title,
      ...(options?.includeDescriptions && chapter.description ? [chapter.description] : []),
      ''
    ].join('\n');

    srtEntries.push(entry);
  });

  return srtEntries.join('\n');
}

/**
 * Generate WebVTT format
 */
function generateVTTFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  let content = 'WEBVTT\n\n';

  if (options?.includeVideoInfo && videoInfo) {
    content += `NOTE\n${videoInfo.title}\n\n`;
  }

  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const endTime = chapter.endTime || nextChapter?.startTime || (chapter.startTime + 300);
    
    const startVTT = formatTimeForVTT(chapter.startTime);
    const endVTT = formatTimeForVTT(endTime);

    content += `${index + 1}\n`;
    content += `${startVTT} --> ${endVTT}\n`;
    content += `${chapter.title}\n`;
    
    if (options?.includeDescriptions && chapter.description) {
      content += `${chapter.description}\n`;
    }
    
    content += '\n';
  });

  return content;
}

/**
 * Generate XML format
 */
function generateXMLFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<chapters>\n';

  if (options?.includeVideoInfo && videoInfo) {
    xml += '  <videoInfo>\n';
    xml += `    <title>${escapeXML(videoInfo.title)}</title>\n`;
    if (videoInfo.channelTitle) {
      xml += `    <channel>${escapeXML(videoInfo.channelTitle)}</channel>\n`;
    }
    if (videoInfo.duration) {
      xml += `    <duration>${escapeXML(videoInfo.duration)}</duration>\n`;
    }
    xml += '  </videoInfo>\n';
  }

  chapters.forEach(chapter => {
    xml += '  <chapter>\n';
    xml += `    <id>${escapeXML(chapter.id)}</id>\n`;
    xml += `    <title>${escapeXML(chapter.title)}</title>\n`;
    xml += `    <timestamp>${escapeXML(chapter.timestamp)}</timestamp>\n`;
    xml += `    <startTime>${chapter.startTime}</startTime>\n`;
    
    if (chapter.endTime !== undefined) {
      xml += `    <endTime>${chapter.endTime}</endTime>\n`;
    }
    
    if (options?.includeDescriptions && chapter.description) {
      xml += `    <description>${escapeXML(chapter.description)}</description>\n`;
    }
    
    if (chapter.confidence !== undefined) {
      xml += `    <confidence>${chapter.confidence}</confidence>\n`;
    }
    
    if (chapter.keywords && chapter.keywords.length > 0) {
      xml += '    <keywords>\n';
      chapter.keywords.forEach(keyword => {
        xml += `      <keyword>${escapeXML(keyword)}</keyword>\n`;
      });
      xml += '    </keywords>\n';
    }
    
    xml += '  </chapter>\n';
  });

  xml += '</chapters>\n';
  return xml;
}

/**
 * Generate Markdown format
 */
function generateMarkdownFormat(
  chapters: GeneratedChapter[],
  videoInfo?: YouTubeVideoInfo,
  options?: Required<ExportOptions>
): string {
  let md = '';

  if (options?.includeVideoInfo && videoInfo) {
    md += `# ${videoInfo.title}\n\n`;
    if (videoInfo.channelTitle) {
      md += `**Channel:** ${videoInfo.channelTitle}\n`;
    }
    if (videoInfo.duration) {
      md += `**Duration:** ${videoInfo.duration}\n`;
    }
    if (videoInfo.url) {
      md += `**URL:** [${videoInfo.url}](${videoInfo.url})\n`;
    }
    md += '\n---\n\n';
  }

  md += '## Chapters\n\n';

  chapters.forEach((chapter, index) => {
    md += `### ${index + 1}. [${chapter.timestamp}] ${chapter.title}\n\n`;
    
    if (options?.includeDescriptions && chapter.description) {
      md += `${chapter.description}\n\n`;
    }

    if (chapter.keywords && chapter.keywords.length > 0) {
      md += `**Keywords:** ${chapter.keywords.map(k => `\`${k}\``).join(', ')}\n\n`;
    }
  });

  return md.trim();
}

/**
 * Generate filename based on video info and format
 */
function generateFilename(videoInfo?: YouTubeVideoInfo, format?: ExportFormat): string {
  const baseFilename = videoInfo?.title
    ? videoInfo.title.replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_').substring(0, 50)
    : 'youtube_chapters';
  
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format ? EXPORT_FORMATS[format].extension : 'txt';
  
  return `${baseFilename}_chapters_${timestamp}.${extension}`;
}

/**
 * Format time for SRT format (HH:MM:SS,mmm)
 */
function formatTimeForSRT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Format time for VTT format (HH:MM:SS.mmm)
 */
function formatTimeForVTT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log export metrics
 */
async function logExportMetrics(metrics: any): Promise<void> {
  // In production, send to analytics service, database, or monitoring system
  console.log('Export metrics:', metrics);
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
  details: any = null,
  status: number = 500
): NextResponse {
  const response: APIResponse<never> = {
    success: false,
    error: {
      code,
      message,
      details,
      ...(process.env.NODE_ENV === 'development' && { stack: new Error().stack })
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
  
  return NextResponse.json(response, { status });
}