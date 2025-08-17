# Chapter Smith UI Design Specifications

## Executive Summary

This document provides comprehensive UI design specifications for Chapter Smith, a YouTube chapters generator built with Next.js and Tailwind CSS. These designs translate the UX research insights into implementable components that prioritize mobile-first responsive design, accessibility compliance (WCAG 2.1 AA), and modern aesthetics optimized for rapid development.

**Design Philosophy**: Clean, modern, and functional with subtle visual delight through micro-interactions and thoughtful color usage.

---

## Design System Foundation

### Color Palette

```css
/* Primary Colors */
--primary-50: #eff6ff;    /* Very light blue background */
--primary-100: #dbeafe;   /* Light blue background */
--primary-500: #3b82f6;   /* Primary CTA blue */
--primary-600: #2563eb;   /* Primary hover blue */
--primary-700: #1d4ed8;   /* Primary active blue */

/* Secondary Colors */
--secondary-50: #f8fafc;  /* Light gray background */
--secondary-100: #f1f5f9; /* Card background */
--secondary-500: #64748b; /* Secondary text */
--secondary-600: #475569; /* Dark secondary text */
--secondary-900: #0f172a; /* Primary text */

/* Status Colors */
--success-50: #f0fdf4;    /* Success background */
--success-500: #10b981;   /* Success green */
--success-600: #059669;   /* Success hover */
--warning-50: #fffbeb;    /* Warning background */
--warning-500: #f59e0b;   /* Warning amber */
--error-50: #fef2f2;      /* Error background */
--error-500: #ef4444;     /* Error red */
--error-600: #dc2626;     /* Error hover */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Typography Scale

```css
/* Tailwind CSS Typography Classes */
.text-display { @apply text-4xl font-bold leading-tight; }     /* 36px/40px */
.text-h1 { @apply text-3xl font-bold leading-tight; }         /* 30px/36px */
.text-h2 { @apply text-2xl font-semibold leading-snug; }      /* 24px/32px */
.text-h3 { @apply text-xl font-semibold leading-normal; }     /* 20px/28px */
.text-body { @apply text-base leading-relaxed; }              /* 16px/24px */
.text-small { @apply text-sm leading-normal; }                /* 14px/20px */
.text-tiny { @apply text-xs leading-normal; }                 /* 12px/16px */
```

### Spacing System

```css
/* 8px Grid System */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Border Radius System

```css
.rounded-sm: 2px;
.rounded: 4px;
.rounded-md: 6px;
.rounded-lg: 8px;
.rounded-xl: 12px;
.rounded-2xl: 16px;
```

---

## Component Specifications

### 1. URL Input Form Component

#### Desktop Layout (768px+)
```jsx
// URLInputForm.tsx
<div className="w-full max-w-4xl mx-auto px-6 py-12">
  {/* Header Section */}
  <div className="text-center mb-12">
    <h1 className="text-display text-gray-900 mb-4">
      Turn YouTube Videos into Chapters
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Generate timestamped chapters automatically from any YouTube video. 
      Perfect for creators, educators, and content organizers.
    </p>
  </div>

  {/* Input Form */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    <form className="space-y-6">
      {/* URL Input Field */}
      <div className="relative">
        <label 
          htmlFor="youtube-url" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          YouTube URL
        </label>
        <div className="relative">
          <input
            type="url"
            id="youtube-url"
            name="youtube-url"
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-4 pr-20 text-base border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     transition-colors duration-200
                     aria-[invalid=true]:border-error-500 aria-[invalid=true]:ring-error-500"
            aria-describedby="url-help url-error"
            aria-invalid="false"
          />
          
          {/* Paste Button */}
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                     hover:text-gray-600 focus:text-primary-500 transition-colors"
            aria-label="Paste from clipboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>

          {/* Validation Icon */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            {/* Success State */}
            <svg className="w-5 h-5 text-success-500 hidden" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            
            {/* Error State */}
            <svg className="w-5 h-5 text-error-500 hidden" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Help Text */}
        <p id="url-help" className="mt-2 text-sm text-gray-500">
          Supports youtube.com and youtu.be links. Example: https://youtube.com/watch?v=dQw4w9WgXcQ
        </p>

        {/* Error Message */}
        <p id="url-error" className="mt-2 text-sm text-error-600 hidden" role="alert">
          Please enter a valid YouTube URL. Make sure it starts with youtube.com or youtu.be
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 
                 text-white font-semibold py-4 px-6 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={false}
      >
        <span className="flex items-center justify-center">
          Generate Chapters
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>
    </form>

    {/* Features List */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
      <div className="flex items-center">
        <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Supports public videos up to 3 hours
      </div>
      <div className="flex items-center">
        <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Works with youtube.com and youtu.be
      </div>
    </div>
  </div>
</div>
```

