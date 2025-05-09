
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, StarOff, Share2, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <Card className="overflow-hidden bg-joip-card border-joip-border shadow-card hover:shadow-glow transition-all duration-300">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-3 right-3 text-white hover:text-joip-accent hover:bg-black/30 rounded-full bg-black/20"
                onClick={() => onToggleFavorite(id)}
              >
                {isFavorite ? 
                  <Star className="h-5 w-5 fill-joip-accent text-joip-accent" /> : 
                  <StarOff className="h-5 w-5" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <CardContent className="pt-5 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground">Last updated {lastUpdated}</p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subreddits.map((subreddit, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="text-xs py-0.5 px-2.5 bg-secondary/60 hover:bg-secondary/80"
            >
              r/{subreddit}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Interval:</span> {interval}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Transition:</span> {transition}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-joip-border/40 bg-black/20 py-4 px-6 flex justify-between">
        <Button asChild variant="primary" size="sm" className="bg-joip-accent hover:bg-joip-accent/90 text-white">
          <Link to={`/session/${id}`} className="flex items-center gap-1.5">
            <Play className="h-4 w-4" />
            <span>Play</span>
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="hover:bg-white/10">
                  <Link to={`/sessions/edit/${id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onShare(id)} className="hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="hover:bg-white/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
