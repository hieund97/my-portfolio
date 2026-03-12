import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/public/Footer';
import Navbar from '../../components/public/Navbar';
import PriceCalculator from '../../components/public/PriceCalculator';
import { useLanguage } from '../../contexts/LanguageContext';
import { profileService, socialService } from '../../services/api';

const Pricing = () => {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, socialRes] = await Promise.all([
          profileService.get(),
          socialService.getAll(),
        ]);
        setProfile(profileRes.data);
        setSocialLinks(socialRes.data);
      } catch (error) {
        console.error(t('common.fetchError'), error);
      }
    };
    fetchData();
  }, [t]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('seo.pricing.title')}</title>
        <meta name="description" content={t('seo.pricing.description')} />
        <meta name="keywords" content={t('seo.pricing.keywords')} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={t('seo.pricing.title')} />
        <meta property="og:description" content={t('seo.pricing.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.pricing.title')} />
        <meta name="twitter:description" content={t('seo.pricing.description')} />
        
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": t('seo.pricing.title'),
            "description": t('seo.pricing.description'),
            "provider": {
              "@type": "Person",
              "name": profile.name || "Hiếu",
              "url": window.location.origin
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": language === 'vi' ? 'VND' : 'USD',
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
      <Navbar />
      <main className="pt-20">
        <PriceCalculator />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  );
};

export default Pricing;
