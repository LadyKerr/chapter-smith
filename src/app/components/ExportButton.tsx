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

    } catch (error) {
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
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Chapters
      </button>

      {/* Export Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 
                      animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl w-full mx-4 
                     transform transition-all duration-300 animate-modal-appear"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Export Your Chapters</h2>
                <p className="text-base text-gray-600 mt-1">
                  Choose your preferred format and copy or download
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Export Progress (when exporting) */}
            {exportState === 'exporting' && (
              <div className="mb-8 p-6 bg-blue-50 rounded-lg animate-fade-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Exporting {EXPORT_FORMATS.find(f => f.id === currentFormat)?.name}
                  </h3>
                  <div className="w-full max-w-xs mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {exportState === 'success' && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <div className="flex items-center justify-center text-center">
                  <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-green-800">Export completed!</p>
                    <p className="text-sm text-green-600">Your chapters are ready</p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Format Grid */}
            {exportState !== 'exporting' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {EXPORT_FORMATS.map((format) => (
                  <div key={format.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-50">
                        {getFormatIcon(format.icon)}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{format.name}</h3>
                      <p className="text-xs text-gray-600 mb-4 h-12 flex items-center justify-center">
                        {format.description}
                      </p>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleExport(format.id, 'copy')}
                          disabled={exportState === 'exporting'}
                          className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
                                   ${format.id === 'youtube' 
                                     ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                                     : format.id === 'json'
                                     ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500'
                                     : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
                                   }`}
                        >
                          Copy {format.id === 'youtube' ? 'for YouTube' : 'as ' + format.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport(format.id, 'download')}
                          disabled={exportState === 'exporting'}
                          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                   hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none 
                                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
                <div key={`mobile-${format.id}`} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gray-50">
                        {getFormatIcon(format.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{format.name}</p>
                        <p className="text-xs text-gray-500">{format.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleExport(format.id, 'copy')}
                        disabled={exportState === 'exporting'}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                                 rounded-md transition-colors duration-200 disabled:opacity-50"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport(format.id, 'download')}
                        disabled={exportState === 'exporting'}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 
                                 rounded-md transition-colors duration-200 disabled:opacity-50"
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
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                           rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-gray-500 focus:ring-offset-2"
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