import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  publishedAt: string;
}

export function LatestSection() {
  const articles: Article[] = [
    {
      id: 1,
      title: "Nike x Comme des Garçons: The Sock Collection We've Been Waiting For",
      excerpt: "An exclusive look at the highly anticipated collaboration that's redefining luxury sportswear.",
      category: "RELEASES",
      image: "https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "3 min",
      publishedAt: "Sep 4, 2025"
    },
    {
      id: 2,
      title: "The Psychology of Sock Colors: What Your Choice Says About You",
      excerpt: "A deep dive into color theory and personal expression through foot fashion.",
      category: "CULTURE",
      image: "https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "5 min",
      publishedAt: "Sep 4, 2025"
    },
    {
      id: 3,
      title: "Sustainable Sock Manufacturing: The Future is Here",
      excerpt: "How emerging brands are revolutionizing production with eco-friendly materials and processes.",
      category: "SUSTAINABILITY",
      image: "https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "7 min",
      publishedAt: "Sep 3, 2025"
    },
    {
      id: 4,
      title: "Street Style Report: Tokyo's Underground Sock Scene",
      excerpt: "An insider's look at how Japanese youth are pushing boundaries in sock fashion.",
      category: "LOOKBOOKS",
      image: "https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      readTime: "4 min",
      publishedAt: "Sep 3, 2025"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>Latest</h2>
          <button className="text-foreground/60 hover:text-foreground transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
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
      </div>
    </section>
  );
}