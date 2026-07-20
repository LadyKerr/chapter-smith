// Utility functions for Chapter Smith

import { Chapter, ExportFormat, VideoInfo } from '../types';

// YouTube URL validation
export const validateYouTubeURL = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
  return youtubeRegex.test(url);
};

// Extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

// Format time from seconds to MM:SS or HH:MM:SS
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Parse time string to seconds
export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

// Format chapters for different export formats
export const formatChaptersForExport = (chapters: Chapter[], format: string): string => {
  switch (format) {
    case 'youtube':
      return chapters
        .map(chapter => `${chapter.timestamp} ${chapter.title}`)
        .join('\n');
    
    case 'text':
      return chapters
        .map(chapter => `${chapter.timestamp} - ${chapter.title}${chapter.description ? '\n  ' + chapter.description : ''}`)
        .join('\n\n');
    
    case 'json':
      return JSON.stringify({ chapters }, null, 2);
    
    case 'csv':
      const headers = 'Timestamp,Title,Description,Start Time (seconds)';
      const rows = chapters.map(chapter => 
        `"${chapter.timestamp}","${chapter.title}","${chapter.description || ''}",${chapter.startTime}`
      );
      return [headers, ...rows].join('\n');
    
    case 'srt':
      return chapters
        .map((chapter, index) => {
          const nextChapter = chapters[index + 1];
          const endTime = nextChapter ? nextChapter.startTime : chapter.startTime + 300; // 5 min default
          return [
            index + 1,
            `${formatSRTTime(chapter.startTime)} --> ${formatSRTTime(endTime)}`,
            chapter.title,
            chapter.description || '',
            ''
          ].join('\n');
        })
        .join('\n');
    
    default:
      return formatChaptersForExport(chapters, 'text');
  }
};

// Format time for SRT format (HH:MM:SS,mmm)
const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Download file
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Validate SRT file
export const validateSRTFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file.name.toLowerCase().endsWith('.srt')) {
      resolve(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Basic SRT format validation - should contain numbered entries with timestamps
      const srtPattern = /^\d+\s*\n\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}\s*\n/m;
      resolve(srtPattern.test(content));
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};

// Parse paste event to extract URL
export const extractURLFromPaste = (event: ClipboardEvent): string | null => {
  const clipboardData = event.clipboardData?.getData('text');
  if (!clipboardData) return null;

  // Try to find a YouTube URL in the pasted text
  const urlMatch = clipboardData.match(/(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/);
  return urlMatch ? urlMatch[0] : null;
};

// Debounce function for input validation
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Available export formats
export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'youtube',
    name: 'YouTube Description',
    description: 'Perfect for pasting directly into your video description',
    icon: 'youtube',
    mimeType: 'text/plain',
    extension: 'txt'
  },
  {
    id: 'text',
    name: 'Plain Text',
    description: 'Simple timestamps with chapter titles',
    icon: 'document',
    mimeType: 'text/plain',
    extension: 'txt'
  },
  {
    id: 'json',
    name: 'JSON Format',
    description: 'Structured data for developers',
    icon: 'code',
    mimeType: 'application/json',
    extension: 'json'
  },
  {
    id: 'csv',
    name: 'CSV Format',
    description: 'Spreadsheet compatible format',
    icon: 'table',
    mimeType: 'text/csv',
    extension: 'csv'
  },
  {
    id: 'srt',
    name: 'SRT Subtitles',
    description: 'Subtitle file format',
    icon: 'subtitles',
    mimeType: 'text/srt',
    extension: 'srt'
  }
];

