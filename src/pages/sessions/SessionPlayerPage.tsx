
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionPlayer from '@/components/sessions/SessionPlayer';

// Mock data for demo
const mockSessions = {
  '1': {
    id: '1',
    title: 'Brett Cooper',
    images: [
      'https://picsum.photos/id/237/800/1000',
      'https://picsum.photos/id/238/800/1000',
      'https://picsum.photos/id/239/800/1000',
      'https://picsum.photos/id/240/800/1000',
      'https://picsum.photos/id/241/800/1000',
    ],
    interval: 10,
    transition: 'fade',
    aiPrompt: 'You are a witty commentator for a Joip AI slideshow. Given an image or post from Reddit, provide a short, insightful, and sometimes humorous caption. Keep it concise (2-3 sentences maximum) and engaging.'
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
    aiPrompt: 'You are a witty commentator for a Joip AI slideshow. Given an image or post from Reddit, provide a short, insightful, and sometimes humorous caption. Keep it concise (2-3 sentences maximum) and engaging.'
  }
};

const SessionPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
  
  if (loading) {
    return (
      <PageLayout showBackButton>
        <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
          <p>Loading session...</p>
        </div>
      </PageLayout>
    );
  }
  
  if (!session) {
    return (
      <PageLayout showBackButton>
        <div className="flex justify-center items-center h-[calc(100vh-3.5rem)]">
          <p>Session not found.</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title={session.title} showBackButton>
      <SessionPlayer {...session} />
    </PageLayout>
  );
};

export default SessionPlayerPage;
