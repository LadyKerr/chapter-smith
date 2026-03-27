'use client';

import React, { useState, useEffect } from 'react';
import { TranscriptLoaderProps } from '../types';

export default function TranscriptLoader({
  state,
  onCancel,
  videoInfo
}: TranscriptLoaderProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        const diff = state.progress - prev;
        return prev + (diff * 0.1); // Smooth animation
      });
    }, 50);

    return () => clearInterval(interval);
  }, [state.progress]);

  const getStepStatus = (stepName: string) => {
    const steps = ['validating', 'extracting', 'generating'];
    const currentIndex = steps.indexOf(state.status);
    const stepIndex = steps.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="transform rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 animate-fade-in dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            {/* Animated Processing Icon */}
            <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping dark:bg-blue-500/20"></div>
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 
                          dark:bg-blue-400
                          animate-pulse">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="mb-2 text-2xl font-semibold text-slate-900 animate-pulse-text dark:text-slate-100">
            Processing Video
          </h2>
          <p className="text-base text-slate-600 animate-fade-in delay-300 dark:text-slate-300">
            <span className="animate-typing">Analyzing your video and generating chapters</span>
            <span className="animate-dots">...</span>
          </p>
          
          {videoInfo && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 animate-fade-in delay-500 dark:bg-slate-800/80">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{videoInfo.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Duration: {videoInfo.duration}</p>
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Progress</span>
            <span className="text-sm font-medium text-blue-600 animate-count-up dark:text-blue-400">
              {Math.round(animatedProgress)}%
            </span>
          </div>
          <div 
            className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={animatedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Chapter generation progress"
          >
            {/* Background Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                          opacity-30 animate-shimmer"></div>
            
            {/* Animated Progress Fill */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                        transition-all duration-500 ease-out relative overflow-hidden
                       shadow-lg shadow-blue-500/30 dark:from-blue-400 dark:to-indigo-500 dark:shadow-blue-400/20"
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Progress Bar Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                            opacity-40 animate-slide-right"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Status Steps */}
        <div className="space-y-4 mb-8">
          {/* Step 1: Validating */}
          <div className={`flex items-center transition-all duration-500 ${
            getStepStatus('validating') === 'pending' ? 'opacity-30' : 'opacity-100 animate-fade-in-left delay-100'
          }`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center 
                          ${getStepStatus('validating') === 'completed' 
                             ? 'bg-green-500 animate-scale-in delay-200 dark:bg-green-400' 
                             : getStepStatus('validating') === 'current'
                             ? 'bg-blue-500 animate-pulse-ring dark:bg-blue-400'
                             : 'bg-slate-300 animate-breathe dark:bg-slate-700'
                           }`}>
              {getStepStatus('validating') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('validating') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                 <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
               )}
             </div>
             <span className={`ml-3 text-sm ${
               getStepStatus('validating') === 'current' ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
             } animate-fade-in delay-400`}>
              Video found and accessible
            </span>
          </div>

          {/* Step 2: Extracting */}
          <div className={`flex items-center transition-all duration-500 ${
            getStepStatus('extracting') === 'pending' ? 'opacity-30' : 'opacity-100 animate-fade-in-left delay-300'
          }`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center 
                          ${getStepStatus('extracting') === 'completed' 
                             ? 'bg-green-500 animate-scale-in delay-500 dark:bg-green-400' 
                             : getStepStatus('extracting') === 'current'
                             ? 'bg-blue-500 animate-pulse-ring dark:bg-blue-400'
                             : 'bg-slate-300 animate-breathe dark:bg-slate-700'
                           }`}>
              {getStepStatus('extracting') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('extracting') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                 <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
               )}
             </div>
             <span className={`ml-3 text-sm ${
               getStepStatus('extracting') === 'current' ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
             } animate-fade-in delay-600`}>
              Extracting audio transcript
            </span>
          </div>

          {/* Step 3: Generating */}
          <div className={`flex items-center transition-all duration-500 ${
            getStepStatus('generating') === 'pending' ? 'opacity-30' : 'opacity-100 animate-fade-in-left delay-500'
          }`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center 
                          ${getStepStatus('generating') === 'completed' 
                             ? 'bg-green-500 animate-scale-in delay-800 dark:bg-green-400' 
                             : getStepStatus('generating') === 'current'
                             ? 'bg-blue-500 animate-pulse-ring dark:bg-blue-400'
                             : 'bg-slate-300 animate-breathe dark:bg-slate-700'
                           }`}>
              {getStepStatus('generating') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('generating') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                 <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
               )}
             </div>
             <span className={`ml-3 text-sm ${
               getStepStatus('generating') === 'current' ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
             } animate-fade-in delay-800`}>
              {getStepStatus('generating') === 'current' ? (
                <>
                  <span className="animate-typing">Generating chapter markers</span>
                  <span className="animate-dots">...</span>
                </>
              ) : (
                'Generate chapter markers'
              )}
            </span>
          </div>

          {/* Step 4: Ready */}
          <div className={`flex items-center transition-all duration-500 ${
            state.status === 'completed' ? 'opacity-100 animate-fade-in-left delay-700' : 'opacity-30'
          }`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center 
                          ${state.status === 'completed' 
                             ? 'bg-green-500 animate-scale-in delay-1000 dark:bg-green-400' 
                             : 'bg-slate-300 animate-breathe dark:bg-slate-700'
                           }`}>
              {state.status === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                 <div className="h-2 w-2 rounded-full bg-slate-500 dark:bg-slate-400" />
               )}
             </div>
             <span className={`ml-3 text-sm ${
               state.status === 'completed' ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
             } animate-fade-in delay-1000`}>
              Ready for review
            </span>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-600 animate-fade-in delay-1200 dark:text-slate-300">
            Estimated time remaining: 
            <span className="ml-1 font-medium text-slate-900 animate-pulse-number dark:text-slate-100">
              {formatTime(state.estimatedTimeRemaining)}
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Current: {state.currentStep}</p>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="transform rounded-lg bg-slate-100 px-6 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:bg-slate-200 active:scale-95 focus:outline-none focus:ring-2 
                     focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-950
                     opacity-0 animate-fade-in delay-1400"
          >
            Cancel Process
          </button>
        </div>
      </div>

      {/* Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        <span className="animate-speak">
          Currently {state.currentStep}, {Math.round(animatedProgress)}% complete
        </span>
      </div>

    </div>
  );
}
