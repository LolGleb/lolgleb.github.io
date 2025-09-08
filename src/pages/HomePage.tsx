import { Hero } from '../components/Hero';
import { SubmitSection } from '../components/SubmitSection';
import { EditorsPick } from '../components/EditorsPick';
import { BrandsSection } from '../components/BrandsSection';
import { SEO } from '../components/SEO';

export function HomePage() {

  return (
    <>
      <SEO 
        title="Ticket to Socks — Indie Magazine About Socks"
        description="Independent media publication about socks. From luxury athletic socks to sustainable fashion, we cover the culture and craft behind your favorite foot fashion."
        keywords="socks, fashion, streetwear, athletic socks, sock culture, sustainable fashion, luxury socks"
      />
      <main>
        <EditorsPick />
        <Hero />
        <SubmitSection />
        
        <BrandsSection 
          defaultFilter="categories"
          defaultSelection="100% Made in USA"
          maxBrands={12}
          showAllFilters={true}
          className="border-t border-border"
        />
      </main>
    </>
  );
}