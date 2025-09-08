import { Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
            {/* Left Side - Brand & Newsletter */}
            <div className="space-y-8 lg:space-y-6">
              {/* Logo */}
              <div>
                <Logo />
              </div>
              
              {/* Description */}
              <p className="text-foreground/70 text-lg max-w-md leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Ticket <span className="italic lowercase" style={{ color: '#FF00A8' }}>to</span> Socks — indie magazine about socks. Yes, about socks. Yes, we're serious. Well, almost.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                
                {/* Threads */}
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="Threads"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.334V12c0-3.586.85-6.44 2.495-8.491C5.845 1.205 8.598.024 12.179 0h.014c3.581.024 6.334 1.205 8.184 3.509C21.85 5.56 22.5 8.414 22.5 11.666V12c0 3.586-.85 6.44-2.495 8.491C18.361 22.795 15.608 23.976 12.186 24zM12 2.25c-2.89 0-5.166.87-6.764 2.587C3.757 6.482 3 8.942 3 12s.757 5.518 2.236 7.163C6.834 21.13 9.11 22 12 22s5.166-.87 6.764-2.587C20.243 17.518 21 15.058 21 12s-.757-5.518-2.236-7.163C17.166 3.12 14.89 2.25 12 2.25z"/>
                    <path d="M16.82 8.25h-1.32c-.83 0-1.5.67-1.5 1.5v4.5c0 .83.67 1.5 1.5 1.5h1.32c.83 0 1.5-.67 1.5-1.5v-4.5c0-.83-.67-1.5-1.5-1.5zm-6 0h-1.32c-.83 0-1.5.67-1.5 1.5v4.5c0 .83.67 1.5 1.5 1.5h1.32c.83 0 1.5-.67 1.5-1.5v-4.5c0-.83-.67-1.5-1.5-1.5z"/>
                  </svg>
                </a>
                
                {/* TikTok */}
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                
                {/* Pinterest */}
                <a 
                  href="#" 
                  className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.1-2.1.1-3.1.2-.9 1.3-5.4 1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.6 2 1.6 2 1.9 0 3.4-2 3.4-4.9 0-2.6-1.9-4.4-4.6-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5.1.1.1.2.1.3-.1.3-.2 1-.3 1.1-.1.2-.2.2-.4.1-1.4-.7-2.3-2.7-2.3-4.4 0-3.4 2.5-6.5 7.2-6.5 3.8 0 6.8 2.7 6.8 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3 0 0-.6 2.2-.7 2.7-.3 1-.9 2.3-1.4 3.1C9.5 21.9 10.7 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                  </svg>
                </a>
              </div>

              {/* Newsletter Section */}
              <div className="space-y-6 lg:space-y-4 lg:pt-4">
                <div className="space-y-2">
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Fresh socks, no spam.
                  </h3>
                  <p className="text-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
                    Rare drops, hot collabs, sock wisdom — delivered when it matters.
                  </p>
                </div>
                
                <NewsletterForm variant="footer" />
                

              </div>
            </div>

            {/* Right Side - Navigation */}
            <div className="lg:flex lg:justify-end lg:pt-0 pt-8 border-t border-border lg:border-t-0">
              <div className="space-y-6 lg:space-y-4">
                {/* Main Navigation */}
                <nav className="space-y-2 lg:space-y-1.5">
                  <Link 
                    to="/news" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    News
                  </Link>
                  <Link 
                    to="/drops" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    Drops
                  </Link>
                  <Link 
                    to="/stories" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    Stories
                  </Link>
                  <Link 
                    to="/brands" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    Brands
                  </Link>
                  <Link 
                    to="/about" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block text-lg text-foreground/80 hover:text-[#FF00A8] transition-colors leading-tight"
                    style={{ fontFamily: 'var(--font-headlines)' }}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Legal Links */}
                <div className="flex items-center gap-3 text-sm text-foreground/50" style={{ fontFamily: 'var(--font-body)' }}>
                  <Link 
                    to="/privacy" 
                    className="hover:text-[#FF00A8] transition-colors"
                  >
                    Privacy
                  </Link>
                  <span>·</span>
                  <Link 
                    to="/terms" 
                    className="hover:text-[#FF00A8] transition-colors"
                  >
                    Terms
                  </Link>
                </div>

                {/* Share Story CTA Button */}
                <div className="lg:text-center">
                  <Link 
                    to="/submit"
                    className="
                      /* Mobile: Button style */
                      bg-[#FF00A8] text-white px-6 py-3 rounded-md hover:bg-[#FF00A8]/90 transition-all duration-300 inline-block text-center
                      /* Desktop: Text link style */  
                      lg:bg-transparent lg:text-[#FF00A8] lg:px-0 lg:py-0 lg:rounded-none lg:hover:bg-transparent lg:hover:text-[#FF00A8]/80 lg:text-lg lg:leading-tight lg:block
                    "
                    style={{ fontFamily: 'var(--font-body), var(--font-headlines)', fontWeight: '600' }}
                  >
                    + Submit Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
          <p>&copy; 2025 Ticket to Socks. All rights reserved.</p>
          <p>Made with ❤️ for sock enthusiasts worldwide.</p>
        </div>
      </div>
    </footer>
  );
}