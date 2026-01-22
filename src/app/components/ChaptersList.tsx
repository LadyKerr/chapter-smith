'use client';

import React, { useState } from 'react';
import { ChaptersListProps } from '../types';
import { formatChaptersForExport } from '../utils';
import CopyButton from './CopyButton';

export default function ChaptersList({
  chapters,
  videoInfo,
  onCopyChapter,
  onCopyAll,
  onExport,
  onRegenerate
}: ChaptersListProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCopyAll = async () => {
    const allChaptersText = formatChaptersForExport(chapters, 'youtube');
    try {
      await navigator.clipboard.writeText(allChaptersText);
      onCopyAll();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Failed to copy all chapters:', error);
    }
  };

  const handleCopyChapter = (chapter: any) => {
    const chapterText = `${chapter.timestamp} ${chapter.title}`;
    onCopyChapter(chapter);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Chapters Generated</h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Video: "{videoInfo.title}" • Duration: {videoInfo.duration}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up delay-200">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {chapters.length} chapters found
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-slide-down">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  All chapters copied to clipboard!
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Ready to paste into YouTube description
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chapter List */}
        <div className="space-y-3 mb-8" role="list" aria-label="Generated chapters">
          {chapters.map((chapter, index) => (
            <div 
              key={chapter.id}
              className={`
                group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200
                animate-fade-in-left
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="listitem"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                                   bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-mono">
                      {chapter.timestamp}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-snug">
                      {chapter.title}
                    </p>
                    {chapter.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CopyButton
                    text={`${chapter.timestamp} ${chapter.title}`}
                    variant="secondary"
                    size="small"
                    label="Copy"
                    onCopyComplete={() => handleCopyChapter(chapter)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
          <CopyButton
            text={formatChaptersForExport(chapters, 'youtube')}
            variant="primary"
            size="large"
            label="Copy All Chapters"
            onCopyComplete={handleCopyAll}
          />
          
          <button
            type="button"
            onClick={() => onExport('text')}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                     text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                     transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as Text
          </button>
          
          <button
            type="button"
            onClick={onRegenerate}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                     text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate
          </button>
        </div>

        {/* Mobile Optimized Action Buttons */}
        <div className="sm:hidden mt-6 grid grid-cols-2 gap-3 animate-fade-in-up delay-700">
          <CopyButton
            text={formatChaptersForExport(chapters, 'youtube')}
            variant="primary"
            size="default"
            label="Copy All"
            onCopyComplete={handleCopyAll}
          />
          
          <button
            type="button"
            onClick={() => onExport('text')}
            className="flex items-center justify-center px-4 py-3 text-sm font-medium 
                     text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg 
                     transition-colors duration-200 touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3" />
            </svg>
            Export
          </button>
        </div>

        {/* Additional Mobile Action */}
        <div className="sm:hidden mt-3 animate-fade-in-up delay-900">
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                     border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg 
                     transition-colors duration-200 touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            Try Again
          </button>
        </div>

        {/* Chapter Statistics */}
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up delay-1000">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="font-medium text-gray-900">{chapters.length}</p>
              <p className="text-gray-500">Chapters</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">{videoInfo.duration}</p>
              <p className="text-gray-500">Duration</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {chapters.length > 0 ? Math.round((chapters.length / parseFloat(videoInfo.duration.split(':')[0]) * 60 + parseFloat(videoInfo.duration.split(':')[1])) * 10) / 10 : 0}
              </p>
              <p className="text-gray-500">Chapters/Hour</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {chapters.reduce((total, chapter) => total + chapter.title.length, 0)}
              </p>
              <p className="text-gray-500">Total Characters</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}