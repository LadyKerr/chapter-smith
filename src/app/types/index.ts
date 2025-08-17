// TypeScript interfaces for Chapter Smith components

export interface Chapter {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  startTime: number; // in seconds
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnailUrl?: string;
}

export interface ProcessingState {
  status: 'idle' | 'validating' | 'extracting' | 'generating' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
  error?: string;
}

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  mimeType: string;
  extension: string;
}

export interface CopyState {
  status: 'idle' | 'copying' | 'success' | 'error';
  message?: string;
}

export interface UploadState {
  status: 'idle' | 'dragover' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
  file?: File;
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'url' | 'file' | 'network' | 'processing';
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Interfaces
export interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
}

export interface TranscriptLoaderProps {
  state: ProcessingState;
  onCancel: () => void;
  videoInfo?: VideoInfo;
}

export interface SRTUploadProps {
  onFileUpload: (file: File) => void;
  onTryDifferentVideo: () => void;
  uploadState: UploadState;
}

export interface ChaptersListProps {
  chapters: Chapter[];
  videoInfo: VideoInfo;
  onCopyChapter: (chapter: Chapter) => void;
  onCopyAll: () => void;
  onExport: (format: string) => void;
  onRegenerate: () => void;
}

export interface CopyButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'small' | 'default' | 'large';
  label?: string;
  onCopyComplete?: (success: boolean) => void;
}

export interface ExportButtonProps {
  chapters: Chapter[];
  videoInfo?: VideoInfo;
  onExportComplete?: (format: string, success: boolean) => void;
}

export interface ErrorDisplayProps {
  error: ValidationError | string;
  onRetry?: () => void;
  onTryDifferentVideo?: () => void;
  onUploadSRT?: () => void;
  showActions?: boolean;
}