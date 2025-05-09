
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SessionCard from '@/components/sessions/SessionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { JoipSession, getUserSessions, toggleSessionFavorite, deleteSession } from '@/services/session-service';
import { useAuth } from '@/hooks/use-auth';
import ShareSessionDialog from '@/components/sessions/ShareSessionDialog';

const SessionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<JoipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<JoipSession | null>(null);
  
  // Fetch sessions on page load
  useEffect(() => {
    const fetchSessions = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      const data = await getUserSessions();
      setSessions(data);
      setLoading(false);
    };
    
    fetchSessions();
  }, [isAuthenticated]);
  
  const filteredSessions = sessions.filter(session => {
    // Filter by search query
    const matchesQuery = 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      session.subreddits.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'favorites' && session.is_favorite);
    
    return matchesQuery && matchesTab;
  });
  
  const handleToggleFavorite = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    const newFavoriteStatus = !session.is_favorite;
    const success = await toggleSessionFavorite(id, newFavoriteStatus);
    
    if (success) {
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === id 
            ? { ...session, is_favorite: newFavoriteStatus } 
            : session
        )
      );
      
      toast({
        title: newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        description: `"${session.title}" has been ${newFavoriteStatus ? 'added to' : 'removed from'} your favorites.`,
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    const success = await deleteSession(id);
    
    if (success) {
      setSessions(prevSessions => prevSessions.filter(s => s.id !== id));
      
      toast({
        title: 'Session deleted',
        description: `"${session.title}" has been deleted.`,
      });
    }
  };
  
  const handleShare = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    
    setSelectedSession(session);
    setShareDialogOpen(true);
  };
  
  const handlePlaySession = () => {
    if (!selectedSession?.id) return;
    
    navigate(`/session/${selectedSession.id}`);
    setShareDialogOpen(false);
  };
  
  return (
    <PageLayout>
      <div className="container py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold section-header">Your Sessions</h1>
            <p className="text-muted-foreground">Create and manage your JOIP sessions</p>
          </div>
          <Button 
            onClick={() => navigate('/sessions/new')} 
            className="btn-primary shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md bg-joip-dark border-joip-border"
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-joip-dark border border-joip-border/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">All Sessions</TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">Favorites</TabsTrigger>
            <TabsTrigger value="shared" disabled className="data-[state=active]:bg-joip-yellow data-[state=active]:text-black">Shared with me (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      id={session.id || ''}
                      title={session.title}
                      thumbnail={session.thumbnail || '/placeholder.svg'}
                      isFavorite={session.is_favorite}
                      lastUpdated={new Date(session.updated_at || Date.now()).toLocaleDateString()}
                      subreddits={session.subreddits}
                      interval={`${session.interval}s`}
                      transition={session.transition}
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
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      id={session.id || ''}
                      title={session.title}
                      thumbnail={session.thumbnail || '/placeholder.svg'}
                      isFavorite={session.is_favorite}
                      lastUpdated={new Date(session.updated_at || Date.now()).toLocaleDateString()}
                      subreddits={session.subreddits}
                      interval={`${session.interval}s`}
                      transition={session.transition}
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
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedSession && (
        <ShareSessionDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          session={{
            id: selectedSession.id || '',
            title: selectedSession.title,
            subreddits: selectedSession.subreddits,
            interval: `${selectedSession.interval}s`,
            transition: selectedSession.transition,
            isPublic: selectedSession.is_public
          }}
          onPlaySession={handlePlaySession}
        />
      )}
    </PageLayout>
  );
};

export default SessionsPage;
