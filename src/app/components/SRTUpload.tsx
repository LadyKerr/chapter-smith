'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SRTUploadProps } from '../types';
import { validateSRTFile } from '../utils';

export default function SRTUpload({
  onFileUpload,
  onTryDifferentVideo,
  uploadState
}: SRTUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're leaving the dropzone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = async (file: File) => {
    setValidationError('');
    
    // Check file type
    if (!file.name.toLowerCase().endsWith('.srt')) {
      setValidationError('Please select a .srt file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('File size must be less than 5MB');
      return;
    }

    // Validate SRT format
    try {
      const isValid = await validateSRTFile(file);
      if (!isValid) {
        setValidationError('Invalid SRT file format. Please check your file.');
        return;
      }
    } catch (error) {
      setValidationError('Could not read the file. Please try again.');
      return;
    }

    onFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const getDropzoneClasses = () => {
    let classes = `
      border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
      focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
    `;

    if (uploadState.status === 'error' || validationError) {
      classes += ' border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 animate-shake';
    } else if (uploadState.status === 'success') {
      classes += ' border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
    } else if (isDragOver || uploadState.status === 'dragover') {
      classes += ' border-blue-500 dark:border-blue-600 bg-blue-100 dark:bg-blue-900/20 animate-dropzone-pulse';
    } else {
      classes += ' border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10';
    }

    return classes;
  };

  const isUploading = uploadState.status === 'uploading';

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Transcript Not Available</h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            The video's transcript couldn't be retrieved automatically. 
            You can upload your own .srt file to continue.
          </p>
        </div>

        {/* Drop Zone */}
        <div 
          className={getDropzoneClasses()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt"
            onChange={handleFileInputChange}
            className="sr-only"
            aria-describedby="srt-upload-description"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 border-2 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Uploading file...
                </p>
                {uploadState.progress !== undefined && (
                  <div className="w-full max-w-xs mx-auto">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${uploadState.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{uploadState.progress}%</p>
                  </div>
                )}
              </div>
            </>
          ) : uploadState.status === 'success' ? (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-green-800 dark:text-green-300">
                  File uploaded successfully!
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {uploadState.file?.name}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 ${
                isDragOver ? 'bg-blue-200 dark:bg-blue-900/40 animate-bounce' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-200 ${
                  isDragOver ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {isDragOver ? 'Drop your .srt file here' : 'Drag & drop .srt file here'}
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  or <span className="text-blue-600 dark:text-blue-400 font-medium underline">click to browse</span>
                </p>
                <p id="srt-upload-description" className="text-sm text-gray-500 dark:text-gray-400">
                  Supported: .srt files up to 5MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {(validationError || uploadState.error) && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-down">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                {validationError || uploadState.error}
              </p>
            </div>
          </div>
        )}

        {/* Alternative Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onTryDifferentVideo}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                     rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
            disabled={isUploading}
          >
            Try Different Video
          </button>
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
                     rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
            disabled={isUploading}
          >
            Get Help Creating .srt
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-fade-in delay-500">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Don't have a transcript file?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            You can create .srt files using YouTube's built-in captions or transcript generation tools.
          </p>
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors duration-200"
            disabled={isUploading}
          >
            Download Sample .srt File
          </button>
        </div>
      </div>

    </div>
  );
}