import { Link } from 'react-router-dom';
import { Tag as TagIcon, TrendingUp, Hash } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Badge } from '../components/ui/badge';
import { mockTags, mockArticles } from '../data/mockData';

export function TagsPage() {
  // Calculate actual counts for each tag
  const tagsWithCounts = mockTags.map(tag => {
    const count = mockArticles.filter(article => 
      article.tags?.includes(tag.slug)
    ).length;
    return { ...tag, count };
  }).filter(tag => tag.count > 0);

  // Sort by count (most popular first)
  const popularTags = [...tagsWithCounts].sort((a, b) => b.count - a.count);

  // Group tags by count for visual hierarchy
  const largeTags = popularTags.filter(tag => tag.count >= 4);
  const mediumTags = popularTags.filter(tag => tag.count >= 2 && tag.count < 4);
  const smallTags = popularTags.filter(tag => tag.count < 2);

  return (
    <>
      <SEO 
        title="Topics — Ticket to Socks"
        description="Explore all topics in our sock culture archive. From sustainability and performance to luxury and streetwear."
        keywords="topics, tags, sock culture, streetwear, fashion, sustainability, performance"
      />
      
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
                <Link to="/" className="hover:text-[#FF00A8] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">Topics</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#FF00A8]/10 rounded-full">
                    <Hash className="w-6 h-6 text-[#FF00A8]" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Explore All Topics
                    </h1>
                    <p className="text-foreground/60">
                      {tagsWithCounts.length} topics covering {mockArticles.filter(a => a.tags?.length).length} articles
                    </p>
                  </div>
                </div>

                <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl">
                  Discover articles by topic. From the latest in sock technology{' '}
                  <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
                  sustainable fashion and luxury streetwear collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Popular Topics */}
          {largeTags.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#FF00A8]" />
                <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Popular Topics
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {largeTags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className="group"
                  >
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-3 text-base transition-all duration-200 hover:bg-muted/50 group-hover:border-[#FF00A8]/50 group-hover:scale-105"
                      style={{ 
                        borderColor: `${tag.color}30`,
                        backgroundColor: `${tag.color}08`
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        {tag.count}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Topics */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-foreground/60" />
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                All Topics
              </h2>
            </div>

            {/* Large Topics */}
            {largeTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground/70 mb-4 uppercase tracking-wider">
                  Most Popular ({largeTags.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {largeTags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="group p-4 bg-card border border-border rounded-lg hover:border-[#FF00A8]/30 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground group-hover:text-[#FF00A8] transition-colors">
                            {tag.name}
                          </h4>
                          {tag.description && (
                            <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                              {tag.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-foreground/50">
                              {tag.count} article{tag.count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Medium & Small Topics */}
            {(mediumTags.length > 0 || smallTags.length > 0) && (
              <div>
                <h3 className="text-sm font-medium text-foreground/70 mb-4 uppercase tracking-wider">
                  Other Topics ({mediumTags.length + smallTags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[...mediumTags, ...smallTags].map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="group"
                    >
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:bg-muted/50 group-hover:border-[#FF00A8]/50"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                        <span className="text-xs text-foreground/50">
                          {tag.count}
                        </span>
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back Navigation */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[#FF00A8] hover:underline"
            >
              ← Back{' '}
              <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span>{' '}
              home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}