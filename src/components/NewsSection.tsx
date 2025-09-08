import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getArticlesByCategory } from '../db/articlesDb';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  image: string;
  publishedAt: string;
}

interface CategoryData {
  name: string;
  slug: string;
  mainArticle: Article;
  sideArticles: Article[];
}

type TabType = 'hype' | 'latest';

export function NewsSection() {
  const [activeTab, setActiveTab] = useState<TabType>('hype');
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  useEffect(() => {
    (async () => {
      const fromDb = await getArticlesByCategory('News');
      const mapped: Article[] = fromDb.map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        image: a.image,
        publishedAt: a.publishedAt,
      }));
      setDbArticles(mapped);
    })();
  }, []);

  // Function to get filtered articles based on active tab
  const getFilteredArticles = (category: CategoryData, activeTab: TabType) => {
    const staticArticles = [category.mainArticle, ...category.sideArticles];
    const allArticles = [...dbArticles, ...staticArticles];
    
    if (activeTab === 'hype') {
      // Hype: Editor's choice - manually curated (keep static curated set)
      return {
        mainArticle: category.mainArticle,
        sideArticles: category.sideArticles
      };
    } else {
      // Latest: Include DB articles and sort by date (newest first)
      const sortedArticles = [...allArticles].sort((a, b) => {
        const dateA = new Date(a.publishedAt);
        const dateB = new Date(b.publishedAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      return {
        mainArticle: sortedArticles[0],
        sideArticles: sortedArticles.slice(1, 3) // Take next 2 articles
      };
    }
  };

  const category: CategoryData = {
    name: 'News',
    slug: 'news',
    mainArticle: {
      id: '1',
      title: 'Street Style Tokyo: The Underground Sock Scene Explodes',
      excerpt: 'An in-depth look at how Japanese youth are redefining sock fashion with bold patterns, unconventional materials, and collaborative designs that are influencing global trends.',
      category: 'News',
      image: 'https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      publishedAt: 'Sep 5, 2025'
    },
    sideArticles: [
      {
        id: '2',
        title: 'Milan Fashion Week: Sock Trends to Watch',
        category: 'News',
        image: 'https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: 'Sep 4, 2025'
      },
      {
        id: '3',
        title: 'Sustainability Report: Eco-Friendly Materials Rise',
        category: 'News',
        image: 'https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: 'Sep 3, 2025'
      }
    ]
  };

  const filteredArticles = getFilteredArticles(category, activeTab);

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section>
          {/* Section Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl lg:text-4xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
              <span style={{ color: '#FF00A8', fontStyle: 'italic', fontFamily: 'var(--font-headlines)' }}>to</span> {category.name}
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex items-center" style={{ marginLeft: '28px' }}>
              <button
                onClick={() => setActiveTab('hype')}
                className={`text-lg mr-4 transition-colors ${
                  activeTab === 'hype' ? '' : 'text-foreground/40 hover:text-foreground/60'
                }`}
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: activeTab === 'hype' ? '#FF00A8' : undefined
                }}
              >
                Hype
              </button>
              <button
                onClick={() => setActiveTab('latest')}
                className={`text-lg transition-colors ${
                  activeTab === 'latest' ? '' : 'text-foreground/40 hover:text-foreground/60'
                }`}
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: activeTab === 'latest' ? '#FF00A8' : undefined
                }}
              >
                Latest
              </button>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Main Article - Left */}
            <div className="lg:col-span-2">
              <article className="group cursor-pointer">
                <div className="relative aspect-[3/2] overflow-hidden rounded-md mb-6">
                  <ImageWithFallback
                    src={filteredArticles.mainArticle.image}
                    alt={filteredArticles.mainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                    <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                      {filteredArticles.mainArticle.category}
                    </span>
                    <span className="text-foreground/40 ml-2">
                      {filteredArticles.mainArticle.publishedAt}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {filteredArticles.mainArticle.title}
                  </h3>
                  
                  {filteredArticles.mainArticle.excerpt && (
                    <p className="text-foreground/70 text-lg leading-relaxed">
                      {filteredArticles.mainArticle.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </div>

            {/* Side Articles - Right */}
            <div className="space-y-8">
              {filteredArticles.sideArticles.map((article) => (
                <article key={article.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-4">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                      <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                        {article.category}
                      </span>
                      <span className="text-foreground/40 ml-2">
                        {article.publishedAt}
                      </span>
                    </div>
                    
                    <h4 className="text-base group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                      {article.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Ticket to Category Link */}
          <div className="flex justify-end">
            <a 
              href={`/${category.slug}`}
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}
            >
              Ticket to {category.name} →
            </a>
          </div>

          {/* Separator */}
          <div className="mt-12 border-t border-border/20"></div>
        </section>
      </div>
    </div>
  );
}