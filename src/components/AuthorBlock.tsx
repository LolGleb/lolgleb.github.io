import { Link } from 'react-router-dom';
import { Author } from '../types';
import { ExternalLink, Twitter, Instagram } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthorBlockProps {
  author: Author;
  variant?: 'compact' | 'full';
}

export function AuthorBlock({ author, variant = 'full' }: AuthorBlockProps) {
  // Compact variant for hero sections
  if (variant === 'compact') {
    return (
      <div className="text-base lg:text-lg text-foreground/60" style={{ fontFamily: 'var(--font-body)' }}>
        Letters: <Link to={`/author/${author.id}`} className="text-foreground hover:text-[#FF00A8] transition-colors">{author.name}</Link>
      </div>
    );
  }

  // Full variant for post-article sections
  return (
    <div className="flex gap-4 p-6 bg-accent/30 rounded-lg">
      {/* Avatar */}
      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-full">
        <ImageWithFallback
          src={author.avatar}
          alt={author.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-3">
        <div>
          <Link 
            to={`/author/${author.id}`}
            className="text-lg hover:text-[#FF00A8] transition-colors"
            style={{ fontFamily: 'var(--font-headlines)' }}
          >
            {author.name}
          </Link>
          {author.bio && (
            <p className="text-foreground/70 text-sm leading-relaxed">
              {author.bio}
            </p>
          )}
        </div>
        
        {/* Social Links */}
        {author.social && (
          <div className="flex items-center gap-3">
            {author.social.twitter && (
              <a 
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {author.social.instagram && (
              <a 
                href={author.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {author.social.website && (
              <a 
                href={author.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}