#### Mobile Layout (320px-767px)
```jsx
<div className="w-full px-4 py-8">
  {/* Header Section */}
  <div className="text-center mb-8">
    <h1 className="text-h1 text-gray-900 mb-3">
      Turn YouTube Videos into Chapters
    </h1>
    <p className="text-base text-gray-600">
      Generate timestamped chapters automatically from any YouTube video.
    </p>
  </div>

  {/* Input Form */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <form className="space-y-5">
      {/* URL Input Field */}
      <div>
        <label htmlFor="youtube-url-mobile" className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL
        </label>
        <div className="relative">
          <input
            type="url"
            id="youtube-url-mobile"
            placeholder="Paste YouTube link here..."
            className="w-full px-4 py-4 pr-12 text-base border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     transition-colors duration-200"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 
                     hover:text-gray-600 touch-manipulation"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Example: youtu.be/dQw4w9WgXcQ
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 
                 text-white font-semibold py-4 px-6 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '52px' }}
      >
        Generate Chapters
      </button>
    </form>

    {/* Features */}
    <div className="mt-6 space-y-2 text-sm text-gray-600">
      <div className="flex items-center">
        <svg className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Public videos only
      </div>
      <div className="flex items-center">
        <svg className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Maximum 3 hours long
      </div>
    </div>
  </div>
</div>
```

#### Interaction States
```css
/* Focus States */
.input-focus {
  @apply ring-2 ring-primary-500 border-primary-500;
}

/* Validation States */
.input-valid {
  @apply border-success-500 ring-success-500;
}

.input-invalid {
  @apply border-error-500 ring-error-500;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Button States */
.button-loading {
  @apply opacity-75 cursor-not-allowed;
}

.button-loading::after {
  content: '';
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2;
}
```

---

### 2. Loading Spinner & Progress Component

#### Progress Indicator Component
```jsx
// ProgressIndicator.tsx
<div className="w-full max-w-2xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    {/* Header */}
    <div className="text-center mb-8">
      <h2 className="text-h2 text-gray-900 mb-2">Processing Video</h2>
      <p className="text-base text-gray-600">
        Analyzing your video and generating chapters...
      </p>
    </div>

    {/* Progress Bar */}
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm font-medium text-primary-600">60%</span>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
        role="progressbar"
        aria-valuenow="60"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Chapter generation progress"
      >
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full 
                   transition-all duration-300 ease-out"
          style={{ width: '60%' }}
        />
      </div>
    </div>

    {/* Status Steps */}
    <div className="space-y-4 mb-8">
      {/* Completed Step */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="ml-3 text-sm text-gray-700">Video found and accessible</span>
      </div>

      {/* Completed Step */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="ml-3 text-sm text-gray-700">Extracting audio transcript</span>
      </div>

      {/* Current Step */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900">Generating chapter markers...</span>
      </div>

      {/* Pending Step */}
      <div className="flex items-center opacity-50">
        <div className="flex-shrink-0 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-500 rounded-full" />
        </div>
        <span className="ml-3 text-sm text-gray-500">Ready for review</span>
      </div>
    </div>

    {/* Time Estimate */}
    <div className="text-center mb-6">
      <p className="text-sm text-gray-600">
        Estimated time remaining: <span className="font-medium text-gray-900">45 seconds</span>
      </p>
    </div>

    {/* Cancel Button */}
    <div className="flex justify-center">
      <button
        type="button"
        className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                 focus:ring-gray-500 focus:ring-offset-2"
      >
        Cancel Process
      </button>
    </div>
  </div>

  {/* Live Region for Screen Readers */}
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    Currently generating chapter markers, 60% complete
  </div>
</div>
```

