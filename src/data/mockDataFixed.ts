import { Article, Brand, Author, Comment, Tag } from '../types';

export const mockTags: Tag[] = [
  {
    id: 'sustainability',
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Eco-friendly and sustainable sock innovations',
    color: '#10B981',
    count: 8
  },
  {
    id: 'performance',
    name: 'Performance',
    slug: 'performance',
    description: 'Athletic and high-performance sock technology',
    color: '#3B82F6',
    count: 12
  },
  {
    id: 'luxury',
    name: 'Luxury',
    slug: 'luxury',
    description: 'Premium and luxury sock brands',
    color: '#8B5CF6',
    count: 6
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    slug: 'streetwear',
    description: 'Street fashion and urban culture',
    color: '#F59E0B',
    count: 15
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    slug: 'collaboration',
    description: 'Brand collaborations and limited editions',
    color: '#EF4444',
    count: 9
  },
  {
    id: 'merino-wool',
    name: 'Merino Wool',
    slug: 'merino-wool',
    description: 'Premium merino wool socks',
    color: '#059669',
    count: 5
  },
  {
    id: 'moisture-wicking',
    name: 'Moisture-Wicking',
    slug: 'moisture-wicking',
    description: 'Advanced moisture management technology',
    color: '#0EA5E9',
    count: 7
  },
  {
    id: 'limited-edition',
    name: 'Limited Edition',
    slug: 'limited-edition',
    description: 'Exclusive and limited-release items',
    color: '#DC2626',
    count: 4
  },
  {
    id: 'comfort',
    name: 'Comfort',
    slug: 'comfort',
    description: 'Maximum comfort and everyday wear',
    color: '#7C3AED',
    count: 11
  },
  {
    id: 'technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Innovation and advanced sock technology',
    color: '#1F2937',
    count: 8
  }
];

export const mockArticles: Article[] = [
  // Featured articles
  {
    id: '1',
    title: 'The Rise of Luxury Athletic Socks',
    excerpt: 'How premium performance socks became the new status symbol in streetwear culture.',
    category: 'News',
    date: 'Sep 6, 2025',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop',
    featured: true,
    readTime: '5 min read',
    author: {
      id: 'alex-rivera',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Fashion journalist specializing in streetwear culture and sustainable fashion trends.',
      social: {
        twitter: 'https://twitter.com/alexrivera',
        instagram: 'https://instagram.com/alexrivera',
        website: 'https://alexrivera.com'
      }
    },
    content: 'The luxury athletic sock market has experienced unprecedented growth over the past three years...',
    tags: ['luxury', 'performance', 'streetwear', 'technology'],
    brands: [
      { id: '1', name: 'Stance', logo: 'ST', description: 'Premium performance socks with bold designs.' },
      { id: '3', name: 'Bombas', logo: 'BO', description: 'Comfort-focused socks with a mission.' }
    ]
  }
];

// Authors data
export const mockAuthors: Author[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Fashion journalist specializing in streetwear culture and sustainable fashion trends.',
    social: {
      twitter: 'https://twitter.com/alexrivera',
      instagram: 'https://instagram.com/alexrivera',
      website: 'https://alexrivera.com'
    }
  }
];

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Stance',
    logo: 'ST',
    description: 'Premium performance socks with bold designs.',
    website: 'https://stance.com',
    image: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=800&h=600&fit=crop',
    founded: '2009',
    madeIn: ['USA', 'China'],
    headquarters: 'San Clemente, CA',
    priceRange: ['$$', '$$$'],
    featured: true,
    trending: true,
    topRated: true,
    tags: ['Streetwear', 'Performance', 'Collabs'],
    about: 'Stance represents the perfect fusion of streetwear culture and technical innovation.',
    rating: {
      culturalImpact: 5,
      collabPower: 5,
      creativity: 5,
      popularity: 4,
      loyalty: 4,
      drops: 4
    }
  },
  {
    id: '2', 
    name: 'Happy Socks',
    logo: 'HS',
    description: 'Colorful socks to spread happiness.',
    website: 'https://happysocks.com',
    image: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=800&h=600&fit=crop',
    founded: '2008',
    madeIn: ['Turkey', 'Italy'],
    headquarters: 'Stockholm, Sweden',
    priceRange: ['$', '$$'],
    featured: true,
    trending: false,
    topRated: true,
    tags: ['Colorful', 'Casual', 'Collabs'],
    about: 'Happy Socks emerged from a simple philosophy of spreading happiness through colorful designs.',
    rating: {
      culturalImpact: 4,
      collabPower: 4,
      creativity: 5,
      popularity: 5,
      loyalty: 4,
      drops: 3
    }
  },
  {
    id: '3',
    name: 'Bombas',
    logo: 'BO',
    description: 'Comfort-focused socks with a mission.',
    website: 'https://bombas.com',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=600&fit=crop',
    founded: '2013',
    madeIn: ['USA'],
    headquarters: 'New York, NY',
    priceRange: ['$$'],
    featured: false,
    trending: true,
    topRated: true,
    tags: ['Comfort', 'Social Impact', 'Performance'],
    about: 'Bombas represents a revolutionary approach to sock design with social responsibility.',
    rating: {
      culturalImpact: 3,
      collabPower: 2,
      creativity: 4,
      popularity: 4,
      loyalty: 5,
      drops: 2
    }
  }
];

