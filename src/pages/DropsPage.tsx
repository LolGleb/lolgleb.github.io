import { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getArticlesByCategory, AdminArticle } from '../db/articlesDb';
import { Article } from '../types';

export function DropsPage() {
  const [articles, setArticles] = useState<{ hype: Article[]; latest: Article[] }>({ hype: [], latest: [] });

  useEffect(() => {
    (async () => {
      try {
        const dbArticles: AdminArticle[] = await getArticlesByCategory('Drops');
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
        title="to Drops — Latest Sock Releases & Collaborations | Ticket to Socks"
        description="Discover the hottest sock drops, limited releases, and brand collaborations. Never miss a fresh drop from your favorite sock brands."
        keywords="sock drops, limited edition socks, sock collaborations, new releases, sock launches, exclusive socks"
      />
      
      <CategoryPageTemplate
        title="Drops"
        articles={articles}
        seoTitle="to Drops — Latest Sock Releases & Collaborations | Ticket to Socks"
        seoDescription="Discover the hottest sock drops, limited releases, and brand collaborations. Never miss a fresh drop from your favorite sock brands."
        seoKeywords="sock drops, limited edition socks, sock collaborations, new releases, sock launches, exclusive socks"
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