#### Mobile Progress Component
```jsx
<div className="w-full px-4 py-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Video</h2>
      <p className="text-sm text-gray-600">Analyzing and generating chapters...</p>
    </div>

    {/* Compact Progress Bar */}
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">60%</span>
        <span className="text-xs text-gray-500">~45s left</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full 
                   transition-all duration-300 ease-out"
          style={{ width: '60%' }}
        />
      </div>
    </div>

    {/* Compact Status Steps */}
    <div className="space-y-3 mb-6">
      <div className="flex items-center text-sm">
        <div className="w-4 h-4 bg-success-500 rounded-full flex-shrink-0 mr-3">
          <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-gray-700">Video found</span>
      </div>
      
      <div className="flex items-center text-sm">
        <div className="w-4 h-4 bg-success-500 rounded-full flex-shrink-0 mr-3">
          <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-gray-700">Audio extracted</span>
      </div>
      
      <div className="flex items-center text-sm">
        <div className="w-4 h-4 bg-primary-500 rounded-full flex-shrink-0 mr-3 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
        <span className="font-medium text-gray-900">Creating chapters</span>
      </div>
      
      <div className="flex items-center text-sm opacity-50">
        <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0 mr-3" />
        <span className="text-gray-500">Almost done</span>
      </div>
    </div>

    {/* Cancel Button */}
    <button
      type="button"
      className="w-full py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-colors duration-200 touch-manipulation"
      style={{ minHeight: '44px' }}
    >
      Cancel
    </button>
  </div>
</div>
```

#### Loading Animations
```css
/* Pulse Animation for Loading States */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Indeterminate Progress Bar */
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-indeterminate::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  animation: indeterminate 1.5s infinite linear;
}

/* Spinner Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  @apply w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin;
}
```

---

### 3. SRT Upload Dropzone Component

#### Desktop Upload Interface
```jsx
// FileUploadDropzone.tsx
<div className="w-full max-w-2xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-h2 text-gray-900 mb-2">Transcript Not Available</h2>
      <p className="text-base text-gray-600">
        The video's transcript couldn't be retrieved automatically. 
        You can upload your own .srt file to continue.
      </p>
    </div>

    {/* Drop Zone */}
    <div 
      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center 
               hover:border-primary-400 hover:bg-primary-50 transition-all duration-200
               focus-within:border-primary-500 focus-within:bg-primary-50
               drag-over:border-primary-500 drag-over:bg-primary-100"
      onDrop={() => {}}
      onDragOver={() => {}}
      onDragEnter={() => {}}
      onDragLeave={() => {}}
    >
      <input
        type="file"
        id="srt-upload"
        accept=".srt"
        className="sr-only"
        aria-describedby="srt-upload-description"
      />
      <label htmlFor="srt-upload" className="cursor-pointer">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Drag & drop .srt file here
          </p>
          <p className="text-base text-gray-600">
            or <span className="text-primary-600 font-medium underline">click to browse</span>
          </p>
          <p id="srt-upload-description" className="text-sm text-gray-500">
            Supported: .srt files up to 5MB
          </p>
        </div>
      </label>
    </div>

    {/* Alternative Actions */}
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                 focus:ring-gray-500 focus:ring-offset-2"
      >
        Try Different Video
      </button>
      <button
        type="button"
        className="px-6 py-3 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 
                 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                 focus:ring-primary-500 focus:ring-offset-2"
      >
        Get Help Creating .srt
      </button>
    </div>

    {/* Help Section */}
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Don't have a transcript file?</h3>
      <p className="text-sm text-gray-600 mb-3">
        You can create .srt files using YouTube's built-in captions or transcript generation tools.
      </p>
      <button
        type="button"
        className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
      >
        Download Sample .srt File
      </button>
    </div>
  </div>
</div>
```