// Production API functions integrated with backend endpoints
export const api = {
  validateURL: async (url: string): Promise<{ valid: boolean; videoInfo?: VideoInfo; error?: string }> => {
    try {
      if (!validateYouTubeURL(url)) {
        return { valid: false, error: 'Invalid YouTube URL format' };
      }

      const response = await fetch('/api/youtube/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      
      if (!result.success) {
        return { 
          valid: false, 
          error: result.error?.message || 'Failed to validate URL'
        };
      }

      // Transform API response to expected format
      return {
        valid: true,
        videoInfo: {
          id: result.data.videoId,
          title: result.data.title,
          duration: formatTime(result.data.duration),
          url,
          thumbnailUrl: `https://img.youtube.com/vi/${result.data.videoId}/maxresdefault.jpg`
        }
      };
    } catch (error) {
      console.error('URL validation error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Provide more specific error if possible
      if (errorMessage.includes('fetch')) {
        return { 
          valid: false, 
          error: 'Network error. Please check your connection and try again.' 
        };
      }
      return { 
        valid: false, 
        error: errorMessage || 'Network error. Please check your connection and try again.' 
      };
    }
  },

  generateChapters: async (url: string): Promise<{ chapters: Chapter[]; error?: string }> => {
    try {
      const response = await fetch('/api/chapters/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      
      if (!result.success) {
        return { 
          chapters: [], 
          error: result.error?.message || 'Failed to generate chapters'
        };
      }

      // Transform API response to expected format
      const chapters: Chapter[] = result.data.chapters.map((chapter: Chapter) => ({
        id: chapter.id,
        timestamp: chapter.timestamp,
        title: chapter.title,
        description: chapter.description,
        startTime: chapter.startTime
      }));

      return { chapters };
    } catch (error) {
      console.error('Chapter generation error:', error);
      return { 
        chapters: [], 
        error: 'Failed to generate chapters. Please try again.' 
      };
    }
  },

  uploadSRT: async (file: File): Promise<{ chapters: Chapter[]; error?: string }> => {
    try {
      const isValid = await validateSRTFile(file);
      if (!isValid) {
        return { chapters: [], error: 'Invalid SRT file format' };
      }

      // For SRT files, we'll parse them locally and then generate chapters
      const text = await file.text();
      const parsedChapters = await parseSRTToChapters(text);
      
      if (parsedChapters.length === 0) {
        return { chapters: [], error: 'No valid chapters found in SRT file' };
      }

      return { chapters: parsedChapters };
    } catch (error) {
      console.error('SRT upload error:', error);
      return { 
        chapters: [], 
        error: 'Failed to process SRT file. Please check the format and try again.' 
      };
    }
  },

  exportChapters: async (chapters: Chapter[], format: string, videoInfo?: VideoInfo): Promise<{ content: string; filename: string; mimeType: string; error?: string }> => {
    try {
      const response = await fetch('/api/chapters/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chapters, 
          format,
          videoInfo,
          options: {
            includeTimestamps: true,
            includeDescriptions: true,
            includeVideoInfo: !!videoInfo
          }
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        return { 
          content: '', 
          filename: '', 
          mimeType: '',
          error: result.error?.message || 'Failed to export chapters'
        };
      }

      return {
        content: result.data.content,
        filename: result.data.filename,
        mimeType: result.data.mimeType
      };
    } catch (error) {
      console.error('Export error:', error);
      return { 
        content: '', 
        filename: '', 
        mimeType: '',
        error: 'Failed to export chapters. Please try again.' 
      };
    }
  }
};

// Helper function to parse SRT files into chapters
async function parseSRTToChapters(srtContent: string): Promise<Chapter[]> {
  const chapters: Chapter[] = [];
  const entries = srtContent.trim().split('\n\n');
  
  entries.forEach((entry, index) => {
    const lines = entry.trim().split('\n');
    if (lines.length >= 3) {
      const timeLine = lines[1];
      const titleLine = lines[2];
      const descriptionLines = lines.slice(3);
      
      // Parse timestamp (format: HH:MM:SS,mmm --> HH:MM:SS,mmm)
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2}),\d{3}\s*-->/);
      if (timeMatch) {
        const timestamp = timeMatch[1];
        const startTime = parseTimeToSeconds(timestamp);
        
        chapters.push({
          id: `srt_${index + 1}`,
          timestamp,
          title: titleLine.trim(),
          description: descriptionLines.join(' ').trim() || undefined,
          startTime
        });
      }
    }
  });
  
  return chapters;
}