import { Link2, Twitter, Facebook, Mail, Heart, Bookmark } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useEngagement } from '../contexts/EngagementContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ShareEngagementInlineProps {
  url?: string;
  title?: string;
  articleId: string;
  category: string;
}

export function ShareEngagementInline({ 
  url, 
  title, 
  articleId,
  category 
}: ShareEngagementInlineProps) {
  const currentUrl = url || window.location.href;
  const shareTitle = title || document.title;
  
  const { getEngagement, likeArticle } = useEngagement();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Guard against invalid articleId
  if (!articleId) {
    return null;
  }
  
  const engagement = getEngagement(articleId);
  const isBookmarked = isFavorite(articleId);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch (err) {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const shareByEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`;
    window.location.href = emailUrl;
  };

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
    <div className="flex items-center justify-between py-6 border-y border-border">
      {/* Left side - Share */}
      <div className="flex items-center gap-4">
        <span 
          className="text-sm uppercase tracking-wide text-foreground/60"
          style={{ fontFamily: 'var(--font-body)', fontWeight: '500' }}
        >
          SHARE
        </span>
        
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
            title="Копировать ссылку"
          >
            <Link2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={shareOnTwitter}
            className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
            title="Поделиться в Twitter"
          >
            <Twitter className="w-4 h-4" />
          </button>
          
          <button
            onClick={shareOnFacebook}
            className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
            title="Поделиться в Facebook"
          >
            <Facebook className="w-4 h-4" />
          </button>
          
          <button
            onClick={shareByEmail}
            className="p-2 text-foreground/40 hover:text-[#FF00A8] transition-colors rounded-md hover:bg-accent/50"
            title="Отправить по email"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right side - Like & Bookmark */}
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            engagement.userLiked 
              ? 'text-green-600' 
              : 'text-foreground/40 hover:text-green-600'
          }`}
          title="Лайк"
        >
          <Heart 
            className={`w-4 h-4 ${engagement.userLiked ? 'fill-current' : ''}`} 
          />
          <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            {engagement.likes}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`p-2 transition-colors rounded-md hover:bg-accent/50 ${
            isBookmarked 
              ? 'text-[#FF00A8]' 
              : 'text-foreground/40 hover:text-[#FF00A8]'
          }`}
          title={isBookmarked ? 'Удалить из закладок' : 'Добавить в закладки'}
        >
          <Bookmark 
            className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
}