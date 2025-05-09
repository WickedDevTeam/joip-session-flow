
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface SessionPlayerProps {
  sessionId: string;
  title: string;
  images: string[];
  interval: number; // in seconds
  transition: string;
  aiPrompt: string;
}

const SessionPlayer: React.FC<SessionPlayerProps> = ({
  sessionId,
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
  
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setTimeout(() => {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCaption(mockCaptions[currentIndex % mockCaptions.length]);
      } else {
        // Loop back to the first image
        setCurrentIndex(0);
        setCaption(mockCaptions[0]);
      }
    }, interval * 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, interval, images.length, isPaused, mockCaptions]);
  
  // Set initial caption
  useEffect(() => {
    setCaption(mockCaptions[0]);
  }, []);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
      {/* Left panel - Image */}
      <div className="flex-1 bg-black relative">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`}
          className="h-full w-full object-contain"
        />
      </div>
      
      {/* Right panel - Text */}
      <div className="w-full lg:w-1/3 bg-joip-dark flex flex-col">
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-2xl font-medium text-white">{caption}</div>
        </div>
        
        <div className="p-4 flex justify-center">
          <Button 
            size="lg" 
            className="w-32"
            onClick={togglePause}
          >
            {isPaused ? (
              <><Play className="mr-2 h-5 w-5" /> Resume</>
            ) : (
              <><Pause className="mr-2 h-5 w-5" /> Pause</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionPlayer;
