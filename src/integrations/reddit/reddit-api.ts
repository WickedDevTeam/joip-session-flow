
import { supabase } from "@/integrations/supabase/client";

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
    
    const data = await response.json();
    
    if (data.access_token) {
      saveToken(data.access_token, data.expires_in);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
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
    
    const data = await response.json();
    
    if (data.access_token) {
      saveToken(data.access_token, data.expires_in);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error getting application-only token:', error);
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
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Failed to fetch subreddit posts');
    }
    
    // Extract and return just the posts
    return data.data?.children?.map((child: any) => child.data) || [];
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error);
    return [];
  }
};

// Extract image URLs from posts
export const extractMediaFromPosts = (posts: any[]): string[] => {
  const mediaUrls: string[] = [];
  
  posts.forEach(post => {
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
    
    for (const subreddit of subreddits) {
      const posts = await fetchSubredditPosts(subreddit, limit);
      const media = extractMediaFromPosts(posts);
      allMedia.push(...media);
    }
    
    return allMedia;
  } catch (error) {
    console.error('Error fetching media from subreddits:', error);
    return [];
  }
};
