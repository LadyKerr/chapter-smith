'use client';

import React, { useState } from 'react';
import { Chapter, VideoInfo, ProcessingState, UploadState, ValidationError } from '../types';
import { api } from '../utils';

// Import all components
import URLInput from './URLInput';
import TranscriptLoader from './TranscriptLoader';
import SRTUpload from './SRTUpload';
import ChaptersList from './ChaptersList';
import ExportButton from './ExportButton';
import ErrorDisplay from './ErrorDisplay';
import ThemeToggle from './ThemeToggle';

type AppState = 'input' | 'processing' | 'upload' | 'chapters' | 'error';

export default function ChapterSmithApp() {
  const [appState, setAppState] = useState<AppState>('input');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | ValidationError>('');
  
  // Processing states
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start...'
  });

  // Upload states
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle'
  });

  const handleURLSubmit = async (url: string) => {
    setAppState('processing');
    setError('');
    
    // Start processing simulation
    setProcessingState({
      status: 'validating',
      progress: 10,
      currentStep: 'Validating YouTube URL...',
      estimatedTimeRemaining: 120
    });

    try {
      // Step 1: Validate URL
      const urlValidation = await api.validateURL(url);
      if (!urlValidation.valid) {
        throw new Error(urlValidation.error || 'Invalid URL');
      }

      setVideoInfo(urlValidation.videoInfo);
      setProcessingState({
        status: 'extracting',
        progress: 40,
        currentStep: 'Extracting audio transcript...',
        estimatedTimeRemaining: 80
      });

      // Step 2: Generate chapters
      setProcessingState({
        status: 'generating',
        progress: 70,
        currentStep: 'Generating chapter markers...',
        estimatedTimeRemaining: 30
      });

      const result = await api.generateChapters(url);
      
      if (result.error) {
        // If no transcript available, show upload option
        if (result.error.includes('transcript')) {
          setAppState('upload');
          return;
        }
        throw new Error(result.error);
      }

      // Success
      setChapters(result.chapters);
      setProcessingState({
        status: 'completed',
        progress: 100,
        currentStep: 'Chapters generated successfully!'
      });

      setTimeout(() => {
        setAppState('chapters');
      }, 1000);

    } catch (error: any) {
      setError(error.message);
      setAppState('error');
    }
  };

  const handleSRTUpload = async (file: File) => {
    setUploadState({
      status: 'uploading',
      progress: 0,
      file
    });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        setUploadState(prev => ({ ...prev, progress }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const result = await api.uploadSRT(file);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setUploadState({
        status: 'success',
        file
      });

      setChapters(result.chapters);
      
      setTimeout(() => {
        setAppState('chapters');
      }, 1000);

    } catch (error: any) {
      setUploadState({
        status: 'error',
        error: error.message
      });
    }
  };

  const handleCopyChapter = (chapter: Chapter) => {
    console.log('Copied chapter:', chapter.title);
  };

  const handleCopyAll = () => {
    console.log('Copied all chapters');
  };

  const handleExport = (format: string) => {
    console.log('Export requested:', format);
  };

  const handleRegenerate = () => {
    setAppState('input');
    setChapters([]);
    setError('');
    setVideoInfo(null);
  };

  const handleRetry = () => {
    if (videoInfo) {
      handleURLSubmit(videoInfo.url);
    } else {
      setAppState('input');
    }
  };

  const handleTryDifferentVideo = () => {
    setAppState('input');
    setVideoInfo(null);
    setChapters([]);
    setError('');
  };

  const handleUploadSRT = () => {
    setAppState('upload');
  };

  const handleCancelProcessing = () => {
    setAppState('input');
    setProcessingState({
      status: 'idle',
      progress: 0,
      currentStep: 'Cancelled'
    });
  };

  const handleTryDifferentVideoFromUpload = () => {
    setAppState('input');
    setUploadState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto">
        {/* Header */}
        <header className="py-6">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chapter Smith</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {appState !== 'input' && (
                  <button
                    type="button"
                    onClick={handleTryDifferentVideo}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                  >
                    ← Start Over
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {appState === 'input' && (
            <URLInput
              onSubmit={handleURLSubmit}
              isLoading={false}
              error={typeof error === 'string' ? error : ''}
            />
          )}

          {appState === 'processing' && (
            <TranscriptLoader
              state={processingState}
              onCancel={handleCancelProcessing}
              videoInfo={videoInfo || undefined}
            />
          )}

          {appState === 'upload' && (
            <SRTUpload
              onFileUpload={handleSRTUpload}
              onTryDifferentVideo={handleTryDifferentVideoFromUpload}
              uploadState={uploadState}
            />
          )}

          {appState === 'chapters' && videoInfo && (
            <ChaptersList
              chapters={chapters}
              videoInfo={videoInfo}
              onCopyChapter={handleCopyChapter}
              onCopyAll={handleCopyAll}
              onExport={handleExport}
              onRegenerate={handleRegenerate}
            />
          )}

          {appState === 'error' && (
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              onTryDifferentVideo={handleTryDifferentVideo}
              onUploadSRT={handleUploadSRT}
              showActions={true}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Made with ❤️ for content creators
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    Terms
                  </a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}