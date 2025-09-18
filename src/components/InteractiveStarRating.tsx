import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

interface InteractiveStarRatingProps {
  brandId: string;
  category: string;
  currentRating: number;
  userRating?: number;
  onRate?: (rating: number) => void;
}

export function InteractiveStarRating({ 
  brandId, 
  category, 
  currentRating, 
  userRating = 0,
  onRate 
}: InteractiveStarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { isAuthenticated, rateBrand } = useAuth();
  const navigate = useNavigate();

  const handleStarClick = (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate brands', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth', { 
            state: { from: { pathname: window.location.pathname } }
          })
        }
      });
      return;
    }

    rateBrand(brandId, category, rating);
    onRate?.(rating);
    toast.success('Rating saved!', {
      description: `You rated ${category} as ${rating} stars`
    });
  };

  const handleStarHover = (rating: number) => {
    if (isAuthenticated) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || userRating || 0;
  const showAverage = hoveredRating === 0;

  return (
    <div className="flex items-center gap-1">
      {/* User Interactive Stars */}
      <div 
        className="flex gap-0.5" 
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const starIndex = i + 1;
          const isActive = starIndex <= displayRating;
          const isUserRated = userRating > 0 && starIndex <= userRating;
          
          return (
            <Star
              key={i}
              className={`w-4 h-4 transition-all cursor-pointer ${
                isAuthenticated ? 'hover:scale-110' : 'cursor-help'
              } ${
                isActive
                  ? isUserRated
                    ? 'fill-[#FF00A8] text-[#FF00A8]' // User's rating
                    : hoveredRating
                      ? 'fill-yellow-400 text-yellow-400' // Hover state
                      : 'fill-gray-300 text-gray-300' // Default
                  : 'text-gray-300'
              }`}
              onMouseEnter={() => handleStarHover(starIndex)}
              onClick={() => handleStarClick(starIndex)}
            />
          );
        })}
      </div>

      {/* Current Average Rating with partial fill reflecting exact average */}
      {showAverage && (
        <>
          <span className="mx-2 text-xs text-foreground/40">avg:</span>
          <div className="flex items-center gap-0.5">
            {(() => {
              const safeAvg = Number.isFinite(currentRating) ? Math.max(0, Math.min(5, Number(currentRating))) : 0;
              return Array.from({ length: 5 }, (_, i) => {
                const fillRatio = Math.max(0, Math.min(1, safeAvg - i)); // 0..1 for this star
                const width = Number.isFinite(fillRatio) ? `${fillRatio * 100}%` : '0%';
                return (
                  <div key={`avg-${i}`} className="relative w-3 h-3">
                    {/* Base star (gray outline) */}
                    <Star className="w-3 h-3 text-gray-300" />
                    {/* Colored overlay clipped by width to show partial fill */}
                    <div className="absolute left-0 top-0 h-full overflow-hidden pointer-events-none" style={{ width }}>
                      {/* Use a filled star so the fill shows correctly */}
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#FF00A8]" aria-hidden="true">
                        <path d="M12 2.25l2.954 5.976 6.596.959-4.775 4.654 1.127 6.574L12 17.771l-5.902 3.142 1.127-6.574L2.45 9.185l6.596-.959L12 2.25z" fill="currentColor" stroke="none" />
                      </svg>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </>
      )}
      
      {/* User rating indicator */}
      {userRating > 0 && !hoveredRating && (
        <span className="ml-2 text-xs text-[#FF00A8]">
          Your rating: {userRating}
        </span>
      )}
    </div>
  );
}