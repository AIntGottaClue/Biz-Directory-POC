import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-[#0f172a] text-white">
      {/* Gold accent line at top */}
      <div className="h-[2px] w-full bg-accent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group flex items-center gap-2.5 font-display text-xl font-bold mb-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md font-black text-lg transition-transform group-hover:scale-105">
                TX
              </span>
              <span className="font-extrabold tracking-tight">
                Locals of <span className="text-accent">Round Rock</span>
              </span>
            </Link>
            <p className="mt-1 text-sm text-white/50 leading-relaxed max-w-xs">
              A local business directory built to help neighbors find and trust
              businesses near them in Round Rock, Texas.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-accent" /> Round Rock, TX
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/search"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Browse Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Community Events
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Featured Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business Owners */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-5">
              For Business Owners
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/claim/add-business"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  List Your Business (Free)
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Featured Placements
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Claim Your Listing
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-5">
              About
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Search Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Local Happenings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Locals of Round Rock. All rights
            reserved.
          </p>
          <p className="hidden sm:block text-xs text-white/40">
            By locals, for Locals.
          </p>
        </div>
      </div>
    </footer>
  );
}
