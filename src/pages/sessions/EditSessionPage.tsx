
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionForm from '@/components/sessions/SessionForm';
import { toast } from '@/components/ui/use-toast';
import { getSessionById, updateSession, JoipSession } from '@/services/session-service';

const EditSessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<JoipSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSession = async () => {
      if (!id) return;
      
      setLoading(true);
      const sessionData = await getSessionById(id);
      setSession(sessionData);
      setLoading(false);
    };
    
    fetchSession();
  }, [id]);
  
  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    // Transform form data to match our database schema
    const sessionData: Partial<JoipSession> = {
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
    
    // Update in database
    const updatedSession = await updateSession(id, sessionData);
    
    if (updatedSession) {
      toast({
        title: 'Session updated',
        description: `"${data.title}" has been updated successfully.`,
      });
      
      navigate('/sessions');
    }
  };
  
  const handleCancel = () => {
    navigate('/sessions');
  };
  
  if (loading) {
    return (
      <PageLayout title="Edit Session" showBackButton>
        <div className="container max-w-3xl py-8 px-4 sm:px-6">
          <div className="flex justify-center items-center h-64">
            <p>Loading session details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!session) {
    return (
      <PageLayout title="Edit Session" showBackButton>
        <div className="container max-w-3xl py-8 px-4 sm:px-6">
          <div className="flex justify-center items-center h-64">
            <p>Session not found.</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Transform session data to format expected by the form
  const initialFormData = {
    title: session.title,
    thumbnail: session.thumbnail || '',
    subreddits: session.subreddits.join(', '),
    interval: session.interval,
    transition: session.transition,
    aiPrompt: session.ai_prompt || '',
    isFavorite: session.is_favorite,
    isPublic: session.is_public
  };
  
  return (
    <PageLayout title="Edit Session" showBackButton>
      <div className="container max-w-3xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Edit JOIP Session</h1>
        <p className="text-muted-foreground mb-8">
          Update your JOIP Session settings, thumbnail, and AI prompt.
        </p>
        
        <div className="bg-joip-card p-6 rounded-lg border border-border/50">
          <SessionForm
            initialData={initialFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default EditSessionPage;
