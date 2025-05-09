
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, History } from 'lucide-react';
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
}

const SessionPlayer: React.FC<SessionPlayerProps> = ({
  id,
  title,
  images,
  interval,
  transition,
  aiPrompt
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [caption, setCaption] = useState('');
  
  // Mock captions for demo purposes
  const mockCaptions = [
    "The more you edge, the prettier I get. Stroke until you're so stupid...",
    "Keep going, I know you can feel it building up. Don't stop now...",
    "Look at me while you do it. Focus on my eyes, my lips...",
    "Imagine how good it would feel to let go. But you can't. Not yet...",
    "Slow down. I want you to last longer. Much longer...",
  ];
  
  const advanceSlide = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCaption(mockCaptions[currentIndex % mockCaptions.length]);
    } else {
      // Loop back to the first image
      setCurrentIndex(0);
      setCaption(mockCaptions[0]);
    }
  }, [currentIndex, images.length, mockCaptions]);
  
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setTimeout(() => {
      advanceSlide();
    }, interval * 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, interval, isPaused, advanceSlide]);
  
  // Set initial caption
  useEffect(() => {
    setCaption(mockCaptions[0]);
  }, []);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
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
            <img 
              src={images[currentIndex]} 
              alt={`Session media ${currentIndex + 1}`}
              className="h-full w-full object-contain"
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
