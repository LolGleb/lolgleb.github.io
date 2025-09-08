import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
}

export function RelatedArticles({ articles, title = "Похожие материалы" }: RelatedArticlesProps) {
  return (
    <div className="hidden lg:block sticky top-8 space-y-6 w-64">
      <h3 className="text-lg" style={{ fontFamily: 'var(--font-headlines)' }}>
        {title}
      </h3>
      
      <div className="space-y-6">
        {articles.slice(0, 5).map((article) => (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`}
            className="group block hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-32 overflow-hidden rounded mb-3">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="uppercase" style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}>
                  {article.category}
                </span>
                <span className="text-foreground/50" style={{ fontFamily: 'var(--font-body)' }}>
                  {article.date}
                </span>
              </div>
              <h4 className="leading-tight group-hover:text-[#FF00A8] transition-colors line-clamp-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                {article.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}