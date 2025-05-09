
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionForm from '@/components/sessions/SessionForm';
import { toast } from '@/components/ui/use-toast';
import { createSession, JoipSession } from '@/services/session-service';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'You need to be signed in to create a session.',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (data: any) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'You need to be signed in to create a session.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    // Transform form data to match our database schema
    const sessionData: JoipSession = {
      title: data.title,
      thumbnail: data.thumbnail,
      // Convert comma-separated subreddits string to array
      subreddits: data.subreddits.split(',').map((s: string) => s.trim().replace(/^r\//, '')),
      interval: Number(data.interval),
      transition: data.transition,
      ai_prompt: data.aiPrompt,
      is_favorite: data.isFavorite,
      is_public: data.isPublic,
    };
    
    // Save to database
    const newSession = await createSession(sessionData);
    
    if (newSession) {
      toast({
        title: 'Session created',
        description: `"${data.title}" has been created successfully.`,
      });
      
      navigate('/sessions');
    }
  };
  
  const handleCancel = () => {
    navigate('/sessions');
  };
  
  return (
    <PageLayout title="Create Session" showBackButton>
      <div className="container max-w-3xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Create JOIP Session</h1>
        <p className="text-muted-foreground mb-8">
          Create a new JOIP Session with your preferred settings and AI prompt.
        </p>
        
        <div className="bg-joip-card p-6 rounded-lg border border-border/50">
          <SessionForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateSessionPage;
