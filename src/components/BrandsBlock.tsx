import { Link } from 'react-router-dom';
import { Brand } from '../types';

interface BrandsBlockProps {
  brands: Brand[];
}

export function BrandsBlock({ brands }: BrandsBlockProps) {
  if (brands.length === 0) return null;

  return (
    <div className="space-y-4 p-6 bg-accent/20 rounded-lg">
      <h3 className="text-sm" style={{ fontFamily: 'var(--font-headlines)', color: '#FF00A8' }}>
        Brands here
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/brand/${brand.id}`}
            className="w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center text-xs hover:border-[#FF00A8] hover:bg-[#FF00A8] hover:text-white transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)', fontWeight: '600' }}
            title={brand.name}
          >
            {brand.logo}
          </Link>
        ))}
      </div>
    </div>
  );
}