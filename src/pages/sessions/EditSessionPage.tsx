
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionForm from '@/components/sessions/SessionForm';
import { toast } from '@/components/ui/use-toast';

// Mock data for demo
const mockSession = {
  title: 'Brett Cooper',
  thumbnail: 'https://picsum.photos/id/237/400/500',
  subreddits: 'BrettCooperSFW, BrettCooper',
  interval: 10,
  transition: 'fade',
  aiPrompt: 'You are a witty commentator for a Joip AI slideshow. Given an image or post from Reddit, provide a short, insightful, and sometimes humorous caption. Keep it concise (2-3 sentences maximum) and engaging.',
  isFavorite: true,
  isPublic: false
};

const EditSessionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch session data
    setLoading(true);
    
    setTimeout(() => {
      // In a real app, we would fetch this from Supabase
      setSession(mockSession);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleSubmit = (data: any) => {
    console.log('Form submitted with updated data:', data);
    
    // Here we would typically update the data in Supabase
    
    toast({
      title: 'Session updated',
      description: `"${data.title}" has been updated successfully.`,
    });
    
    navigate('/sessions');
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
  
  return (
    <PageLayout title="Edit Session" showBackButton>
      <div className="container max-w-3xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Edit Session</h1>
        <p className="text-muted-foreground mb-8">
          Update your JOIP Session settings, thumbnail, and AI prompt.
        </p>
        
        <div className="bg-joip-card p-6 rounded-lg border border-border/50">
          <SessionForm
            initialData={session}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default EditSessionPage;
