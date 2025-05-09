
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
  const { isAuthenticated, loading } = useAuth();
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    // Only redirect after authentication check is complete
    if (loading) return;
    
    if (!isAuthenticated) {
      console.log("CreateSessionPage: Not authenticated, redirecting");
      toast({
        title: 'Authentication required',
        description: 'You need to be signed in to create a session.',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <PageLayout title="Create Session" showBackButton>
        <div className="container flex justify-center items-center py-20">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </PageLayout>
    );
  }
  
  // If not authenticated, don't render the form
  if (!isAuthenticated) {
    return null; // We're redirecting anyway
  }
  
  const handleSubmit = async (data: any) => {
    // We already checked authentication above, but double-check
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
    
    try {
      // Save to database
      const newSession = await createSession(sessionData);
      
      if (newSession) {
        toast({
          title: 'Session created',
          description: `"${data.title}" has been created successfully.`,
        });
        
        navigate('/sessions');
      }
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: 'Error creating session',
        description: 'There was a problem creating your session. Please try again.',
        variant: 'destructive',
      });
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
