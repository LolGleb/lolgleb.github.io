import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SubmitSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side sock illustration */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-24 lg:w-32 lg:h-32 opacity-10 rotate-12">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNvY2tzJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NzE1OTc1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Decorative sock illustration"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        {/* Right side graphic element */}
        <div className="absolute right-4 top-1/4 w-20 h-20 lg:w-28 lg:h-28 opacity-8 -rotate-12">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1752253604157-65fb42c30816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwZWxlbWVudHMlMjBtaW5pbWFsfGVufDF8fHx8MTc1NzE1OTc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Decorative graphic element"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        {/* Bottom scattered elements */}
        <div className="absolute bottom-8 left-1/4 w-16 h-16 opacity-6 rotate-45">
          <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300 rounded-full"></div>
        </div>
        
        <div className="absolute top-8 right-1/3 w-12 h-12 opacity-5 -rotate-12">
          <div className="w-full h-full bg-gradient-to-tr from-blue-300 to-cyan-300 rounded-lg"></div>
        </div>
        
        {/* Fun doodle-style lines */}
        <svg 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-24 opacity-5 rotate-6" 
          viewBox="0 0 128 96" 
          fill="none"
        >
          <path 
            d="M10 20 Q30 10, 50 20 T90 25 Q110 30, 118 40" 
            stroke="#FF00A8" 
            strokeWidth="2" 
            fill="none"
            strokeDasharray="5,5"
          />
          <path 
            d="M15 50 Q35 45, 55 55 T95 60 Q115 65, 123 75" 
            stroke="#d946ef" 
            strokeWidth="1.5" 
            fill="none"
            strokeDasharray="3,3"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center space-y-8 flex flex-col items-center justify-center min-h-[280px]">
          {/* Playful Pre-headline */}
          <div className="text-sm uppercase tracking-wide" style={{ 
            fontFamily: 'var(--font-body)', 
            color: '#FF00A8',
            fontWeight: '500'
          }}>
            Join the sock revolution ✨
          </div>
          
          {/* Headline */}
          <h2 
            className="text-foreground text-2xl lg:text-3xl xl:text-4xl leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-headlines)', fontWeight: '600' }}
          >
            Got 🧦 sock stories? Collab drops? Reviews? Share them with the world — your voice deserves the spotlight.
          </h2>
          
          {/* Subtext */}
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            Whether you're dropping the next big collaboration or have thoughts on the latest streetwear trends, 
            we want to hear from you. Because let's be honest — the best stories come from the community.
          </p>
          
          {/* Submit Button */}
          <div className="pt-4">
            <Link 
              to="/submit"
              className="inline-block px-10 py-4 text-lg rounded-lg hover:opacity-90 transition-all transform hover:scale-105 duration-200 shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: '#FF00A8', 
                color: 'white', 
                fontFamily: 'var(--font-body)',
                fontWeight: '600'
              }}
            >
              Submit Your Story
            </Link>
          </div>
          
          {/* Fun footer note */}
          <div className="text-xs text-foreground/50 italic" style={{ fontFamily: 'var(--font-body)' }}>
            *We promise to read every submission (yes, even the weird ones)
          </div>
        </div>
      </div>
    </section>
  );
}