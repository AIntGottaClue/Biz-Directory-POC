import { cityForPath } from '@/data/cities';
import type { ComponentType } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { RouteProvider } from '@/lib/router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/views/Home';
import AllCategories from '@/views/AllCategories';
import CategoryPage from '@/views/CategoryPage';
import BusinessDetail from '@/views/BusinessDetail';
import SearchPage from '@/views/SearchPage';
import Blog from '@/views/Blog';
import BlogPostDetail from '@/views/BlogPostDetail';
import Events from '@/views/Events';
import EventDetail from '@/views/EventDetail';
import ClaimListing from '@/views/ClaimListing';
import PremiumListings from '@/views/PremiumListings';
import DownloadProject from '@/views/DownloadProject';
import DataExplorer from '@/views/DataExplorer';
import DownloadSourceFiles from '@/views/DownloadSourceFiles';
import Nexus from '@/views/Nexus';
import NotFound from '@/views/NotFound';
const pages: Record<string, ComponentType> = {
 home:Home,categories:AllCategories,category:CategoryPage,business:BusinessDetail,
 search:SearchPage,blog:Blog,post:BlogPostDetail,events:Events,event:EventDetail,
 claim:ClaimListing,premium:PremiumListings,download:DownloadProject,
 data:DataExplorer,source:DownloadSourceFiles,nexus:Nexus,notfound:NotFound,
};
const fullBleed = ['/', '/search', '/premium', '/categories', '/category/', '/blog/', '/events/', '/business/', '/hero-preview'];
const queryClient = new QueryClient();
export default function AstroShell({ page, path }: { page: string; path: string }) {
  const Page = pages[page] || NotFound;
  const local = cityForPath(path).prefix ? path.slice(cityForPath(path).prefix.length) || '/' : path;
  const isFullBleed = fullBleed.some((r) => (r.endsWith('/') && (local === r.slice(0,-1) || local.startsWith(r))) || local === r);
  return <RouteProvider value={path}><ThemeProvider><QueryClientProvider client={queryClient}><TooltipProvider>
    <Toaster /><Sonner />
    <div className="flex min-h-screen flex-col bg-background"><Header />
      <main className={`flex-1 ${isFullBleed ? '' : 'pt-20 sm:pt-24'}`}><Page /></main>
      <Footer /><ScrollToTop />
    </div>
  </TooltipProvider></QueryClientProvider></ThemeProvider></RouteProvider>;
}
