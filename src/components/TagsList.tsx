import { Link } from 'react-router-dom';
import { Tag as TagIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { mockTags } from '../data/mockData';

interface TagsListProps {
  tags: string[];
  variant?: 'default' | 'compact';
  className?: string;
  clickable?: boolean;
}

export function TagsList({ tags, variant = 'default', className = '', clickable = true }: TagsListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Get tag objects with metadata
  const tagObjects = tags.map(tagSlug => 
    mockTags.find(tag => tag.slug === tagSlug)
  ).filter(Boolean);

  if (tagObjects.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant === 'default' && (
        <div className="flex items-center gap-1.5 text-foreground/60">
          <TagIcon className="w-3.5 h-3.5" />
          <span className="text-sm">Topics:</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1.5">
        {tagObjects.map((tag) => {
          const badgeContent = (
            <Badge
              variant="outline"
              className={`
                flex items-center gap-1.5 transition-all duration-200
                ${clickable ? 'hover:bg-muted/50 group-hover:border-[#FF00A8]/50 group-hover:text-[#FF00A8]' : ''}
                ${variant === 'compact' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1 text-xs'}
              `}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </Badge>
          );

          if (clickable) {
            return (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="group"
              >
                {badgeContent}
              </Link>
            );
          }

          return (
            <div key={tag.id}>
              {badgeContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}