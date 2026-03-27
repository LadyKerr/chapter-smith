'use client';

import React, { useState } from 'react';
import { Chapter, ChaptersListProps } from '../types';
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

  const handleCopyChapter = (chapter: Chapter) => {
    onCopyChapter(chapter);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg animate-fade-in dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="animate-fade-in-up">
            <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Chapters Generated</h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Video: &quot;{videoInfo.title}&quot; • Duration: {videoInfo.duration}
            </p>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500 animate-fade-in-up delay-200 dark:text-slate-400 sm:mt-0">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {chapters.length} chapters found
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 animate-slide-down dark:border-green-500/40 dark:bg-green-950/30">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                 <p className="text-sm font-medium text-green-800 dark:text-green-200">
                   All chapters copied to clipboard!
                 </p>
                 <p className="text-xs text-green-700 dark:text-green-300">
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
                group flex items-center justify-between rounded-lg border border-slate-200 p-4 
                transition-all duration-200 hover:border-slate-300 hover:shadow-sm
                dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/60
                animate-fade-in-left
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="listitem"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                                   bg-blue-100 text-blue-800 font-mono dark:bg-blue-950/40 dark:text-blue-200">
                      {chapter.timestamp}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-base font-medium leading-snug text-slate-900 dark:text-slate-100">
                       {chapter.title}
                     </p>
                     {chapter.description && (
                       <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                     rounded-lg bg-slate-100 text-slate-700 
                     transition-all duration-200 transform hover:scale-105 hover:bg-slate-200 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-50
                     dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-950"
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
                     rounded-lg border border-slate-300 bg-white text-slate-700 
                     transition-all duration-200 transform hover:scale-105 hover:bg-slate-50 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50
                     dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-950"
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
                     rounded-lg bg-slate-100 text-slate-700 
                     transition-colors duration-200 touch-manipulation dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 
                     transition-colors duration-200 touch-manipulation hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            style={{ minHeight: '44px' }}
          >
            Try Again
          </button>
        </div>

        {/* Chapter Statistics */}
        <div className="mt-8 border-t border-slate-200 pt-6 animate-fade-in-up delay-1000 dark:border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{chapters.length}</p>
              <p className="text-slate-500 dark:text-slate-400">Chapters</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{videoInfo.duration}</p>
              <p className="text-slate-500 dark:text-slate-400">Duration</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {chapters.length > 0 ? Math.round((chapters.length / parseFloat(videoInfo.duration.split(':')[0]) * 60 + parseFloat(videoInfo.duration.split(':')[1])) * 10) / 10 : 0}
              </p>
              <p className="text-slate-500 dark:text-slate-400">Chapters/Hour</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {chapters.reduce((total, chapter) => total + chapter.title.length, 0)}
              </p>
              <p className="text-slate-500 dark:text-slate-400">Total Characters</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
