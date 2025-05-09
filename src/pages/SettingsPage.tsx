
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const [showNsfw, setShowNsfw] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [autoplayVideos, setAutoplayVideos] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated.',
    });
  };
  
  return (
    <PageLayout title="Settings">
      <div className="container max-w-3xl py-8 px-4 sm:px-6">
        <h1 className="section-header">Settings</h1>
        
        <div className="card-content p-6 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Content Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="nsfw-content">NSFW Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Show NSFW (adult) content in your slideshow and sessions
                  </p>
                </div>
                <Switch
                  id="nsfw-content"
                  checked={showNsfw}
                  onCheckedChange={setShowNsfw}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoplay-videos">Autoplay Videos</Label>
                  <p className="text-sm text-muted-foreground">
                    Videos will play automatically when scrolling
                  </p>
                </div>
                <Switch
                  id="autoplay-videos"
                  checked={autoplayVideos}
                  onCheckedChange={setAutoplayVideos}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">App Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme throughout the app
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable browser notifications for updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings} className="btn-primary">Save Settings</Button>
          </div>
        </div>
        
        <div className="mt-8 card-content p-6">
          <h2 className="text-xl font-bold text-destructive mb-4">Danger Zone</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">
                Permanently delete your account and all your data
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
            
            <div>
              <p className="text-sm mb-2">
                Clear all browsing history and cached content
              </p>
              <Button variant="outline" className="border-destructive text-destructive">
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
