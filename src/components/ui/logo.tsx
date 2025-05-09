
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  const { theme } = useTheme();
  
  // Determine which logo to show based on theme
  const logoSrc = theme === 'light' ? '/logo-light.png' : '/logo-dark.png';
  
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img src={logoSrc} alt="Joip Logo" className="h-8" />
      {showText && <span className="text-2xl font-bold">Joip</span>}
    </Link>
  );
};

export default Logo;
