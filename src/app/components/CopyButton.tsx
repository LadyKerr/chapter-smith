'use client';

import React, { useState } from 'react';
import { CopyButtonProps } from '../types';
import { copyToClipboard } from '../utils';

export default function CopyButton({
  text,
  variant = 'primary',
  size = 'default',
  label = 'Copy',
  onCopyComplete
}: CopyButtonProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [showFeedback, setShowFeedback] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  const handleCopy = async () => {
    setCopyState('copying');
    setParticleKey(prev => prev + 1);
    
    try {
      const success = await copyToClipboard(text);
      if (success) {
        setCopyState('success');
        setShowFeedback(true);
        onCopyComplete?.(true);
        
        // Reset states
        setTimeout(() => {
          setCopyState('idle');
          setShowFeedback(false);
        }, 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch {
      setCopyState('error');
      onCopyComplete?.(false);
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  const getBaseClasses = () => {
    const base = `
      inline-flex items-center justify-center font-medium rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950
      transition-all duration-200 transform active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      relative overflow-hidden group
    `;

    const sizeClasses = {
      small: 'px-3 py-2 text-sm',
      default: 'px-4 py-2 text-sm',
      large: 'px-6 py-3 text-base'
    };

    return `${base} ${sizeClasses[size]}`;
  };

  const getVariantClasses = () => {
    if (copyState === 'success') {
      return 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500 animate-success-wiggle dark:bg-green-500 dark:hover:bg-green-400 dark:focus:ring-green-400';
    }
    
    if (copyState === 'error') {
      return 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-error-shake dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-red-400';
    }

    const variants = {
      primary: 'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 hover:scale-105 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-400',
      secondary: 'text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-500 hover:scale-105 hover:shadow-md dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-400',
      success: 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500 hover:scale-105 hover:shadow-lg dark:bg-green-500 dark:hover:bg-green-400 dark:focus:ring-green-400'
    };

    return variants[variant];
  };

  const getButtonContent = () => {
    switch (copyState) {
      case 'copying':
        return (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            <span className="animate-pulse">Copying...</span>
          </>
        );
      case 'success':
        return (
          <>
            <svg className="w-4 h-4 mr-2 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="animate-success-text">Copied!</span>
          </>
        );
      case 'error':
        return (
          <>
            <svg className="w-4 h-4 mr-2 animate-error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Failed</span>
          </>
        );
      default:
        return (
          <>
            <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{label}</span>
          </>
        );
    }
  };

  return (
    <div className="relative">
      {/* Ripple Effect Container */}
      {copyState === 'copying' && (
        <div className="absolute inset-0 rounded-lg animate-ripple pointer-events-none" />
      )}

      {/* Main Copy Button */}
      <button
        type="button"
        className={`${getBaseClasses()} ${getVariantClasses()}`}
        onClick={handleCopy}
        disabled={copyState === 'copying'}
        aria-label={`${label} - ${text.length > 50 ? text.substring(0, 50) + '...' : text}`}
      >
        {/* Button Content */}
        <span className="relative z-10 flex items-center">
          {getButtonContent()}
        </span>
      </button>

      {/* Success Particles */}
      {copyState === 'success' && (
        <div key={particleKey} className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-green-400 rounded-full animate-particle-${i + 1}`}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Feedback Toast */}
      {showFeedback && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 
                      animate-float-up pointer-events-none">
          <div className="relative whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
            Copied to clipboard!
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                          border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-slate-100" />
          </div>
        </div>
      )}

    </div>
  );
}
