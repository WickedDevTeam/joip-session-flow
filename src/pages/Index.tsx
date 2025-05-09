
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-gradient-to-b from-joip-dark to-joip-darker p-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-joip-yellow">⚡Joip</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-300">
            Immersive visual experiences with AI-powered interactive sessions
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/slideshow')}
            >
              Browse Slideshow
            </Button>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/sessions')}
            >
              My Sessions
            </Button>
          </div>
          
          <p className="mt-12 text-sm text-gray-400">
            Joip offers a personalized media experience powered by AI, sourcing from Reddit and other content providers.
            <br />
            Connect your Reddit account to start browsing or create custom Joip Sessions with AI-generated captions.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
