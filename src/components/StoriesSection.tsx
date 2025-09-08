import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Article {
  id: number;
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

export function StoriesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('hype');

  // Function to get filtered articles based on active tab
  const getFilteredArticles = (category: CategoryData, activeTab: TabType) => {
    const allArticles = [category.mainArticle, ...category.sideArticles];
    
    if (activeTab === 'hype') {
      // Hype: Editor's choice - manually curated
      return {
        mainArticle: category.mainArticle,
        sideArticles: category.sideArticles
      };
    } else {
      // Latest: Sort by date (newest first)
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
    name: 'Stories',
    slug: 'stories',
    mainArticle: {
      id: 10,
      title: 'The Psychology of Sock Colors: What Your Choice Really Says About You',
      excerpt: 'A deep dive into color theory, consumer behavior, and the subtle psychology behind our sock choices, backed by research from leading fashion psychologists.',
      category: 'Stories',
      image: 'https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      publishedAt: 'Sep 2, 2025'
    },
    sideArticles: [
      {
        id: 11,
        title: 'Material Science: The Future of Sock Technology',
        category: 'Stories',
        image: 'https://images.unsplash.com/photo-1597137759489-f4d0b1fbc651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHNvY2tzJTIwcnVubmluZ3xlbnwxfHx8fDE3NTcwODMxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: 'Sep 1, 2025'
      },
      {
        id: 12,
        title: 'The Economics of Sock Manufacturing',
        category: 'Stories',
        image: 'https://images.unsplash.com/photo-1514408171400-282d59fc544e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGFib3JhdGlvbiUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzU3MDgzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        publishedAt: 'Aug 30, 2025'
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
        </section>
      </div>
    </div>
  );
}