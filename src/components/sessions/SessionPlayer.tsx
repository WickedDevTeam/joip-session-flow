
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

interface SessionPlayerProps {
  id?: string;
  title: string;
  images: string[];
  interval: number; // in seconds
  transition: string;
  aiPrompt: string;
  isPaused?: boolean;
}

// Placeholder captions for demo
const mockCaptions = [
  "The more you edge, the prettier I get. Stroke until you're so stupid...",
  "Keep going, I know you can feel it building up. Don't stop now...",
  "Look at me while you do it. Focus on my eyes, my lips...",
  "Imagine how good it would feel to let go. But you can't. Not yet...",
  "Slow down. I want you to last longer. Much longer...",
];

const SessionPlayer: React.FC<SessionPlayerProps> = ({
  id,
  title,
  images,
  interval,
  transition,
  aiPrompt,
  isPaused = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [imageLoaded, setImageLoaded] = useState(true);
  const nextImageRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Preload next image
  const preloadNextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    if (nextImageRef.current) {
      nextImageRef.current.src = images[nextIndex];
    }
  }, [currentIndex, images]);
  
  // Generate caption for current image
  const generateCaption = useCallback(() => {
    // In a real implementation, this would use an AI API based on aiPrompt
    // For now, we'll use the mock captions
    setCaption(mockCaptions[currentIndex % mockCaptions.length]);
  }, [currentIndex, aiPrompt]);
  
  // Advance to next slide
  const advanceSlide = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to the first image
      setCurrentIndex(0);
    }
    
    setImageLoaded(false);
    preloadNextImage();
  }, [currentIndex, images.length, preloadNextImage]);
  
  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
    generateCaption();
  };
  
  // Set up interval timer for auto-advance
  useEffect(() => {
    if (isPaused || !imageLoaded || images.length === 0) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      advanceSlide();
    }, interval * 1000);
    
    // Cleanup timer on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, imageLoaded, interval, advanceSlide, images.length]);
  
  // Initialize first caption and preload next image
  useEffect(() => {
    if (images.length > 0) {
      generateCaption();
      preloadNextImage();
    }
  }, [images, generateCaption, preloadNextImage]);
  
  // Handle transition style
  const getTransitionStyle = () => {
    switch (transition) {
      case 'fade':
        return 'transition-opacity duration-500';
      case 'slide':
        return 'transition-transform duration-500';
      case 'zoom':
        return 'transition-transform duration-500 transform hover:scale-105';
      default:
        return '';
    }
  };
  
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-white">No images found for this session.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Main content - Resizable panels */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 rounded-lg h-full"
      >
        {/* Left panel - Image */}
        <ResizablePanel defaultSize={65} minSize={30} className="bg-black">
          <div className="h-full w-full relative">
            {/* Current visible image */}
            <img 
              src={images[currentIndex]} 
              alt={`Session media ${currentIndex + 1}`}
              className={`h-full w-full object-contain ${getTransitionStyle()} ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
            />
            
            {/* Preload next image */}
            <img 
              ref={nextImageRef}
              src={images[(currentIndex + 1) % images.length]} 
              alt="Preload next"
              className="hidden"
            />
          </div>
        </ResizablePanel>
        
        {/* Resizable handle */}
        <ResizableHandle withHandle className="bg-[#222222] border-none" />
        
        {/* Right panel - Text */}
        <ResizablePanel defaultSize={35} minSize={25} className="bg-[#121212]">
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-2xl font-medium text-white">{caption}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Mobile fallback layout - show stacked on small screens */}
      <div className="block md:hidden bg-[#121212] p-4">
        <div className="text-xl font-medium text-white text-center">{caption}</div>
      </div>
    </div>
  );
};

export default SessionPlayer;
