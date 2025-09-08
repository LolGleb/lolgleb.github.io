import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { brandCategories, getBrandsByCategory } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Brand } from '../types';
import { categoryToSlug } from '../pages/BrandCategoryPage';

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
                <Star key={i} className="w-3 h-3 fill-[#FF00A8] text-[#FF00A8]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BrandsPreview() {
  const [selectedCategory, setSelectedCategory] = useState('100% Made in USA');

  return (
    <section className="py-8 lg:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-headlines)' }}>
            Explore by Categories
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/60">Currently showing:</span>
            <span className="text-sm font-medium" style={{ color: '#FF00A8', fontFamily: 'var(--font-body)' }}>
              {selectedCategory}
            </span>
          </div>
        </div>
        
        {/* Category Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {brandCategories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-[#FF00A8] hover:text-white transition-colors text-xs lg:text-sm"
                onClick={() => setSelectedCategory(category)}
                style={{ 
                  backgroundColor: selectedCategory === category ? '#FF00A8' : undefined,
                  borderColor: selectedCategory === category ? '#FF00A8' : undefined
                }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {getBrandsByCategory(selectedCategory).slice(0, 12).map((brand, index) => (
            <NewBrandCard key={`${brand.id}-${index}`} brand={brand} />
          ))}
        </div>

        {/* Show all link */}
        <div className="text-center mt-8">
          <Link 
            to={`/brands/${categoryToSlug(selectedCategory)}`}
            className="text-foreground/60 hover:text-[#FF00A8] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>
              Ticket <span className="italic lowercase" style={{ color: '#FF00A8' }}>to</span>
            </span>
            <span className="ml-2">all {selectedCategory.toLowerCase()} brands →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}