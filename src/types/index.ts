export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'News' | 'Drops' | 'Stories' | 'Brands' | 'About';
  subtype?: string;
  date: string;
  image: string;
  readTime?: string;
  featured?: boolean;
  author?: Author;
  content?: string;
  brands?: Brand[];
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count?: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  replies?: Comment[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  image?: string;
  heroImage?: string;
  founded?: string;
  madeIn?: string[];
  headquarters?: string;
  priceRange?: string[];
  about?: string;
  tags?: string[];
  // Legacy/mock rating structure
  rating?: {
    culturalImpact: number;
    collabPower: number;
    creativity: number;
    popularity: number;
    loyalty: number;
    drops: number;
  };
  // DB-backed simple average rating (1..5, halves allowed)
  numericRating?: number;
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
  promoLinks?: Array<{
    label: string;
    url: string;
  }>;
  contacts?: Array<{
    label: string;
    url: string;
  }>;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  whereToBuy?: { [key: string]: string };
}

export type TabType = 'hype' | 'latest';