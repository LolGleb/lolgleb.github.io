import { SEO } from '../components/SEO';
import { SubmitSection } from '../components/SubmitSection';
import { BrandsSection } from '../components/BrandsSection';

export function AboutPage() {
  return (
    <>
      <SEO 
        title="About & Contact — Ticket to Socks | Independent Sock Magazine"
        description="Learn about Ticket to Socks and get in touch with our editorial team. Contact us for partnerships, advertising, editorial inquiries, and collaborations."
        keywords="about ticket to socks, contact, editorial, partnerships, advertising, sock magazine, independent media, fashion journalism"
      />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-3xl lg:text-4xl mb-8" style={{ fontFamily: 'var(--font-headlines)' }}>
            About Ticket <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span> Socks
          </h1>
          
          <div className="space-y-8 text-lg text-foreground/80 leading-relaxed">
            <p>
              We're an independent magazine about socks. Yes, about socks. Yes, we're serious. Well, almost.
            </p>
            
            <p>
              Founded in 2025, Ticket to Socks emerged from a simple observation: socks had become more than just foot coverings. They're expressions of personality, markers of culture, and surprisingly complex fashion statements hiding in plain sight.
            </p>
            
            <p>
              From luxury athletic collaborations to sustainable manufacturing innovations, we cover the stories, people, and brands shaping sock culture worldwide. We believe that the details matter, especially the ones no one else is talking about.
            </p>
            
            <div className="pt-8 border-t border-border">
              <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                What We Cover
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                    News & Trends
                  </h3>
                  <p className="text-base">
                    Breaking stories from the sock industry, cultural movements, and emerging trends.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Drops & Releases
                  </h3>
                  <p className="text-base">
                    Limited editions, collaborations, and must-have releases from brands worldwide.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Stories & Features
                  </h3>
                  <p className="text-base">
                    In-depth profiles, cultural commentary, and the human stories behind the brands.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Brand Spotlights
                  </h3>
                  <p className="text-base">
                    From heritage makers to disruptive startups shaping the future of socks.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="pt-8 border-t border-border">
              <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                Get in Touch
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Editorial
                    </h3>
                    <p className="text-base mb-3">
                      Got a story tip, product launch, or something we should know about?
                    </p>
                    <div className="space-y-2 text-base">
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:editorial@tickettosocks.com" className="text-[#FF00A8] hover:underline">
                          editorial@tickettosocks.com
                        </a>
                      </p>
                      <p>
                        <strong>Or use our:</strong>{' '}
                        <a href="#submit" className="text-[#FF00A8] hover:underline">
                          submission form
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Partnerships
                    </h3>
                    <p className="text-base mb-3">
                      Interested in collaborating or featuring your brand?
                    </p>
                    <div className="space-y-2 text-base">
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:partnerships@tickettosocks.com" className="text-[#FF00A8] hover:underline">
                          partnerships@tickettosocks.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Advertising
                    </h3>
                    <p className="text-base mb-3">
                      Reach sock enthusiasts and fashion-forward readers.
                    </p>
                    <div className="space-y-2 text-base">
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:advertising@tickettosocks.com" className="text-[#FF00A8] hover:underline">
                          advertising@tickettosocks.com
                        </a>
                      </p>
                      <p>
                        <strong>Media Kit:</strong>{' '}
                        <a href="/media-kit" className="text-[#FF00A8] hover:underline">
                          Download here
                        </a>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl mb-3 text-[#FF00A8]" style={{ fontFamily: 'var(--font-headlines)' }}>
                      General Inquiries
                    </h3>
                    <p className="text-base mb-3">
                      Questions, feedback, or just want to say hello?
                    </p>
                    <div className="space-y-2 text-base">
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href="mailto:hello@tickettosocks.com" className="text-[#FF00A8] hover:underline">
                          hello@tickettosocks.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media & Response Time */}
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Follow Us
                    </h4>
                    <p className="text-base text-foreground/70 mb-3">
                      Stay updated with our latest content and behind-the-scenes moments.
                    </p>
                    <div className="flex space-x-4">
                      <a 
                        href="#" 
                        className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        aria-label="Instagram"
                      >
                        Instagram
                      </a>
                      <a 
                        href="#" 
                        className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        aria-label="Twitter"
                      >
                        Twitter
                      </a>
                      <a 
                        href="#" 
                        className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
                        aria-label="YouTube"
                      >
                        YouTube
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Response Time
                    </h4>
                    <p className="text-base text-foreground/70">
                      We typically respond to editorial inquiries within 48 hours and partnership requests within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div id="submit">
        <SubmitSection />
      </div>
      
      <BrandsSection 
        defaultFilter="madeIn"
        defaultSelection="USA"
        maxBrands={18}
        showAllFilters={false}
        title="FEATURED SOCK BRANDS"
      />
    </>
  );
}