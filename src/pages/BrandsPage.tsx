import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { mockBrands, getFeaturedBrands, getTrendingBrands, getTopRatedBrands, mockArticles, brandCategories, getBrandsByCategory } from '../data/mockData';
import { getAllBrands, AdminBrand } from '../db/brandsDb';
import { useCachedData } from '../hooks/useCachedData';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArticleGrid } from '../components/ArticleGrid';
import { Brand } from '../types';
import { categoryToSlug } from './BrandCategoryPage';

type FilterType = 'madeIn' | 'price' | 'categories' | 'all';

export function BrandsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState('brand-guides');
  const [filterType, setFilterType] = useState<FilterType>('madeIn');
  const [selectedFilters, setSelectedFilters] = useState<{
    madeIn: string;
    categories: string;
    price: string;
  }>({
    madeIn: 'USA', // По умолчанию активен USA
    categories: '',
    price: ''
  });
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const featuredBrands = getFeaturedBrands();
  const trendingBrands = getTrendingBrands();
  const topRatedBrands = getTopRatedBrands();

  // Filter brands based on current filter type and selections
  const getFilteredBrands = () => {
    if (filterType === 'all') {
      return mockBrands; // Показываем все бренды
    }

    return mockBrands.filter(brand => {
      const matchesSearch = !searchQuery || 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocalSearch = !localSearchQuery || 
        brand.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        brand.description?.toLowerCase().includes(localSearchQuery.toLowerCase());

      if (filterType === 'madeIn') {
        const matchesMadeIn = !selectedFilters.madeIn ||
          brand.madeIn?.includes(selectedFilters.madeIn);
        return matchesSearch && matchesLocalSearch && matchesMadeIn;
      }

      if (filterType === 'price') {
        const matchesPrice = !selectedFilters.price ||
          brand.priceRange?.includes(selectedFilters.price);
        return matchesSearch && matchesLocalSearch && matchesPrice;
      }

      if (filterType === 'categories') {
        const matchesCategories = !selectedFilters.categories ||
          (() => {
            // Проверяем через getBrandsByCategory для корректного сопоставления
            const categoryBrands = getBrandsByCategory(selectedFilters.categories);
            return categoryBrands.some(catBrand => catBrand.id === brand.id);
          })();
        return matchesSearch && matchesLocalSearch && matchesCategories;
      }

      return matchesSearch && matchesLocalSearch;
    });
  };

  const filteredBrands = getFilteredBrands();

  // Get brand-related articles
  const brandGuideArticles = mockArticles.filter(article => 
    article.category === 'Stories' && article.subtype === 'Brand Guide'
  );

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const toggleSection = (letter: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(letter)) {
        newSet.delete(letter);
      } else {
        newSet.add(letter);
      }
      return newSet;
    });
  };

  // Get current filter description for display
  const getCurrentFilterDescription = () => {
    if (filterType === 'madeIn' && selectedFilters.madeIn) {
      return `Made in ${selectedFilters.madeIn}`;
    }
    if (filterType === 'price' && selectedFilters.price) {
      return `Price: ${selectedFilters.price}`;
    }
    if (filterType === 'categories' && selectedFilters.categories) {
      return selectedFilters.categories;
    }
    if (filterType === 'all') {
      return 'All Brands';
    }
    return '100% Made in USA'; // По умолчанию
  };

  // Get dynamic link text and URL
  const getDynamicLinkData = () => {
    if (filterType === 'madeIn' && selectedFilters.madeIn) {
      // For Made in USA, use the specific category page
      if (selectedFilters.madeIn === 'USA') {
        return {
          text: `Ticket to all Made in ${selectedFilters.madeIn}`,
          url: `/brands/${categoryToSlug('100% Made in USA')}`
        };
      }
      return {
        text: `Ticket to all Made in ${selectedFilters.madeIn}`,
        url: '/brands' // Default fallback
      };
    }
    if (filterType === 'price' && selectedFilters.price) {
      return {
        text: `Ticket to all ${selectedFilters.price} brands`,
        url: '/brands' // Could be extended for price-based categories
      };
    }
    if (filterType === 'categories' && selectedFilters.categories) {
      return {
        text: `Ticket to all ${selectedFilters.categories} brands`,
        url: `/brands/${categoryToSlug(selectedFilters.categories)}`
      };
    }
    if (filterType === 'all') {
      return {
        text: 'Ticket to All Brands',
        url: '/brands'
      };
    }
    return {
      text: 'Ticket to all Made in USA brands',
      url: `/brands/${categoryToSlug('100% Made in USA')}`
    };
  };

  function NewBrandCard({ brand }: { brand: Brand }) {
    const [imageLoading, setImageLoading] = useState(true);
    const [logoLoading, setLogoLoading] = useState(true);
    
    // Calculate stars from either DB numericRating (1..5, halves allowed) or legacy mock rating
    let stars = 4;
    if (typeof brand.numericRating === 'number') {
      stars = Math.min(Math.max(Math.round(brand.numericRating), 1), 5);
    } else if (brand.rating) {
      const avgOutOf10 = (brand.rating.culturalImpact + brand.rating.collabPower + brand.rating.creativity + brand.rating.popularity + brand.rating.loyalty) / 5;
      stars = Math.min(Math.max(Math.round(avgOutOf10 / 2), 1), 5);
    }
    
    // Price level (convert price range to dollar signs)
    const getPriceLevel = (priceRange?: string[]) => {
      if (!priceRange || !priceRange[0]) return '$';
      return priceRange[0];
    };

    return (
      <Link to={`/brand/${brand.id}`} className="group">
        <div className="space-y-3">
          {/* Brand Image with Logo Overlay */}
          <div className="aspect-[4/3] relative overflow-hidden rounded-md bg-gray-100">
            {(() => {
              const imageSrc = brand.image || brand.heroImage;
              if (!imageSrc) {
                return (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="h-6 w-6 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
                  </div>
                );
              }
              return (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="h-6 w-6 border-2 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
                    </div>
                  )}
                  <ImageWithFallback
                    src={imageSrc}
                    alt={brand.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </>
              );
            })()}
            {/* Logo Circle Overlay */}
            <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
              {/* Loading indicator for logo */}
              {logoLoading && typeof brand.logo === 'string' && /^(https?:\/\/|data:|\/\/)/.test(brand.logo) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 border border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#FF00A8' }} />
                </div>
              )}
              {typeof brand.logo === 'string' && /^(https?:\/\/|data:|\/\/)/.test(brand.logo) ? (
                <ImageWithFallback
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className={`w-full h-full object-contain ${logoLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setLogoLoading(false)}
                  onError={() => setLogoLoading(false)}
                />
              ) : (
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {brand.logo}
                </span>
              )}
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
                  <Star key={i} className="w-3 h-3 fill-[#FF00A8] text-[#FF00A8]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Reset to default filter when filter type changes
  useEffect(() => {
    if (filterType === 'madeIn') {
      setSelectedFilters(prev => ({ ...prev, madeIn: 'USA', categories: '', price: '' }));
    } else if (filterType === 'price') {
      setSelectedFilters(prev => ({ ...prev, price: '', madeIn: '', categories: '' }));
    } else if (filterType === 'categories') {
      setSelectedFilters(prev => ({ ...prev, categories: '', madeIn: '', price: '' }));
    } else {
      setSelectedFilters({ madeIn: '', categories: '', price: '' });
    }
  }, [filterType]);

  // Migrate old cache keys to a stable key so refresh uses existing cache
  useEffect(() => {
    const stableKey = 'brands:list';
    try {
      const existing = sessionStorage.getItem(stableKey) || localStorage.getItem(stableKey);
      if (!existing) {
        const legacyKeys = ['brands:list:v3', 'brands:list:v2', 'brands:list:v1'];
        for (const k of legacyKeys) {
          const raw = sessionStorage.getItem(k) || localStorage.getItem(k);
          if (raw) {
            if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(stableKey, raw);
            if (typeof localStorage !== 'undefined') localStorage.setItem(stableKey, raw);
            break;
          }
        }
      }
    } catch {}
  }, []);

  // Load brands with localStorage cache and background refresh
  const fetchBrands = async (): Promise<Brand[]> => {
    const all: AdminBrand[] = await getAllBrands();
    const mapped = all.map((b) => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      image: b.image || b.logo,
      description: b.description,
      website: b.website,
      priceRange: b.priceRange,
      numericRating: typeof b.rating === 'number' ? b.rating : undefined,
    }));
    return mapped;
  };

  const storageKey = 'brands:list';
  const { data: dbBrands, isLoading, hasCache, isRefreshing } = useCachedData<Brand[]>(
    storageKey,
    fetchBrands,
    {
      maxAgeMs: 10 * 60 * 1000, // 10 minutes
      revalidateOnMount: true,
      // Compress data for storage - remove large images, keep only essential data
      serialize: (brands) => brands.map(b => ({
        id: b.id,
        name: b.name,
        logo: typeof b.logo === 'string' ? b.logo : '', // Keep only string logos
        image: '', // Remove images to save space
        description: b.description?.substring(0, 100) || '', // Truncate description
        website: b.website || '',
        priceRange: b.priceRange || [],
        numericRating: b.numericRating || 0,
      })),
      shouldAccept: (prev, next) => {
        const prevLen = Array.isArray(prev) ? prev.length : 0;
        const nextLen = Array.isArray(next) ? next.length : 0;
        // if we had data before and next is empty, keep previous
        if (prevLen > 0 && nextLen === 0) return false;
        return true;
      }
    }
  );


  // Render DB-backed brands only (placeholders removed)
  return (
    <div className="min-h-screen">
      <SEO 
        title="Brands"
        description="Discover the best sock brands from around the world"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
        <section className="mb-16 lg:mb-20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span> Brands
            </h1>
          </div>

          {dbBrands && dbBrands.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
              {dbBrands.map((brand) => (
                <div key={brand.id}>
                  <NewBrandCard brand={brand} />
                </div>
              ))}
            </div>
          ) : (
            isLoading && !hasCache ? (
              <div className="py-12 flex items-center justify-center">
                <LoadingIndicator message="Loading brands..." />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60">No brands yet. Add some in the Admin panel.</p>
              </div>
            )
          )}
        </section>

        {/* Spacer to ensure visible gap between grid and CTA */}
        <div className="h-12 lg:h-16" aria-hidden="true"></div>
        {/* UGC Submit (Call-to-action) */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-lg text-foreground/80" style={{ fontFamily: 'var(--font-body)' }}>
              Don't see your brand? Submit it here.
            </h3>
            <Button
              asChild
              className="bg-[#FF00A8] hover:bg-[#FF00A8]/90 text-white px-8 py-6 text-base"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Link to="/brand/submit">
                Submit Brand
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}