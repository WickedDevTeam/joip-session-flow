
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface SessionFormProps {
  initialData?: {
    title: string;
    thumbnail: string;
    subreddits: string;
    interval: number;
    transition: string;
    aiPrompt: string;
    isFavorite: boolean;
    isPublic: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  initialData = {
    title: '',
    thumbnail: '',
    subreddits: '',
    interval: 10,
    transition: 'fade',
    aiPrompt: 'You are a witty commentator for a Joip AI slideshow. Given an image or post from Reddit, provide a short, insightful, and sometimes humorous caption. Keep it concise (2-3 sentences maximum) and engaging.',
    isFavorite: false,
    isPublic: false
  },
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData.thumbnail || null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, interval: value[0] }));
  };
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        setFormData(prev => ({ ...prev, thumbnail: result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearThumbnail = () => {
    setThumbnailPreview(null);
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Session Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter session title"
          className="bg-joip-dark border-border/50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Session Thumbnail</Label>
        <div className="relative">
          {thumbnailPreview ? (
            <div className="relative w-full h-64 overflow-hidden rounded-md">
              <img 
                src={thumbnailPreview} 
                alt="Session thumbnail" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                onClick={clearThumbnail}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="w-full h-64 border border-border/50 rounded-md flex items-center justify-center bg-joip-dark">
              <p className="text-muted-foreground">No thumbnail selected</p>
            </div>
          )}
        </div>
        <div className="pt-2">
          <Input
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleThumbnailChange}
            className="bg-joip-dark border-border/50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports JPG, PNG, GIF and WebP. Max size 5MB.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload a custom thumbnail for your session or leave empty to use an image from your selected subreddits.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subreddits" className="text-sm font-medium">Subreddits</Label>
        <Input
          id="subreddits"
          name="subreddits"
          value={formData.subreddits}
          onChange={handleInputChange}
          placeholder="BrettCooperSFW, BrettCooper"
          className="bg-joip-dark border-border/50"
          required
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated subreddit names. Can also include r/subreddit or full URLs.
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="interval" className="text-sm font-medium">JOIP Interval</Label>
          <span className="text-sm text-muted-foreground">{formData.interval} seconds</span>
        </div>
        <Slider
          id="interval"
          defaultValue={[formData.interval]}
          max={60}
          min={1}
          step={1}
          onValueChange={handleSliderChange}
          className="mt-2"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transition" className="text-sm font-medium">Transition Effect</Label>
        <Select
          defaultValue={formData.transition}
          onValueChange={(value) => handleSelectChange('transition', value)}
        >
          <SelectTrigger id="transition" className="bg-joip-dark border-border/50">
            <SelectValue placeholder="Select transition effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="aiPrompt" className="text-sm font-medium">AI Caption Prompt</Label>
        <Textarea
          id="aiPrompt"
          name="aiPrompt"
          value={formData.aiPrompt}
          onChange={handleInputChange}
          placeholder="Instructions for how the AI should generate captions"
          rows={7}
          className="bg-joip-dark border-border/50 resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Instructions for how the AI should generate captions for each image.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="text-to-speech" className="text-sm font-medium">Text-to-Speech</Label>
              <span className="text-xs bg-joip-dark px-2 py-0.5 rounded-full text-muted-foreground">Coming Soon</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Have captions read aloud during the session
            </p>
          </div>
          <Switch
            id="text-to-speech"
            disabled
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="add-to-favorites" className="text-sm font-medium">Add to Favorites</Label>
            <p className="text-xs text-muted-foreground">
              Mark this session as a favorite for quick access
            </p>
          </div>
          <Switch
            id="add-to-favorites"
            checked={formData.isFavorite}
            onCheckedChange={(checked) => handleSwitchChange('isFavorite', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="make-public" className="text-sm font-medium">Make Public</Label>
            <p className="text-xs text-muted-foreground">
              Allow sharing this session with others
            </p>
          </div>
          <Switch
            id="make-public"
            checked={formData.isPublic}
            onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-transparent hover:bg-joip-dark/50"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-white text-black hover:bg-white/90">
          Save Session
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
