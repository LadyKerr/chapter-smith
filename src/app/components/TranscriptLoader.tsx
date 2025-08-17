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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 
                    transform transition-all duration-300 animate-fade-in">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            {/* Animated Processing Icon */}
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping"></div>
            <div className="relative w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center 
                          animate-pulse">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 animate-pulse-text">
            Processing Video
          </h2>
          <p className="text-base text-gray-600 animate-fade-in delay-300">
            <span className="animate-typing">Analyzing your video and generating chapters</span>
            <span className="animate-dots">...</span>
          </p>
          
          {videoInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg animate-fade-in delay-500">
              <p className="text-sm text-gray-700 font-medium">{videoInfo.title}</p>
              <p className="text-xs text-gray-500">Duration: {videoInfo.duration}</p>
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-600 animate-count-up">
              {Math.round(animatedProgress)}%
            </span>
          </div>
          <div 
            className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative"
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
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full 
                       transition-all duration-500 ease-out relative overflow-hidden
                       shadow-lg shadow-blue-500/30"
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
                            ? 'bg-green-500 animate-scale-in delay-200' 
                            : getStepStatus('validating') === 'current'
                            ? 'bg-blue-500 animate-pulse-ring'
                            : 'bg-gray-300 animate-breathe'
                          }`}>
              {getStepStatus('validating') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('validating') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>
            <span className={`ml-3 text-sm ${
              getStepStatus('validating') === 'current' ? 'font-medium text-gray-900' : 'text-gray-700'
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
                            ? 'bg-green-500 animate-scale-in delay-500' 
                            : getStepStatus('extracting') === 'current'
                            ? 'bg-blue-500 animate-pulse-ring'
                            : 'bg-gray-300 animate-breathe'
                          }`}>
              {getStepStatus('extracting') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-100" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('extracting') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>
            <span className={`ml-3 text-sm ${
              getStepStatus('extracting') === 'current' ? 'font-medium text-gray-900' : 'text-gray-700'
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
                            ? 'bg-green-500 animate-scale-in delay-800' 
                            : getStepStatus('generating') === 'current'
                            ? 'bg-blue-500 animate-pulse-ring'
                            : 'bg-gray-300 animate-breathe'
                          }`}>
              {getStepStatus('generating') === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : getStepStatus('generating') === 'current' ? (
                <div className="w-3 h-3 bg-white rounded-full animate-bounce-gentle" />
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>
            <span className={`ml-3 text-sm ${
              getStepStatus('generating') === 'current' ? 'font-medium text-gray-900' : 'text-gray-700'
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
                            ? 'bg-green-500 animate-scale-in delay-1000' 
                            : 'bg-gray-300 animate-breathe'
                          }`}>
              {state.status === 'completed' ? (
                <svg className="w-4 h-4 text-white animate-draw-check delay-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>
            <span className={`ml-3 text-sm ${
              state.status === 'completed' ? 'font-medium text-gray-900' : 'text-gray-500'
            } animate-fade-in delay-1000`}>
              Ready for review
            </span>
          </div>
        </div>

        {/* Time Estimate */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 animate-fade-in delay-1200">
            Estimated time remaining: 
            <span className="font-medium text-gray-900 animate-pulse-number ml-1">
              {formatTime(state.estimatedTimeRemaining)}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Current: {state.currentStep}</p>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                     rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95
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