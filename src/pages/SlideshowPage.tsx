
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MasonryGrid from '@/components/slideshow/MasonryGrid';
import SlideshowItem from '@/components/slideshow/SlideshowItem';

// Mock data for demo
const generateMockItems = (count: number) => {
  const aspectRatios = ['portrait', 'square', 'video'] as const;
  const mockImages = [
    '/placeholder.svg',
    'https://picsum.photos/id/237/400/500',
    'https://picsum.photos/id/238/400/400',
    'https://picsum.photos/id/239/500/300',
    'https://picsum.photos/id/240/400/600',
    'https://picsum.photos/id/241/500/500',
    'https://picsum.photos/id/242/400/300',
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `image-${i}`,
    image: mockImages[i % mockImages.length],
    alt: `Image ${i}`,
    aspectRatio: aspectRatios[i % aspectRatios.length]
  }));
};

const MediaBrowserPage = () => {
  const [items, setItems] = useState(generateMockItems(12));
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Implement infinite scrolling
  const loadMoreItems = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newItems = generateMockItems(12);
      setItems(prevItems => [...prevItems, ...newItems]);
      setLoading(false);
    }, 1000);
  };
  
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading) {
      loadMoreItems();
    }
  }, [loading]);
  
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);
  
  return (
    <PageLayout>
      <div className="container py-8 px-4 sm:px-6">
        <h1 className="section-header">Media Browser</h1>
        <p className="section-description">Browse and select media for your sessions</p>
        
        <MasonryGrid columns={4}>
          {items.map((item) => (
            <SlideshowItem 
              key={item.id}
              image={item.image}
              alt={item.alt}
              aspectRatio={item.aspectRatio}
            />
          ))}
        </MasonryGrid>
        
        <div 
          ref={loaderRef} 
          className="w-full h-20 flex items-center justify-center mt-6"
        >
          {loading && (
            <div className="loading flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-joip-yellow"></div>
              <span className="ml-2 text-muted-foreground">Loading more items...</span>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MediaBrowserPage;
