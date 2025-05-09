
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Settings, Play } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const JoipLogo = () => (
  <Link to="/" className="flex items-center gap-1">
    <div className="text-joip-yellow font-bold text-2xl">⚡Joip</div>
  </Link>
);

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-joip-border bg-joip-darker">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2 text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {title ? (
            <>
              <JoipLogo />
              <span className="ml-2 text-lg font-medium">{title}</span>
            </>
          ) : (
            <JoipLogo />
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-joip-card border-joip-border">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                <Link to="/slideshow" className="flex gap-2 items-center">
                  <Play className="h-4 w-4" />
                  <span>Slideshow</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                <Link to="/sessions" className="flex gap-2 items-center">
                  <Play className="h-4 w-4" />
                  <span>Sessions</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                <Link to="/account" className="flex gap-2 items-center">
                  <span>My Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/5">
                <Link to="/settings" className="flex gap-2 items-center">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-joip-border" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-white/5">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
