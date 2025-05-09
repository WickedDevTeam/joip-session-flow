
import React, { ReactNode } from 'react';
import Header from './Header';
// Import is kept but component will not be rendered
// import AgeVerification from './AgeVerification';

interface PageLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  showBackButton = false,
  title
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* AgeVerification component temporarily disabled */}
      <Header showBackButton={showBackButton} title={title} />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
