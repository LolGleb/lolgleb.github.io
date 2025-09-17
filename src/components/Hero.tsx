import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAllArticles, AdminArticle } from '../db/articlesDb';
import { useCachedData } from '../hooks/useCachedData';

function LoadingImage({
  src,
  alt,
  className,
  spinnerSize = 'h-5 w-5',
}: {
  src: string;
  alt: string;
  className?: string;
  spinnerSize?: 'h-5 w-5' | 'h-6 w-6';
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div
            className={`${spinnerSize} border-2 border-gray-300 rounded-full animate-spin`}
            style={{ borderTopColor: '#FF00A8' }}
          />
        </div>
      )}
      <ImageWithFallback
        src={src}
        alt={alt}
        className={`${className ?? ''} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}

interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  publishedAt: string;
  excerpt?: string;
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<'hype' | 'latest'>('hype');
  const [displayedArticles, setDisplayedArticles] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  const { data: articles, isLoading: isFetching, hasCache } = useCachedData<AdminArticle[]>(
    'articles:list',
    async () => {
      const all = await getAllArticles();
      return all.map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt?.slice(0, 120),
        category: a.category,
        image: a.image,
        publishedAt: a.publishedAt,
      } as AdminArticle));
    },
    {
      maxAgeMs: 10 * 60 * 1000,
      revalidateOnMount: true,
      shouldAccept: (prev, next) => {
        const prevLen = Array.isArray(prev) ? prev.length : 0;
        const nextLen = Array.isArray(next) ? next.length : 0;
        return !(prevLen > 0 && nextLen === 0);
      },
    }
  );

  useEffect(() => {
    const sorted = Array.isArray(articles) ? [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)) : [];
    const mapped: Article[] = sorted.map((a, idx) => ({
      id: idx + 1,
      title: a.title,
      category: a.category,
      image: a.image,
      publishedAt: (() => {
        try {
          const d = new Date(a.publishedAt);
          return isNaN(d.getTime()) ? a.publishedAt : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
          return a.publishedAt;
        }
      })(),
      excerpt: a.excerpt,
    }));
    setDbArticles(mapped);
  }, [articles]);

  // If there are no admin articles yet, render a simple empty state
  if (isFetching && !hasCache) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
          </div>
        </div>
      </section>
    );
  }

  if (dbArticles.length === 0) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>
            Latest Articles
          </h2>
          <p className="text-foreground/60 mt-2">No articles yet. Add some in the Admin panel.</p>
        </div>
      </section>
    );
  }

  const featuredArticle: Article | undefined = dbArticles[0];
  const sideArticles: Article[] = dbArticles.slice(1, 3);
  const bottomArticles: Article[] = dbArticles.slice(3);

  // Load more from existing DB-backed list
  const loadMoreArticles = async () => {
    setIsLoadingMore(true);
    await new Promise((r) => setTimeout(r, 400));
    setDisplayedArticles((prev) => Math.min(prev + 8, bottomArticles.length));
    setIsLoadingMore(false);
  };

  // Получаем статьи для отображения
  const articlesToDisplay = bottomArticles.slice(0, displayedArticles);

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Верхняя секция: главная статья + две боковые */}
        {/* Мобильная версия: главная статья + две статьи в ряд под ней */}
        <div className="lg:hidden mb-12">
          {/* Главная статья на мобиле */}
          <div className="mb-6">
            <article className="group cursor-pointer h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md mb-4">
                <LoadingImage
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  spinnerSize="h-6 w-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                    {featuredArticle.category}
                  </span>
                  <span className="text-foreground/40 ml-2">
                    {featuredArticle.publishedAt}
                  </span>
                </div>
                
                <h1 className="text-2xl group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {featuredArticle.title}
                </h1>
                
                <p className="text-foreground/70 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>
            </article>
          </div>

          {/* Две с��атьи в ряд на мобиле */}
          <div className="grid grid-cols-2 gap-4">
            {sideArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                  <LoadingImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    spinnerSize="h-5 w-5"
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
                  
                  <h4 className="text-sm group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {article.title}
                  </h4>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Десктопная версия: главная статья слева + две статьи справа */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Главная статья */}
          <div className="lg:col-span-2">
            <article className="group cursor-pointer h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md mb-4">
                <LoadingImage
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  spinnerSize="h-6 w-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                    {featuredArticle.category}
                  </span>
                  <span className="text-foreground/40 ml-2">
                    {featuredArticle.publishedAt}
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {featuredArticle.title}
                </h1>
                
                <p className="text-foreground/70 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>
            </article>
          </div>

          {/* Две статьи справа на десктопе */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-3">
                  <LoadingImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    spinnerSize="h-5 w-5"
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
                  
                  <h3 className="text-lg group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Табуляция */}
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('hype')}
              className={`text-lg transition-colors ${
                activeTab === 'hype' 
                  ? 'text-foreground' 
                  : 'text-foreground/40 hover:text-foreground/70'
              }`}
              style={{ fontFamily: 'var(--font-headlines)' }}
            >
              Hype
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`text-lg transition-colors ${
                activeTab === 'latest' 
                  ? 'text-foreground' 
                  : 'text-foreground/40 hover:text-foreground/70'
              }`}
              style={{ fontFamily: 'var(--font-headlines)' }}
            >
              Latest
            </button>
          </div>
        </div>

        {/* Нижняя секция: статьи с подгрузкой */}
        {/* На мобиле - по 2 в ряд, на десктопе - по 4 в ряд */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {articlesToDisplay.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                <LoadingImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  spinnerSize="h-5 w-5"
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
                
                <h4 className="text-sm group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {article.title}
                </h4>
              </div>
            </article>
          ))}
        </div>

        {/* Кнопка загрузки дополнительных статей */}
        <div className="flex justify-center">
          <button
            onClick={loadMoreArticles}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-3 text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="italic" style={{ color: '#FF00A8' }}>
              Ticket to
            </span>
            <span>
              {isLoadingMore ? 'loading...' : 'loading more'}
            </span>
            {!isLoadingMore && <span>→</span>}
          </button>
        </div>
      </div>
    </section>
  );
}