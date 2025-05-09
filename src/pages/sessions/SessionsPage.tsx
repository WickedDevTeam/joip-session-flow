
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionCard from '@/components/sessions/SessionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for demo
const mockSessions = [
  {
    id: '1',
    title: 'Brett Cooper',
    thumbnail: 'https://picsum.photos/id/237/400/500',
    isFavorite: false,
    lastUpdated: 'May 5, 2023',
    subreddits: ['BrettCooperSFW', 'BrettCooper'],
    interval: '10s',
    transition: 'fade'
  },
  {
    id: '2',
    title: 'Selena',
    thumbnail: 'https://picsum.photos/id/238/400/400',
    isFavorite: true,
    lastUpdated: 'May 5, 2023',
    subreddits: ['SelenaGomezLust', 'SelenaGomezHot', 'SelenaGomez'],
    interval: '6s',
    transition: 'fade'
  }
];

const SessionsPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockSessions);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSessions = sessions.filter(session => {
    // Filter by search query
    const matchesQuery = session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         session.subreddits.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'favorites' && session.isFavorite);
    
    return matchesQuery && matchesTab;
  });
  
  const handleToggleFavorite = (id: string) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === id 
          ? { ...session, isFavorite: !session.isFavorite } 
          : session
      )
    );
    
    const session = sessions.find(s => s.id === id);
    if (session) {
      toast({
        title: session.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: `"${session.title}" has been ${session.isFavorite ? 'removed from' : 'added to'} your favorites.`,
      });
    }
  };
  
  const handleDelete = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setSessions(prevSessions => prevSessions.filter(s => s.id !== id));
      toast({
        title: 'Session deleted',
        description: `"${session.title}" has been deleted.`,
      });
    }
  };
  
  const handleShare = (id: string) => {
    toast({
      title: 'Share functionality',
      description: 'Sharing feature will be implemented in the future.',
    });
  };
  
  return (
    <PageLayout>
      <div className="container py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Sessions</h1>
            <p className="text-muted-foreground">Create and manage your JOIP sessions</p>
          </div>
          <Button onClick={() => navigate('/sessions/new')} className="shrink-0 bg-white text-black hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-joip-dark border-border/50"
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-joip-dark border border-border/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">All Sessions</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">Favorites</TabsTrigger>
            <TabsTrigger value="shared" disabled className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">Shared with me (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    {...session}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No sessions found. Create your first session!</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <SessionCard
                    key={session.id}
                    {...session}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onShare={handleShare}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No favorite sessions found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default SessionsPage;
