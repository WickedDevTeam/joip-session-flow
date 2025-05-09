
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchMediaFromSubreddits, 
  validateSubreddit, 
  hasValidRedditToken,
  getApplicationOnlyToken
} from '@/integrations/reddit/reddit-api';

export function useRedditMedia(subreddits: string[], limit: number = 25, enabled: boolean = true) {
  const [error, setError] = useState<string | null>(null);
  
  // Check if we have a Reddit token or try to get one
  const { data: hasToken, refetch: checkToken } = useQuery({
    queryKey: ['reddit', 'token'],
    queryFn: async () => {
      if (hasValidRedditToken()) {
        return true;
      }
      return await getApplicationOnlyToken();
    },
    // Only run if we have subreddits
    enabled: enabled && subreddits.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Fetch media from subreddits once we have a token
  const { 
    data: media = [], 
    isLoading, 
    isError, 
    refetch: refetchMedia 
  } = useQuery({
    queryKey: ['reddit', 'media', ...subreddits, limit],
    queryFn: () => fetchMediaFromSubreddits(subreddits, limit),
    enabled: enabled && hasToken === true && subreddits.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    // Replace onError with the correct React Query v5 API
    onSettled: (_, error) => {
      if (error) {
        setError((error as Error)?.message || 'Failed to fetch media from Reddit');
      }
    }
  });
  
  // Validate a single subreddit
  const validateSingleSubreddit = async (subreddit: string): Promise<boolean> => {
    try {
      return await validateSubreddit(subreddit);
    } catch (err) {
      console.error("Error validating subreddit:", err);
      return false;
    }
  };
  
  const refetch = async () => {
    await checkToken();
    await refetchMedia();
  };
  
  return { 
    media, 
    isLoading,
    isError,
    error, 
    refetch,
    validateSubreddit: validateSingleSubreddit 
  };
}
