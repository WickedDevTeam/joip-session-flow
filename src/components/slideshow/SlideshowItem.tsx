
import React from 'react';
import { Card } from '@/components/ui/card';

interface SlideshowItemProps {
  image: string;
  alt: string;
  aspectRatio?: 'portrait' | 'square' | 'video';
}

const SlideshowItem: React.FC<SlideshowItemProps> = ({ 
  image, 
  alt,
  aspectRatio = 'portrait'
}) => {
  const aspectRatioClass = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    video: 'aspect-video'
  };

  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className={`relative ${aspectRatioClass[aspectRatio]} bg-joip-card w-full overflow-hidden`}>
        <img 
          src={image} 
          alt={alt}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
    </Card>
  );
};

export default SlideshowItem;