#### Mobile Upload Interface
```jsx
<div className="w-full px-4 py-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    {/* Header */}
    <div className="text-center mb-6">
      <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Transcript Missing</h2>
      <p className="text-sm text-gray-600">
        Video transcript not available. Upload your own .srt file:
      </p>
    </div>

    {/* Compact Drop Zone */}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center touch-manipulation">
      <input
        type="file"
        id="srt-upload-mobile"
        accept=".srt"
        className="sr-only"
      />
      <label htmlFor="srt-upload-mobile" className="cursor-pointer">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-900 mb-1">
          Drop .srt here
        </p>
        <p className="text-sm text-gray-600 mb-1">
          or <span className="text-primary-600 underline">tap to browse</span>
        </p>
        <p className="text-xs text-gray-500">Max 5MB</p>
      </label>
    </div>

    {/* Action Buttons */}
    <div className="mt-6 space-y-3">
      <button
        type="button"
        className="w-full py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Try Different Video
      </button>
      <button
        type="button"
        className="w-full py-3 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Get Help
      </button>
    </div>
  </div>
</div>
```

#### Upload States & Animations
```css
/* Drag and Drop States */
.dropzone-default {
  @apply border-gray-300 bg-white;
}

.dropzone-hover {
  @apply border-primary-400 bg-primary-50;
}

.dropzone-active {
  @apply border-primary-500 bg-primary-100;
  animation: dropzone-pulse 1s infinite;
}

@keyframes dropzone-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Upload Progress */
.upload-progress {
  position: relative;
  overflow: hidden;
}

.upload-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.3));
  transition: width 0.3s ease;
}

/* File Validation States */
.file-valid {
  @apply border-success-500 bg-success-50;
}

.file-invalid {
  @apply border-error-500 bg-error-50;
  animation: shake 0.4s ease-in-out;
}
```

---

### 4. Chapter List Component

#### Desktop Chapter List
```jsx
// ChapterList.tsx
<div className="w-full max-w-4xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h2 className="text-h2 text-gray-900 mb-2">Chapters Generated</h2>
        <p className="text-base text-gray-600">
          Video: "How to Build a Next.js App" " Duration: 1:23:45
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        8 chapters found
      </div>
    </div>

    {/* Chapter List */}
    <div className="space-y-3 mb-8" role="list" aria-label="Generated chapters">
      {/* Chapter Item */}
      <div 
        className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg 
                 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
        role="listitem"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                             bg-primary-100 text-primary-800 font-mono">
                00:00
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 leading-snug">
                Introduction and Setup
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Getting started with the project structure and initial configuration
              </p>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                     bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     opacity-0 group-hover:opacity-100"
            aria-label="Copy this chapter"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* More Chapter Items */}
      <div className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg 
                    hover:border-gray-300 hover:shadow-sm transition-all duration-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium 
                             bg-primary-100 text-primary-800 font-mono">
                03:42
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 leading-snug">
                Installing Dependencies
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Setting up the required packages and development environment
              </p>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                     bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200
                     opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* Additional chapters... */}
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-white bg-primary-500 hover:bg-primary-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy All Chapters
      </button>
      
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export as Text
      </button>
      
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Regenerate
      </button>
    </div>
  </div>
</div>
```

