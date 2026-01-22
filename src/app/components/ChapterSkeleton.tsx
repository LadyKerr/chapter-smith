'use client';

import React, { useMemo } from 'react';

interface ChapterSkeletonProps {
  count?: number;
  delay?: number;
}

export default function ChapterSkeleton({ count = 5, delay = 0 }: ChapterSkeletonProps) {
  // Generate fixed widths once to avoid re-renders
  const skeletonWidths = useMemo(() => {
    const widths = [];
    const titleWidths = [60, 70, 65, 75, 68];
    const descWidths = [40, 50, 45, 55, 48];
    
    for (let i = 0; i < count; i++) {
      widths.push({
        title: titleWidths[i % titleWidths.length],
        desc: descWidths[i % descWidths.length],
        hasDesc: i % 2 === 0
      });
    }
    return widths;
  }, [count]);

  return (
    <>
      {skeletonWidths.map((item, index) => (
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
                <div className="h-5 bg-gray-200 rounded animate-pulse" style={{ width: `${item.title}%` }}></div>
                {/* Description Skeleton (appears on some items) */}
                {item.hasDesc && (
                  <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${item.desc}%` }}></div>
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
