import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAllArticles, AdminArticle } from '../db/articlesDb';
import { useCachedData } from '../hooks/useCachedData';

export function EditorsPick() {
  const { data: articles, isLoading, hasCache } = useCachedData<AdminArticle[]>(
    'articles:list',
    async () => {
      const all = await getAllArticles();
      // minimize payload for storage
      return all.map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt?.slice(0, 160),
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

  // Must be declared before any conditional returns to keep hooks order stable
  const [imageLoading, setImageLoading] = useState(true);

  const latest = (() => {
    const list = Array.isArray(articles) ? [...articles] : [];
    list.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    return list[0] || null;
  })();

  if (isLoading && !hasCache) {
    return (
      <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-white/40 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
          </div>
        </div>
      </section>
    );
  }

  if (!latest) {
    return (
      <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>No articles yet</h2>
          <p className="opacity-80">Add your first article in the Admin panel.</p>
        </div>
      </section>
    );
  }

  const dateText = (() => {
    try {
      const d = new Date(latest.publishedAt);
      return isNaN(d.getTime()) ? latest.publishedAt : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return latest.publishedAt;
    }
  })();

  return (
    <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-md">
              <Link to={`/article/${latest.id}`}>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="h-6 w-6 border-2 border-white/40 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
                  </div>
                )}
                <ImageWithFallback
                  src={latest.image}
                  alt={latest.title}
                  className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
              Latest {latest.category}
            </h2>
            
            <div className="space-y-4">
              <Link to={`/article/${latest.id}`} className="block">
                <h3 className="text-xl lg:text-2xl opacity-90" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {latest.title}
                </h3>
              </Link>
              
              <p className="text-sm opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
                {dateText}
              </p>
              
              {latest.excerpt && (
                <p className="text-lg opacity-80 leading-relaxed">
                  {latest.excerpt}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/article/${latest.id}`} className="bg-primary-foreground text-primary px-8 py-3 hover:bg-primary-foreground/90 transition-colors text-center">
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}