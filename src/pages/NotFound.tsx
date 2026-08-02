import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-6 pt-16 text-center">
        <div>
          <p className="cor-overline-he">שגיאה 404</p>
          <h1 className="cor-display mt-4 text-foreground">הדף לא נמצא</h1>
          <p className="mt-4 text-muted-foreground">
            הקישור שגוי או שהדף הוסר. בואי נחזיר אותך למסלול.
          </p>
          <Link
            to="/"
            className="cta-warm mt-8 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm"
          >
            חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
