import { SEO } from '../components/SEO';
import { CategoryPageTemplate } from '../components/CategoryPageTemplate';
import { getStoriesByTab } from '../data/mockData';

export function StoriesPage() {
  const articles = {
    hype: getStoriesByTab('hype'),
    latest: getStoriesByTab('latest')
  };

  return (
    <>
      <SEO 
        title="to Stories — In-Depth Features & Profiles | Ticket to Socks"
        description="Deep dives into sock culture, brand stories, designer profiles, and the people shaping the future of foot fashion."
        keywords="sock stories, fashion features, brand profiles, sock culture, designer interviews, sock history"
      />
      
      <CategoryPageTemplate
        title="Stories"
        articles={articles}
        seoTitle="to Stories — In-Depth Features & Profiles | Ticket to Socks"
        seoDescription="Deep dives into sock culture, brand stories, designer profiles, and the people shaping the future of foot fashion."
        seoKeywords="sock stories, fashion features, brand profiles, sock culture, designer interviews, sock history"
      />
    </>
  );
}