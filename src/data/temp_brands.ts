// Temporary file to fix getBrandsByCategory function
import { Brand } from '../types';

// Helper function to get brands by category
export const getBrandsByCategory = (category: string, mockBrands: Brand[]): Brand[] => {
  switch (category) {
    case '100% Made in USA':
      return mockBrands.filter(brand => 
        brand.madeIn.length === 1 && brand.madeIn.includes('USA')
      );
    case 'European Craftsmanship':
      return mockBrands.filter(brand => 
        brand.madeIn.some(country => ['Germany', 'Italy', 'UK', 'Turkey'].includes(country))
      );
    case 'Luxury Premium':
      return mockBrands.filter(brand => 
        brand.priceRange.includes('$$$') || brand.priceRange.includes('$$$$')
      );
    case 'Streetwear & Collabs':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Streetwear') || brand.tags?.includes('Collabs')
      );
    case 'Performance & Athletic':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Performance') || brand.tags?.includes('Athletic') || brand.name === 'Thorlos'
      );
    case 'Sustainable & Eco-Friendly':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Social Impact') || brand.tags?.includes('Sustainable') || brand.name === 'Smartwool' || brand.name === 'Darn Tough' || brand.name === 'Allbirds'
      );
    case 'Outdoor & Adventure':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Outdoor') || brand.name === 'Smartwool' || brand.name === 'Darn Tough'
      );
    case 'Business & Professional':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Luxury') || brand.tags?.includes('Heritage') || brand.tags?.includes('British Design') || brand.name === 'Paul Smith' || brand.name === 'Falke' || brand.name === 'Pantherella'
      );
    case 'Compression & Health':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Health') || brand.tags?.includes('Compression') || brand.name === 'Comrad'
      );
    case 'Comfort & Everyday':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Comfort') || brand.tags?.includes('Casual') || brand.name === 'Allbirds'
      );
    case 'Merino Wool':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Merino Wool') || brand.name === 'Smartwool' || brand.name === 'Darn Tough' || brand.name === 'Allbirds'
      );
    case 'Bold & Colorful':
      return mockBrands.filter(brand => 
        brand.tags?.includes('Colorful') || brand.name === 'Happy Socks' || brand.name === 'Stance'
      );
    case 'Heritage Brands':
      return mockBrands.filter(brand => 
        parseInt(brand.founded) < 1950 || brand.name === 'Falke' || brand.name === 'Paul Smith' || brand.name === 'Pantherella'
      );
    case 'Made in Germany':
      return mockBrands.filter(brand => 
        brand.madeIn.includes('Germany')
      );
    case 'Made in Italy':
      return mockBrands.filter(brand => 
        brand.madeIn.includes('Italy')
      );
    case 'Made in UK':
      return mockBrands.filter(brand => 
        brand.madeIn.includes('UK')
      );
    default:
      return mockBrands;
  }
};