// Brand categories/tags for filtering
export const brandCategories = [
  '100% Made in USA',
  'European Craftsmanship',  
  'Luxury Premium',
  'Streetwear & Collabs',
  'Performance & Athletic',
  'Sustainable & Eco-Friendly',
  'Outdoor & Adventure',
  'Business & Professional',
  'Compression & Health',
  'Comfort & Everyday',
  'Merino Wool',
  'Bold & Colorful',
  'Heritage Brands',
  'Made in Germany',
  'Made in Italy',
  'Made in UK'
];

// Helper function to get brands by category
export const getBrandsByCategory = (category: string): Brand[] => {
  let brands: Brand[] = [];
  
  switch (category) {
    case '100% Made in USA':
      brands = mockBrands.filter(brand => 
        brand.madeIn.length === 1 && brand.madeIn.includes('USA')
      );
      break;
    case 'European Craftsmanship':
      brands = mockBrands.filter(brand => 
        brand.madeIn.some(country => ['Germany', 'Italy', 'UK', 'Turkey'].includes(country))
      );
      break;
    case 'Luxury Premium':
      brands = mockBrands.filter(brand => 
        brand.priceRange.includes('$$$') || brand.priceRange.includes('$$$$')
      );
      break;
    case 'Streetwear & Collabs':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Streetwear') || brand.tags?.includes('Collabs')
      );
      break;
    case 'Performance & Athletic':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Performance') || brand.tags?.includes('Athletic')
      );
      break;
    case 'Sustainable & Eco-Friendly':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Social Impact') || brand.tags?.includes('Sustainable')
      );
      break;
    case 'Comfort & Everyday':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Comfort') || brand.tags?.includes('Casual')
      );
      break;
    case 'Bold & Colorful':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Colorful') || brand.name === 'Happy Socks' || brand.name === 'Stance'
      );
      break;
    case 'Made in Germany':
      brands = mockBrands.filter(brand => 
        brand.madeIn.includes('Germany')
      );
      break;
    case 'Made in Italy':
      brands = mockBrands.filter(brand => 
        brand.madeIn.includes('Italy')
      );
      break;
    case 'Made in UK':
      brands = mockBrands.filter(brand => 
        brand.madeIn.includes('UK')
      );
      break;
    default:
      brands = mockBrands;
      break;
  }
  
  // Remove duplicates based on brand ID
  const uniqueBrands = brands.filter((brand, index, self) => 
    self.findIndex(b => b.id === brand.id) === index
  );
  
  return uniqueBrands;
};

// Helper functions to get filtered articles
export const getNewsByTab = (tab: 'hype' | 'latest'): Article[] => {
  const newsArticles = mockArticles.filter(article => article.category === 'News');
  
  if (tab === 'hype') {
    return newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    return newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getDropsByTab = (tab: 'hype' | 'latest'): Article[] => {
  const dropsArticles = mockArticles.filter(article => article.category === 'Drops');
  
  if (tab === 'hype') {
    return dropsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    return dropsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getStoriesByTab = (tab: 'hype' | 'latest'): Article[] => {
  const storiesArticles = mockArticles.filter(article => article.category === 'Stories');
  
  if (tab === 'hype') {
    return storiesArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else {
    return storiesArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

export const getFeaturedArticles = (): Article[] => {
  return mockArticles.filter(article => article.featured);
};

export const getArticleById = (id: string): Article | undefined => {
  return mockArticles.find(article => article.id === id);
};

// Brand helper functions
export const getFeaturedBrands = (): Brand[] => {
  return mockBrands.filter(brand => brand.featured);
};

export const getTrendingBrands = (): Brand[] => {
  return mockBrands.filter(brand => brand.trending);
};

export const getTopRatedBrands = (): Brand[] => {
  return mockBrands.filter(brand => brand.topRated);
};

export const getBrandById = (id: string): Brand | undefined => {
  return mockBrands.find(brand => brand.id === id);
};

export const getSimilarBrands = (currentBrandId: string, limit: number = 6): Brand[] => {
  return mockBrands.filter(brand => brand.id !== currentBrandId).slice(0, limit);
};

export const getBrandArticles = (brandName: string): Article[] => {
  return mockArticles.filter(article => 
    article.brands?.some(brand => brand.name.toLowerCase() === brandName.toLowerCase()) ||
    article.title.toLowerCase().includes(brandName.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(brandName.toLowerCase())
  ).slice(0, 6);
};

// Mock Comments
export const mockComments = [
  {
    id: '1',
    author: 'Taylor Swift',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    content: 'Great article! I had no idea sock technology had evolved this much.',
    date: 'Sep 5, 2025',
    replies: [
      {
        id: '1-1',
        author: 'Casey Brown',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        content: 'Totally agree! Just ordered a pair from the first brand mentioned.',
        date: 'Sep 5, 2025'
      }
    ]
  }
];