import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Star, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { mockBrands, getFeaturedBrands, getTrendingBrands, getTopRatedBrands, mockArticles, brandCategories, getBrandsByCategory } from '../data/mockData';
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

  return (
    <div className="min-h-screen">
      <SEO 
        title="Brands"
        description="Discover the best sock brands from around the world"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
        {/* Main Filter Section */}
        <section>
          {/* Header with current filter */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              SOCK BRANDS <span style={{ color: '#FF00A8', fontStyle: 'italic' }}>to</span>
            </h1>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#FF00A8]" />
              <span className="text-lg font-medium" style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}>
                {getCurrentFilterDescription()}
              </span>
            </div>
          </div>

          {/* Filter Type Tabs */}
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
              {filteredBrands.slice(0, 18).map((brand) => (
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
        </section>

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

        {/* From the editors */}
        <section>
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-headlines)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#FF00A8' }}>to</span> editors
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="brand-guides" className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white">
                Brand Guides
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white">
                News
              </TabsTrigger>
              <TabsTrigger value="drops" className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white">
                Drops
              </TabsTrigger>
              <TabsTrigger value="stories" className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white">
                Stories
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brand-guides" className="mt-8">
              <ArticleGrid 
                articles={brandGuideArticles.slice(0, 8)} 
                showCategory={false}
                gridCols="grid-cols-2 lg:grid-cols-4"
              />
              <div className="mt-8 text-center">
                <Link 
                  to="/stories" 
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-headlines)', color: '#FF00A8' }}
                >
                  Ticket <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#FF00A8', margin: '0 4px' }}>to</span> All Brand Guides
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="news" className="mt-8">
              <ArticleGrid 
                articles={mockArticles.filter(article => article.category === 'News').slice(0, 8)} 
                showCategory={false}
                gridCols="grid-cols-2 lg:grid-cols-4"
              />
              <div className="mt-8 text-center">
                <Link 
                  to="/news" 
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-headlines)', color: '#FF00A8' }}
                >
                  Ticket <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#FF00A8', margin: '0 4px' }}>to</span> All News
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="drops" className="mt-8">
              <ArticleGrid 
                articles={mockArticles.filter(article => article.category === 'Drops').slice(0, 8)} 
                showCategory={false}
                gridCols="grid-cols-2 lg:grid-cols-4"
              />
              <div className="mt-8 text-center">
                <Link 
                  to="/drops" 
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-headlines)', color: '#FF00A8' }}
                >
                  Ticket <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#FF00A8', margin: '0 4px' }}>to</span> All Drops
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="stories" className="mt-8">
              <ArticleGrid 
                articles={mockArticles.filter(article => article.category === 'Stories').slice(0, 8)} 
                showCategory={false}
                gridCols="grid-cols-2 lg:grid-cols-4"
              />
              <div className="mt-8 text-center">
                <Link 
                  to="/stories" 
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'var(--font-headlines)', color: '#FF00A8' }}
                >
                  Ticket <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: '#FF00A8', margin: '0 4px' }}>to</span> All Stories
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* All Brands - Alphabetical */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>
              All Brands ({mockBrands.length})
            </h2>
          </div>

          {/* Alphabetical Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {['All', ...Array.from(new Set(mockBrands.map(brand => brand.name.charAt(0).toUpperCase()))).sort()].map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className={`min-w-[40px] h-10 transition-colors ${
                    selectedLetter === letter 
                      ? 'bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90' 
                      : 'hover:bg-[#FF00A8] hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: selectedLetter === letter ? '#FF00A8' : undefined,
                    fontFamily: 'var(--font-headlines)' 
                  }}
                >
                  {letter}
                </Button>
              ))}
            </div>

            {/* Search within All Brands */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/60" />
              <Input
                type="text"
                placeholder="Search in all brands..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Grouped Brands by Letter */}
          {(() => {
            const allBrandsFiltered = mockBrands.filter(brand => {
              const matchesLocalSearch = !localSearchQuery || 
                brand.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                brand.description?.toLowerCase().includes(localSearchQuery.toLowerCase());

              const matchesLetter = selectedLetter === 'All' || 
                brand.name.toUpperCase().startsWith(selectedLetter);

              return matchesLocalSearch && matchesLetter;
            });

            const groupedAllBrands = allBrandsFiltered.reduce((acc, brand) => {
              const firstLetter = brand.name.charAt(0).toUpperCase();
              if (!acc[firstLetter]) {
                acc[firstLetter] = [];
              }
              acc[firstLetter].push(brand);
              return acc;
            }, {} as Record<string, Brand[]>);

            return Object.keys(groupedAllBrands).length > 0 ? (
              <div className="space-y-8">
                {Object.keys(groupedAllBrands)
                  .sort()
                  .map((letter) => {
                    const isExpanded = expandedSections.has(letter);
                    const brandsInSection = groupedAllBrands[letter];
                    
                    return (
                      <div key={letter} className="border-b border-gray-200 pb-6">
                        <Button
                          variant="ghost"
                          onClick={() => toggleSection(letter)}
                          className="w-full justify-between p-0 h-auto mb-4 hover:bg-transparent"
                        >
                          <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>
                            {letter} ({brandsInSection.length})
                          </h3>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                        
                        {isExpanded && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {brandsInSection.map((brand) => (
                              <NewBrandCard key={brand.id} brand={brand} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">
                  No brands found matching your search.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-foreground/40">
                    Try adjusting your search criteria.
                  </p>
                </div>
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
}