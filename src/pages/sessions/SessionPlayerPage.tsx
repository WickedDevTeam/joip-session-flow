
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pause, Play, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import SessionPlayer from '@/components/sessions/SessionPlayer';

// Mock data for demo
const mockSessions = {
  '1': {
    id: '1',
    title: 'Selena',
    images: [
      'https://picsum.photos/id/237/800/1000',
      'https://picsum.photos/id/238/800/1000',
      'https://picsum.photos/id/239/800/1000',
      'https://picsum.photos/id/240/800/1000',
      'https://picsum.photos/id/241/800/1000',
    ],
    interval: 10,
    transition: 'fade',
    aiPrompt: 'You are a dominant female giving instructions to submissive male users. Provide teasing, instructional captions for each image shown, describing what they should do to pleasure or punish themselves. Keep it immersive, provocative and commanding in tone.'
  },
  '2': {
    id: '2',
    title: 'Selena',
    images: [
      'https://picsum.photos/id/242/800/1000',
      'https://picsum.photos/id/243/800/1000',
      'https://picsum.photos/id/244/800/1000',
      'https://picsum.photos/id/247/800/1000',
      'https://picsum.photos/id/248/800/1000',
    ],
    interval: 6,
    transition: 'fade',
    aiPrompt: 'You are a dominant female giving instructions to submissive male users. Provide teasing, instructional captions for each image shown, describing what they should do to pleasure or punish themselves. Keep it immersive, provocative and commanding in tone.'
  }
};

const SessionPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // Simulate API call to fetch session data
    setTimeout(() => {
      const sessionData = mockSessions[id as keyof typeof mockSessions];
      setSession(sessionData);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const showHistory = () => {
    // In a real implementation, this would show session history
    console.log("Show history/resume functionality");
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-joip-darker">
        <p className="text-white">Loading session...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-joip-darker">
        <p className="text-white">Session not found.</p>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-joip-darker">
      {/* Custom header for the session player */}
      <header className="h-14 border-b border-border/40 bg-black px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white" 
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </Button>
          <div className="flex items-center">
            <div className="text-joip-yellow font-bold text-2xl mr-2">⚡Joip</div>
            <span className="text-lg font-medium text-white">{session.title}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white" 
            onClick={togglePause}
          >
            {isPaused ? (
              <Play className="h-5 w-5" />
            ) : (
              <Pause className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white" 
            onClick={showHistory}
          >
            <History className="h-5 w-5" />
          </Button>
          
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
        </div>
      </header>
      
      {/* Session Player */}
      <div className="flex-1 overflow-hidden">
        <SessionPlayer {...session} />
      </div>
    </div>
  );
};

export default SessionPlayerPage;
