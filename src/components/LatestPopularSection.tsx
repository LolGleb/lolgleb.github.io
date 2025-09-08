import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LatestArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  publishedAt: string;
}

interface PopularArticle {
  id: number;
  title: string;
  category: string;
  image: string;
  views: string;
  rank: number;
  publishedAt: string;
}

export function LatestPopularSection() {
  const latestArticles: LatestArticle[] = [
    {
      id: 1,
      title: "Nike x Comme des Garçons: The Sock Collection We've Been Waiting For",
      excerpt: "An exclusive look at the highly anticipated collaboration that's redefining luxury sportswear.",
      category: "Drops",
      image: "https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "3 min",
      publishedAt: "Sep 4, 2025"
    },
    {
      id: 2,
      title: "The Psychology of Sock Colors: What Your Choice Says About You",
      excerpt: "A deep dive into color theory and personal expression through foot fashion.",
      category: "Features",
      image: "https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "5 min",
      publishedAt: "Sep 4, 2025"
    },
    {
      id: 3,
      title: "Sustainable Sock Manufacturing: The Future is Here",
      excerpt: "How emerging brands are revolutionizing production with eco-friendly materials and processes.",
      category: "Brands",
      image: "https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "7 min",
      publishedAt: "Sep 3, 2025"
    },
    {
      id: 4,
      title: "Street Style Report: Tokyo's Underground Sock Scene",
      excerpt: "An insider's look at how Japanese youth are pushing boundaries in sock fashion.",
      category: "News",
      image: "https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "4 min",
      publishedAt: "Sep 3, 2025"
    }
  ];

  const popularArticles: PopularArticle[] = [
    {
      id: 1,
      title: "The Complete Guide to Sock Materials: From Cotton to Merino Wool",
      category: "Features",
      image: "https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "12.4k",
      rank: 1,
      publishedAt: "Aug 15, 2025"
    },
    {
      id: 2,
      title: "Stance vs. Happy Socks: The Ultimate Brand Comparison",
      category: "Brands",
      image: "https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "8.7k",
      rank: 2,
      publishedAt: "Jul 22, 2025"
    },
    {
      id: 3,
      title: "Limited Edition Drops: How to Score the Rarest Releases",
      category: "Drops",
      image: "https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "7.2k",
      rank: 3,
      publishedAt: "Aug 3, 2025"
    },
    {
      id: 4,
      title: "Building the Perfect Sock Wardrobe: Essential Styles for Every Occasion",
      category: "About",
      image: "https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "6.1k",
      rank: 4,
      publishedAt: "Jun 18, 2025"
    },
    {
      id: 5,
      title: "The Rise of Compression Socks in Athleisure Fashion",
      category: "News",
      image: "https://images.unsplash.com/photo-1514408171400-282d59fc544e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGFib3JhdGlvbiUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: "5.3k",
      rank: 5,
      publishedAt: "Jul 5, 2025"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="popular" className="w-full">
          <div className="flex items-center justify-between mb-12">
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="popular" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none text-3xl lg:text-4xl p-0 mr-8 data-[state=active]:text-foreground text-foreground/40 border-b-2 border-transparent data-[state=active]:border-primary rounded-none pb-2"
                style={{ fontFamily: 'var(--font-headlines)' }}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  Popular
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="latest" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none text-3xl lg:text-4xl p-0 data-[state=active]:text-foreground text-foreground/40 border-b-2 border-transparent data-[state=active]:border-primary rounded-none pb-2"
                style={{ fontFamily: 'var(--font-headlines)' }}
              >
                Latest
              </TabsTrigger>
            </TabsList>
            <button className="text-foreground/60 hover:text-foreground transition-colors">
              View All
            </button>
          </div>

          <TabsContent value="popular" className="mt-0">
            <div className="space-y-6">
              {popularArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <div className="flex items-center gap-6 p-4 hover:bg-accent/50 transition-colors rounded-lg">
                    {/* Rank */}
                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm flex-shrink-0">
                      {article.rank}
                    </div>

                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <div className="aspect-square overflow-hidden rounded">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-foreground/60" style={{ fontFamily: 'var(--font-body)' }}>
                          {article.views} views
                        </span>
                      </div>
                      <h3 className="text-lg group-hover:text-foreground/70 transition-colors leading-tight mb-1" style={{ fontFamily: 'var(--font-headlines)' }}>
                        {article.title}
                      </h3>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                        <span className="italic uppercase" style={{ color: '#d946ef' }}>
                          {article.category}
                        </span>
                        <span className="text-foreground/50 ml-2">
                          {article.publishedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="latest" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="sm:w-48 flex-shrink-0">
                      <div className="aspect-square overflow-hidden">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-foreground/40" style={{ fontFamily: 'var(--font-body)' }}>
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                      </div>

                      <h3 className="text-lg group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                        {article.title}
                      </h3>

                      <p className="text-foreground/70 text-sm leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                        <span className="italic uppercase" style={{ color: '#d946ef' }}>
                          {article.category}
                        </span>
                        <span className="text-foreground/40 ml-2">
                          {article.publishedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}