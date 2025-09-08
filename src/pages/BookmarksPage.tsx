import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEngagement } from '../contexts/EngagementContext';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BookmarkCheck, Trash2, Calendar, Tag } from 'lucide-react';
import { mockArticles } from '../data/mockData';

export function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useEngagement();
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState<'date' | 'category'>('date');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title="Bookmarks - Ticket to Socks"
          description="Your saved articles"
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <BookmarkCheck className="w-16 h-16 text-[#FF00A8] mx-auto opacity-50" />
            <div className="space-y-2">
              <h1 className="text-3xl font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>
                Sign in to view bookmarks
              </h1>
              <p className="text-foreground/60 max-w-md mx-auto">
                Save your favorite articles and access them anytime. Create an account to get started.
              </p>
            </div>
            <Link to="/auth">
              <Button style={{ backgroundColor: '#FF00A8' }}>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
    }
    return a.category.localeCompare(b.category);
  });

  const groupedByCategory = sortedBookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.category]) {
      acc[bookmark.category] = [];
    }
    acc[bookmark.category].push(bookmark);
    return acc;
  }, {} as Record<string, typeof bookmarks>);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bookmarks - Ticket to Socks"
        description="Your saved articles and stories"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookmarkCheck className="w-8 h-8 text-[#FF00A8]" />
            <h1 className="text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              My Bookmarks
            </h1>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-foreground/60">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
            </p>
            
            {bookmarks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/60">Sort by:</span>
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('date')}
                  className="gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  Date
                </Button>
                <Button
                  variant={sortBy === 'category' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('category')}
                  className="gap-1"
                >
                  <Tag className="w-3 h-3" />
                  Category
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkCheck className="w-16 h-16 text-foreground/20 mx-auto mb-6" />
            <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
              No bookmarks yet
            </h2>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
              Start saving articles you want to read later. Look for the bookmark icon on any article.
            </p>
            <Link to="/">
              <Button style={{ backgroundColor: '#FF00A8' }}>
                Explore Articles
              </Button>
            </Link>
          </div>
        ) : sortBy === 'category' ? (
          /* Grouped by Category */
          <div className="space-y-12">
            {Object.entries(groupedByCategory).map(([category, categoryBookmarks]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-6">
                  <Badge 
                    variant="secondary" 
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {category}
                  </Badge>
                  <span className="text-sm text-foreground/60">
                    {categoryBookmarks.length} {categoryBookmarks.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryBookmarks.map((bookmark) => {
                    const article = mockArticles.find(a => a.id === bookmark.articleId);
                    if (!article) return null;
                    
                    return (
                      <BookmarkCard 
                        key={bookmark.articleId}
                        bookmark={bookmark}
                        article={article}
                        onRemove={(id) => toggleBookmark(id, bookmark.title, bookmark.category)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Sorted by Date */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedBookmarks.map((bookmark) => {
              const article = mockArticles.find(a => a.id === bookmark.articleId);
              if (!article) return null;
              
              return (
                <BookmarkCard 
                  key={bookmark.articleId}
                  bookmark={bookmark}
                  article={article}
                  onRemove={(id) => toggleBookmark(id, bookmark.title, bookmark.category)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface BookmarkCardProps {
  bookmark: {
    articleId: string;
    bookmarkedAt: string;
    title: string;
    category: string;
  };
  article: any;
  onRemove: (id: string) => void;
}

function BookmarkCard({ bookmark, article, onRemove }: BookmarkCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Article Image */}
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Remove Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRemove(bookmark.articleId)}
          className="absolute top-3 right-3 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
          title="Remove bookmark"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" style={{ fontFamily: 'var(--font-body)' }}>
            {bookmark.category}
          </Badge>
          <span className="text-foreground/60">
            Saved {formatDate(bookmark.bookmarkedAt)}
          </span>
        </div>
        
        <Link to={`/article/${bookmark.articleId}`}>
          <h3 className="line-clamp-2 hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
            {article.title}
          </h3>
        </Link>
        
        {article.excerpt && (
          <p className="text-sm text-foreground/70 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Link 
            to={`/article/${bookmark.articleId}`}
            className="text-sm text-[#FF00A8] hover:text-[#FF00A8]/80 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Read article →
          </Link>
          
          <div className="text-xs text-foreground/60">
            {article.publishedAt}
          </div>
        </div>
      </div>
    </div>
  );
}