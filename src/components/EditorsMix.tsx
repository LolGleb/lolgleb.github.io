import { ImageWithFallback } from './figma/ImageWithFallback';

interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  publishedAt: string;
  featured?: boolean;
}

export function EditorsMix() {
  const articles: Article[] = [
    {
      id: 1,
      title: "The Rise of Technical Socks in Street Fashion",
      category: "CULTURE",
      image: "https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 2, 2025",
      featured: true
    },
    {
      id: 2,
      title: "Minimalist Design Philosophy",
      category: "LOOKBOOKS",
      image: "https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 1, 2025"
    },
    {
      id: 3,
      title: "Colors That Define Seasons",
      category: "TRENDS",
      image: "https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Aug 30, 2025"
    },
    {
      id: 4,
      title: "Streetwear Collaboration Insights",
      category: "BUSINESS",
      image: "https://images.unsplash.com/photo-1514408171400-282d59fc544e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGFib3JhdGlvbiUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Aug 28, 2025"
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>Editor's Mix</h2>
          <button className="text-foreground/60 hover:text-foreground transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <article 
              key={article.id} 
              className={`group cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${
                index === 0 ? 'aspect-[4/3]' : 'aspect-square'
              }`}>
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className={`text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    index === 0 ? 'text-xl' : 'text-base'
                  }`} style={{ fontFamily: 'var(--font-headlines)' }}>
                    {article.title}
                  </h3>
                </div>
              </div>

              {/* Title Below */}
              <div className="mt-4 space-y-2 group-hover:text-foreground/70 transition-colors">
                <h3 className={index === 0 ? 'text-xl' : 'text-base'} style={{ fontFamily: 'var(--font-headlines)' }}>
                  {article.title}
                </h3>
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#d946ef' }}>
                    {article.category}
                  </span>
                  <span className="text-foreground/60 ml-2">
                    {article.publishedAt}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}