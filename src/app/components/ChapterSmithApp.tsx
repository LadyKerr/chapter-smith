'use client';

import React, { useEffect, useState } from 'react';
import { Chapter, ProcessingState, UploadState, ValidationError, VideoInfo } from '../types';
import { api } from '../utils';

import ChaptersList from './ChaptersList';
import ErrorDisplay from './ErrorDisplay';
import SRTUpload from './SRTUpload';
import TranscriptLoader from './TranscriptLoader';
import URLInput from './URLInput';

type AppState = 'input' | 'processing' | 'upload' | 'chapters' | 'error';
type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'chapter-smith-theme';

export default function ChapterSmithApp() {
  const [appState, setAppState] = useState<AppState>('input');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | ValidationError>('');
  const [theme, setTheme] = useState<Theme>('light');
  const [isThemeReady, setIsThemeReady] = useState(false);

  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start...'
  });

  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle'
  });

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [isThemeReady, theme]);

  const handleURLSubmit = async (url: string) => {
    setAppState('processing');
    setError('');

    setProcessingState({
      status: 'validating',
      progress: 10,
      currentStep: 'Validating YouTube URL...',
      estimatedTimeRemaining: 120
    });

    try {
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

      setProcessingState({
        status: 'generating',
        progress: 70,
        currentStep: 'Generating chapter markers...',
        estimatedTimeRemaining: 30
      });

      const result = await api.generateChapters(url);

      if (result.error) {
        if (result.error.includes('transcript')) {
          setAppState('upload');
          return;
        }
        throw new Error(result.error);
      }

      setChapters(result.chapters);
      setProcessingState({
        status: 'completed',
        progress: 100,
        currentStep: 'Chapters generated successfully!'
      });

      setTimeout(() => {
        setAppState('chapters');
      }, 1000);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to generate chapters.');
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
      for (let progress = 0; progress <= 100; progress += 20) {
        setUploadState((previousState) => ({ ...previousState, progress }));
        await new Promise((resolve) => setTimeout(resolve, 200));
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
    } catch (caughtError) {
      setUploadState({
        status: 'error',
        error: caughtError instanceof Error ? caughtError.message : 'Failed to upload transcript.'
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
      return;
    }

    setAppState('input');
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

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto">
        <header className="py-6">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 shadow-sm shadow-blue-500/20 dark:bg-blue-400 dark:shadow-blue-400/20">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chapter Smith</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:ring-offset-slate-950"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <>
                      <svg className="h-4 w-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-8.486a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.95-2.464a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM4.343 5.05A1 1 0 102.93 6.464l.707.707A1 1 0 105.05 5.757l-.707-.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                      </svg>
                      <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span>Dark mode</span>
                    </>
                  )}
                </button>

                {appState !== 'input' && (
                  <button
                    type="button"
                    onClick={handleTryDifferentVideo}
                    className="text-sm text-slate-600 transition-colors duration-200 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    ← Start Over
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

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

        <footer className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
              <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-4 flex items-center space-x-2 md:mb-0">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Made with ❤️ for content creators
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <a href="#" className="transition-colors duration-200 hover:text-slate-900 dark:hover:text-slate-100">
                    Privacy
                  </a>
                  <a href="#" className="transition-colors duration-200 hover:text-slate-900 dark:hover:text-slate-100">
                    Terms
                  </a>
                  <a href="#" className="transition-colors duration-200 hover:text-slate-900 dark:hover:text-slate-100">
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
