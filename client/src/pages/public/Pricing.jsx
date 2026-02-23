import { useEffect, useState } from 'react';
import Footer from '../../components/public/Footer';
import Navbar from '../../components/public/Navbar';
import PriceCalculator from '../../components/public/PriceCalculator';
import { useLanguage } from '../../contexts/LanguageContext';
import { profileService, socialService } from '../../services/api';

const Pricing = () => {
  const { t } = useLanguage();
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
      <Navbar />
      <main className="pt-20">
        <PriceCalculator />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  );
};

export default Pricing;
