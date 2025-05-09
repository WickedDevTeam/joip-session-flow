
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Session Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter session title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Session Thumbnail</Label>
        <div className="flex items-start space-x-4">
          <div className="border border-border rounded-md overflow-hidden w-32 h-32 flex items-center justify-center bg-joip-dark">
            {thumbnailPreview ? (
              <img 
                src={thumbnailPreview} 
                alt="Session thumbnail" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground text-sm text-center p-2">
                No image selected
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleThumbnailChange}
              className="max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subreddits">Subreddits</Label>
        <Input
          id="subreddits"
          name="subreddits"
          value={formData.subreddits}
          onChange={handleInputChange}
          placeholder="Comma-separated subreddit names (e.g., pics, funny)"
          required
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated subreddit names. Can also include r/subreddit or full URLs.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="interval">JOIP Interval: {formData.interval} seconds</Label>
        <Slider
          id="interval"
          defaultValue={[formData.interval]}
          max={60}
          min={1}
          step={1}
          onValueChange={handleSliderChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transition">Transition Effect</Label>
        <Select
          defaultValue={formData.transition}
          onValueChange={(value) => handleSelectChange('transition', value)}
        >
          <SelectTrigger id="transition">
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
        <Label htmlFor="aiPrompt">AI Caption Prompt</Label>
        <Textarea
          id="aiPrompt"
          name="aiPrompt"
          value={formData.aiPrompt}
          onChange={handleInputChange}
          placeholder="Instructions for how the AI should generate captions"
          rows={5}
        />
        <p className="text-sm text-muted-foreground">
          Instructions for how the AI should generate captions for each image.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="text-to-speech">Text-to-Speech</Label>
            <p className="text-sm text-muted-foreground">
              Have captions read aloud during the session (Coming Soon)
            </p>
          </div>
          <Switch
            id="text-to-speech"
            disabled
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="add-to-favorites">Add to Favorites</Label>
            <p className="text-sm text-muted-foreground">
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
            <Label htmlFor="make-public">Make Public</Label>
            <p className="text-sm text-muted-foreground">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Session</Button>
      </div>
    </form>
  );
};

export default SessionForm;
