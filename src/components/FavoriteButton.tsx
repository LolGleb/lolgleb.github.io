import { Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { cn } from '../components/ui/utils';

interface FavoriteButtonProps {
  articleId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ articleId, className, size = 'md' }: FavoriteButtonProps) {
  // Guard against incorrect usage
  if (typeof articleId !== 'string' || !articleId.trim()) {
    return null;
  }
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const favorite = isFavorite(articleId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFromFavorites(articleId);
    } else {
      addToFavorites(articleId);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group flex items-center justify-center rounded-full p-2 transition-all duration-200',
        'bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm',
        'hover:bg-white hover:border-white/40 hover:scale-110',
        favorite && 'bg-[#FF00A8]/10 border-[#FF00A8]/20',
        className
      )}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          'transition-colors duration-200',
          sizeClasses[size],
          favorite 
            ? 'fill-[#FF00A8] text-[#FF00A8]' 
            : 'text-foreground/60 group-hover:text-[#FF00A8]'
        )}
      />
    </button>
  );
}