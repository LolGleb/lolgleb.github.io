import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getArticlesByCategory, AdminArticle } from '../db/articlesDb';
import { Article } from '../types';
import { useCachedData } from '../hooks/useCachedData';

export function DropsPage() {
  const { data: dbArticles, isLoading, hasCache } = useCachedData<AdminArticle[]>(
    'articles:category:Drops',
    async () => await getArticlesByCategory('Drops'),
    {
      maxAgeMs: 10 * 60 * 1000,
      revalidateOnMount: true,
      shouldAccept: (prev, next) => {
        const prevLen = Array.isArray(prev) ? prev.length : 0;
        const nextLen = Array.isArray(next) ? next.length : 0;
        return !(prevLen > 0 && nextLen === 0);
      },
    }
  );

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

  const sorted: Article[] = (Array.isArray(dbArticles) ? [...dbArticles] : [])
    .sort((a, b) => {
      const da = Date.parse(a.publishedAt);
      const db = Date.parse(b.publishedAt);
      return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
    })
    .map(toArticle);

  const articles = { hype: sorted, latest: sorted };

  if (isLoading && !hasCache) {
    return (
      <main className="min-h-screen">
        <SEO 
          title="to Drops — Latest Sock Releases & Collaborations | Ticket to Socks"
          description="Discover the hottest sock drops, limited releases, and brand collaborations. Never miss a fresh drop from your favorite sock brands."
          keywords="sock drops, limited edition socks, sock collaborations, new releases, sock launches, exclusive socks"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="py-20 flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
          </div>
        </div>
      </main>
    );
  }

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