import React, { useState } from 'react';
import { PhotoAttribution } from '../../types';
import { placePhotoUrl } from '../../lib/places';

interface SmartImageProps {
  src?: string;
  photo?: PhotoAttribution;
  mockFallback?: string;
  slug?: string;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/2' | '2/3' | 'auto';
  className?: string;
  priority?: boolean;
  attribution?: PhotoAttribution;
  width?: number;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  photo,
  mockFallback,
  slug = 'dishcult-dining',
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false,
  attribution,
  width = 800,
}) => {
  // Determine primary image URL
  const initialUrl = photo?.name
    ? placePhotoUrl(photo.name, width)
    : photo?.url || src || mockFallback || `https://picsum.photos/seed/${slug}/1200/800`;

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [errorStage, setErrorStage] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleError = () => {
    if (errorStage === 0 && mockFallback && mockFallback !== currentSrc) {
      setErrorStage(1);
      setCurrentSrc(mockFallback);
    } else if (errorStage <= 1) {
      setErrorStage(2);
      setCurrentSrc(`https://picsum.photos/seed/${slug}/1200/800`);
    } else {
      setErrorStage(3); // styled container fallback
    }
  };

  const activeAttribution = attribution || photo;

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : aspectRatio === '2/3'
      ? 'aspect-[2/3]'
      : '';

  return (
    <div
      className={`relative overflow-hidden bg-coal ${aspectClass} ${className}`}
    >
      {/* Blurred gradient shimmer placeholder */}
      {!loaded && errorStage < 3 && (
        <div className="absolute inset-0 bg-gradient-to-tr from-coal via-smoke to-coal animate-pulse">
          <div className="absolute inset-0 opacity-20 bg-brand-gradient blur-xl" />
        </div>
      )}

      {errorStage < 3 ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ${
            loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
          }`}
        />
      ) : (
        /* Styled CSS/SVG fallback container */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-coal via-smoke to-ink text-center">
          <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-xs font-serif text-cream/80 max-w-[80%] line-clamp-1">{alt}</p>
          <span className="text-[10px] text-muted tracking-wider uppercase mt-1">Dish Cult Kitchen</span>
        </div>
      )}

      {/* Subtle vignette scrim */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />

      {/* Optional Photo Attribution (Section 7.6) */}
      {activeAttribution?.authorName && (
        <div className="absolute bottom-2 left-2 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
          {activeAttribution.authorUri ? (
            <a
              href={activeAttribution.authorUri}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded text-[10px] bg-ink/75 backdrop-blur-md text-muted hover:text-cream border border-smoke/50 transition-colors inline-block"
            >
              Photo: {activeAttribution.authorName}
            </a>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] bg-ink/75 backdrop-blur-md text-muted border border-smoke/50">
              Photo: {activeAttribution.authorName}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
