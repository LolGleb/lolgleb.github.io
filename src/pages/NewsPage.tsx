import { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getArticlesByCategory, AdminArticle } from '../db/articlesDb';
import { Article } from '../types';

export function NewsPage() {
  const [articles, setArticles] = useState<{ hype: Article[]; latest: Article[] }>({ hype: [], latest: [] });

  useEffect(() => {
    (async () => {
      try {
        const dbArticles: AdminArticle[] = await getArticlesByCategory('News');
        const toArticle = (a: AdminArticle): Article => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || '',
          category: a.category,
          image: a.image,
          date: formatDate(a.publishedAt),
          readTime: a.readTime,
          featured: a.featured,
          content: a.content,
        });
        // Sort by ISO publishedAt desc first, then map to UI Article
        const sortedAdmin = [...dbArticles].sort((a, b) => {
          const da = Date.parse(a.publishedAt);
          const db = Date.parse(b.publishedAt);
          return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
        });
        const sorted = sortedAdmin.map(toArticle);
        setArticles({ hype: sorted, latest: sorted });
      } catch (e) {
        // In case of error, keep empty lists; optionally could log
        setArticles({ hype: [], latest: [] });
      }
    })();
  }, []);

  return (
    <>
      <SEO 
        title="to News — Latest Sock Culture & Industry Updates | Ticket to Socks"
        description="Stay updated with the latest news in sock fashion, industry trends, brand collaborations, and cultural movements shaping the sock world."
        keywords="sock news, fashion news, sock industry, streetwear news, athletic sock trends, sock culture news"
      />
      
      <CategoryPageTemplate
        title="News"
        articles={articles}
        seoTitle="to News — Latest Sock Culture & Industry Updates | Ticket to Socks"
        seoDescription="Stay updated with the latest news in sock fashion, industry trends, brand collaborations, and cultural movements shaping the sock world."
        seoKeywords="sock news, fashion news, sock industry, streetwear news, athletic sock trends, sock culture news"
      />
    </>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}