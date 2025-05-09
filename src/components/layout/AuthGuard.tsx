
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

// These routes do not require authentication
const PUBLIC_ROUTES = ["/auth"];

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't do anything while still loading auth state
    if (loading) return;
    
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );
    
    console.log("AuthGuard check:", { 
      isAuthenticated, 
      isPublicRoute, 
      path: location.pathname 
    });
    
    // If not authenticated and not on a public route, redirect to auth
    if (!isAuthenticated && !isPublicRoute) {
      console.log("Redirecting to auth page");
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }
    
    // If authenticated and on a public route (like /auth), redirect to home
    if (isAuthenticated && isPublicRoute) {
      console.log("Redirecting to home page");
      navigate("/", { replace: true });
      return;
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-joip-darker">
        <div className="text-white">Loading authentication...</div>
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
