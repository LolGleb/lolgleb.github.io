import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getBrandById, getSimilarBrands, getBrandArticles } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArticleGrid } from '../components/ArticleGrid';
import { FavoriteButton } from '../components/FavoriteButton';
import { InteractiveStarRating } from '../components/InteractiveStarRating';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { AdminBrand, getBrandByIdAdmin } from '../db/brandsDb';
import { getBrandAverages } from '../db/brandRatingsDb';
import { getArticlesByBrandId, AdminArticle } from '../db/articlesDb';
import { Article } from '../types';

export function BrandPage() {
  const { id } = useParams<{ id: string }>();
  const { getUserBrandRating } = useAuth();
  
  if (!id) {
    return <div>Brand not found</div>;
  }

  // Per-category average ratings aggregated from Supabase
  const [avgRatings, setAvgRatings] = useState<{
    culturalImpact: number;
    collabPower: number;
    creativity: number;
    popularity: number;
    loyalty: number;
    drops: number;
  } | undefined>(undefined);
  const [, setAvgLoading] = useState<boolean>(true);
  const [, setAvgError] = useState<boolean>(false);

  // Admin-linked articles for this brand (DB)
  const [adminBrandArticles, setAdminBrandArticles] = useState<Article[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        const items: AdminArticle[] = await getArticlesByBrandId(id);
        if (cancelled) return;
        const toArticle = (a: AdminArticle): Article => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || '',
          category: a.category,
          image: a.image,
          date: new Date(a.publishedAt).toISOString(),
          readTime: a.readTime,
          featured: a.featured,
          content: a.content,
        });
        setAdminBrandArticles(items.map(toArticle));
      } catch (e) {
        try { console.warn('[BrandPage] failed to load admin articles for brand', id, e); } catch {}
        if (!cancelled) setAdminBrandArticles([]);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setAvgLoading(true);
    setAvgError(false);
    (async () => {
      if (!id) return;
      try {
        const avg = await getBrandAverages(id);
        if (!cancelled) {
          setAvgRatings(avg);
          setAvgError(false);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[BrandPage] failed to fetch brand averages', e);
        if (!cancelled) {
          setAvgRatings(undefined);
          setAvgError(true);
        }
      } finally {
        if (!cancelled) setAvgLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const refreshAverages = async () => {
    if (!id) return;
    setAvgLoading(true);
    setAvgError(false);
    try {
      const avg = await getBrandAverages(id);
      setAvgRatings(avg);
      setAvgError(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[BrandPage] refreshAverages error', e);
      setAvgError(true);
    } finally {
      setAvgLoading(false);
    }
  };

  // Try legacy/mock brand first
  const brand = getBrandById(id);

  // Also try to resolve admin-created brand from client DB
  const [dbBrand, setDbBrand] = useState<AdminBrand | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const b = await getBrandByIdAdmin(id);
        if (!cancelled) setDbBrand(b ?? null);
      } catch {
        if (!cancelled) setDbBrand(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!brand) {
    // Loading admin brand lookup
    if (dbBrand === undefined) {
      return null;
    }
    // Not found anywhere
    if (dbBrand === null) {
      return <div>Brand not found</div>;
    }

    // Render view for admin-created brand with full meta
    const b = dbBrand as AdminBrand;
    const cover = b.image || b.logo;
    const price = Array.isArray(b.priceRange) && b.priceRange.length ? b.priceRange[0] : undefined;
    const madeIn = Array.isArray(b.madeIn) ? b.madeIn : undefined;
    const stars = typeof b.rating === 'number' ? Math.min(Math.max(Math.round(b.rating), 1), 5) : undefined;
    const userRating = getUserBrandRating(id);
    const baseAvg = typeof b.rating === 'number' ? Math.min(Math.max(Math.round(b.rating), 1), 5) : 3;


    return (
      <>
        <SEO 
          title={`${b.name} — Brand Profile | Ticket to Socks`}
          description={b.description}
          keywords={`${b.name}, sock brand`}
        />
        <main className="min-h-screen bg-background">
          {/* Hero Image - Full Screen on Mobile */}
          <div className="w-full h-screen lg:hidden">
            <ImageWithFallback
              src={cover}
              alt={b.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Desktop Hero Section */}
          <div className="hidden lg:flex lg:min-h-screen">
            {/* Left side - Brand info */}
            <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12">
              {/* Back navigation & Breadcrumbs */}
              <div className="mb-6">
                <Breadcrumb className="mb-4">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/brands">Brands</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{b.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="text-foreground/60 hover:text-[#FF00A8] px-0"
                >
                  <Link to="/brands">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to brands
                  </Link>
                </Button>
              </div>

              {/* Brand header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center overflow-hidden">
                  {typeof b.logo === 'string' && /^(https?:\/\/|data:|\/\/)/.test(b.logo) ? (
                    <ImageWithFallback src={b.logo} alt={`${b.name} logo`} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-body)' }}>{String(b.logo)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                      {b.name}
                    </h1>
                    <div className="flex">
                      {Array.from({ length: stars || 0 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (stars || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <FavoriteButton 
                      item={{
                        id: b.id,
                        title: b.name,
                        type: 'brand',
                        image: cover || '',
                        description: b.description || ''
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand intro */}
              {b.description && (
                <div className="mb-6">
                  <h3 className="text-base mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {b.name} Description
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              )}

              {/* Brand details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-2">
                    <span className="text-foreground/60 uppercase tracking-wide">FOUNDED</span>
                    <div className="mt-1">{b.founded}</div>
                  </div>
                  <div className="mb-2">
                    <span className="text-foreground/60 uppercase tracking-wide">MADE IN</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {madeIn?.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-foreground/60 uppercase tracking-wide">HEADQUARTERS</span>
                    <div className="mt-1">{b.headquarters}</div>
                  </div>
                  <div className="mb-2">
                    <span className="text-foreground/60 uppercase tracking-wide">PRICE</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Array.isArray(b.priceRange) && b.priceRange.map((price) => (
                        <Badge key={price} variant="outline" className="text-xs">
                          {price}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Hero image on Desktop */}
            <div className="lg:w-1/2">
              <div className="h-screen overflow-hidden">
                <ImageWithFallback
                  src={cover}
                  alt={b.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="lg:hidden px-4 py-6">
            {/* Back navigation & Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/brands">Brands</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{b.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <Button 
                variant="ghost" 
                size="sm"
                asChild
                className="text-foreground/60 hover:text-[#FF00A8] px-0"
              >
                <Link to="/brands">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to brands
                </Link>
              </Button>
            </div>

            {/* Brand header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center overflow-hidden">
                {typeof b.logo === 'string' && /^(https?:\/\/|data:|\/\/)/.test(b.logo) ? (
                  <ImageWithFallback src={b.logo} alt={`${b.name} logo`} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-body)' }}>{String(b.logo)}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {b.name}
                  </h1>
                  <div className="flex">
                    {Array.from({ length: stars || 0 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < (stars || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <FavoriteButton 
                    item={{
                      id: b.id,
                      title: b.name,
                      type: 'brand',
                      image: cover || '',
                      description: b.description || ''
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Brand intro */}
            <p className="text-foreground/80 mb-6 leading-relaxed">
              {(b as any).about || b.description}
            </p>

            {/* Brand details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">FOUNDED</span>
                  <div className="mt-1">{b.founded}</div>
                </div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">MADE IN</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {madeIn?.map((country) => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">HEADQUARTERS</span>
                  <div className="mt-1">{b.headquarters}</div>
                </div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">PRICE</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {Array.isArray(b.priceRange) && b.priceRange.map((price) => (
                      <Badge key={price} variant="outline" className="text-xs">
                        {price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* About & Tags Section */}
            <div className="lg:flex lg:gap-12 mb-12">
              <div className="lg:w-2/3">
                <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  About {b.name}
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  {(b as any).about || b.description}
                </p>
              </div>
              
              {/* Tags */}
              <div className="lg:w-1/3 mt-6 lg:mt-0">
                <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(b.tags) ? b.tags : []).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Section (Admin brand) */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Rate {b.name}
                </h2>
                <div className="text-sm text-foreground/60">
                  Click stars to rate • Average rating on the right
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Cultural Impact</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="culturalImpact"
                      currentRating={avgRatings?.culturalImpact ?? (userRating?.ratings.culturalImpact || 0)}
                      userRating={userRating?.ratings.culturalImpact || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Collab Power</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="collabPower"
                      currentRating={avgRatings?.collabPower ?? (userRating?.ratings.collabPower || 0)}
                      userRating={userRating?.ratings.collabPower || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Creativity</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="creativity"
                      currentRating={avgRatings?.creativity ?? (userRating?.ratings.creativity || 0)}
                      userRating={userRating?.ratings.creativity || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Popularity</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="popularity"
                      currentRating={avgRatings?.popularity ?? (userRating?.ratings.popularity || 0)}
                      userRating={userRating?.ratings.popularity || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Loyalty & Rewards</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="loyalty"
                      currentRating={avgRatings?.loyalty ?? (userRating?.ratings.loyalty || 0)}
                      userRating={userRating?.ratings.loyalty || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Drops & Sales</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="drops"
                      currentRating={avgRatings?.drops ?? (userRating?.ratings.drops || 0)}
                      userRating={userRating?.ratings.drops || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Website Link */}
            {b.website && (
              <div className="mb-12">
                <a
                  href={b.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF00A8] hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{b.website}</span>
                </a>
              </div>
            )}


            {/* Articles featuring this brand (Admin) */}
            {adminBrandArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Articles featuring {b.name}
                </h2>
                <ArticleGrid articles={adminBrandArticles} />
                <div className="text-center mt-8">
                  <Link
                    to="/news"
                    className="text-[#FF00A8] hover:opacity-80 transition-opacity"
                  >
                    Ticket <em style={{ color: '#FF00A8' }}>to</em> all Articles
                  </Link>
                </div>
              </div>
            )}

            {/* Contact Links */}
            {Array.isArray(b.contacts) && b.contacts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Contact {b.name}
                </h2>
                <div className="space-y-2">
                  {b.contacts.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#FF00A8] hover:opacity-80 transition-opacity"
                    >
                      {contact.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  const similarBrands = getSimilarBrands(id);
  const brandArticles = getBrandArticles(brand.name);
  const userRating = getUserBrandRating(id);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <>
      <SEO 
        title={`${brand.name} — Brand Profile | Ticket to Socks`}
        description={brand.about || brand.description}
        keywords={`${brand.name}, sock brand, ${brand.tags?.join(', ')}`}
      />
      
      <main className="min-h-screen bg-background">
        {/* Hero Image - Full Screen on Mobile */}
        <div className="w-full h-screen lg:hidden">
          <ImageWithFallback
            src={brand.heroImage || brand.image || ''}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Desktop Hero Section */}
        <div className="hidden lg:flex lg:min-h-screen">
          {/* Left side - Brand info */}
          <div className="lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12">
            {/* Back navigation & Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/brands">Brands</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{brand.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <Button 
                variant="ghost" 
                size="sm"
                asChild
                className="text-foreground/60 hover:text-[#FF00A8] px-0"
              >
                <Link to="/brands">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to brands
                </Link>
              </Button>
            </div>

            {/* Brand header */}
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center text-lg"
                style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
              >
                {brand.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {brand.name}
                  </h1>
                  <div className="flex">
                    {brand.rating && renderStars(Math.round((brand.rating.culturalImpact + brand.rating.popularity) / 2))}
                  </div>
                  <FavoriteButton 
                    item={{
                      id: brand.id,
                      title: brand.name,
                      type: 'brand',
                      image: brand.image || brand.heroImage || '',
                      description: brand.description
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Brand intro */}
            <div className="mb-6">
              <h3 className="text-base mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                {brand.name} Description
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {brand.description || `${brand.name} is a leading sock brand known for innovative designs and quality craftsmanship.`}
              </p>
            </div>

            {/* Brand details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">FOUNDED</span>
                  <div className="mt-1">{brand.founded}</div>
                </div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">MADE IN</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {brand.madeIn?.map((country) => (
                      <Badge key={country} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">HEADQUARTERS</span>
                  <div className="mt-1">{brand.headquarters}</div>
                </div>
                <div className="mb-2">
                  <span className="text-foreground/60 uppercase tracking-wide">PRICE</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {brand.priceRange?.map((price) => (
                      <Badge key={price} variant="outline" className="text-xs">
                        {price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Hero image on Desktop */}
          <div className="lg:w-1/2">
            <div className="h-screen overflow-hidden">
              <ImageWithFallback
                src={brand.heroImage || brand.image || ''}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden px-4 py-6">
          {/* Back navigation & Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/brands">Brands</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{brand.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-foreground/60 hover:text-[#FF00A8] px-0"
            >
              <Link to="/brands">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to brands
              </Link>
            </Button>
          </div>

          {/* Brand header */}
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center text-lg"
              style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
            >
              {brand.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {brand.name}
                </h1>
                <div className="flex">
                  {brand.rating && renderStars(Math.round((brand.rating.culturalImpact + brand.rating.popularity) / 2))}
                </div>
                <FavoriteButton 
                  item={{
                    id: brand.id,
                    title: brand.name,
                    type: 'brand',
                    image: brand.image || brand.heroImage || '',
                    description: brand.description
                  }}
                />
              </div>
            </div>
          </div>

          {/* Brand intro */}
          <p className="text-foreground/80 mb-6 leading-relaxed">
            {brand.about || brand.description}
          </p>

          {/* Brand details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-2">
                <span className="text-foreground/60 uppercase tracking-wide">FOUNDED</span>
                <div className="mt-1">{brand.founded}</div>
              </div>
              <div className="mb-2">
                <span className="text-foreground/60 uppercase tracking-wide">MADE IN</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {brand.madeIn?.map((country) => (
                    <Badge key={country} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-foreground/60 uppercase tracking-wide">HEADQUARTERS</span>
                <div className="mt-1">{brand.headquarters}</div>
              </div>
              <div className="mb-2">
                <span className="text-foreground/60 uppercase tracking-wide">PRICE</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {brand.priceRange?.map((price) => (
                    <Badge key={price} variant="outline" className="text-xs">
                      {price}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* About & Tags Section */}
          <div className="lg:flex lg:gap-12 mb-12">
            <div className="lg:w-2/3">
              <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                About {brand.name}
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                {brand.about || `${brand.name} is a leading sock brand known for innovative designs and quality craftsmanship. Founded with a mission to transform everyday essentials into expressions of personal style and creativity.\n\nThe brand represents a revolutionary approach to sock design, merging cutting-edge textile technology with bold artistic vision to create products that transcend traditional boundaries between functionality and fashion. Founded by a team of passionate designers and engineers who believed that socks could be more than just foot coverings, the brand has consistently pushed the envelope in terms of material innovation, construction techniques, and aesthetic expression.

The brand's commitment to excellence begins with their careful selection of premium materials sourced from the world's finest textile mills. Each sock is crafted using proprietary yarn blends that incorporate advanced moisture-wicking fibers, antimicrobial treatments, and targeted cushioning zones strategically placed to enhance comfort during extended wear. The construction process involves seamless toe closures, reinforced heel and toe areas, and compression zones that provide support without restricting natural movement.

What truly sets ${brand.name} apart is their dedication to sustainable manufacturing practices. The company has invested heavily in developing eco-friendly production methods, utilizing recycled materials wherever possible, and maintaining strict environmental standards throughout their supply chain. Their packaging is made from 100% recyclable materials, and they offer a sock recycling program that gives new life to worn-out pairs.

The design philosophy centers around the belief that socks are the foundation of any great outfit – often the first thing you put on and the last thing you take off. This attention to detail is evident in every aspect of their products, from the carefully curated color palettes that complement contemporary fashion trends to the subtle branding elements that add sophistication without overwhelming the overall aesthetic.

Collaboration has been a cornerstone of the brand's growth strategy, with partnerships spanning high-fashion designers, streetwear icons, and performance athletes. These collaborations have resulted in limited-edition collections that often sell out within hours of release, cementing the brand's position as a cultural tastemaker in the fashion industry.

The brand continues to innovate with smart textile integration, exploring possibilities for temperature regulation, biometric monitoring, and even smartphone connectivity, positioning themselves at the forefront of wearable technology while never losing sight of their core commitment to comfort, style, and quality craftsmanship.`}
              </p>
            </div>
            
            {/* Tags */}
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-headlines)' }}>
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {brand.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          {brand.rating && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Rate {brand.name}
                </h2>
                <div className="text-sm text-foreground/60">
                  Click stars to rate • Average ratings shown in gray
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Cultural Impact</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="culturalImpact"
                      currentRating={avgRatings?.culturalImpact ?? (userRating?.ratings.culturalImpact || brand.rating.culturalImpact)}
                      userRating={userRating?.ratings.culturalImpact || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Collab Power</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="collabPower"
                      currentRating={avgRatings?.collabPower ?? (userRating?.ratings.collabPower || brand.rating.collabPower)}
                      userRating={userRating?.ratings.collabPower || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Creativity</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="creativity"
                      currentRating={avgRatings?.creativity ?? (userRating?.ratings.creativity || brand.rating.creativity)}
                      userRating={userRating?.ratings.creativity || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Popularity</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="popularity"
                      currentRating={avgRatings?.popularity ?? (userRating?.ratings.popularity || brand.rating.popularity)}
                      userRating={userRating?.ratings.popularity || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Loyalty & Rewards</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="loyalty"
                      currentRating={avgRatings?.loyalty ?? (userRating?.ratings.loyalty || brand.rating.loyalty)}
                      userRating={userRating?.ratings.loyalty || 0}
                      onRate={refreshAverages}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Drops & Sales</span>
                    <InteractiveStarRating
                      brandId={id}
                      category="drops"
                      currentRating={brand.rating.drops}
                      userRating={userRating?.ratings.drops || 0}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Website Link */}
          <div className="mb-12">
            <a 
              href={brand.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#FF00A8] hover:opacity-80 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{brand.website}</span>
            </a>
          </div>

          {/* Promo Block */}
          {brand.promoLinks && brand.promoLinks.length > 0 && (
            <div className="mb-12 relative overflow-hidden rounded-lg min-h-[300px] lg:min-h-[400px]">
              {/* Background Image */}
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651336492616-4eebfdd995d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcmV0YWlsJTIwcHJvbW90aW9ufGVufDF8fHx8MTc1NzE5MzA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Promotion background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-8 min-h-[300px] lg:min-h-[400px]">
                <h2 className="text-2xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Shop {brand.name} Collection
                </h2>
                <p className="text-lg lg:text-xl mb-8 max-w-2xl opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
                  Discover the latest drops and exclusive offers from {brand.name}. Don't miss out on limited-time deals.
                </p>
                
                {/* Promo Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {brand.promoLinks.map((link, index) => (
                    <Button 
                      key={index}
                      asChild
                      size="lg"
                      className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white shadow-lg border-2 border-transparent hover:border-white/20 transition-all"
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Articles featuring this brand */}
          {brandArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                Articles featuring {brand.name}
              </h2>
              <ArticleGrid articles={brandArticles} />
              <div className="text-center mt-8">
                <Link 
                  to="/news" 
                  className="text-[#FF00A8] hover:opacity-80 transition-opacity"
                >
                  Ticket <em style={{ color: '#FF00A8' }}>to</em> all Articles
                </Link>
              </div>
            </div>
          )}

          {/* Contact Links */}
          {brand.contacts && brand.contacts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                Contact {brand.name}
              </h2>
              <div className="space-y-2">
                {brand.contacts.map((contact, index) => (
                  <a 
                    key={index}
                    href={contact.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-[#FF00A8] hover:opacity-80 transition-opacity"
                  >
                    {contact.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Where to Buy */}
          {brand.whereToBuy && Object.keys(brand.whereToBuy).length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
                Buy {brand.name} at:
              </h2>
              <div className="space-y-2">
                {Object.entries(brand.whereToBuy).map(([platform, url]) => {
                  if (!url) return null;
                  
                  // Get platform label from WHERE_TO_BUY_PLATFORMS or use platform key
                  const platformLabels = {
                    'official': 'official website',
                    'amazon': 'Amazon',
                    'walmart': 'Walmart',
                    'target': 'Target',
                    'macys': 'Macy\'s',
                    'asos': 'ASOS',
                    'nordstrom': 'Nordstrom',
                    'zappos': 'Zappos',
                    'footlocker': 'Foot Locker',
                    'other': 'other store'
                  };
                  
                  const label = platformLabels[platform] || platform;
                  
                  return (
                    <a 
                      key={platform}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-[#FF00A8] hover:opacity-80 transition-opacity"
                    >
                      Buy {brand.name} on {label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Work for Brand */}
          <div className="mb-12">
            <details className="group">
              <summary className="cursor-pointer text-xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                Work for {brand.name}?
              </summary>
              <div className="mt-4 p-6 bg-accent/20 rounded-lg">
                <p className="text-foreground/80 mb-4">
                  Claim your {brand.name} brand page to keep info up to date, add links, and showcase your latest drops.
                </p>
                <Button asChild className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white">
                  <Link to="/brand/submit">
                    Claim {brand.name}
                  </Link>
                </Button>
              </div>
            </details>
          </div>

          {/* Similar Brands */}
          <div>
            <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
              Brands Similar to {brand.name}
            </h2>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {similarBrands.map((similarBrand) => {
                // Calculate average rating for stars
                const avgRating = similarBrand.rating ? 
                  Math.round((similarBrand.rating.culturalImpact + similarBrand.rating.collabPower + similarBrand.rating.creativity + similarBrand.rating.popularity + similarBrand.rating.loyalty) / 5) : 4;
                const stars = Math.min(Math.max(Math.round(avgRating / 2), 1), 5); // Convert to 1-5 stars
                
                // Price level (convert price range to dollar signs)
                const getPriceLevel = (priceRange) => {
                  if (!priceRange || !priceRange[0]) return '$';
                  const price = priceRange[0].toLowerCase();
                  if (price.includes('budget') || price.includes('$10-20')) return '$';
                  if (price.includes('mid') || price.includes('$20-40')) return '$$';
                  if (price.includes('premium') || price.includes('$40+')) return '$$$';
                  return '$$';
                };

                return (
                  <Link key={similarBrand.id} to={`/brand/${similarBrand.id}`} className="group">
                    <div className="space-y-3">
                      {/* Brand Image with Logo Overlay */}
                      <div className="aspect-[4/3] relative overflow-hidden rounded-md bg-gray-100">
                        <ImageWithFallback
                          src={similarBrand.image || similarBrand.heroImage || ''}
                          alt={similarBrand.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Logo Circle Overlay */}
                        <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                          <ImageWithFallback
                            src={similarBrand.logo}
                            alt={`${similarBrand.name} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Brand Info */}
                      <div className="space-y-2">
                        <h3 className="text-sm lg:text-base leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
                          {similarBrand.name}
                        </h3>
                        
                        {/* Price and Stars */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
                            {getPriceLevel(similarBrand.priceRange)}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: stars }, (_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#FF00A8] text-[#FF00A8]" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}