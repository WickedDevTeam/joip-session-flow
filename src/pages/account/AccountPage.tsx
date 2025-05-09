
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const AccountPage = () => {
  const [displayName, setDisplayName] = useState('Anonymous User');
  const [avatarUrl, setAvatarUrl] = useState('/placeholder.svg');
  
  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been updated.',
    });
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <PageLayout title="My Account">
      <div className="container max-w-4xl py-8 px-4 sm:px-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="mt-6">
            <div className="bg-joip-card p-6 rounded-lg border border-border/50">
              <h2 className="text-2xl font-bold mb-2">User Profile</h2>
              <p className="text-muted-foreground mb-6">
                Update your account information and preferences
              </p>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt="Profile" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <Button variant="outline" asChild>
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        Upload profile image
                      </Label>
                    </Button>
                    <Input
                      id="profile-image"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleProfileImageChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, and GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    This is your public display name visible to other users.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-joip-card p-6 rounded-lg border border-border/50">
              <h2 className="text-2xl font-bold mb-2">
                Free
                <span className="ml-2 text-sm align-middle px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  Basic features
                </span>
              </h2>
              
              <div className="mt-4">
                <p className="text-muted-foreground mb-4">
                  Support Joip AI and unlock premium features by becoming a patron.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Premium Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Access to premium subreddits
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Extended slideshow durations
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Custom AI model selection
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Unlimited media sources
                  </li>
                </ul>
                
                <Button className="mt-6 w-full">
                  Connect Patreon
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connections" className="mt-6">
            <div className="bg-joip-card p-6 rounded-lg border border-border/50">
              <div className="flex items-center gap-4">
                <div className="bg-orange-600 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                  r
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">Reddit Connection</h2>
                  <p className="text-muted-foreground">Your Reddit account is connected</p>
                </div>
              </div>
              
              <div className="mt-4 pl-12">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-green-500">✓</span>
                  <span>Authenticated with Reddit</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Token expires in: 1418 minutes
                </p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Available Permissions</h3>
                  <ul className="space-y-1">
                    <li className="text-sm flex items-center gap-2">
                      <span className="text-green-500">✓</span> read
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <span className="text-green-500">✓</span> identity
                    </li>
                    <li className="text-sm flex items-center gap-2">
                      <span className="text-green-500">✓</span> history
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Visit Reddit</Button>
                  <Button variant="destructive" size="sm">Disconnect</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-joip-card p-6 rounded-lg border border-border/50">
              <h2 className="text-2xl font-bold mb-2">
                Free
                <span className="ml-2 text-sm align-middle px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                  Basic features
                </span>
              </h2>
              
              <div className="mt-4">
                <p className="text-muted-foreground mb-4">
                  Support Joip AI and unlock premium features by becoming a patron.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Premium Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Access to premium subreddits
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Extended slideshow durations
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Custom AI model selection
                  </li>
                  <li className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    Unlimited media sources
                  </li>
                </ul>
                
                <Button className="mt-6 w-full">
                  Connect Patreon
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AccountPage;
