
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pause, Play, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SessionPlayer from '@/components/sessions/SessionPlayer';
import { getSessionById, fetchSessionMedia, JoipSession } from '@/services/session-service';
import { fetchMediaFromSubreddits } from '@/integrations/reddit/reddit-api';
import { toast } from '@/components/ui/use-toast';

const SessionPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<JoipSession | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  
  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!id) return;
      
      setLoading(true);
      const sessionData = await getSessionById(id);
      setSession(sessionData);
      setLoading(false);
      
      if (sessionData) {
        loadMedia(sessionData);
      }
    };
    
    fetchSession();
  }, [id]);
  
  // Load media from Reddit
  const loadMedia = async (sessionData: JoipSession) => {
    setLoadingMedia(true);
    
    try {
      const mediaUrls = await fetchSessionMedia(sessionData, 25);
      
      if (mediaUrls.length === 0) {
        toast({
          title: 'No media found',
          description: 'Could not find any media in the selected subreddits. Please check the subreddit names and try again.',
          variant: 'destructive',
        });
      } else {
        setMedia(mediaUrls);
      }
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: 'Error loading media',
        description: 'Failed to load media from Reddit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMedia(false);
    }
  };
  
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
        {loadingMedia ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">Loading media...</p>
          </div>
        ) : media.length > 0 ? (
          <SessionPlayer 
            id={session.id}
            title={session.title}
            images={media}
            interval={session.interval}
            transition={session.transition}
            aiPrompt={session.ai_prompt || ""}
            isPaused={isPaused}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-white mb-4">No media found for this session.</p>
            <Button 
              onClick={() => loadMedia(session)}
              className="bg-white text-black hover:bg-white/90"
            >
              Retry Loading Media
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPlayerPage;
