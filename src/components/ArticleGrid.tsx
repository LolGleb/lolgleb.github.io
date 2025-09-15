import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FavoriteButton } from './FavoriteButton';
import { TagsList } from './TagsList';

interface ArticleGridProps {
  articles: Article[];
  featured?: boolean;
  showCategory?: boolean;
  gridCols?: string;
}

// Format date strings nicely as DD/MM/YYYY if parseable; otherwise return original
function formatDateDisplay(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  return value;
}

export function ArticleGrid({ articles, featured = false, showCategory = true, gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }: ArticleGridProps) {
  if (featured && articles.length >= 3) {
    // Hero layout: 1 large + 2 medium + rest in grid
    const [mainArticle, ...otherArticles] = articles;
    const sideArticles = otherArticles.slice(0, 2);
    const gridArticles = otherArticles.slice(2);

    return (
      <div className="space-y-8">
        {/* Featured Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <Link to={`/article/${mainArticle.id}`} className="group">
              <div className="space-y-4">
                <div className="aspect-[16/10] overflow-hidden rounded-md relative">
                  <ImageWithFallback
                    src={mainArticle.image}
                    alt={mainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <FavoriteButton articleId={mainArticle.id} />
                  </div>
                </div>
                <div className="space-y-3">
                  {showCategory && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                        {mainArticle.subtype === 'Brand Guide' ? 'Brand Guide' : mainArticle.category}
                      </span>
                      <span className="date-text text-foreground/50">{formatDateDisplay(mainArticle.date)}</span>
                      {mainArticle.readTime && (
                        <span className="text-foreground/50">•</span>
                      )}
                      {mainArticle.readTime && (
                        <span className="text-foreground/50">{mainArticle.readTime}</span>
                      )}
                    </div>
                  )}
                  <h2 className="text-2xl lg:text-3xl leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {mainArticle.title}
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    {mainArticle.excerpt}
                  </p>
                  {mainArticle.tags && (
                    <TagsList tags={mainArticle.tags} className="pt-2" clickable={false} />
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`} className="group">
                <div className="space-y-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-md relative">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <FavoriteButton articleId={article.id} size="sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {showCategory && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                          {article.subtype === 'Brand Guide' ? 'Brand Guide' : article.category}
                        </span>
                        <span className="date-text text-foreground/50">{formatDateDisplay(article.date)}</span>
                      </div>
                    )}
                    <h3 className="text-lg leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                      {article.title}
                    </h3>
                    {article.tags && (
                      <TagsList tags={article.tags} variant="compact" clickable={false} />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid Articles */}
        {gridArticles.length > 0 && (
          <div className={`grid ${gridCols} gap-8`}>
            {gridArticles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`} className="group">
                <div className="space-y-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-md relative">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <FavoriteButton articleId={article.id} size="sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {showCategory && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                          {article.subtype === 'Brand Guide' ? 'Brand Guide' : article.category}
                        </span>
                        <span className="date-text text-foreground/50">{formatDateDisplay(article.date)}</span>
                      </div>
                    )}
                    <h3 className="text-lg leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                      {article.title}
                    </h3>
                    {article.readTime && (
                      <span className="text-sm text-foreground/50">{article.readTime}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular grid layout
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {articles.slice(0, 8).map((article) => (
        <Link key={article.id} to={`/article/${article.id}`} className="group">
          <div className="space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-md relative">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton articleId={article.id} size="sm" />
              </div>
            </div>
            <div className="space-y-2">
              {showCategory && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                    {article.subtype === 'Brand Guide' ? 'Brand Guide' : article.category}
                  </span>
                  <span className="date-text text-foreground/50">{formatDateDisplay(article.date)}</span>
                </div>
              )}
              <h3 className="text-lg leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                {article.title}
              </h3>
              {article.tags && (
                <TagsList tags={article.tags} variant="compact" clickable={false} />
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}