
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/auth"];

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (loading) return;
    
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );
    
    if (!isAuthenticated && !isPublicRoute) {
      navigate("/auth", { state: { from: location.pathname } });
    }
    
    if (isAuthenticated && isPublicRoute) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);
  
  if (loading) {
    // Loading state - could be replaced with a spinner
    return (
      <div className="min-h-screen flex justify-center items-center bg-joip-darker">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  // If we're on a public route or the user is authenticated, render the children
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );
  
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }
  
  // This should not be visible, we should have redirected
  return null;
};

export default AuthGuard;
