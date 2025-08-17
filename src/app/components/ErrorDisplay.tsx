'use client';

import React from 'react';
import { ErrorDisplayProps, ValidationError } from '../types';

export default function ErrorDisplay({
  error,
  onRetry,
  onTryDifferentVideo,
  onUploadSRT,
  showActions = true
}: ErrorDisplayProps) {
  const isValidationError = typeof error === 'object' && 'type' in error;
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorType = isValidationError ? (error as ValidationError).type : 'network';

  const getErrorIcon = () => {
    switch (errorType) {
      case 'url':
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'url':
        return 'Invalid YouTube URL';
      case 'file':
        return 'File Upload Error';
      case 'processing':
        return 'Processing Failed';
      case 'network':
        return 'Connection Error';
      default:
        return 'Oops! Something went wrong';
    }
  };

  const getPossibleCauses = () => {
    switch (errorType) {
      case 'url':
        return [
          'The URL format is incorrect',
          'The video is private or unavailable',
          'The URL is not from YouTube'
        ];
      case 'file':
        return [
          'The file format is not supported',
          'The file is corrupted or empty',
          'The file size exceeds the limit'
        ];
      case 'processing':
        return [
          'The video is too long (over 3 hours)',
          'No transcript is available for this video',
          'The video content cannot be processed'
        ];
      case 'network':
      default:
        return [
          'Your internet connection is unstable',
          'YouTube is temporarily unavailable',
          'Our servers are experiencing high load'
        ];
    }
  };

  const getSuggestedActions = () => {
    const actions = [];
    
    if (onRetry) {
      actions.push({
        label: 'Try Again',
        action: onRetry,
        variant: 'primary' as const,
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      });
    }

    if (onTryDifferentVideo) {
      actions.push({
        label: 'Try Different Video',
        action: onTryDifferentVideo,
        variant: 'secondary' as const,
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 19l-7-7 7-7" />
          </svg>
        )
      });
    }

    if (onUploadSRT && (errorType === 'processing' || errorType === 'network')) {
      actions.push({
        label: 'Upload .srt File',
        action: onUploadSRT,
        variant: 'outline' as const,
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )
      });
    }

    return actions;
  };

  const getButtonClasses = (variant: 'primary' | 'secondary' | 'outline') => {
    const base = `
      inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 
      transform hover:scale-105 active:scale-95
    `;

    switch (variant) {
      case 'primary':
        return `${base} text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500`;
      case 'secondary':
        return `${base} text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500`;
      case 'outline':
        return `${base} text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500`;
      default:
        return base;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center animate-fade-in">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
          {getErrorIcon()}
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 animate-fade-in-up">
          {getErrorTitle()}
        </h2>
        <p className="text-base text-gray-600 mb-6 max-w-md mx-auto animate-fade-in-up delay-200">
          {errorMessage}
        </p>

        {/* Possible Causes */}
        <div className="text-left bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto animate-fade-in-up delay-400">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">This might be because:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {getPossibleCauses().map((cause, index) => (
              <li key={index} className="flex items-start animate-fade-in-left" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <span className="block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {cause}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-800">
            {getSuggestedActions().map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.action}
                className={getButtonClasses(action.variant)}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Support Link */}
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up delay-1000">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble?
          </p>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium underline transition-colors duration-200"
          >
            Contact Support
          </button>
        </div>

        {/* Error Details (for debugging) */}
        {process.env.NODE_ENV === 'development' && isValidationError && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
}