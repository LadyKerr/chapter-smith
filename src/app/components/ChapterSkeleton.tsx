'use client';

import React from 'react';

interface ChapterSkeletonProps {
  count?: number;
  delay?: number;
}

export default function ChapterSkeleton({ count = 5, delay = 0 }: ChapterSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-fade-in-left"
          style={{ animationDelay: `${delay + index * 0.1}s` }}
          role="status"
          aria-label="Loading chapter"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-4">
              {/* Timestamp Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              {/* Title Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }}></div>
                {/* Description Skeleton (appears on some items) */}
                {index % 2 === 0 && (
                  <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }}></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Copy Button Skeleton */}
          <div className="ml-4 flex-shrink-0">
            <div className="w-16 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  );
}