#### Mobile Chapter List
```jsx
<div className="w-full px-4 py-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    {/* Header */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Chapters Ready</h2>
      <p className="text-sm text-gray-600">
        "How to Build..." " 1:23h " 8 chapters
      </p>
    </div>

    {/* Compact Chapter List */}
    <div className="space-y-2 mb-6">
      {/* Chapter Item */}
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg 
                    active:bg-gray-50 transition-colors duration-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium 
                           bg-primary-100 text-primary-800 font-mono flex-shrink-0">
              00:00
            </span>
            <p className="text-sm font-medium text-gray-900 truncate">
              Introduction and Setup
            </p>
          </div>
        </div>
        <button
          type="button"
          className="ml-2 p-2 text-gray-400 hover:text-gray-600 touch-manipulation flex-shrink-0"
          style={{ minWidth: '40px', minHeight: '40px' }}
          aria-label="Copy chapter"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* More compact chapter items... */}
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium 
                           bg-primary-100 text-primary-800 font-mono flex-shrink-0">
              03:42
            </span>
            <p className="text-sm font-medium text-gray-900 truncate">
              Installing Dependencies
            </p>
          </div>
        </div>
        <button
          type="button"
          className="ml-2 p-2 text-gray-400 hover:text-gray-600 touch-manipulation flex-shrink-0"
          style={{ minWidth: '40px', minHeight: '40px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Action Buttons */}
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center px-4 py-3 text-sm font-medium 
                 text-white bg-primary-500 hover:bg-primary-600 rounded-lg 
                 transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy
      </button>
      
      <button
        type="button"
        className="flex items-center justify-center px-4 py-3 text-sm font-medium 
                 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg 
                 transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </button>
    </div>

    {/* Additional Mobile Action */}
    <button
      type="button"
      className="w-full mt-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white 
               border border-gray-300 hover:bg-gray-50 rounded-lg 
               transition-colors duration-200 touch-manipulation"
      style={{ minHeight: '44px' }}
    >
      Try Again
    </button>
  </div>
</div>
```

---

### 5. Copy Button with Feedback Component

#### Copy Button States
```jsx
// CopyButton.tsx
const CopyButton = ({ text, variant = 'primary', size = 'default' }) => {
  const [copyState, setCopyState] = useState('idle'); // idle, copying, success, error

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all duration-200 transform active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: `
      text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      focus:ring-primary-500
    `,
    secondary: `
      text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      focus:ring-gray-500
    `,
    success: `
      text-white bg-success-500 hover:bg-success-600 active:bg-success-700
      focus:ring-success-500
    `
  };

  const getButtonContent = () => {
    switch (copyState) {
      case 'copying':
        return (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Copying...
          </>
        );
      case 'success':
        return (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Copied!
          </>
        );
      case 'error':
        return (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Failed
          </>
        );
      default:
        return (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </>
        );
    }
  };

  const getCurrentVariant = () => {
    if (copyState === 'success') return 'success';
    if (copyState === 'error') return 'secondary';
    return variant;
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[getCurrentVariant()]}`}
      onClick={async () => {
        setCopyState('copying');
        try {
          await navigator.clipboard.writeText(text);
          setCopyState('success');
          setTimeout(() => setCopyState('idle'), 2000);
        } catch (error) {
          setCopyState('error');
          setTimeout(() => setCopyState('idle'), 3000);
        }
      }}
      disabled={copyState === 'copying'}
    >
      {getButtonContent()}
    </button>
  );
};
```

#### Floating Copy Feedback
```jsx
// FloatingCopyFeedback.tsx
<div className="fixed top-4 right-4 z-50">
  <div 
    className={`
      bg-white border border-gray-200 rounded-lg shadow-lg p-4 
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
    `}
  >
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">
          Copied to clipboard!
        </p>
        <p className="text-xs text-gray-500">
          Ready to paste into YouTube description
        </p>
      </div>
    </div>
  </div>
