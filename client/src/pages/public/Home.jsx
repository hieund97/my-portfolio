import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Contact from '../../components/public/Contact';
import Experience from '../../components/public/Experience';
import Footer from '../../components/public/Footer';
import Hero from '../../components/public/Hero';
import Navbar from '../../components/public/Navbar';
import Projects from '../../components/public/Projects';
import Skills from '../../components/public/Skills';
import { experienceService, profileService, projectsService, skillsService, socialService } from '../../services/api';

import { useLanguage } from '../../contexts/LanguageContext';

// Home Page Component
const Home = () => {
  const { t } = useLanguage();
  const [data, setData] = useState({
    profile: {},
    skills: [],
    projects: [],
    experience: [],
    socialLinks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes, experienceRes, socialRes] = await Promise.all([
          profileService.get(),
          skillsService.getAll(),
          projectsService.getAll(),
          experienceService.getAll(),
          socialService.getAll(),
        ]);

        setData({
          profile: profileRes.data,
          skills: skillsRes.data,
          projects: projectsRes.data,
          experience: experienceRes.data,
          socialLinks: socialRes.data,
        });
      } catch (error) {
        console.error(t('common.fetchError'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
        <meta name="keywords" content={t('seo.home.keywords')} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={t('seo.home.title')} />
        <meta property="og:description" content={t('seo.home.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.home.title')} />
        <meta name="twitter:description" content={t('seo.home.description')} />

        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Navbar />
      <main>
        <Hero profile={data.profile} socialLinks={data.socialLinks} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Experience experience={data.experience} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} socialLinks={data.socialLinks} />
    </div>
  );
};

export default Home;
