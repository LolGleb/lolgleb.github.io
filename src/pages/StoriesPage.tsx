import { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getArticlesByCategory, AdminArticle } from '../db/articlesDb';
import { Article } from '../types';

export function StoriesPage() {
  const [articles, setArticles] = useState<{ hype: Article[]; latest: Article[] }>({ hype: [], latest: [] });

  useEffect(() => {
    (async () => {
      try {
        const dbArticles: AdminArticle[] = await getArticlesByCategory('Stories');
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
        title="to Stories — In-Depth Features & Profiles | Ticket to Socks"
        description="Deep dives into sock culture, brand stories, designer profiles, and the people shaping the future of foot fashion."
        keywords="sock stories, fashion features, brand profiles, sock culture, designer interviews, sock history"
      />
      
      <CategoryPageTemplate
        title="Stories"
        articles={articles}
        seoTitle="to Stories — In-Depth Features & Profiles | Ticket to Socks"
        seoDescription="Deep dives into sock culture, brand stories, designer profiles, and the people shaping the future of foot fashion."
        seoKeywords="sock stories, fashion features, brand profiles, sock culture, designer interviews, sock history"
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