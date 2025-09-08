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
  const showCurrentRating = !hoveredRating && !userRating;

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

      {/* Current Average Rating (smaller, grayed out) */}
      {showCurrentRating && (
        <>
          <span className="mx-2 text-xs text-foreground/40">avg:</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={`avg-${i}`}
                className={`w-3 h-3 ${
                  i + 1 <= currentRating 
                    ? 'fill-gray-400 text-gray-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
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