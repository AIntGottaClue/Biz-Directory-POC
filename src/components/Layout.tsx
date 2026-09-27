import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

function ScrollToTopOnMount() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Routes whose first section is a full-bleed hero that should extend under the fixed header
const FULL_BLEED_ROUTES = [
  "/",
  "/search",
  "/premium",
  "/categories",
  "/category/",
  "/blog/",
  "/events/",
  "/business/",
  "/hero-preview",
];

export default function Layout() {
  const { pathname } = useLocation();
  const isFullBleed = FULL_BLEED_ROUTES.some(
    (r) =>
      (r.endsWith("/") &&
        (pathname === r.slice(0, -1) || pathname.startsWith(r))) ||
      pathname === r,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTopOnMount />
      <Header />
      <main className={`flex-1 ${isFullBleed ? "" : "pt-20 sm:pt-24"}`}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