</div>
```

---

### 6. Export Button with Download State

#### Export Controls Component
```jsx
// ExportControls.tsx
<div className="w-full max-w-2xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    {/* Header */}
    <div className="text-center mb-8">
      <h2 className="text-h2 text-gray-900 mb-2">Export Your Chapters</h2>
      <p className="text-base text-gray-600">
        Choose your preferred format and copy or download
      </p>
    </div>

    {/* Export Format Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* YouTube Format */}
      <div className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">YouTube Description</h3>
          <p className="text-xs text-gray-600 mb-4">
            Perfect for pasting directly into your video description
          </p>
          <button
            type="button"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 
                     rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-red-500 focus:ring-offset-2"
          >
            Copy for YouTube
          </button>
        </div>
      </div>

      {/* Plain Text Format */}
      <div className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Plain Text</h3>
          <p className="text-xs text-gray-600 mb-4">
            Simple timestamps with chapter titles
          </p>
          <button
            type="button"
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                     rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-gray-500 focus:ring-offset-2"
          >
            Copy as Text
          </button>
        </div>
      </div>

      {/* JSON Format */}
      <div className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-sm transition-all duration-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">JSON Format</h3>
          <p className="text-xs text-gray-600 mb-4">
            Structured data for developers
          </p>
          <button
            type="button"
            className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 
                     rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
          >
            Copy as JSON
          </button>
        </div>
      </div>
    </div>

    {/* Download Options */}
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Download Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CSV Download */}
        <button
          type="button"
          className="flex items-center justify-center px-6 py-3 text-sm font-medium 
                   text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 
                   rounded-lg transition-colors duration-200 focus:outline-none 
                   focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </button>

        {/* SRT Download */}
        <button
          type="button"
          className="flex items-center justify-center px-6 py-3 text-sm font-medium 
                   text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 
                   rounded-lg transition-colors duration-200 focus:outline-none 
                   focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download SRT
        </button>
      </div>
    </div>

    {/* Success Feedback */}
    <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg hidden" id="export-success">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-success-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-medium text-success-800">
            Copied to clipboard!
          </p>
          <p className="text-xs text-success-700">
            Ready to paste into YouTube description
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Mobile Export Controls
```jsx
<div className="w-full px-4 py-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Export Chapters</h2>
      <p className="text-sm text-gray-600">Choose your format</p>
    </div>

    {/* Stacked Export Options */}
    <div className="space-y-3 mb-6">
      {/* YouTube Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">YouTube Format</p>
              <p className="text-xs text-gray-500">For video descriptions</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 
                     rounded-md touch-manipulation transition-colors duration-200"
            style={{ minHeight: '36px' }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Plain Text Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Plain Text</p>
              <p className="text-xs text-gray-500">Simple timestamps</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                     rounded-md touch-manipulation transition-colors duration-200"
            style={{ minHeight: '36px' }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* JSON Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Developer Format</p>
              <p className="text-xs text-gray-500">JSON structure</p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 
                     rounded-md touch-manipulation transition-colors duration-200"
            style={{ minHeight: '36px' }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    {/* Download Buttons */}
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="flex items-center justify-center px-4 py-3 text-sm font-medium 
                 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
        </svg>
        CSV
      </button>
      
      <button
        type="button"
        className="flex items-center justify-center px-4 py-3 text-sm font-medium 
                 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
        </svg>
        SRT
      </button>
    </div>

    {/* Success Message */}
    <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg hidden" id="mobile-export-success">
      <div className="flex items-center">
        <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-medium text-success-800">Copied! Ready to paste</p>
      </div>
    </div>
  </div>
</div>
```

---

### 7. Error Message Components

#### Network Error Component
```jsx
// ErrorStates.tsx
<div className="w-full max-w-2xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
    {/* Error Icon */}
    <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-8 h-8 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>

    {/* Error Message */}
    <h2 className="text-h2 text-gray-900 mb-4">Oops! Something went wrong</h2>
    <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
      We couldn't process your video right now. This might be temporary.
    </p>

    {/* Possible Causes */}
    <div className="text-left bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">This might be because:</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start">
          <span className="block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          The video is private or unavailable
        </li>
        <li className="flex items-start">
          <span className="block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          YouTube is temporarily unavailable
        </li>
        <li className="flex items-start">
          <span className="block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Your internet connection is unstable
        </li>
      </ul>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-white bg-primary-500 hover:bg-primary-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
      
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        Try Different Video
      </button>
      
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        Upload .srt
      </button>
    </div>

    {/* Support Link */}
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-500 mb-2">Still having trouble?</p>
      <button
        type="button"
        className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
      >
        Contact Support
      </button>
    </div>
  </div>
</div>
```

