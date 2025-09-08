import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getDropsByTab } from '../data/mockData';

export function DropsPage() {
  const articles = {
    hype: getDropsByTab('hype'),
    latest: getDropsByTab('latest')
  };

  return (
    <>
      <SEO 
        title="to Drops — Latest Sock Releases & Collaborations | Ticket to Socks"
        description="Discover the hottest sock drops, limited releases, and brand collaborations. Never miss a fresh drop from your favorite sock brands."
        keywords="sock drops, limited edition socks, sock collaborations, new releases, sock launches, exclusive socks"
      />
      
      <CategoryPageTemplate
        title="Drops"
        articles={articles}
        seoTitle="to Drops — Latest Sock Releases & Collaborations | Ticket to Socks"
        seoDescription="Discover the hottest sock drops, limited releases, and brand collaborations. Never miss a fresh drop from your favorite sock brands."
        seoKeywords="sock drops, limited edition socks, sock collaborations, new releases, sock launches, exclusive socks"
      />
    </>
  );
}