import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found | Ticket to Socks"
        description="The page you're looking for doesn't exist. Explore our latest sock news, drops, and stories instead."
      />
      
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Illustration */}
              <div className="w-64 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1475053181767-9b735f0b1689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3N0JTIwc29jayUyMGxhdW5kcnklMjBtaXNzaW5nfGVufDF8fHx8MTc1NzE2MjU2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Lost sock illustration" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              
              <h1 className="text-9xl text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)', fontWeight: '700' }}>
                404
              </h1>
              <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                Lost your socks?
              </h2>
              <p className="text-xl text-foreground/70 max-w-md mx-auto">
                The page you're looking for seems to have disappeared like that one sock that always goes missing.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/"
                className="bg-[#FF00A8] text-white px-8 py-3 hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
              >
                Back to Home
              </Link>
              <Link 
                to="/news"
                className="bg-transparent border-2 border-[#FF00A8] text-foreground px-8 py-3 hover:bg-[#FF00A8] hover:text-white transition-all duration-300"
                style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
              >
                Browse News
              </Link>
            </div>
            
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-foreground/50">
                Or explore:{' '}
                <Link to="/brands" className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors">
                  Brands
                </Link>
                {' · '}
                <Link to="/drops" className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors">
                  Drops
                </Link>
                {' · '}
                <Link to="/stories" className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors">
                  Stories
                </Link>
                {' · '}
                <Link to="/about" className="text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors">
                  About
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}