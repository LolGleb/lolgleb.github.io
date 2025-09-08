import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article, TabType } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryPageTemplateProps {
  title: string;
  articles: {
    hype: Article[];
    latest: Article[];
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export function CategoryPageTemplate({ 
  title, 
  articles,
  seoTitle,
  seoDescription,
  seoKeywords 
}: CategoryPageTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>('hype');
  const [visibleArticles, setVisibleArticles] = useState(0);

  const currentArticles = articles[activeTab];
  const featuredArticles = currentArticles.slice(0, 3); // First 3 for hero layout
  const gridArticles = currentArticles.slice(3);

  // Desktop: 28 articles (7 rows × 4), Mobile: 14 articles (7 rows × 2)
  const initialDesktopArticles = 28;
  const initialMobileArticles = 14;
  const loadMoreDesktopArticles = 20; // 5 rows × 4
  const loadMoreMobileArticles = 10; // 5 rows × 2

  useEffect(() => {
    // Set initial visible articles based on screen size
    const updateVisibleArticles = () => {
      const isMobile = window.innerWidth < 1024;
      setVisibleArticles(isMobile ? initialMobileArticles : initialDesktopArticles);
    };

    updateVisibleArticles();
    window.addEventListener('resize', updateVisibleArticles);
    return () => window.removeEventListener('resize', updateVisibleArticles);
  }, []);

  useEffect(() => {
    // Reset visible articles when tab changes
    const isMobile = window.innerWidth < 1024;
    setVisibleArticles(isMobile ? initialMobileArticles : initialDesktopArticles);
  }, [activeTab]);

  const displayedGridArticles = gridArticles.slice(0, visibleArticles);
  const hasMore = gridArticles.length > visibleArticles;

  const handleLoadMore = () => {
    const isMobile = window.innerWidth < 1024;
    const loadMore = isMobile ? loadMoreMobileArticles : loadMoreDesktopArticles;
    setVisibleArticles(prev => prev + loadMore);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
            <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span> {title}
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-accent rounded-lg p-1">
            <button
              onClick={() => handleTabChange('hype')}
              className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                activeTab === 'hype'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
              style={{ fontFamily: 'var(--font-body)', fontWeight: '500' }}
            >
              Hype
            </button>
            <button
              onClick={() => handleTabChange('latest')}
              className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                activeTab === 'latest'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
              style={{ fontFamily: 'var(--font-body)', fontWeight: '500' }}
            >
              Latest
            </button>
          </div>
        </div>

        {/* Featured Section - Hero Layout */}
        {featuredArticles.length > 0 && (
          <div className="mb-12 lg:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Article */}
              {featuredArticles[0] && (
                <div className="lg:col-span-2">
                  <Link to={`/article/${featuredArticles[0].id}`} className="group">
                    <div className="space-y-4">
                      <div className="aspect-[16/10] overflow-hidden rounded-md">
                        <ImageWithFallback
                          src={featuredArticles[0].image}
                          alt={featuredArticles[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                            {featuredArticles[0].category}
                          </span>
                          <span className="date-text text-foreground/50">{featuredArticles[0].date}</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                          {featuredArticles[0].title}
                        </h2>
                        {featuredArticles[0].excerpt && (
                          <p className="text-foreground/70 text-lg leading-relaxed">
                            {featuredArticles[0].excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Side Articles */}
              <div className="space-y-6">
                {featuredArticles.slice(1).map((article) => (
                  <Link key={article.id} to={`/article/${article.id}`} className="group">
                    <div className="space-y-3">
                      <div className="aspect-[4/3] overflow-hidden rounded-md">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                            {article.category}
                          </span>
                          <span className="date-text text-foreground/50">{article.date}</span>
                        </div>
                        <h3 className="text-lg leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid Articles */}
        {displayedGridArticles.length > 0 && (
          <div className="mb-8 lg:mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayedGridArticles.map((article) => (
                <Link key={article.id} to={`/article/${article.id}`} className="group">
                  <div className="space-y-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-md">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                          {article.category}
                        </span>
                        <span className="date-text text-foreground/50">{article.date}</span>
                      </div>
                      <h3 className="text-sm lg:text-base leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="bg-transparent text-[#FF00A8] border-2 border-[#FF00A8] px-8 py-3 hover:bg-[#FF00A8] hover:text-white transition-all duration-300"
              style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
            >
              Load more {title}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}