#### Invalid URL Error
```jsx
<div className="w-full max-w-2xl mx-auto px-6 py-8">
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
    {/* Error Icon */}
    <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-8 h-8 text-error-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>

    {/* Error Message */}
    <h2 className="text-h2 text-gray-900 mb-4">Invalid YouTube URL</h2>
    <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
      We couldn't recognize this as a YouTube link. Please check your URL format.
    </p>

    {/* Requirements List */}
    <div className="text-left bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Please check that your URL:</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li className="flex items-start">
          <svg className="w-4 h-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Starts with youtube.com or youtu.be
        </li>
        <li className="flex items-start">
          <svg className="w-4 h-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Points to a public video
        </li>
        <li className="flex items-start">
          <svg className="w-4 h-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Is properly formatted
        </li>
      </ul>
    </div>

    {/* Example URLs */}
    <div className="text-left bg-primary-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Examples of valid URLs:</h3>
      <div className="space-y-2 text-sm text-gray-600 font-mono">
        <p className="break-all">https://youtube.com/watch?v=dQw4w9WgXcQ</p>
        <p className="break-all">https://youtu.be/dQw4w9WgXcQ</p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-white bg-primary-500 hover:bg-primary-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        Try Again
      </button>
      
      <button
        type="button"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                 transition-colors duration-200"
      >
        See More Examples
      </button>
    </div>
  </div>
</div>
```

#### Mobile Error States
```jsx
<div className="w-full px-4 py-6">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
    {/* Compact Error Icon */}
    <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-6 h-6 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
      </svg>
    </div>

    {/* Error Message */}
    <h2 className="text-lg font-semibold text-gray-900 mb-3">Connection Error</h2>
    <p className="text-sm text-gray-600 mb-4">
      Couldn't process your video
    </p>

    {/* Compact Causes */}
    <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
      <p className="text-sm font-medium text-gray-900 mb-2">This might be:</p>
      <ul className="space-y-1 text-sm text-gray-600">
        <li>" Private video</li>
        <li>" Network issue</li>
        <li>" Temporary problem</li>
      </ul>
    </div>

    {/* Stacked Action Buttons */}
    <div className="space-y-3">
      <button
        type="button"
        className="w-full py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Try Again
      </button>
      
      <button
        type="button"
        className="w-full py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Different Video
      </button>
      
      <button
        type="button"
        className="w-full py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                 hover:bg-gray-50 rounded-lg transition-colors duration-200 touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Upload .srt
      </button>
    </div>

    {/* Support Link */}
    <div className="mt-6 pt-4 border-t border-gray-200">
      <button
        type="button"
        className="text-sm text-primary-600 hover:text-primary-700 font-medium underline touch-manipulation"
        style={{ minHeight: '44px' }}
      >
        Get Help
      </button>
    </div>
  </div>
</div>
```

---

### 8. Mobile Responsive Layouts

#### Responsive Breakpoints
```css
/* Tailwind CSS Responsive Design System */

/* Mobile First Approach */
.container {
  /* Base: Mobile (320px-640px) */
  @apply px-4 py-6;
}

/* Small tablets and large phones */
@media (min-width: 640px) {
  .container {
    @apply px-6 py-8;
  }
}

/* Tablets */
@media (min-width: 768px) {
  .container {
    @apply px-8 py-10;
  }
}

/* Small desktops */
@media (min-width: 1024px) {
  .container {
    @apply px-12 py-12;
  }
}

/* Large desktops */
@media (min-width: 1280px) {
  .container {
    @apply px-16 py-16;
  }
}
```

#### Touch-Optimized Components
```css
/* Touch Target Optimization */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  @apply touch-manipulation;
}

/* Interactive Element Spacing */
.touch-spacing {
  @apply space-y-3 sm:space-y-4;
}

/* Mobile-First Button Sizing */
.btn-mobile {
  @apply w-full py-4 text-base font-medium rounded-lg touch-manipulation;
  min-height: 52px;
}

.btn-mobile-sm {
  @apply w-full py-3 text-sm font-medium rounded-lg touch-manipulation;
  min-height: 44px;
}

/* Desktop Button Sizing */
@media (min-width: 768px) {
  .btn-mobile {
    @apply w-auto px-8 py-3;
  }
  
  .btn-mobile-sm {
    @apply w-auto px-6 py-2;
  }
}
```

