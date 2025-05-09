
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="card-content p-12 text-center max-w-md">
          <h1 className="text-6xl font-bold text-joip-yellow mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="btn-primary">Return Home</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
