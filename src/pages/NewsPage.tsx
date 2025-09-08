import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getNewsByTab } from '../data/mockData';

export function NewsPage() {
  const articles = {
    hype: getNewsByTab('hype'),
    latest: getNewsByTab('latest')
  };

  return (
    <>
      <SEO 
        title="to News — Latest Sock Culture & Industry Updates | Ticket to Socks"
        description="Stay updated with the latest news in sock fashion, industry trends, brand collaborations, and cultural movements shaping the sock world."
        keywords="sock news, fashion news, sock industry, streetwear news, athletic sock trends, sock culture news"
      />
      
      <CategoryPageTemplate
        title="News"
        articles={articles}
        seoTitle="to News — Latest Sock Culture & Industry Updates | Ticket to Socks"
        seoDescription="Stay updated with the latest news in sock fashion, industry trends, brand collaborations, and cultural movements shaping the sock world."
        seoKeywords="sock news, fashion news, sock industry, streetwear news, athletic sock trends, sock culture news"
      />
    </>
  );
}