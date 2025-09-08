import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { brandCategories, getBrandsByCategory } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Brand } from '../types';

function NewBrandCard({ brand }: { brand: Brand }) {
  // Calculate average rating for stars
  const avgRating = brand.rating ? 
    Math.round((brand.rating.culturalImpact + brand.rating.collabPower + brand.rating.creativity + brand.rating.popularity + brand.rating.loyalty) / 5) : 4;
  const stars = Math.min(Math.max(Math.round(avgRating / 2), 1), 5); // Convert to 1-5 stars
  
  // Price level (convert price range to dollar signs)
  const getPriceLevel = (priceRange?: string[]) => {
    if (!priceRange || !priceRange[0]) return '$';
    const price = priceRange[0].toLowerCase();
    if (price.includes('budget') || price.includes('$10-20')) return '$';
    if (price.includes('mid') || price.includes('$20-40')) return '$$';
    if (price.includes('premium') || price.includes('$40+')) return '$$$';
    return '$$';
  };

  return (
    <Link to={`/brand/${brand.id}`} className="group">
      <div className="space-y-3">
        {/* Brand Image with Logo Overlay */}
        <div className="aspect-[4/3] relative overflow-hidden rounded-md bg-gray-100">
          <ImageWithFallback
            src={brand.image || brand.heroImage || ''}
            alt={brand.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Logo Circle Overlay */}
          <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
        </div>
        
        {/* Brand Info */}
        <div className="space-y-2">
          <h3 className="text-sm lg:text-base leading-tight group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
            {brand.name}
          </h3>
          
          {/* Price and Stars */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
              {getPriceLevel(brand.priceRange)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: stars }, (_, i) => (
                <Star key={`${brand.id}-star-${i}`} className="w-3 h-3 fill-[#FF00A8] text-[#FF00A8]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to convert category name to URL slug
function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to convert URL slug back to category name
function slugToCategory(slug: string): string {
  // Find the category that matches this slug
  return brandCategories.find(cat => categoryToSlug(cat) === slug) || '';
}

// SEO content for different categories
const getCategoryContent = (category: string) => {
  const contents: Record<string, { title: string; description: string; seoText: string }> = {
    '100% Made in USA': {
      title: '100% Made in USA Sock Brands',
      description: 'Discover authentic American sock brands that design, source, and manufacture entirely in the USA. From heritage labels to innovative newcomers.',
      seoText: 'Looking for authentic sock brands made entirely in the USA? This selection features companies that design, source, and manufacture their socks domestically — ensuring top quality, local craftsmanship, and full transparency. Explore the best American sock makers, from heritage labels to innovative newcomers.'
    },
    'Luxury': {
      title: 'Luxury Sock Brands',
      description: 'Premium luxury sock brands offering the finest materials, craftsmanship, and design. Discover high-end socks from prestigious labels.',
      seoText: 'Indulge in the finest luxury sock brands that prioritize premium materials, exceptional craftsmanship, and sophisticated design. These prestigious labels offer unparalleled comfort and style, from cashmere blends to hand-finished details. Experience the pinnacle of sock luxury.'
    },
    'Eco-Friendly': {
      title: 'Eco-Friendly Sock Brands',
      description: 'Sustainable and environmentally conscious sock brands using organic materials and ethical manufacturing practices.',
      seoText: 'Discover eco-friendly sock brands committed to sustainability and environmental responsibility. These conscious companies use organic materials, recycled fibers, and ethical manufacturing practices to create comfortable socks with minimal environmental impact. Step into sustainable fashion.'
    },
    'Athletic Performance': {
      title: 'Athletic Performance Sock Brands',
      description: 'High-performance athletic sock brands designed for sports, running, and active lifestyles with advanced moisture-wicking technology.',
      seoText: 'Elevate your athletic performance with specialized sock brands engineered for sports and active lifestyles. These performance-focused companies combine advanced moisture-wicking technology, strategic cushioning, and ergonomic design to enhance comfort and support during intense activities.'
    },
    'Streetwear': {
      title: 'Streetwear Sock Brands',
      description: 'Bold and trendy streetwear sock brands with unique designs, collaborations, and urban-inspired aesthetics.',
      seoText: 'Express your urban style with cutting-edge streetwear sock brands that blend bold graphics, innovative collaborations, and contemporary design. These labels capture the essence of street culture, offering statement pieces that complete your urban wardrobe with distinctive flair.'
    }
  };

  return contents[category] || {
    title: `${category} Sock Brands`,
    description: `Discover the best ${category.toLowerCase()} sock brands with unique designs, quality materials, and exceptional craftsmanship.`,
    seoText: `Explore our curated collection of ${category.toLowerCase()} sock brands, featuring innovative designs, premium materials, and exceptional craftsmanship. Find the perfect socks that match your style and preferences from top brands in this category.`
  };
};

export function BrandCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [displayedBrands, setDisplayedBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Convert slug back to category name
  const category = slug ? slugToCategory(slug) : '';
  const allBrands = category ? getBrandsByCategory(category) : [];
  
  // If category doesn't exist, redirect to brands page
  if (!category || !brandCategories.includes(category)) {
    return <Navigate to="/brands" replace />;
  }
  
  const categoryContent = getCategoryContent(category);
  const itemsPerLoad = 24;

  useEffect(() => {
    // Reset and load initial brands when category changes
    const initialBrands = allBrands.slice(0, itemsPerLoad);
    setDisplayedBrands(initialBrands);
    setHasMore(allBrands.length > itemsPerLoad);
  }, [category]);

  const loadMoreBrands = () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedBrands.length;
      const nextBrands = allBrands.slice(currentLength, currentLength + itemsPerLoad);
      
      setDisplayedBrands(prev => [...prev, ...nextBrands]);
      setHasMore(currentLength + nextBrands.length < allBrands.length);
      setIsLoading(false);
    }, 500);
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreBrands();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, displayedBrands.length]);

  return (
    <>
      <SEO 
        title={categoryContent.title}
        description={categoryContent.description}
        keywords={`${category.toLowerCase()}, sock brands, socks, fashion, ${category.toLowerCase()} socks`}
      />
      
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-8 lg:mb-12">
            {/* Breadcrumb */}
            <div className="mb-4">
              <Link 
                to="/brands"
                className="inline-flex items-center gap-2 text-[#FF00A8] hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ticket </span>
                <span className="italic lowercase" style={{ color: '#FF00A8' }}>to</span>
                <span> all Sock Brands</span>
              </Link>
            </div>
            
            <h1 className="text-3xl lg:text-4xl mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
              {categoryContent.title}
            </h1>
            <p className="text-base lg:text-lg text-foreground/80 max-w-4xl" style={{ fontFamily: 'var(--font-body)' }}>
              {categoryContent.seoText}
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 mb-12">
            {displayedBrands.map((brand, index) => (
              <NewBrandCard key={`${brand.id}-${index}`} brand={brand} />
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-foreground/60">
                <div className="w-4 h-4 border-2 border-[#FF00A8] border-t-transparent rounded-full animate-spin"></div>
                Loading more brands...
              </div>
            </div>
          )}

          {/* No more brands message */}
          {!hasMore && displayedBrands.length > 0 && (
            <div className="text-center py-8">
            </div>
          )}

          {/* Back to Brands Button */}
          <div className="text-center border-t border-border pt-8">
            <Link to="/brands">
              <Button 
                variant="outline" 
                className="inline-flex items-center gap-2 hover:bg-[#FF00A8] hover:text-white transition-colors px-6 py-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all Brands
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

// Export helper function for use in other components
export { categoryToSlug };