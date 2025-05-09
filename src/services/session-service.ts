
import { supabase } from "@/integrations/supabase/client";
import { fetchMediaFromSubreddits } from "@/integrations/reddit/reddit-api";
import { toast } from "@/components/ui/use-toast";

export interface JoipSession {
  id?: string;
  title: string;
  thumbnail?: string;
  subreddits: string[];
  interval: number;
  transition: string;
  ai_prompt?: string;
  is_favorite: boolean;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

// Create a new session
export const createSession = async (sessionData: JoipSession): Promise<JoipSession | null> => {
  try {
    const { error, data } = await supabase
      .from('joip_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating session:', error);
    toast({
      title: 'Error creating session',
      description: error.message || 'Failed to create session. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Get all sessions for the current user
export const getUserSessions = async (): Promise<JoipSession[]> => {
  try {
    const { error, data } = await supabase
      .from('joip_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    toast({
      title: 'Error fetching sessions',
      description: error.message || 'Failed to load sessions. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
};

// Get a session by ID
export const getSessionById = async (id: string): Promise<JoipSession | null> => {
  try {
    const { error, data } = await supabase
      .from('joip_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(`Error fetching session with ID ${id}:`, error);
    toast({
      title: 'Error fetching session',
      description: error.message || 'Failed to load session. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Update an existing session
export const updateSession = async (id: string, sessionData: Partial<JoipSession>): Promise<JoipSession | null> => {
  try {
    const { error, data } = await supabase
      .from('joip_sessions')
      .update(sessionData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error(`Error updating session with ID ${id}:`, error);
    toast({
      title: 'Error updating session',
      description: error.message || 'Failed to update session. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Delete a session
export const deleteSession = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('joip_sessions')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting session with ID ${id}:`, error);
    toast({
      title: 'Error deleting session',
      description: error.message || 'Failed to delete session. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

// Toggle favorite status
export const toggleSessionFavorite = async (id: string, isFavorite: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('joip_sessions')
      .update({ is_favorite: isFavorite })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error toggling favorite status for session ${id}:`, error);
    toast({
      title: 'Error updating session',
      description: error.message || 'Failed to update favorite status. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

// Fetch media for a session
export const fetchSessionMedia = async (session: JoipSession, limit = 20): Promise<string[]> => {
  if (!session.subreddits || session.subreddits.length === 0) {
    return [];
  }
  
  try {
    return await fetchMediaFromSubreddits(session.subreddits, limit);
  } catch (error) {
    console.error('Error fetching session media:', error);
    return [];
  }
};
