
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 h-80 rounded-3xl" />
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  </div>
);

export const ComposerSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6">
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm h-[600px]">
      <div className="flex justify-between mb-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-40 rounded-[2rem]" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] rounded-[3rem]" />
      </div>
    </div>
  </div>
);
