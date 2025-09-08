import { Heart, HeartOff, Bookmark, BookmarkCheck, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEngagement } from '../contexts/EngagementContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatReadingTime } from '../utils/readingTime';

interface ArticleEngagementProps {
  articleId: string;
  title: string;
  category: string;
  variant?: 'full' | 'compact' | 'minimal';
  showViews?: boolean;
  showReadingTime?: boolean;
  showLikes?: boolean;
  showBookmark?: boolean;
  className?: string;
}

export function ArticleEngagement({ 
  articleId, 
  title, 
  category, 
  variant = 'full',
  showViews = true,
  showReadingTime = true,
  showLikes = true,
  showBookmark = true,
  className = ""
}: ArticleEngagementProps) {
  const { 
    getEngagement, 
    likeArticle, 
    dislikeArticle, 
    isBookmarked, 
    toggleBookmark 
  } = useEngagement();

  const engagement = getEngagement(articleId);
  const bookmarked = isBookmarked(articleId);

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 text-sm text-foreground/60 ${className}`}>
        {showReadingTime && engagement.readingTime && (
          <span>{formatReadingTime(engagement.readingTime)}</span>
        )}
        {showViews && engagement.views > 0 && (
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {engagement.views}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => likeArticle(articleId)}
          className={`gap-1 h-8 px-2 ${engagement.userLiked ? 'text-red-500' : 'text-foreground/60'}`}
        >
          <Heart className={`w-4 h-4 ${engagement.userLiked ? 'fill-current' : ''}`} />
          {engagement.likes > 0 && <span className="text-xs">{engagement.likes}</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBookmark(articleId, title, category)}
          className={`h-8 px-2 ${bookmarked ? 'text-[#FF00A8]' : 'text-foreground/60'}`}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-current" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </Button>

        {showViews && engagement.views > 0 && (
          <div className="flex items-center gap-1 text-xs text-foreground/60">
            <Eye className="w-3 h-3" />
            {engagement.views}
          </div>
        )}
      </div>
    );
  }

  // Check if there's anything to show in left section
  const hasLeftContent = showLikes || showBookmark;
  
  // Check if there's anything to show in right section
  const hasRightContent = (showViews && engagement.views > 0) || (showReadingTime && engagement.readingTime);
  
  // Hide entire block if nothing to show
  if (!hasLeftContent && !hasRightContent) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between p-4 border border-border rounded-lg bg-card ${className}`}>
      <div className="flex items-center gap-4">
        {/* Like/Dislike */}
        {showLikes && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => likeArticle(articleId)}
              className={`gap-2 ${engagement.userLiked ? 'text-green-600 bg-green-50 dark:bg-green-950' : 'text-foreground/60'}`}
            >
              <ThumbsUp className={`w-4 h-4 ${engagement.userLiked ? 'fill-current' : ''}`} />
              <span>{engagement.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => dislikeArticle(articleId)}
              className={`gap-2 ${engagement.userDisliked ? 'text-red-600 bg-red-50 dark:bg-red-950' : 'text-foreground/60'}`}
            >
              <ThumbsDown className={`w-4 h-4 ${engagement.userDisliked ? 'fill-current' : ''}`} />
              <span>{engagement.dislikes}</span>
            </Button>
          </div>
        )}

        {/* Bookmark */}
        {showBookmark && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleBookmark(articleId, title, category)}
          className={`gap-2 ${bookmarked ? 'text-[#FF00A8] bg-[#FF00A8]/10' : 'text-foreground/60'}`}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-current" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-foreground/60">
        {showViews && engagement.views > 0 && (
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{engagement.views} views</span>
          </div>
        )}
        
        {showReadingTime && engagement.readingTime && (
          <Badge variant="secondary">
            {formatReadingTime(engagement.readingTime)}
          </Badge>
        )}
      </div>
    </div>
  );
}