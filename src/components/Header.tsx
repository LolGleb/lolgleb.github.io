import { Search, Menu, User, Instagram, Twitter, Youtube, Facebook, Plus, LogIn, LogOut, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isFollowOpen, setIsFollowOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" style={{ fontFamily: 'var(--font-body)' }}>
            <Link 
              to="/news" 
              className={`transition-colors ${
                isActive('/news') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              News
            </Link>
            <Link 
              to="/drops" 
              className={`transition-colors ${
                isActive('/drops') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Drops
            </Link>
            <Link 
              to="/stories" 
              className={`transition-colors ${
                isActive('/stories') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Stories
            </Link>
            <Link 
              to="/brands" 
              className={`transition-colors ${
                isActive('/brands') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Brands
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${
                isActive('/about') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              About
            </Link>
            <Link 
              to="/admin" 
              className={`transition-colors ${
                isActive('/admin') 
                  ? 'text-[#FF00A8]' 
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Search, Follow, Submit, User, and Menu */}
          <div className="flex items-center space-x-2">
            <Link to="/search" className="p-2 hover:bg-accent rounded-md transition-colors">
              <Search className="w-4 h-4" />
            </Link>
            
            {/* Follow Dropdown */}
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => setIsFollowOpen(true)}
              onMouseLeave={() => setIsFollowOpen(false)}
            >
              <button 
                className="px-3 py-2 text-foreground/80 hover:text-foreground transition-colors text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Follow
              </button>
              
              {isFollowOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-6 z-50">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-headlines)' }}>
                        Follow on
                      </h3>
                      <p className="text-sm text-foreground/70">
                        We drop socks, not spam. Stay tuned.
                      </p>
                    </div>
                    
                    {/* Social Icons */}
                    <div className="flex space-x-3">
                      <a 
                        href="#" 
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a 
                        href="#" 
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Twitter/X"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a 
                        href="#" 
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                      <a 
                        href="#" 
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Pinterest"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.1-2.1.1-3.1.2-.9 1.3-5.4 1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.6 2 1.6 2 1.9 0 3.4-2 3.4-4.9 0-2.6-1.9-4.4-4.6-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5.1.1.1.2.1.3-.1.3-.2 1-.3 1.1-.1.2-.2.2-.4.1-1.4-.7-2.3-2.7-2.3-4.4 0-3.4 2.5-6.5 7.2-6.5 3.8 0 6.8 2.7 6.8 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3 0 0-.6 2.2-.7 2.7-.3 1-.9 2.3-1.4 3.1C9.5 21.9 10.7 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="p-2 rounded-full hover:bg-accent transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                    
                    {/* Email Subscription */}
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Your email = your ticket to socks"
                        className="w-full"
                      />
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Join the crew
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to={isAuthenticated ? "/submit" : "/auth?redirect=/submit"} 
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm bg-[#FF00A8] text-white rounded-md hover:bg-[#FF00A8]/90 transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Plus className="w-4 h-4" />
              Submit
            </Link>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth buttons/User profile */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/bookmarks" className="p-2 hover:bg-accent rounded-md transition-colors" title="Bookmarks">
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link to="/profile" className="p-2 hover:bg-accent rounded-md transition-colors" title={currentUser?.name}>
                  <User className="w-4 h-4" />
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-accent rounded-md transition-colors text-foreground/60 hover:text-foreground"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="hidden md:flex p-2 hover:bg-accent rounded-md transition-colors"
                title="Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
            <button 
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="px-4 py-4 space-y-4" style={{ fontFamily: 'var(--font-body)' }}>
              <Link 
                to="/search" 
                className={`flex items-center gap-2 transition-colors ${
                  isActive('/search') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                Search
              </Link>
              <Link 
                to="/news" 
                className={`block transition-colors ${
                  isActive('/news') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link 
                to="/drops" 
                className={`block transition-colors ${
                  isActive('/drops') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Drops
              </Link>
              <Link 
                to="/stories" 
                className={`block transition-colors ${
                  isActive('/stories') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link 
                to="/brands" 
                className={`block transition-colors ${
                  isActive('/brands') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link 
                to="/about" 
                className={`block transition-colors ${
                  isActive('/about') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/admin" 
                className={`block transition-colors ${
                  isActive('/admin') 
                    ? 'text-[#FF00A8]' 
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
              
              {/* Mobile Follow Section */}
              <div className="pt-4 border-t border-border space-y-4">
                <div>
                  <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Follow on
                  </h3>
                  <p className="text-sm text-foreground/70">
                    We drop socks, not spam. Stay tuned.
                  </p>
                </div>
                
                {/* Social Icons */}
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Twitter/X"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Pinterest"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.1-2.1.1-3.1.2-.9 1.3-5.4 1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.6 2 1.6 2 1.9 0 3.4-2 3.4-4.9 0-2.6-1.9-4.4-4.6-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5.1.1.1.2.1.3-.1.3-.2 1-.3 1.1-.1.2-.2.2-.4.1-1.4-.7-2.3-2.7-2.3-4.4 0-3.4 2.5-6.5 7.2-6.5 3.8 0 6.8 2.7 6.8 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3 0 0-.6 2.2-.7 2.7-.3 1-.9 2.3-1.4 3.1C9.5 21.9 10.7 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
                
                {/* Email Subscription */}
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email = your ticket to socks"
                    className="w-full"
                  />
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Join the crew
                  </Button>
                </div>
              </div>
              
              {/* User Profile for Mobile */}
              <div className="pt-4 border-t border-border space-y-3">
                <Link 
                  to={isAuthenticated ? "/submit" : "/auth?redirect=/submit"} 
                  className="flex items-center space-x-2 text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Story</span>
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/bookmarks" 
                      className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>Bookmarks</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile ({currentUser?.name})</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-foreground/60 hover:text-foreground transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}