
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Star, StarOff, Share2, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

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
    <div className="bg-black/30 rounded-lg overflow-hidden">
      <div className="relative">
        <img 
          src={thumbnail || '/placeholder.svg'} 
          alt={title}
          className="w-full h-52 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 text-white hover:text-joip-accent bg-transparent hover:bg-transparent"
          onClick={() => onToggleFavorite(id)}
        >
          {isFavorite ? 
            <Star className="h-5 w-5 fill-white text-white" /> : 
            <StarOff className="h-5 w-5" />
          }
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">Last updated {lastUpdated}</p>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {subreddits.map((subreddit, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="text-xs px-2 py-0.5 bg-black/20 hover:bg-black/40 border-gray-700"
            >
              r/{subreddit}
            </Badge>
          ))}
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="text-sm text-gray-400">
            Interval: {interval}
          </div>
          <div className="text-sm text-gray-400">
            Transition: {transition}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 flex justify-between">
        <Button asChild variant="ghost" className="bg-black/30 hover:bg-black/50 text-white border-0 rounded-md">
          <Link to={`/session/${id}`} className="flex items-center gap-1.5">
            <Play className="h-4 w-4" />
            <span>Play</span>
          </Link>
        </Button>
        
        <div className="flex gap-1">
          <Button asChild variant="ghost" size="icon" className="bg-transparent hover:bg-black/20 border-0">
            <Link to={`/sessions/edit/${id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => onShare(id)} className="bg-transparent hover:bg-black/20 border-0">
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="bg-transparent hover:bg-black/20 border-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
