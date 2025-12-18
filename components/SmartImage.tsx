
import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, alt = "", className = "", aspectRatio = 'square' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const ratioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${ratioClasses} ${className}`}>
      {loading && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      
      {!src || error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
          <ImageIcon className="w-8 h-8" />
          <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  );
};
