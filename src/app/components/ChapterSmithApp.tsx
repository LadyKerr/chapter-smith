'use client';

import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Chapter, VideoInfo, ProcessingState, UploadState, ValidationError } from '../types';
import { api } from '../utils';

// Import all components
import URLInput from './URLInput';
import TranscriptLoader from './TranscriptLoader';
import SRTUpload from './SRTUpload';
import ChaptersList from './ChaptersList';
import ExportButton from './ExportButton';
import ErrorDisplay from './ErrorDisplay';

type AppState = 'input' | 'processing' | 'upload' | 'chapters' | 'error';

function getUserDisplayInfo(user?: { name?: string | null; email?: string | null }) {
  const accountConnectedLabel = 'GitHub account connected';
  const displayName = user?.name || user?.email || accountConnectedLabel;
  const secondaryLabel = user?.name && user?.email ? user.email : '';

  return { displayName, secondaryLabel };
}

export default function ChapterSmithApp() {
  const { data: session, status } = useSession();
  const userDisplayInfo = getUserDisplayInfo(session?.user);
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

  const handleSignIn = () => {
    void signIn('github');
  };

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Chapter Smith</h1>
          <p className="mt-4 text-sm text-gray-600">Checking your GitHub session…</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.096.682-.223.682-.496 0-.245-.009-.893-.014-1.752-2.782.62-3.37-1.384-3.37-1.384-.454-1.18-1.11-1.495-1.11-1.495-.908-.635.069-.622.069-.622 1.004.073 1.532 1.056 1.532 1.056.892 1.566 2.341 1.114 2.91.852.091-.667.349-1.114.635-1.37-2.221-.26-4.555-1.14-4.555-5.073 0-1.12.39-2.036 1.029-2.754-.104-.261-.446-1.312.097-2.736 0 0 .84-.277 2.75 1.052A9.37 9.37 0 0112 6.836a9.37 9.37 0 012.504.35c1.909-1.33 2.748-1.052 2.748-1.052.545 1.424.202 2.475.1 2.736.64.718 1.027 1.634 1.027 2.754 0 3.943-2.338 4.81-4.566 5.065.359.319.678.949.678 1.913 0 1.381-.012 2.495-.012 2.834 0 .275.18.596.688.495C19.138 20.617 22 16.776 22 12.25 22 6.59 17.523 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign in with GitHub to use Chapter Smith</h1>
            <p className="mt-4 text-base text-gray-600">
              Authenticate once to generate, manage, and export chapters through a protected app session.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleSignIn}
              className="inline-flex items-center gap-3 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.096.682-.223.682-.496 0-.245-.009-.893-.014-1.752-2.782.62-3.37-1.384-3.37-1.384-.454-1.18-1.11-1.495-1.11-1.495-.908-.635.069-.622.069-.622 1.004.073 1.532 1.056 1.532 1.056.892 1.566 2.341 1.114 2.91.852.091-.667.349-1.114.635-1.37-2.221-.26-4.555-1.14-4.555-5.073 0-1.12.39-2.036 1.029-2.754-.104-.261-.446-1.312.097-2.736 0 0 .84-.277 2.75 1.052A9.37 9.37 0 0112 6.836a9.37 9.37 0 012.504.35c1.909-1.33 2.748-1.052 2.748-1.052.545 1.424.202 2.475.1 2.736.64.718 1.027 1.634 1.027 2.754 0 3.943-2.338 4.81-4.566 5.065.359.319.678.949.678 1.913 0 1.381-.012 2.495-.012 2.834 0 .275.18.596.688.495C19.138 20.617 22 16.776 22 12.25 22 6.59 17.523 2 12 2z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        {/* Header */}
        <header className="py-6">
          <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Chapter Smith</h1>
                </div>

                <div className="flex items-center gap-3">
                  {appState !== 'input' && (
                    <button
                      type="button"
                      onClick={handleTryDifferentVideo}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      ← Start Over
                    </button>
                  )}

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-gray-900">{userDisplayInfo.displayName}</p>
                    {userDisplayInfo.secondaryLabel && (
                      <p className="text-xs text-gray-500">{userDisplayInfo.secondaryLabel}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
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
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">
                    Made with ❤️ for content creators
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-200">
                    Terms
                  </a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-200">
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
