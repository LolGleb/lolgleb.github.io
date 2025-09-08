import { useParams, Link } from 'react-router-dom';
import { Tag as TagIcon, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ArticleGrid } from '../components/ArticleGrid';
import { Badge } from '../components/ui/badge';
import { mockArticles, mockTags } from '../data/mockData';
import { NotFoundPage } from './NotFoundPage';

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the tag
  const tag = mockTags.find(t => t.slug === slug);
  
  if (!tag || !slug) {
    return <NotFoundPage />;
  }

  // Filter articles by tag
  const taggedArticles = mockArticles.filter(article => 
    article.tags?.includes(slug)
  );

  // Get related tags (tags that appear with this tag)
  const relatedTagSlugs = new Set<string>();
  taggedArticles.forEach(article => {
    article.tags?.forEach(tagSlug => {
      if (tagSlug !== slug) {
        relatedTagSlugs.add(tagSlug);
      }
    });
  });
  
  const relatedTags = mockTags.filter(t => relatedTagSlugs.has(t.slug));

  return (
    <>
      <SEO 
        title={`${tag.name} — Topic Archive`}
        description={tag.description || `Explore articles about ${tag.name.toLowerCase()} in sock culture and fashion`}
        keywords={`${tag.name.toLowerCase()}, socks, fashion, streetwear, articles`}
      />
      
      <main className="min-h-screen bg-background">
        {/* Tag Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
                <Link to="/" className="hover:text-[#FF00A8] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link to="/tags" className="hover:text-[#FF00A8] transition-colors">
                  Topics
                </Link>
                <span>/</span>
                <span className="text-foreground">{tag.name}</span>
              </div>

              <div className="space-y-6">
                {/* Tag Badge */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 text-lg"
                    style={{ 
                      backgroundColor: `${tag.color}15`, 
                      color: tag.color,
                      border: `1px solid ${tag.color}30`
                    }}
                  >
                    <TagIcon className="w-5 h-5" />
                    {tag.name}
                  </Badge>
                  <span className="text-foreground/60">
                    {taggedArticles.length} article{taggedArticles.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Tag Info */}
                <div>
                  <h1 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {tag.name} in Sock Culture
                  </h1>
                  {tag.description && (
                    <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl">
                      {tag.description}. Explore the latest trends, innovations, and stories.
                    </p>
                  )}
                </div>

                {/* Related Tags */}
                {relatedTags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground/70 mb-3 uppercase tracking-wider">
                      Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTags.slice(0, 8).map((relatedTag) => (
                        <Link
                          key={relatedTag.id}
                          to={`/tag/${relatedTag.slug}`}
                          className="group"
                        >
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted/50 transition-colors group-hover:border-[#FF00A8]/50"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: relatedTag.color }}
                            />
                            {relatedTag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {taggedArticles.length > 0 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Latest {tag.name} Articles
                </h2>
                <div className="text-sm text-foreground/60">
                  {taggedArticles.length} article{taggedArticles.length !== 1 ? 's' : ''} found
                </div>
              </div>

              <ArticleGrid articles={taggedArticles} featured={taggedArticles.length >= 3} />
            </div>
          ) : (
            <div className="text-center py-12">
              <TagIcon className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
                No articles found
              </h2>
              <p className="text-foreground/60 mb-6">
                We haven't published any articles about {tag.name.toLowerCase()} yet.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-[#FF00A8] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back{' '}
                <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                home
              </Link>
            </div>
          )}

          {/* Back Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[#FF00A8] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back{' '}
              <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
              home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}