
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Share2, Link as LinkIcon } from 'lucide-react';

interface ShareSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: {
    id: string;
    title: string;
    description?: string;
    subreddits: string[];
    interval: string;
    transition: string;
    isPublic: boolean;
  };
  onPlaySession: () => void;
}

const ShareSessionDialog: React.FC<ShareSessionDialogProps> = ({
  open,
  onOpenChange,
  session,
  onPlaySession
}) => {
  const [isPublic, setIsPublic] = useState(session.isPublic);
  const [shareableLink, setShareableLink] = useState(isPublic ? `${window.location.origin}/shared/${session.id}` : '');
  
  const handleTogglePublic = async (checked: boolean) => {
    setIsPublic(checked);
    
    // In a real app, we'd update the database here
    // For now, we just simulate the public status
    
    if (checked) {
      setShareableLink(`${window.location.origin}/shared/${session.id}`);
      
      toast({
        title: 'Session made public',
        description: 'This session can now be shared with others.',
      });
    } else {
      setShareableLink('');
      
      toast({
        title: 'Session made private',
        description: 'This session is now private and cannot be shared.',
      });
    }
  };
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: 'Link copied',
      description: 'Shareable link has been copied to clipboard.',
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-joip-card text-white border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-5 w-5" />
            Share JOIP Session
          </DialogTitle>
          <DialogDescription>
            Share your session "{session.title}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Session Details</h3>
            
            {session.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description:</p>
                <p className="text-sm">{session.description || 'No description'}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Subreddits:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {session.subreddits.map((subreddit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                  >
                    r/{subreddit}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Interval:</p>
                <p className="text-sm">{session.interval}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transition:</p>
                <p className="text-sm">{session.transition}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="space-y-0.5">
              <Label htmlFor="public-session" className="text-sm font-medium">Public Session</Label>
              <p className="text-xs text-muted-foreground">
                Only you and people you share with can access this session
              </p>
            </div>
            <Switch
              id="public-session"
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
            />
          </div>
          
          {isPublic && (
            <div className="flex items-center gap-2 pt-2">
              <Input 
                value={shareableLink} 
                readOnly 
                className="bg-joip-dark border-border/50 text-sm"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyLinkToClipboard}
                className="shrink-0 bg-joip-dark hover:bg-joip-dark/80 border-border/50"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {!isPublic && (
            <div className="text-center py-3 text-sm text-muted-foreground">
              Enable "Public Session" to generate a shareable link
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-border/50 hover:bg-joip-dark/50"
          >
            Cancel
          </Button>
          <Button
            onClick={onPlaySession}
            className="bg-white text-black hover:bg-white/90"
          >
            Play Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSessionDialog;
