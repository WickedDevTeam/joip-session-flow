
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import MasonryGrid from '@/components/slideshow/MasonryGrid';
import SlideshowItem from '@/components/slideshow/SlideshowItem';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [searchQuery, setSearchQuery] = useState('');
  
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
      <div className="container py-10 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="section-header">Media Browser</h1>
            <p className="section-description">Browse and select media for your sessions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="primary" size="sm">Upload</Button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md bg-joip-dark border-joip-border rounded-lg"
          />
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer">All</Badge>
          <Badge variant="outline" className="cursor-pointer">Images</Badge>
          <Badge variant="outline" className="cursor-pointer">GIFs</Badge>
          <Badge variant="outline" className="cursor-pointer">Videos</Badge>
          <Badge variant="accent" className="cursor-pointer">Favorites</Badge>
        </div>
        
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
            <div className="flex items-center justify-center">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-muted-foreground">Loading more items...</span>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MediaBrowserPage;
