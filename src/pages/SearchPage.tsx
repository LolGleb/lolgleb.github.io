import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Clock, TrendingUp } from 'lucide-react';
import { SEO } from '../components/SEO';
import { mockArticles, mockBrands } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArticleGrid } from '../components/ArticleGrid';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Article, Brand } from '../types';

// Search suggestions/trending
const trendingSearches = [
  'sustainable socks',
  'athletic performance',
  'luxury brands',
  'made in usa',
  'streetwear'
];

// Recent searches (mock - would be from localStorage in real app)
const recentSearches = [
  'bombas',
  'stance collaboration',
  'merino wool'
];

// Helper function to search articles
function searchArticles(query: string): Article[] {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt?.toLowerCase().includes(lowercaseQuery) ||
    article.category.toLowerCase().includes(lowercaseQuery) ||
    article.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Helper function to search brands
function searchBrands(query: string): Brand[] {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockBrands.filter(brand =>
    brand.name.toLowerCase().includes(lowercaseQuery) ||
    brand.description?.toLowerCase().includes(lowercaseQuery) ||
    brand.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    brand.madeIn?.some(country => country.toLowerCase().includes(lowercaseQuery))
  );
}

function BrandSearchCard({ brand }: { brand: Brand }) {
  return (
    <Link to={`/brand/${brand.id}`} className="group">
      <div className="flex gap-4 p-4 rounded-lg border border-border hover:border-[#FF00A8] transition-colors">
        <div className="w-16 h-16 flex-shrink-0">
          <div className="w-full h-full rounded-md bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium group-hover:text-[#FF00A8] transition-colors" style={{ fontFamily: 'var(--font-headlines)' }}>
            {brand.name}
          </h3>
          {brand.description && (
            <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
              {brand.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {brand.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = {
    articles: searchArticles(query),
    brands: searchBrands(query)
  };

  const totalResults = searchResults.articles.length + searchResults.brands.length;
  const hasQuery = query.trim().length > 0;

  // Update URL when query changes
  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchParams({});
      setIsSearching(false);
    }
  }, [query, setSearchParams]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <>
      <SEO 
        title={hasQuery ? `Search results for "${query}"` : 'Search'}
        description={hasQuery ? `Find articles and brands related to "${query}"` : 'Search for articles, brands, and sock-related content'}
        keywords={`search, ${query}, socks, brands, articles`}
      />
      
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl mb-6" style={{ fontFamily: 'var(--font-headlines)' }}>
              {hasQuery ? 'Search Results' : 'Search'}
            </h1>
            
            {/* Search Input */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/60" />
              <Input
                type="text"
                placeholder="Search articles, brands, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-12 text-base"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#FF00A8] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {!hasQuery ? (
            /* Search Suggestions */
            <div className="space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-foreground/60" />
                    <h2 className="text-lg" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Recent Searches
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(search)}
                        className="hover:bg-[#FF00A8] hover:text-white hover:border-[#FF00A8] transition-colors"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </section>
              )}

              {/* Trending Searches */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-foreground/60" />
                  <h2 className="text-lg" style={{ fontFamily: 'var(--font-headlines)' }}>
                    Trending Searches
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(search)}
                      className="hover:bg-[#FF00A8] hover:text-white hover:border-[#FF00A8] transition-colors"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </section>

              {/* Popular Categories */}
              <section>
                <h2 className="text-lg mb-4" style={{ fontFamily: 'var(--font-headlines)' }}>
                  Popular Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/news"
                    className="p-4 border border-border rounded-lg hover:border-[#FF00A8] transition-colors text-center"
                  >
                    <h3 className="font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>News</h3>
                    <p className="text-sm text-foreground/60 mt-1">Latest updates</p>
                  </Link>
                  <Link
                    to="/drops"
                    className="p-4 border border-border rounded-lg hover:border-[#FF00A8] transition-colors text-center"
                  >
                    <h3 className="font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>Drops</h3>
                    <p className="text-sm text-foreground/60 mt-1">New releases</p>
                  </Link>
                  <Link
                    to="/stories"
                    className="p-4 border border-border rounded-lg hover:border-[#FF00A8] transition-colors text-center"
                  >
                    <h3 className="font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>Stories</h3>
                    <p className="text-sm text-foreground/60 mt-1">In-depth features</p>
                  </Link>
                  <Link
                    to="/brands"
                    className="p-4 border border-border rounded-lg hover:border-[#FF00A8] transition-colors text-center"
                  >
                    <h3 className="font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>Brands</h3>
                    <p className="text-sm text-foreground/60 mt-1">Discover labels</p>
                  </Link>
                </div>
              </section>
            </div>
          ) : (
            /* Search Results */
            <div>
              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-foreground/70" style={{ fontFamily: 'var(--font-body)' }}>
                  {isSearching ? (
                    'Searching...'
                  ) : totalResults > 0 ? (
                    <>Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "<span className="text-[#FF00A8] font-medium">{query}</span>"</>
                  ) : (
                    <>No results found for "<span className="text-[#FF00A8] font-medium">{query}</span>"</>
                  )}
                </p>
              </div>

              {totalResults > 0 && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white"
                    >
                      All ({totalResults})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="articles" 
                      className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white"
                    >
                      Articles ({searchResults.articles.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="brands" 
                      className="data-[state=active]:bg-[#FF00A8] data-[state=active]:text-white"
                    >
                      Brands ({searchResults.brands.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-8 space-y-8">
                    {/* Articles Section */}
                    {searchResults.articles.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                            Articles ({searchResults.articles.length})
                          </h2>
                          {searchResults.articles.length > 4 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab('articles')}
                              className="hover:bg-[#FF00A8] hover:text-white transition-colors"
                            >
                              View all articles
                            </Button>
                          )}
                        </div>
                        <ArticleGrid 
                          articles={searchResults.articles.slice(0, 4)} 
                          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        />
                      </section>
                    )}

                    {/* Brands Section */}
                    {searchResults.brands.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl" style={{ fontFamily: 'var(--font-headlines)' }}>
                            Brands ({searchResults.brands.length})
                          </h2>
                          {searchResults.brands.length > 4 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab('brands')}
                              className="hover:bg-[#FF00A8] hover:text-white transition-colors"
                            >
                              View all brands
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {searchResults.brands.slice(0, 4).map((brand) => (
                            <BrandSearchCard key={brand.id} brand={brand} />
                          ))}
                        </div>
                      </section>
                    )}
                  </TabsContent>

                  <TabsContent value="articles" className="mt-8">
                    {searchResults.articles.length > 0 ? (
                      <ArticleGrid 
                        articles={searchResults.articles} 
                        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-foreground/60">No articles found for "{query}"</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="brands" className="mt-8">
                    {searchResults.brands.length > 0 ? (
                      <div className="grid gap-4">
                        {searchResults.brands.map((brand) => (
                          <BrandSearchCard key={brand.id} brand={brand} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-foreground/60">No brands found for "{query}"</p>
                        <div className="mt-4">
                          <Link 
                            to="/brands" 
                            className="text-[#FF00A8] hover:underline"
                          >
                            Browse all brands →
                          </Link>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {/* No Results */}
              {totalResults === 0 && !isSearching && (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <Search className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                    <h2 className="text-xl mb-2" style={{ fontFamily: 'var(--font-headlines)' }}>
                      No results found
                    </h2>
                    <p className="text-foreground/60">
                      Try adjusting your search terms or browse our popular categories below.
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-4">
                    <h3 className="font-medium" style={{ fontFamily: 'var(--font-headlines)' }}>
                      Try searching for:
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {trendingSearches.map((search) => (
                        <Button
                          key={search}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(search)}
                          className="hover:bg-[#FF00A8] hover:text-white hover:border-[#FF00A8] transition-colors"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}