#### Mobile Layout Grid
```css
/* Mobile-First Grid System */
.grid-mobile {
  @apply grid grid-cols-1 gap-4;
}

.grid-mobile-2 {
  @apply grid grid-cols-2 gap-3;
}

/* Responsive Grid Expansion */
@media (min-width: 768px) {
  .grid-mobile {
    @apply grid-cols-2 gap-6;
  }
  
  .grid-mobile-2 {
    @apply grid-cols-4 gap-4;
  }
}

@media (min-width: 1024px) {
  .grid-mobile {
    @apply grid-cols-3 gap-8;
  }
  
  .grid-mobile-2 {
    @apply grid-cols-6 gap-6;
  }
}
```

---

## Implementation Guidelines

### Component Development Order
1. **Phase 1**: URL Input Form (Sprint 1)
2. **Phase 2**: Progress Indicator & Loading States (Sprint 2)
3. **Phase 3**: SRT Upload Dropzone (Sprint 3)
4. **Phase 4**: Chapter List Display (Sprint 4)
5. **Phase 5**: Copy/Export Controls (Sprint 5)
6. **Phase 6**: Error States & Recovery (Sprint 6)

### Accessibility Checklist
- [ ] WCAG 2.1 AA color contrast ratios (4.5:1 minimum)
- [ ] Keyboard navigation support for all interactive elements
- [ ] Screen reader compatibility with ARIA labels
- [ ] Focus indicators clearly visible
- [ ] Touch targets minimum 44px � 44px
- [ ] Semantic HTML structure
- [ ] Alternative text for all images/icons
- [ ] Live regions for dynamic content updates

### Performance Optimization
- [ ] Mobile-first CSS loading
- [ ] Lazy loading for non-critical components
- [ ] Optimized animations using transform/opacity
- [ ] Compressed SVG icons
- [ ] Efficient bundle splitting
- [ ] Progressive enhancement approach

### Browser Support
- **Primary**: Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Secondary**: iOS Safari, Chrome Mobile, Samsung Internet
- **Graceful Degradation**: IE11 (basic functionality only)

### Testing Strategy
- [ ] Component unit tests with Jest
- [ ] Visual regression tests with Playwright
- [ ] Accessibility audits with axe-core
- [ ] Cross-browser testing on BrowserStack
- [ ] Mobile device testing on real hardware
- [ ] Performance testing with Lighthouse CI

---

## File Structure for Implementation

```
/components
   ui/
      URLInput/
         URLInput.tsx
         URLInput.test.tsx
         URLInput.stories.tsx
      ProgressIndicator/
         ProgressIndicator.tsx
         ProgressSteps.tsx
         ProgressIndicator.test.tsx
      FileUpload/
         FileUploadDropzone.tsx
         UploadProgress.tsx
         FileUpload.test.tsx
      ChapterList/
         ChapterList.tsx
         ChapterItem.tsx
         ChapterList.test.tsx
      ExportControls/
         ExportControls.tsx
         CopyButton.tsx
         ExportControls.test.tsx
      ErrorStates/
          ErrorBoundary.tsx
          ErrorMessage.tsx
          ErrorStates.test.tsx
   layout/
      Container.tsx
      MobileLayout.tsx
      DesktopLayout.tsx
   shared/
       Button.tsx
       Input.tsx
       Card.tsx
       Icon.tsx
```

This comprehensive UI design specification provides everything needed to implement the Chapter Smith YouTube chapters generator with modern, accessible, and mobile-first design principles. Each component includes detailed Tailwind CSS classes, responsive behavior, and accessibility considerations to ensure rapid development while maintaining high quality standards.

The designs prioritize user experience through clear visual hierarchy, intuitive interactions, and robust error handling, all while being optimized for the 6-day sprint development cycle outlined in the project requirements.