import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star } from 'lucide-react';

export function EditorsPick() {
  return (
    <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-md">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1514408171400-282d59fc544e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGFib3JhdGlvbiUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Palace x Adidas collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Overlay Badge */}

          </div>

          {/* Content */}
          <div className="space-y-6">

            
            <h2 className="text-4xl lg:text-5xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
              Collab of the Week
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl opacity-90" style={{ fontFamily: 'var(--font-headlines)' }}>
                Palace x Adidas: The Sock Game Revolution
              </h3>
              
              <p className="text-sm opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
                Sep 1, 2025
              </p>
              
              <p className="text-lg opacity-80 leading-relaxed">
                When two streetwear giants collide, magic happens. This week's collaboration 
                between Palace and Adidas brings us a collection that perfectly captures the 
                essence of both brands.
              </p>
              
              <p className="opacity-70">
                From technical performance features to bold graphic design, these socks 
                represent everything we love about modern streetwear collaborations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-foreground text-primary px-8 py-3 hover:bg-primary-foreground/90 transition-colors">
                Read Full Review
              </button>
              <button className="border border-primary-foreground/30 px-8 py-3 hover:bg-primary-foreground/10 transition-colors">
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}