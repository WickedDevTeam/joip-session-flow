
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sessions page
    navigate('/sessions');
  }, [navigate]);

  // This is just a fallback if the redirect doesn't happen immediately
  return (
    <div className="min-h-screen flex items-center justify-center bg-joip-darker">
      <div className="text-center">
        <p className="text-lg text-gray-300">Redirecting to your sessions...</p>
      </div>
    </div>
  );
};

export default Index;
