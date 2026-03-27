'use client';

import React, { useState } from 'react';
import { ExportButtonProps } from '../types';
import { formatChaptersForExport, downloadFile, copyToClipboard, EXPORT_FORMATS } from '../utils';

export default function ExportButton({
  chapters,
  videoInfo,
  onExportComplete
}: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState<string>('');

  const handleExport = async (format: string, action: 'copy' | 'download') => {
    setExportState('exporting');
    setCurrentFormat(format);
    setProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      const exportFormat = EXPORT_FORMATS.find(f => f.id === format);
      const content = formatChaptersForExport(chapters, format);
      const filename = `${videoInfo?.title || 'chapters'}-chapters.${exportFormat?.extension || 'txt'}`;

      if (action === 'copy') {
        await copyToClipboard(content);
      } else {
        downloadFile(content, filename, exportFormat?.mimeType);
      }

      setProgress(100);
      setExportState('success');
      onExportComplete?.(format, true);
      
      setTimeout(() => {
        setExportState('idle');
        setProgress(0);
        if (action === 'copy') {
          setIsModalOpen(false);
        }
      }, 2000);

    } catch {
      clearInterval(progressInterval);
      setExportState('error');
      onExportComplete?.(format, false);
      setTimeout(() => {
        setExportState('idle');
        setProgress(0);
      }, 3000);
    }
  };

  const getFormatIcon = (iconName: string) => {
    const icons = {
      youtube: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      document: (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      code: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      table: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h3M7 3v18M17 3v18m3-14v10a1 1 0 01-1 1h-3" />
        </svg>
      ),
      subtitles: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0l1 16h8l1-16M9 10h6M9 14h6" />
        </svg>
      )
    };
    return icons[iconName as keyof typeof icons] || icons.document;
  };

  return (
    <>
      {/* Export Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-white bg-blue-500 hover:bg-blue-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50
                 transition-all duration-200 transform hover:scale-105 active:scale-95
                 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-950"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Chapters
      </button>

      {/* Export Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 
                      animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div 
            className="mx-4 w-full max-w-2xl transform rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 animate-modal-appear dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Export Your Chapters</h2>
                 <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
                   Choose your preferred format and copy or download
                 </p>
               </div>
               <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Export Progress (when exporting) */}
            {exportState === 'exporting' && (
               <div className="mb-8 rounded-lg bg-blue-50 p-6 animate-fade-in dark:bg-blue-950/30">
                 <div className="text-center">
                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 animate-pulse dark:bg-blue-500/15">
                     <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin dark:border-blue-300" />
                   </div>
                   <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-slate-100">
                     Exporting {EXPORT_FORMATS.find(f => f.id === currentFormat)?.name}
                   </h3>
                   <div className="w-full max-w-xs mx-auto">
                     <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                       <div 
                         className="h-full rounded-full bg-blue-500 transition-all duration-300 dark:bg-blue-400"
                         style={{ width: `${progress}%` }}
                       />
                     </div>
                     <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{progress}% complete</p>
                   </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {exportState === 'success' && (
               <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 animate-fade-in dark:border-green-500/40 dark:bg-green-950/30">
                <div className="flex items-center justify-center text-center">
                  <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                     <p className="text-lg font-medium text-green-800 dark:text-green-200">Export completed!</p>
                     <p className="text-sm text-green-600 dark:text-green-300">Your chapters are ready</p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Format Grid */}
            {exportState !== 'exporting' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {EXPORT_FORMATS.map((format) => (
                   <div key={format.id} className="rounded-lg border border-slate-200 p-6 transition-all duration-200 hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-800/60">
                     <div className="text-center">
                       <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                         {getFormatIcon(format.icon)}
                       </div>
                       <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{format.name}</h3>
                       <p className="mb-4 flex h-12 items-center justify-center text-xs text-slate-600 dark:text-slate-300">
                         {format.description}
                       </p>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleExport(format.id, 'copy')}
                          disabled={exportState === 'exporting'}
                          className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 dark:focus:ring-offset-slate-950
                                    ${format.id === 'youtube' 
                                      ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-400' 
                                      : format.id === 'json'
                                      ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/60 dark:focus:ring-blue-400'
                                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-slate-400'
                                    }`}
                        >
                          Copy {format.id === 'youtube' ? 'for YouTube' : 'as ' + format.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport(format.id, 'download')}
                          disabled={exportState === 'exporting'}
                           className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 
                                    transition-colors duration-200 hover:bg-slate-50 focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50
                                    dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-950"
                        >
                          Download .{format.extension}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Optimized Layout */}
            <div className="md:hidden">
              {exportState !== 'exporting' && EXPORT_FORMATS.map((format) => (
                 <div key={`mobile-${format.id}`} className="mb-4 rounded-lg border border-slate-200 p-4 last:mb-0 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                       <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                         {getFormatIcon(format.icon)}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{format.name}</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{format.description}</p>
                       </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleExport(format.id, 'copy')}
                        disabled={exportState === 'exporting'}
                         className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 
                                  transition-colors duration-200 hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport(format.id, 'download')}
                        disabled={exportState === 'exporting'}
                         className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 
                                  transition-colors duration-200 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            {exportState !== 'exporting' && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                   className="rounded-lg bg-slate-100 px-6 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200 focus:outline-none focus:ring-2 
                           focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-950"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}
