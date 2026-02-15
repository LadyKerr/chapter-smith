'use client';

import React, { useState, useEffect, useRef } from 'react';
import { URLInputProps } from '../types';
import { validateYouTubeURL, debounce } from '../utils';
// import { extractURLFromPaste } from '../utils'; // Currently unused

export default function URLInput({
  onSubmit,
  isLoading = false,
  error = '',
  placeholder = 'https://youtube.com/watch?v=...'
}: URLInputProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced validation
  const debouncedValidation = debounce((value: string) => {
    if (value.trim() === '') {
      setIsValid(null);
      return;
    }
    
    const valid = validateYouTubeURL(value);
    setIsValid(valid);
    setShowSuccess(valid);
    setShowError(!valid);
    
    // Auto-hide feedback after 2 seconds
    if (valid) {
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, 500);

  useEffect(() => {
    debouncedValidation(url);
  }, [url, debouncedValidation]);

  // Show error state when error prop changes
  useEffect(() => {
    if (error) {
      setShowError(true);
      setIsValid(false);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText && validateYouTubeURL(clipboardText)) {
        setUrl(clipboardText);
        inputRef.current?.focus();
      }
    } catch {
      console.warn('Clipboard access denied');
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* Animated Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
          Turn YouTube Videos into Chapters
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-300">
          Generate timestamped chapters automatically from any YouTube video. 
          Perfect for creators, educators, and content organizers.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input Field */}
          <div className="relative group">
            <label 
              htmlFor="youtube-url" 
              className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                isFocused ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              YouTube URL
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="url"
                id="youtube-url"
                name="youtube-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className={`
                  w-full px-4 py-4 pr-20 text-base border rounded-lg 
                  transition-all duration-300 ease-out
                  hover:border-gray-400 hover:shadow-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  placeholder:transition-opacity placeholder:duration-200
                  focus:placeholder:opacity-50
                  ${isValid === false || error ? 
                    'border-red-500 ring-1 ring-red-500 animate-shake' : 
                    isValid === true ? 
                    'border-green-500 ring-1 ring-green-500' : 
                    'border-gray-300'
                  }
                `}
                aria-describedby="url-help url-error"
                aria-invalid={isValid === false || !!error}
                disabled={isLoading}
              />
              
              {/* Paste Button */}
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                         hover:text-gray-600 focus:text-blue-500 transition-all duration-200
                         hover:scale-110 active:scale-95 transform
                         hover:bg-gray-100 rounded-md disabled:opacity-50"
                aria-label="Paste from clipboard"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:rotate-3" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>

              {/* Validation Icons */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                {/* Success State */}
                {showSuccess && (
                  <svg className="w-5 h-5 text-green-500 animate-bounce-in" 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                
                {/* Error State */}
                {showError && (
                  <svg className="w-5 h-5 text-red-500 animate-wobble" 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            {/* Help Text */}
            <p id="url-help" className={`mt-2 text-sm transition-all duration-200 ${
              isFocused ? 'text-blue-600' : 'text-gray-500'
            }`}>
              Supports youtube.com and youtu.be links. Example: https://youtube.com/watch?v=dQw4w9WgXcQ
            </p>

            {/* Error Message */}
            {(showError || error) && (
              <p id="url-error" className="mt-2 text-sm text-red-600 animate-slide-down" role="alert">
                {error || 'Please enter a valid YouTube URL. Make sure it starts with youtube.com or youtu.be'}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`
              w-full font-semibold py-4 px-6 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200 transform relative overflow-hidden group
              ${!isValid || isLoading ? 
                'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-blue-500/25'
              }
            `}
          >
            {/* Button Background Gradient Animation */}
            {isValid && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            
            <span className="flex items-center justify-center relative z-10">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Generate Chapters
                  </span>
                  <svg className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Features List */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center animate-fade-in-up delay-700 
                        hover:text-green-600 transition-colors duration-200">
            <svg className="w-4 h-4 text-green-500 mr-2 animate-bounce-subtle" 
                 fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Supports public videos up to 3 hours
          </div>
          <div className="flex items-center animate-fade-in-up delay-900
                        hover:text-green-600 transition-colors duration-200">
            <svg className="w-4 h-4 text-green-500 mr-2 animate-bounce-subtle delay-100" 
                 fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Works with youtube.com and youtu.be
          </div>
        </div>
      </div>

    </div>
  );
}