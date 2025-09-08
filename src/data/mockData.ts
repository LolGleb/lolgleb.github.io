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
  // NEWS ARTICLES
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
  },
  {
    id: '3',
    title: 'Nike Dri-FIT Crew Socks Review',
    excerpt: 'Testing the latest moisture-wicking technology from Nike.',
    category: 'News',
    date: 'Sep 4, 2025',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=400&fit=crop',
    readTime: '7 min read',
    tags: ['performance', 'moisture-wicking', 'technology'],
    author: {
      id: 'jordan-kim',
      name: 'Jordan Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=100&h=100&fit=crop&crop=face',
      bio: 'Footwear specialist and technology reviewer focused on performance gear and athletic innovations.',
      social: {
        twitter: 'https://twitter.com/jordankim',
        instagram: 'https://instagram.com/jordankim'
      }
    }
  },
  {
    id: '4',
    title: 'Sustainable Sock Materials: The Future is Here',
    excerpt: 'Exploring bamboo, organic cotton, and recycled polyester in modern sock design.',
    category: 'News',
    date: 'Sep 3, 2025',
    image: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=600&h=400&fit=crop',
    readTime: '6 min read',
    tags: ['sustainability', 'technology', 'comfort'],
    author: { id: 'alex-rivera', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', bio: 'Fashion journalist.' }
  },
  {
    id: '5',
    title: 'Athletic Sock Wars: Comparing Top Performance Brands',
    excerpt: 'Head-to-head testing of Nike, Adidas, Under Armour, and Stance athletic socks.',
    category: 'News',
    date: 'Sep 2, 2025',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=400&fit=crop',
    readTime: '8 min read',
    tags: ['performance', 'technology', 'comparison'],
    author: { id: 'jordan-kim', name: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=100&h=100&fit=crop&crop=face', bio: 'Performance gear specialist.' }
  },
  
  // DROPS ARTICLES
  {
    id: '2', 
    title: 'Supreme x Stance: Limited Drop',
    excerpt: 'The collaboration everyone has been waiting for drops tomorrow.',
    category: 'Drops',
    date: 'Sep 5, 2025',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    readTime: '3 min read',
    tags: ['collaboration', 'limited-edition', 'streetwear'],
    author: {
      id: 'sam-chen',
      name: 'Sam Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Drop culture expert and brand collaborations analyst covering limited releases and hype trends.',
      social: {
        twitter: 'https://twitter.com/samchen',
        website: 'https://samchen.blog'
      }
    }
  },
  {
    id: '41',
    title: 'Travis Scott x Nike Sock Collaboration Leaked',
    excerpt: 'Exclusive first look at the upcoming Cactus Jack sock collection.',
    category: 'Drops',
    date: 'Sep 4, 2025',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    readTime: '3 min read',
    tags: ['collaboration', 'limited-edition', 'nike'],
    author: { id: 'sam-chen', name: 'Sam Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', bio: 'Drop culture expert.' }
  },
  {
    id: '42',
    title: 'OFF-WHITE "Industrial" Sock Pack Drops Tomorrow',
    excerpt: 'Virgil Abloh\'s signature aesthetic meets technical sock design.',
    category: 'Drops',
    date: 'Sep 3, 2025',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=600&h=400&fit=crop',
    readTime: '2 min read',
    tags: ['off-white', 'luxury', 'limited-edition'],
    author: { id: 'sam-chen', name: 'Sam Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', bio: 'Drop culture expert.' }
  },
  
  // STORIES ARTICLES
  {
    id: '81',
    title: 'The Sock Drawer Chronicles: A Collector\'s Journey',
    excerpt: 'Meet the person who owns over 500 pairs of designer socks.',
    category: 'Stories',
    subtype: 'Profile',
    date: 'Sep 5, 2025',
    image: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=600&h=400&fit=crop',
    readTime: '8 min read',
    tags: ['collector', 'lifestyle', 'passion'],
    author: { id: 'alex-rivera', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', bio: 'Lifestyle journalist.' }
  },
  {
    id: '82',
    title: 'From Rags to Riches: The Bombas Success Story',
    excerpt: 'How two friends turned a simple idea into a sock empire.',
    category: 'Stories',
    subtype: 'Brand Guide',
    date: 'Sep 4, 2025',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop',
    readTime: '12 min read',
    tags: ['bombas', 'startup', 'social-impact'],
    author: { id: 'sam-chen', name: 'Sam Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', bio: 'Business journalist.' }
  },
  {
    id: '83',
    title: 'Happy Socks: Spreading Joy One Pair at a Time',
    excerpt: 'The Swedish brand that made colorful socks cool again.',
    category: 'Stories',
    subtype: 'Brand Guide',
    date: 'Sep 3, 2025',
    image: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=600&h=400&fit=crop',
    readTime: '10 min read',
    tags: ['happy-socks', 'sweden', 'color'],
    author: { id: 'alex-rivera', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', bio: 'Brand storyteller.' }
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
  },
  {
    id: 'jordan-kim',
    name: 'Jordan Kim',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3db?w=100&h=100&fit=crop&crop=face',
    bio: 'Footwear specialist and technology reviewer focused on performance gear and athletic innovations.',
    social: {
      twitter: 'https://twitter.com/jordankim',
      instagram: 'https://instagram.com/jordankim'
    }
  },
  {
    id: 'sam-chen',
    name: 'Sam Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Drop culture expert and brand collaborations analyst covering limited releases and hype trends.',
    social: {
      twitter: 'https://twitter.com/samchen',
      website: 'https://samchen.blog'
    }
  }
];

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Stance',
    logo: 'ST',
    description: 'Premium performance socks with bold designs and streetwear collaborations.',
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
    },
    contacts: [
      { label: 'Customer Service', url: 'mailto:support@stance.com' },
      { label: 'Press Inquiries', url: 'mailto:press@stance.com' },
      { label: 'Partnership Opportunities', url: 'mailto:partnerships@stance.com' }
    ],
    whereToBuy: {
      official: 'https://stance.com',
      amazon: 'https://amazon.com/stores/stance',
      nordstrom: 'https://nordstrom.com/browse/stance',
      footlocker: 'https://footlocker.com/brand/stance'
    }
  },
  {
    id: '2', 
    name: 'Happy Socks',
    logo: 'HS',
    description: 'Colorful Swedish sock brand spreading happiness through bold designs.',
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
    },
    contacts: [
      { label: 'Customer Support', url: 'mailto:hello@happysocks.com' },
      { label: 'Wholesale Inquiries', url: 'mailto:wholesale@happysocks.com' }
    ],
    whereToBuy: {
      official: 'https://happysocks.com',
      amazon: 'https://amazon.com/stores/happysocks',
      asos: 'https://asos.com/brand/happy-socks'
    }
  },
  {
    id: '3',
    name: 'Bombas',
    logo: 'BO',
    description: 'Comfort-focused socks with a mission to help those in need.',
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
    },
    contacts: [
      { label: 'Customer Care', url: 'mailto:care@bombas.com' },
      { label: 'Social Impact', url: 'mailto:impact@bombas.com' },
      { label: 'Media', url: 'mailto:media@bombas.com' }
    ],
    whereToBuy: {
      official: 'https://bombas.com',
      amazon: 'https://amazon.com/stores/bombas',
      target: 'https://target.com/s/bombas'
    }
  },
  {
    id: '4',
    name: 'Darn Tough',
    logo: 'DT',
    description: 'Vermont-made merino wool socks with lifetime guarantee.',
    website: 'https://darntough.com',
    image: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=800&h=600&fit=crop',
    founded: '2004',
    madeIn: ['USA'],
    headquarters: 'Northfield, VT',
    priceRange: ['$$', '$$$'],
    featured: false,
    trending: false,
    topRated: true,
    tags: ['Merino Wool', 'Performance', 'Made in USA'],
    about: 'Darn Tough Vermont creates premium merino wool socks with an unconditional lifetime guarantee.',
    rating: {
      culturalImpact: 3,
      collabPower: 1,
      creativity: 3,
      popularity: 3,
      loyalty: 5,
      drops: 1
    },
    contacts: [
      { label: 'Customer Service', url: 'mailto:service@darntough.com' },
      { label: 'Warranty Claims', url: 'mailto:warranty@darntough.com' },
      { label: 'Wholesale', url: 'mailto:wholesale@darntough.com' }
    ],
    whereToBuy: {
      official: 'https://darntough.com',
      amazon: 'https://amazon.com/stores/darntough',
      rei: 'https://rei.com/brand/darn-tough',
      backcountry: 'https://backcountry.com/darn-tough-vermont'
    }
  },
  {
    id: '5',
    name: 'OFF-WHITE',
    logo: 'OW',
    description: 'High-fashion streetwear brand with distinctive sock designs.',
    website: 'https://off---white.com',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop',
    founded: '2013',
    madeIn: ['Italy'],
    headquarters: 'Milan, Italy',
    priceRange: ['$$$', '$$$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Luxury', 'Streetwear', 'Fashion'],
    about: 'OFF-WHITE brings high-fashion sensibility to streetwear with distinctive designs.',
    rating: {
      culturalImpact: 5,
      collabPower: 4,
      creativity: 5,
      popularity: 4,
      loyalty: 3,
      drops: 5
    }
  },
  {
    id: '6',
    name: 'Falke',
    logo: 'FK',
    description: 'German engineering meets sock perfection.',
    website: 'https://falke.com',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    founded: '1895',
    madeIn: ['Germany'],
    headquarters: 'Schmallenberg, Germany',
    priceRange: ['$$', '$$$'],
    featured: false,
    trending: false,
    topRated: true,
    tags: ['Luxury', 'Heritage', 'Performance'],
    about: 'Falke combines German engineering with premium materials to create luxury socks.',
    rating: {
      culturalImpact: 3,
      collabPower: 2,
      creativity: 4,
      popularity: 3,
      loyalty: 4,
      drops: 2
    }
  },
  {
    id: '7',
    name: 'Smartwool',
    logo: 'SW',
    description: 'Merino wool performance socks.',
    website: 'https://smartwool.com',
    image: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=800&h=600&fit=crop',
    founded: '1994',
    madeIn: ['USA'],
    headquarters: 'Steamboat Springs, CO',
    priceRange: ['$$', '$$$'],
    featured: false,
    trending: false,
    topRated: true,
    tags: ['Merino Wool', 'Performance', 'Outdoor'],
    about: 'Smartwool pioneers merino wool performance apparel for outdoor enthusiasts.',
    rating: {
      culturalImpact: 3,
      collabPower: 2,
      creativity: 4,
      popularity: 4,
      loyalty: 4,
      drops: 2
    },
    contacts: [
      { label: 'Customer Care', url: 'mailto:customercare@smartwool.com' },
      { label: 'Technical Support', url: 'mailto:tech@smartwool.com' }
    ],
    whereToBuy: {
      official: 'https://smartwool.com',
      amazon: 'https://amazon.com/stores/smartwool',
      rei: 'https://rei.com/brand/smartwool',
      backcountry: 'https://backcountry.com/smartwool'
    }
  },
  {
    id: '8',
    name: 'Nike',
    logo: 'NK',
    description: 'Athletic performance socks from the sportswear giant.',
    website: 'https://nike.com',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    founded: '1964',
    madeIn: ['Vietnam', 'China'],
    headquarters: 'Beaverton, OR',
    priceRange: ['$', '$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Athletic', 'Performance', 'Mainstream'],
    about: 'Nike brings world-class athletic performance to sock design.',
    rating: {
      culturalImpact: 5,
      collabPower: 3,
      creativity: 3,
      popularity: 5,
      loyalty: 4,
      drops: 3
    },
    contacts: [
      { label: 'Customer Service', url: 'mailto:service@nike.com' },
      { label: 'Nike By You Support', url: 'mailto:nikebyyou@nike.com' },
      { label: 'Corporate Affairs', url: 'mailto:corporate@nike.com' }
    ],
    whereToBuy: {
      official: 'https://nike.com',
      amazon: 'https://amazon.com/stores/nike',
      footlocker: 'https://footlocker.com/brand/nike',
      finishline: 'https://finishline.com/brand/nike',
      dickssportinggoods: 'https://dickssportinggoods.com/brand/nike'
    }
  },
  
  // Additional brands (32 more to reach 40 total)
  {
    id: '9',
    name: 'Adidas',
    logo: 'AD',
    description: 'Three-stripe excellence in athletic sock design.',
    website: 'https://adidas.com',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    founded: '1949',
    madeIn: ['Germany', 'Vietnam'],
    headquarters: 'Herzogenaurach, Germany',
    priceRange: ['$', '$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Athletic', 'Performance', 'Heritage'],
    about: 'Adidas brings German athletic heritage to modern sock performance.',
    rating: { culturalImpact: 4, collabPower: 3, creativity: 3, popularity: 5, loyalty: 4, drops: 3 }
  },
  {
    id: '10',
    name: 'Allbirds',
    logo: 'AB',
    description: 'Sustainable merino wool comfort socks.',
    website: 'https://allbirds.com',
    image: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1578080134513-cb8dcce3f6e8?w=800&h=600&fit=crop',
    founded: '2016',
    madeIn: ['USA', 'New Zealand'],
    headquarters: 'San Francisco, CA',
    priceRange: ['$$'],
    featured: false,
    trending: true,
    topRated: true,
    tags: ['Sustainable', 'Merino Wool', 'Comfort'],
    about: 'Allbirds pioneers sustainable footwear and sock design.',
    rating: { culturalImpact: 3, collabPower: 2, creativity: 4, popularity: 4, loyalty: 4, drops: 2 }
  },
  {
    id: '11',
    name: 'Balenciaga',
    logo: 'BA',
    description: 'High-fashion luxury socks with avant-garde design.',
    website: 'https://balenciaga.com',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop',
    founded: '1917',
    madeIn: ['Italy'],
    headquarters: 'Paris, France',
    priceRange: ['$$$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Luxury', 'Fashion', 'Avant-garde'],
    about: 'Balenciaga pushes boundaries in luxury fashion accessories.',
    rating: { culturalImpact: 5, collabPower: 3, creativity: 5, popularity: 3, loyalty: 3, drops: 4 }
  },
  {
    id: '12',
    name: 'Supreme',
    logo: 'SU',
    description: 'NYC streetwear icon with coveted sock drops.',
    website: 'https://supremenewyork.com',
    image: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=800&h=600&fit=crop',
    founded: '1994',
    madeIn: ['USA'],
    headquarters: 'New York, NY',
    priceRange: ['$$', '$$$'],
    featured: true,
    trending: true,
    topRated: false,
    tags: ['Streetwear', 'NYC', 'Hype'],
    about: 'Supreme defines streetwear culture and hype fashion.',
    rating: { culturalImpact: 5, collabPower: 5, creativity: 4, popularity: 5, loyalty: 4, drops: 5 }
  },
  {
    id: '13',
    name: 'Gucci',
    logo: 'GU',
    description: 'Italian luxury fashion house with signature sock designs.',
    website: 'https://gucci.com',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop',
    founded: '1921',
    madeIn: ['Italy'],
    headquarters: 'Florence, Italy',
    priceRange: ['$$$$'],
    featured: true,
    trending: true,
    topRated: false,
    tags: ['Luxury', 'Italian', 'Fashion'],
    about: 'Gucci brings centuries of Italian craftsmanship to luxury socks.',
    rating: { culturalImpact: 5, collabPower: 3, creativity: 5, popularity: 4, loyalty: 3, drops: 3 }
  },
  {
    id: '14',
    name: 'Louis Vuitton',
    logo: 'LV',
    description: 'French luxury house with signature monogram socks.',
    website: 'https://louisvuitton.com',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop',
    founded: '1854',
    madeIn: ['France', 'Italy'],
    headquarters: 'Paris, France',
    priceRange: ['$$$$'],
    featured: true,
    trending: false,
    topRated: false,
    tags: ['Luxury', 'French', 'Heritage'],
    about: 'Louis Vuitton brings centuries of French luxury to sock design.',
    rating: { culturalImpact: 5, collabPower: 2, creativity: 4, popularity: 3, loyalty: 4, drops: 2 }
  },
  {
    id: '15',
    name: 'New Balance',
    logo: 'NB',
    description: 'Boston-made athletic performance socks.',
    website: 'https://newbalance.com',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    founded: '1906',
    madeIn: ['USA', 'UK'],
    headquarters: 'Boston, MA',
    priceRange: ['$', '$$'],
    featured: false,
    trending: true,
    topRated: true,
    tags: ['Athletic', 'Made in USA', 'Performance'],
    about: 'New Balance combines American craftsmanship with athletic innovation.',
    rating: { culturalImpact: 3, collabPower: 3, creativity: 3, popularity: 4, loyalty: 4, drops: 3 }
  },
  {
    id: '16',
    name: 'Palace',
    logo: 'PA',
    description: 'London skate culture with signature tri-ferg socks.',
    website: 'https://palaceskateboards.com',
    image: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=800&h=600&fit=crop',
    founded: '2009',
    madeIn: ['UK'],
    headquarters: 'London, UK',
    priceRange: ['$$', '$$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Skatewear', 'London', 'Tri-ferg'],
    about: 'Palace brings London skate culture to streetwear fashion.',
    rating: { culturalImpact: 4, collabPower: 4, creativity: 4, popularity: 4, loyalty: 4, drops: 4 }
  },
  {
    id: '17',
    name: 'Puma',
    logo: 'PU',
    description: 'German sportswear with performance sock technology.',
    website: 'https://puma.com',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=600&fit=crop',
    founded: '1948',
    madeIn: ['Germany', 'Vietnam'],
    headquarters: 'Herzogenaurach, Germany',
    priceRange: ['$', '$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Athletic', 'German', 'Performance'],
    about: 'Puma brings feline agility to athletic performance.',
    rating: { culturalImpact: 3, collabPower: 3, creativity: 3, popularity: 4, loyalty: 3, drops: 3 }
  },
  {
    id: '18',
    name: 'Kith',
    logo: 'KI',
    description: 'New York streetwear with premium sock collections.',
    website: 'https://kith.com',
    image: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1628195762562-2a46a7071049?w=800&h=600&fit=crop',
    founded: '2011',
    madeIn: ['USA'],
    headquarters: 'New York, NY',
    priceRange: ['$$', '$$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Streetwear', 'NYC', 'Collabs'],
    about: 'Kith elevates streetwear with premium materials and design.',
    rating: { culturalImpact: 4, collabPower: 5, creativity: 4, popularity: 4, loyalty: 3, drops: 5 }
  },
  {
    id: '19',
    name: 'Fear of God',
    logo: 'FG',
    description: 'Minimalist luxury streetwear essentials.',
    website: 'https://fearofgod.com',
    image: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608522859137-0dd2e6a51c4e?w=800&h=600&fit=crop',
    founded: '2013',
    madeIn: ['USA'],
    headquarters: 'Los Angeles, CA',
    priceRange: ['$$$', '$$$$'],
    featured: false,
    trending: true,
    topRated: false,
    tags: ['Luxury', 'Streetwear', 'Minimalist'],
    about: 'Fear of God defines luxury streetwear essentials.',
    rating: { culturalImpact: 4, collabPower: 3, creativity: 4, popularity: 4, loyalty: 3, drops: 4 }
  },
  {
    id: '20',
    name: 'Uniqlo',
    logo: 'UQ',
    description: 'Japanese basics with innovative sock technology.',
    website: 'https://uniqlo.com',
    image: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=400&h=300&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1727498830440-339a797d8423?w=800&h=600&fit=crop',
    founded: '1949',
    madeIn: ['Japan', 'China'],
    headquarters: 'Tokyo, Japan',
    priceRange: ['$'],
    featured: false,
    trending: false,
    topRated: true,
    tags: ['Japanese', 'Basics', 'Technology'],
    about: 'Uniqlo democratizes quality through innovative basic wear.',
    rating: { culturalImpact: 3, collabPower: 2, creativity: 3, popularity: 5, loyalty: 4, drops: 2 }
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
        brand.tags?.includes('Social Impact') || brand.tags?.includes('Sustainable') || brand.name === 'Darn Tough'
      );
      break;
    case 'Comfort & Everyday':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Comfort') || brand.tags?.includes('Casual')
      );
      break;
    case 'Merino Wool':
      brands = mockBrands.filter(brand => 
        brand.tags?.includes('Merino Wool') || brand.name === 'Darn Tough' || brand.name === 'Smartwool'
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
  },
  {
    id: '2',
    author: 'Morgan Davis',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face',
    content: 'The sustainability angle is what really caught my attention. More brands should follow this approach.',
    date: 'Sep 4, 2025'
  }
];