import { useParams, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ReadingProgress } from '../components/ReadingProgress';
import { ArticleEngagement } from '../components/ArticleEngagement';
import { ArticleEngagementCompact } from '../components/ArticleEngagementCompact';
import { getArticleById as getMockArticleById, mockArticles, mockComments } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArticleGallery } from '../components/ArticleGallery';
import { ShareBlock } from '../components/ShareBlock';
import { ShareEngagementInline } from '../components/ShareEngagementInline';
import { RelatedArticles } from '../components/RelatedArticles';
import { AuthorBlock } from '../components/AuthorBlock';
import { BrandsBlock } from '../components/BrandsBlock';
import { CommentsSection } from '../components/CommentsSection';
import { ArticleGrid } from '../components/ArticleGrid';
import { useEngagement } from '../contexts/EngagementContext';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';
import { getArticleByIdAdmin, AdminArticle } from '../db/articlesDb';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/404" replace />;
  }

  // Try mock data first for legacy/static articles
  const mockArticle = getMockArticleById(id);
  const article = mockArticle;

  // Also try to resolve admin-created article from client DB
  const [adminArticle, setAdminArticle] = useState<AdminArticle | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const a = await getArticleByIdAdmin(id);
        if (!cancelled) setAdminArticle(a ?? null);
      } catch {
        if (!cancelled) setAdminArticle(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // If no mock article, check admin DB states
  if (!article) {
    // Loading state while checking admin DB
    if (adminArticle === undefined) {
      return null;
    }
    // Not found anywhere
    if (adminArticle === null) {
      return <Navigate to="/404" replace />;
    }

    // Render simplified view for admin-created article
    const a = adminArticle as AdminArticle;
    const formattedDate = (() => {
      try {
        const d = new Date(a.publishedAt);
        return isNaN(d.getTime()) ? a.publishedAt : d.toLocaleDateString();
      } catch {
        return a.publishedAt;
      }
    })();

    return (
      <>
        <ReadingProgress />
        <SEO 
          title={`${a.title} | Ticket to Socks`}
          description={a.excerpt}
          keywords={`${a.category.toLowerCase()}, socks, fashion`}
        />
        <main className="min-h-screen bg-background">
          <section className="min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[60vh]">
                <div className="lg:order-2 flex items-center">
                  <div className="w-full h-[60vh] lg:h-auto lg:aspect-[4/5] overflow-hidden rounded-none lg:rounded-md">
                    <ImageWithFallback src={a.image} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="lg:order-1 space-y-6 lg:space-y-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center text-foreground/60 hover:text-[#FF00A8] transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="uppercase" style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}>{a.category}</span>
                      <span className="text-foreground/50" style={{ fontFamily: 'var(--font-body)' }}>{formattedDate}</span>
                    </div>
                  </div>
                  <h1 className="text-3xl lg:text-5xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>{a.title}</h1>
                  {a.excerpt && (
                    <p className="text-xl lg:text-2xl text-foreground/70 leading-relaxed">{a.excerpt}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 lg:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {a.content ? (
                <div className="space-y-6 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    {a.content}
                  </p>
                </div>
              ) : (
                <p className="text-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
                  No additional content provided for this article.
                </p>
              )}
            </div>
          </section>
        </main>
      </>
    );
  }

  // Get related articles - mix from same category and other articles
  const sameCategory = mockArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 2);
  
  const otherArticles = mockArticles
    .filter(a => a.category !== article.category && a.id !== article.id)
    .slice(0, 3);
  
  const relatedArticles = [...sameCategory, ...otherArticles].slice(0, 5);

  // Get similar articles for the bottom section
  const similarArticles = mockArticles
    .filter(a => a.id !== article.id)
    .slice(0, 8);

  // Sample gallery images
  const galleryImages = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=800&h=600&fit=crop'
  ];

  const galleryCaptions = [
    'Premium athletic socks featuring moisture-wicking technology',
    'Sustainable bamboo fiber construction in various colorways',
    'Compression zones designed for enhanced performance',
    'Limited edition collaboration patterns'
  ];

  // Sample grid images
  const gridImages = [
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  ];

  return (
    <>
      <ReadingProgress />
      <SEO 
        title={`${article.title} | Ticket to Socks`}
        description={article.excerpt}
        keywords={`${article.category.toLowerCase()}, sock news, ${article.title.toLowerCase()}, socks, fashion`}
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh] lg:min-h-[70vh]">
              {/* Mobile: Image first */}
              <div className="lg:order-2 flex items-center">
                <div className="w-full h-screen lg:h-auto lg:aspect-[4/5] overflow-hidden rounded-none lg:rounded-md">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Desktop: Content left, Mobile: Content below image */}
              <div className="lg:order-1 space-y-6 lg:space-y-8 flex flex-col justify-center">
              {/* Back navigation + Meta */}
              <div className="flex items-center gap-4">
                <Link 
                  to="/"
                  className="flex items-center text-foreground/60 hover:text-[#FF00A8] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 text-sm">
                  <span 
                    className="category-label uppercase"
                    style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}
                  >
                    {article.category}
                  </span>
                  <span className="date-text text-foreground/50" style={{ fontFamily: 'var(--font-body)' }}>
                    {article.date}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl xl:text-6xl leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                {article.title}
              </h1>

              {/* Lead */}
              <p className="text-xl lg:text-2xl text-foreground/70 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author */}
              {article.author && (
                <AuthorBlock author={article.author} variant="compact" />
              )}

              {/* Engagement Actions */}
              <ArticleEngagementCompact 
                articleId={article.id}
                title={article.title}
                category={article.category}
              />
            </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Article Text */}
              <div className="max-w-3xl space-y-6">
                {article.content ? (
                  article.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg leading-relaxed text-foreground/80">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-lg leading-relaxed text-foreground/80">
                      This article explores the fascinating world of luxury athletic socks, where performance meets fashion in ways that were unimaginable just a decade ago. The convergence of technical innovation and streetwear culture has created a new category of premium products that command both respect and premium prices.
                    </p>
                    
                    <p className="text-lg leading-relaxed text-foreground/80">
                      From moisture-wicking synthetic blends to merino wool composites, the materials science behind modern sock construction represents some of the most advanced textile engineering available today. Brands are investing millions in R&D to develop proprietary fibers and construction techniques.
                    </p>
                  </>
                )}

                {/* Single Image with Caption */}
                <div className="space-y-3">
                  <div className="aspect-[16/9] overflow-hidden rounded-md">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop"
                      alt="Luxury sock construction details"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-foreground/60 text-center lg:text-left">
                    Close-up view of precision knitting techniques used in premium athletic socks
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground/80">
                  The cultural impact extends beyond just functionality. Social media has transformed socks into a form of personal expression, with enthusiasts sharing their latest acquisitions and creating communities around specific brands and collaborations.
                </p>

                {/* Gallery Component */}
                <ArticleGallery 
                  images={galleryImages}
                  captions={galleryCaptions}
                />

                <p className="text-lg leading-relaxed text-foreground/80">
                  Sustainability has become a key differentiator in the premium segment. Consumers are increasingly conscious of environmental impact, driving brands to explore organic materials, recycled fibers, and responsible manufacturing processes.
                </p>

                {/* Full-bleed Image */}
                <div className="-mx-4 sm:-mx-6 lg:-mx-12 xl:-mx-32">
                  <div className="aspect-[21/9] overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&h=600&fit=crop"
                      alt="Manufacturing facility showcasing sustainable practices"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-foreground/60 text-center mt-3 mx-4 sm:mx-6 lg:mx-12 xl:mx-32">
                    State-of-the-art manufacturing facility implementing zero-waste production methods
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground/80">
                  Looking ahead, the integration of smart textiles and wearable technology promises to push the boundaries even further. Early prototypes featuring embedded sensors for performance monitoring hint at a future where socks become integral components of personal health and fitness ecosystems.
                </p>

                {/* 2x2 Grid */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {gridImages.map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-md">
                        <ImageWithFallback
                          src={image}
                          alt={`Grid image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-foreground/60 text-center lg:text-left">
                    Various colorways and patterns from the latest premium collections
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground/80">
                  The luxury athletic sock market represents more than just a fashion trend—it's a testament to how innovation, culture, and consumer consciousness can converge to create entirely new product categories. As the industry continues to evolve, we can expect even more surprising developments at the intersection of performance and style.
                </p>
              </div>

              {/* Share & Engagement Inline */}
              <ShareEngagementInline 
                url={window.location.href} 
                title={article.title}
                articleId={article.id}
                category={article.category}
              />

              {/* Article Engagement (only views and reading time) */}
              <ArticleEngagement 
                articleId={article.id}
                title={article.title}
                category={article.category}
                variant="full"
                className="my-8"
                showLikes={false}
                showBookmark={false}
              />

              {/* Author Block */}
              {article.author && (
                <AuthorBlock author={article.author} />
              )}

              {/* Brands Block */}
              {article.brands && article.brands.length > 0 && (
                <BrandsBlock brands={article.brands} />
              )}

              {/* Comments Section */}
              <CommentsSection comments={mockComments} />
            </div>

            {/* Related Articles - Desktop only, sticky */}
            <RelatedArticles articles={relatedArticles} />
          </div>


        </section>

        {/* Similar Articles */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-8">
            <h2 className="text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              More Articles
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {similarArticles.map((similarArticle) => (
                <Link key={similarArticle.id} to={`/article/${similarArticle.id}`} className="group">
                  <div className="space-y-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-md">
                      <ImageWithFallback
                        src={similarArticle.image}
                        alt={similarArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="category-label uppercase" style={{ color: '#FF00A8' }}>
                          {similarArticle.category}
                        </span>
                        <span className="date-text text-foreground/50">{similarArticle.date}</span>
                      </div>
                      <h3 className="text-sm lg:text-base leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                        {similarArticle.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Read More Button */}
            <div className="text-center">
              <Link
                to="/"
                className="bg-transparent text-[#FF00A8] border-2 border-[#FF00A8] px-6 py-2 hover:bg-[#FF00A8] hover:text-white transition-all duration-300 inline-block"
                style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
              >
                Read more
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}