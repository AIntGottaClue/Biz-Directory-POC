import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted/30">
      <SEOHead
        title="Page Not Found"
        description="The page you are looking for does not exist."
        canonical="/404"
        noIndex
      />
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl font-bold text-primary">
          404
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <a href="/" className="text-accent underline hover:text-accent/80">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
