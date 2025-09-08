import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockBrands, brandCategories, getBrandsByCategory } from '../data/mockData';
import { Brand } from '../types';
import { categoryToSlug } from '../pages/BrandCategoryPage';

type FilterType = 'madeIn' | 'price' | 'categories' | 'all';

interface BrandsSectionProps {
  defaultFilter?: FilterType;
  defaultSelection?: string;
  maxBrands?: number;
  showAllFilters?: boolean;
  title?: string;
  className?: string;
}

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
          <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
            <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>
              {brand.logo}
            </span>
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

export function BrandsSection({ 
  defaultFilter = 'madeIn',
  defaultSelection = 'USA',
  maxBrands = 12,
  showAllFilters = false,
  title = 'SOCK BRANDS',
  className = ''
}: BrandsSectionProps) {
  const [filterType, setFilterType] = useState<FilterType>(defaultFilter);
  const [selectedFilters, setSelectedFilters] = useState<{
    madeIn: string;
    categories: string;
    price: string;
  }>({
    madeIn: defaultFilter === 'madeIn' ? defaultSelection : '',
    categories: defaultFilter === 'categories' ? defaultSelection : '',
    price: defaultFilter === 'price' ? defaultSelection : ''
  });

  // Filter brands based on current filter type and selections
  const getFilteredBrands = () => {
    if (filterType === 'all') {
      return mockBrands;
    }

    return mockBrands.filter(brand => {
      if (filterType === 'madeIn') {
        const matchesMadeIn = !selectedFilters.madeIn ||
          brand.madeIn?.includes(selectedFilters.madeIn);
        return matchesMadeIn;
      }

      if (filterType === 'price') {
        const matchesPrice = !selectedFilters.price ||
          brand.priceRange?.includes(selectedFilters.price);
        return matchesPrice;
      }

      if (filterType === 'categories') {
        const matchesCategories = !selectedFilters.categories ||
          (() => {
            const categoryBrands = getBrandsByCategory(selectedFilters.categories);
            return categoryBrands.some(catBrand => catBrand.id === brand.id);
          })();
        return matchesCategories;
      }

      return true;
    });
  };

  const filteredBrands = getFilteredBrands();

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
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
    return '100% Made in USA';
  };

  // Get dynamic link text and URL
  const getDynamicLinkData = () => {
    if (filterType === 'madeIn' && selectedFilters.madeIn) {
      if (selectedFilters.madeIn === 'USA') {
        return {
          text: `Ticket to all Made in ${selectedFilters.madeIn}`,
          url: `/brands/${categoryToSlug('100% Made in USA')}`
        };
      }
      return {
        text: `Ticket to all Made in ${selectedFilters.madeIn}`,
        url: '/brands'
      };
    }
    if (filterType === 'price' && selectedFilters.price) {
      return {
        text: `Ticket to all ${selectedFilters.price} brands`,
        url: '/brands'
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

  return (
    <section className={`py-8 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with current filter */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <h2 className="text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-headlines)' }}>
            {title} <span style={{ color: '#FF00A8', fontStyle: 'italic' }}>to</span>
          </h2>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-[#FF00A8]" />
            <span className="text-base font-medium" style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}>
              {getCurrentFilterDescription()}
            </span>
          </div>
        </div>

        {/* Filter Type Tabs - only show if showAllFilters is true */}
        {showAllFilters && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'madeIn', label: 'Made in' },
                { key: 'price', label: 'Price' },
                { key: 'categories', label: 'All categories' },
                { key: 'all', label: 'ALL' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filterType === tab.key ? 'default' : 'outline'}
                  onClick={() => setFilterType(tab.key as FilterType)}
                  className={`transition-colors ${
                    filterType === tab.key 
                      ? 'bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90' 
                      : 'hover:bg-[#FF00A8] hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: filterType === tab.key ? '#FF00A8' : undefined,
                    fontFamily: 'var(--font-body)' 
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tags based on selected filter type */}
        <div className="mb-8">
          {filterType === 'madeIn' && (
            <div className="flex flex-wrap gap-2">
              {['USA', 'Italy', 'Germany', 'Turkey', 'Vietnam', 'China'].map((country) => {
                const matchingBrands = mockBrands.filter(brand => brand.madeIn.includes(country));
                if (matchingBrands.length === 0) return null;
                return (
                  <Badge
                    key={country}
                    variant={selectedFilters.madeIn === country ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-[#FF00A8] hover:text-white transition-colors"
                    onClick={() => toggleFilter('madeIn', country)}
                    style={{ backgroundColor: selectedFilters.madeIn === country ? '#FF00A8' : undefined }}
                  >
                    {country} ({matchingBrands.length})
                  </Badge>
                );
              })}
            </div>
          )}

          {filterType === 'price' && (
            <div className="flex flex-wrap gap-2">
              {['$', '$$', '$$$', '$$$$'].map((price) => {
                const matchingBrands = mockBrands.filter(brand => brand.priceRange.includes(price));
                return (
                  <Badge
                    key={price}
                    variant={selectedFilters.price === price ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-[#FF00A8] hover:text-white transition-colors"
                    onClick={() => toggleFilter('price', price)}
                    style={{ backgroundColor: selectedFilters.price === price ? '#FF00A8' : undefined }}
                  >
                    {price} ({matchingBrands.length})
                  </Badge>
                );
              })}
            </div>
          )}

          {filterType === 'categories' && (
            <div className="flex flex-wrap gap-2">
              {brandCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedFilters.categories === category ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-[#FF00A8] hover:text-white transition-colors text-xs lg:text-sm"
                  onClick={() => toggleFilter('categories', category)}
                  style={{ 
                    backgroundColor: selectedFilters.categories === category ? '#FF00A8' : undefined,
                    borderColor: selectedFilters.categories === category ? '#FF00A8' : undefined
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {filterType === 'all' && (
            <div className="text-center py-4">
              <p className="text-foreground/60">Showing all brands without filters</p>
            </div>
          )}
        </div>

        {/* Brand Grid */}
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {filteredBrands.slice(0, maxBrands).map((brand) => (
              <NewBrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No brands found with current filters</p>
            <Button 
              variant="outline" 
              onClick={() => setFilterType('all')}
              className="hover:bg-[#FF00A8] hover:text-white transition-colors"
            >
              Show all brands
            </Button>
          </div>
        )}

        {/* Dynamic link */}
        <div className="text-center mt-8">
          <Link 
            to={getDynamicLinkData().url}
            className="text-[#FF00A8] hover:underline transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {getDynamicLinkData().text} →
          </Link>
        </div>
      </div>
    </section>
  );
}