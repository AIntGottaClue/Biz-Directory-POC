import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import AllCategories from "@/pages/AllCategories";
import CategoryPage from "@/pages/CategoryPage";
import BusinessDetail from "@/pages/BusinessDetail";
import SearchPage from "@/pages/SearchPage";
import Blog from "@/pages/Blog";
import BlogPostDetail from "@/pages/BlogPostDetail";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import ClaimListing from "@/pages/ClaimListing";
import PremiumListings from "@/pages/PremiumListings";

import DownloadProject from "@/pages/DownloadProject";
import DataExplorer from "@/pages/DataExplorer";
import DownloadSourceFiles from "@/pages/DownloadSourceFiles";
import Nexus from "@/pages/Nexus";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/business/:slug" element={<BusinessDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:slug" element={<EventDetail />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/premium" element={<PremiumListings />} />
                <Route path="/claim/:slug" element={<ClaimListing />} />
                <Route path="/download" element={<DownloadProject />} />
                <Route path="/data-explorer" element={<DataExplorer />} />
                <Route
                  path="/download-source"
                  element={<DownloadSourceFiles />}
                />
                <Route path="/nexus" element={<Nexus />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
