import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { mockBrands, getFeaturedBrands, getTrendingBrands, getTopRatedBrands, mockArticles, brandCategories, getBrandsByCategory } from '../data/mockData';
import { getAllBrands, AdminBrand } from '../db/brandsDb';
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
    // Calculate average rating for stars
    const avgRating = brand.rating ? 
      Math.round((brand.rating.culturalImpact + brand.rating.collabPower + brand.rating.creativity + brand.rating.popularity + brand.rating.loyalty) / 5) : 4;
    const stars = Math.min(Math.max(Math.round(avgRating / 2), 1), 5);
    
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
            <ImageWithFallback
              src={brand.image || brand.heroImage || ''}
              alt={brand.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Logo Circle Overlay */}
            <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md overflow-hidden">
              <ImageWithFallback
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-full h-full object-cover"
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

  // Load brands from admin DB and render them only (remove placeholders)
  const [dbBrands, setDbBrands] = useState<Brand[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const all: AdminBrand[] = await getAllBrands();
        const mapped: Brand[] = all.map((b) => ({
          id: b.id,
          name: b.name,
          logo: b.logo,
          image: b.image || b.logo,
          description: b.description,
          website: b.website,
        }));
        setDbBrands(mapped);
      } catch {
        setDbBrands([]);
      }
    })();
  }, []);

  // Render DB-backed brands only (placeholders removed)
  return (
    <div className="min-h-screen">
      <SEO 
        title="Brands"
        description="Discover the best sock brands from around the world"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              <span style={{ fontStyle: 'italic', color: '#FF00A8' }}>to</span> Brands
            </h1>
          </div>

          {dbBrands.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
              {dbBrands.map((brand) => (
                <NewBrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">No brands yet. Add some in the Admin panel.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}