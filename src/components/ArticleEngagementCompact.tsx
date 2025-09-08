import { Heart, Bookmark } from 'lucide-react';
import { useEngagement } from '../contexts/EngagementContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ArticleEngagementCompactProps {
  articleId: string;
  title: string;
  category: string;
  className?: string;
}

export function ArticleEngagementCompact({
  articleId,
  title,
  category,
  className = ''
}: ArticleEngagementCompactProps) {
  const { getEngagement, likeArticle } = useEngagement();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Guard against invalid articleId
  if (!articleId) {
    return null;
  }
  
  const engagement = getEngagement(articleId);

  const isBookmarked = isFavorite(articleId);

  const handleLike = () => {
    likeArticle(articleId);
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      removeFromFavorites(articleId);
    } else {
      addToFavorites(articleId);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 transition-colors ${
          engagement.userLiked 
            ? 'text-green-600' 
            : 'text-foreground/60 hover:text-green-600'
        }`}
      >
        <Heart 
          className={`w-5 h-5 ${engagement.userLiked ? 'fill-current' : ''}`} 
        />
        <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
          {engagement.likes}
        </span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className={`flex items-center gap-2 transition-colors ${
          isBookmarked 
            ? 'text-[#FF00A8]' 
            : 'text-foreground/60 hover:text-[#FF00A8]'
        }`}
      >
        <Bookmark 
          className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} 
        />
      </button>
    </div>
  );
}