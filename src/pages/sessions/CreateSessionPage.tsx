
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionForm from '@/components/sessions/SessionForm';
import { toast } from '@/components/ui/use-toast';

const CreateSessionPage = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    // Here we would typically save the data to Supabase
    // For demo, we'll just show a success toast and navigate
    
    toast({
      title: 'Session created',
      description: `"${data.title}" has been created successfully.`,
    });
    
    navigate('/sessions');
  };
  
  const handleCancel = () => {
    navigate('/sessions');
  };
  
  return (
    <PageLayout title="Create Session" showBackButton>
      <div className="container max-w-3xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Create Session</h1>
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
