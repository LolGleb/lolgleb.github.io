import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  publishedAt: string;
  excerpt?: string;
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<'hype' | 'latest'>('hype');
  const [displayedArticles, setDisplayedArticles] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  // Главная статья
  const featuredArticle: Article = {
    id: 1,
    title: "The Future of Sock Manufacturing: How AI is Revolutionizing Textile Production",
    category: "Stories",
    image: "https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    publishedAt: "Sep 5, 2025",
    excerpt: "From automated knitting machines to predictive design algorithms, the sock industry is undergoing a technological revolution that promises to change everything."
  };

  // Две статьи справа
  const sideArticles: Article[] = [
    {
      id: 2,
      title: "Nike x Jacquemus: The Unexpected Sock Collaboration of the Year",
      category: "Drops",
      image: "https://images.unsplash.com/photo-1580973757787-e22cdecb9cd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNvY2tzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 4, 2025"
    },
    {
      id: 3,
      title: "Sustainability Report: The Brands Leading Eco-Friendly Sock Production",
      category: "Brands",
      image: "https://images.unsplash.com/photo-1631180543602-727e1197619d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc29ja3MlMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU3MDgzMTEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 4, 2025"
    }
  ];

  // Восемь статей внизу
  const bottomArticles: Article[] = [
    {
      id: 4,
      title: "Street Style Tokyo: The Underground Sock Scene",
      category: "News",
      image: "https://images.unsplash.com/photo-1723672939506-ecf86e248311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmYXNoaW9uJTIwc29ja3MlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzU2OTgwMTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 3, 2025"
    },
    {
      id: 5,
      title: "Palace x Stone Island: Limited Edition Drop Analysis",
      category: "Drops",
      image: "https://images.unsplash.com/photo-1514408171400-282d59fc544e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGFib3JhdGlvbiUyMHN0cmVldHdlYXJ8ZW58MXx8fHwxNzU3MDgzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 3, 2025"
    },
    {
      id: 6,
      title: "The Science of Compression Socks in Athletic Performance",
      category: "Stories",
      image: "https://images.unsplash.com/photo-1597137759489-f4d0b1fbc651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHNvY2tzJTIwcnVubmluZ3xlbnwxfHx8fDE3NTcwODMxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 2, 2025"
    },
    {
      id: 7,
      title: "Vintage Sock Collecting: A Growing Market Analysis",
      category: "About",
      image: "https://images.unsplash.com/photo-1734523960913-8e2ef63b1a2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzb2NrcyUyMGZhc2hpb24lMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzU2OTgwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 2, 2025"
    },
    {
      id: 8,
      title: "Luxury Sock Brands: The Rise of Premium Footwear Fashion",
      category: "Brands",
      image: "https://images.unsplash.com/photo-1734523506485-9e457e09f60b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc29ja3MlMjBsdXh1cnl8ZW58MXx8fHwxNzU3MjUyNzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 1, 2025"
    },
    {
      id: 9,
      title: "Performance Testing: Best Athletic Socks for Runners",
      category: "Stories",
      image: "https://images.unsplash.com/photo-1607255948106-18b1704e07b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHNvY2tzJTIwZGVzaWdufGVufDF8fHx8MTc1NzI1MjczOXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Sep 1, 2025"
    },
    {
      id: 10,
      title: "Colorful Expression: How Socks Became Statement Pieces",
      category: "News",
      image: "https://images.unsplash.com/photo-1679391903287-b52bee558313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNvY2tzJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NTcyNTI3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Aug 31, 2025"
    },
    {
      id: 11,
      title: "Behind the Scenes: How Socks Are Made in Modern Factories",
      category: "Drops",
      image: "https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NrJTIwbWFudWZhY3R1cmluZyUyMHRleHRpbGV8ZW58MXx8fHwxNzU3MjUyNzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishedAt: "Aug 31, 2025"
    }
  ];

  // Функция для генерации дополнительных статей
  const generateMoreArticles = (startId: number): Article[] => {
    const additionalImages = [
      "https://images.unsplash.com/photo-1608357746078-342b38f738c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc29ja3MlMjBmYXNoaW9ufGVufDF8fHx8MTc1NzI1MzIyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1698821610670-731514d37c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NrJTIwY29sbGVjdGlvbiUyMGRpc3BsYXl8ZW58MXx8fHwxNzU3MjUzMjMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1680420562679-74976cfbc0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBzb2Nrc3xlbnwxfHx8fDE3NTcyNTMyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1598031018189-fa4e3f3b03f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwdGVjaCUyMHNvY2tzfGVufDF8fHx8MTc1NzI1MzIzNXww&ixlib=rb-4.1.0&q=80&w=1080"
    ];
    
    const titles = [
      "Premium Sock Market: Luxury Meets Functionality",
      "Curated Collections: The Art of Sock Display",
      "Sustainable Innovation in Sock Manufacturing",
      "Tech-Enhanced Socks: The Future of Footwear",
      "Heritage Brands Reimagining Classic Designs",
      "Minimalist Sock Trends Taking Over Fashion",
      "Performance Socks for Professional Athletes",
      "Artisan Crafted Socks: Quality Over Quantity"
    ];
    
    const categories = ["News", "Drops", "Stories", "Brands"];
    const dates = ["Aug 30, 2025", "Aug 29, 2025", "Aug 28, 2025", "Aug 27, 2025"];
    
    return Array.from({ length: 8 }, (_, index) => ({
      id: startId + index,
      title: titles[index % titles.length],
      category: categories[index % categories.length],
      image: additionalImages[index % additionalImages.length],
      publishedAt: dates[index % dates.length]
    }));
  };

  // Функция загрузк�� дополнительных статей
  const loadMoreArticles = async () => {
    setIsLoading(true);
    
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newArticles = generateMoreArticles(bottomArticles.length + displayedArticles - 8 + 1);
    bottomArticles.push(...newArticles);
    setDisplayedArticles(prev => prev + 8);
    setIsLoading(false);
  };

  // Получаем статьи для отображения
  const articlesToDisplay = bottomArticles.slice(0, displayedArticles);

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Верхняя секция: главная статья + две боковые */}
        {/* Мобильная версия: главная статья + две статьи в ряд под ней */}
        <div className="lg:hidden mb-12">
          {/* Главная статья на мобиле */}
          <div className="mb-6">
            <article className="group cursor-pointer h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md mb-4">
                <ImageWithFallback
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                    {featuredArticle.category}
                  </span>
                  <span className="text-foreground/40 ml-2">
                    {featuredArticle.publishedAt}
                  </span>
                </div>
                
                <h1 className="text-2xl group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {featuredArticle.title}
                </h1>
                
                <p className="text-foreground/70 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>
            </article>
          </div>

          {/* Две с��атьи в ряд на мобиле */}
          <div className="grid grid-cols-2 gap-4">
            {sideArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                    <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                      {article.category}
                    </span>
                    <span className="text-foreground/40 ml-2">
                      {article.publishedAt}
                    </span>
                  </div>
                  
                  <h4 className="text-sm group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {article.title}
                  </h4>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Десктопная версия: главная статья слева + две статьи справа */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Главная статья */}
          <div className="lg:col-span-2">
            <article className="group cursor-pointer h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md mb-4">
                <ImageWithFallback
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                    {featuredArticle.category}
                  </span>
                  <span className="text-foreground/40 ml-2">
                    {featuredArticle.publishedAt}
                  </span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {featuredArticle.title}
                </h1>
                
                <p className="text-foreground/70 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>
            </article>
          </div>

          {/* Две статьи справа на десктопе */}
          <div className="space-y-6">
            {sideArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-3">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                    <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                      {article.category}
                    </span>
                    <span className="text-foreground/40 ml-2">
                      {article.publishedAt}
                    </span>
                  </div>
                  
                  <h3 className="text-lg group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Табуляция */}
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('hype')}
              className={`text-lg transition-colors ${
                activeTab === 'hype' 
                  ? 'text-foreground' 
                  : 'text-foreground/40 hover:text-foreground/70'
              }`}
              style={{ fontFamily: 'var(--font-headlines)' }}
            >
              Hype
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`text-lg transition-colors ${
                activeTab === 'latest' 
                  ? 'text-foreground' 
                  : 'text-foreground/40 hover:text-foreground/70'
              }`}
              style={{ fontFamily: 'var(--font-headlines)' }}
            >
              Latest
            </button>
          </div>
        </div>

        {/* Нижняя секция: статьи с подгрузкой */}
        {/* На мобиле - по 2 в ряд, на десктопе - по 4 в ряд */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {articlesToDisplay.map((article) => (
            <article key={article.id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-md mb-3">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="italic uppercase" style={{ color: '#FF00A8' }}>
                    {article.category}
                  </span>
                  <span className="text-foreground/40 ml-2">
                    {article.publishedAt}
                  </span>
                </div>
                
                <h4 className="text-sm group-hover:text-foreground/70 transition-colors leading-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
                  {article.title}
                </h4>
              </div>
            </article>
          ))}
        </div>

        {/* Кнопка загрузки дополнительных статей */}
        <div className="flex justify-center">
          <button
            onClick={loadMoreArticles}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span className="italic" style={{ color: '#FF00A8' }}>
              Ticket to
            </span>
            <span>
              {isLoading ? 'loading...' : 'loading more'}
            </span>
            {!isLoading && <span>→</span>}
          </button>
        </div>
      </div>
    </section>
  );
}