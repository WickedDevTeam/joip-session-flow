
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const REDDIT_CLIENT_ID = "xJUYYAjdr7ZcgLLM3XkizA";
const REDDIT_CLIENT_SECRET = "CVSv6DFs45GdaSVjkVxKL17hSXGIUA";
const REDDIT_REDIRECT_URI = window.location.origin + "/auth/reddit-callback";
const REDDIT_TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_BASE = "https://oauth.reddit.com";

// Store tokens in local storage with expiry
const saveToken = (token: string, expiresIn: number) => {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem('reddit_access_token', token);
  localStorage.setItem('reddit_token_expires_at', expiresAt.toString());
};

// Check if token exists and is valid
export const hasValidRedditToken = (): boolean => {
  const token = localStorage.getItem('reddit_access_token');
  const expiresAt = localStorage.getItem('reddit_token_expires_at');
  
  if (!token || !expiresAt) return false;
  
  return Date.now() < parseInt(expiresAt);
};

// Clear Reddit tokens
export const clearRedditTokens = () => {
  localStorage.removeItem('reddit_access_token');
  localStorage.removeItem('reddit_token_expires_at');
};

// Get auth URL for Reddit OAuth
export const getRedditAuthUrl = (state: string): string => {
  const params = new URLSearchParams({
    client_id: REDDIT_CLIENT_ID,
    response_type: 'code',
    state,
    redirect_uri: REDDIT_REDIRECT_URI,
    duration: 'permanent',
    scope: 'read',
  });
  
  return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
};

// Exchange code for token
export const exchangeCodeForToken = async (code: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDDIT_REDIRECT_URI,
    });
    
    const response = await fetch(REDDIT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to exchange code for token");
    }
    
    const data = await response.json();
    
    if (data.access_token) {
      saveToken(data.access_token, data.expires_in);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    toast({
      title: "Reddit Authentication Failed",
      description: error instanceof Error ? error.message : "Failed to authenticate with Reddit",
      variant: "destructive"
    });
    return false;
  }
};

// Use application-only auth (no user context)
export const getApplicationOnlyToken = async (): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
    });
    
    const response = await fetch(REDDIT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get application token");
    }
    
    const data = await response.json();
    
    if (data.access_token) {
      saveToken(data.access_token, data.expires_in);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error getting application-only token:', error);
    toast({
      title: "Reddit API Error",
      description: error instanceof Error ? error.message : "Failed to connect to Reddit API",
      variant: "destructive"
    });
    return false;
  }
};

// Get fresh token if needed
export const ensureRedditToken = async (): Promise<string | null> => {
  if (hasValidRedditToken()) {
    return localStorage.getItem('reddit_access_token');
  }
  
  // Try to get a new application-only token
  const success = await getApplicationOnlyToken();
  if (success) {
    return localStorage.getItem('reddit_access_token');
  }
  
  toast({
    title: "Reddit Connection Failed",
    description: "Unable to connect to Reddit API. Please try again later.",
    variant: "destructive"
  });
  
  return null;
};

// Fetch posts from subreddit
export const fetchSubredditPosts = async (subreddit: string, limit = 25): Promise<any[]> => {
  try {
    const token = await ensureRedditToken();
    
    if (!token) {
      throw new Error('No valid Reddit token');
    }
    
    // Clean subreddit name (remove r/ prefix if exists)
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    const url = `${REDDIT_API_BASE}/r/${cleanSubreddit}/hot?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'web:joip-app:v1.0 (by /u/joipapp)',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch from r/${cleanSubreddit}`);
    }
    
    const data = await response.json();
    
    // Extract and return just the posts
    return data.data?.children?.map((child: any) => child.data) || [];
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error);
    toast({
      title: `Error Loading r/${subreddit}`,
      description: error instanceof Error ? error.message : "Failed to load subreddit content",
      variant: "destructive"
    });
    return [];
  }
};

// Extract image URLs from posts
export const extractMediaFromPosts = (posts: any[]): string[] => {
  const mediaUrls: string[] = [];
  
  posts.forEach(post => {
    try {
      // Check for direct image
      if (post.url?.match(/\.(jpg|jpeg|png|gif)$/i)) {
        mediaUrls.push(post.url);
      }
      // Check for gallery
      else if (post.is_gallery && post.media_metadata) {
        const galleryItems = Object.values(post.media_metadata);
        galleryItems.forEach((item: any) => {
          if (item.s?.u) {
            // Reddit uses HTML escaped URLs, so we need to unescape them
            const unescapedUrl = item.s.u.replace(/&amp;/g, '&');
            mediaUrls.push(unescapedUrl);
          }
        });
      }
      // Check for embedded image in preview
      else if (post.preview?.images?.[0]?.source?.url) {
        const unescapedUrl = post.preview.images[0].source.url.replace(/&amp;/g, '&');
        mediaUrls.push(unescapedUrl);
      }
    } catch (error) {
      console.error("Error extracting media from post:", error);
    }
  });
  
  return mediaUrls;
};

// Fetch media from multiple subreddits
export const fetchMediaFromSubreddits = async (subreddits: string[], limit = 10): Promise<string[]> => {
  try {
    // Initialize Reddit token if we don't have one
    if (!hasValidRedditToken()) {
      await getApplicationOnlyToken();
    }
    
    const allMedia: string[] = [];
    const fetchPromises: Promise<void>[] = [];
    
    // Create a promise for each subreddit fetch
    for (const subreddit of subreddits) {
      const promise = fetchSubredditPosts(subreddit, limit)
        .then(posts => {
          const media = extractMediaFromPosts(posts);
          allMedia.push(...media);
        })
        .catch(error => {
          console.error(`Error fetching from r/${subreddit}:`, error);
        });
      
      fetchPromises.push(promise);
    }
    
    // Wait for all fetches to complete
    await Promise.all(fetchPromises);
    
    // Shuffle the media to get a good mix from different subreddits
    return shuffleArray(allMedia);
  } catch (error) {
    console.error('Error fetching media from subreddits:', error);
    toast({
      title: "Media Loading Failed",
      description: error instanceof Error ? error.message : "Failed to load media content",
      variant: "destructive"
    });
    return [];
  }
};

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to validate if a subreddit exists
export const validateSubreddit = async (subreddit: string): Promise<boolean> => {
  try {
    const token = await ensureRedditToken();
    
    if (!token) {
      throw new Error('No valid Reddit token');
    }
    
    // Clean subreddit name
    const cleanSubreddit = subreddit.replace(/^r\//, '').trim();
    const url = `${REDDIT_API_BASE}/r/${cleanSubreddit}/about`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'web:joip-app:v1.0 (by /u/joipapp)',
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data?.data?.display_name ? true : false;
  } catch (error) {
    console.error(`Error validating subreddit r/${subreddit}:`, error);
    return false;
  }
};
