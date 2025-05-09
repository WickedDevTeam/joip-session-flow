
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, StarOff, Share2, Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SessionCardProps {
  id: string;
  title: string;
  thumbnail: string;
  isFavorite: boolean;
  lastUpdated: string;
  subreddits: string[];
  interval: string;
  transition: string;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  title,
  thumbnail,
  isFavorite,
  lastUpdated,
  subreddits,
  interval,
  transition,
  onToggleFavorite,
  onDelete,
  onShare
}) => {
  return (
    <Card className="overflow-hidden bg-joip-card border border-border/50">
      <div className="relative">
        <img 
          src={thumbnail || '/placeholder.svg'} 
          alt={title}
          className="w-full h-52 object-cover"
          onError={(e) => {
            // If image fails to load, replace with placeholder
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:text-joip-yellow hover:bg-black/30 rounded-full bg-black/20"
          onClick={() => onToggleFavorite(id)}
        >
          {isFavorite ? 
            <Star className="h-5 w-5 fill-joip-yellow text-joip-yellow" /> : 
            <StarOff className="h-5 w-5" />
          }
        </Button>
      </div>
      
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">Last updated {lastUpdated}</p>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {subreddits.map((subreddit, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              r/{subreddit}
            </span>
          ))}
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Interval:</span> {interval}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Transition:</span> {transition}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border/40 bg-black/20 py-3 px-6 flex justify-between">
        <Button asChild variant="ghost" size="icon">
          <Link to={`/session/${id}`}>
            <Play className="h-5 w-5" />
          </Link>
        </Button>
        
        <div className="flex gap-1">
          <Button asChild variant="ghost" size="icon">
            <Link to={`/sessions/edit/${id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onShare(id)}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
