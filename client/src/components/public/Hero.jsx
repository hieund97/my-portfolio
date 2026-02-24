import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub, FaLinkedin, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Particles from './Particles';

const Hero = ({ profile = {}, socialLinks = [] }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (profile?.avatar && profile?.avatar2) {
      const initialTimer = setTimeout(() => setIsFlipped(true), 1500);
      const interval = setInterval(() => {
        setIsFlipped(prev => !prev);
      }, 4000);
      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    } else {
      const timer = setTimeout(() => setIsFlipped(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [profile?.avatar, profile?.avatar2]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'github': return <FaGithub className="w-5 h-5" />;
      case 'linkedin': return <FaLinkedin className="w-5 h-5" />;
      case 'twitter': return <FaTwitter className="w-5 h-5" />;
      case 'facebook': return <FaFacebook className="w-5 h-5" />;
      case 'youtube': return <FaYoutube className="w-5 h-5" />;
      case 'x': return <FaXTwitter className="w-5 h-5" />;
      case 'telegram': return <FaTelegram className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0 transition-colors duration-500">
      {/* Dynamic Modern Background */}
      <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-[#0B0F19]">
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] dark:hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.04] hidden dark:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          }}
        />
        
        {/* Deep Glow Effects */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-200/40 dark:bg-primary-900/40 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-200/30 dark:bg-cyan-900/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"
        />

        <Particles />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left Column: Glassmorphism Profile Card (1 Part) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-1 flex justify-center lg:justify-start"
          >
            <div className="relative group perspective-1000 w-64 h-80 lg:w-full lg:max-w-[280px] lg:h-[400px]">
              {/* Animated Gradient Border Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
              
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0, y: [0, -10, 0] }}
                transition={{ 
                  rotateY: { duration: 0.8, type: 'spring', stiffness: 260, damping: 20 },
                  y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full h-full rounded-3xl"
              >
                {/* Front Face */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-white/10 p-1 bg-white/5"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {profile.avatar ? (
                    <img 
                      src={`/uploads/${profile.avatar}`} 
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-600/10 to-cyan-600/10 dark:from-primary-600/20 dark:to-cyan-600/20 flex items-center justify-center">
                      <span className="text-6xl font-display font-bold text-slate-800 dark:text-white/80">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Back Face */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-white/20 p-1 bg-white/5"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {profile.avatar2 ? (
                    <img 
                      src={`/uploads/${profile.avatar2}`} 
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : profile.avatar ? (
                    <img 
                      src={`/uploads/${profile.avatar}`} 
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center">
                       <span className="text-6xl font-display font-bold text-slate-400">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Content (3 Parts) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:pl-8"
          >
            {/* Greeting & Headline */}
            <div className="space-y-4">
              <span className="inline-block uppercase tracking-[0.2em] text-sm font-semibold text-primary-600 dark:text-cyan-400 bg-primary-100 dark:bg-cyan-400/10 px-4 py-1.5 rounded-full border border-primary-200 dark:border-cyan-400/20">
                {t('hero.greeting') || "Software Engineer"}
              </span>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-slate-900 dark:text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-cyan-600 dark:from-primary-400 dark:via-purple-400 dark:to-cyan-400 animate-gradient-x">
                  {profile.name || 'Your Name'}
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 font-light">
                {profile.title || 'Full Stack Developer'}
              </p>
            </div>

            {/* Description / About */}
            <div className="prose prose-lg dark:prose-invert max-w-2xl">
              <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                {profile.bio || profile.heroTagline || 'Building the future, one line of code at a time. I specialize in modern applications and scalable architectures.'}
              </p>
            </div>

            {/* CTAs & Socials Group */}
            <div className="flex flex-col xl:flex-row items-center gap-8 pt-4 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                {/* Primary CTA */}
                <button 
                  onClick={() => navigate('/pricing')}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-cyan-600 text-white rounded-xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(14,165,233,0.35)] flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <HiArrowRight className="w-5 h-5" />
                    {t('hero.getQuote')}
                  </span>
                </button>

                {/* Secondary CTAs */}
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => scrollToSection('projects')}
                    className="flex-1 sm:flex-none px-6 py-4 glass-panel border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-w-[140px]"
                  >
                    {t('hero.viewWork')}
                  </button>

                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="flex-1 sm:flex-none px-6 py-4 glass-panel border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-w-[140px]"
                  >
                    {t('hero.contact')}
                  </button>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden xl:block mx-1"></div>

              {/* Minimalist Socials */}
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-500/20 hover:border-primary-200 dark:hover:border-primary-500/50 transition-all duration-300"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Custom Styles with Theme Awareness */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        @media (prefers-color-scheme: dark) {
          .glass-panel {
            background: rgba(15, 23, 42, 0.4);
          }
        }
        /* Overwrite if class 'dark' is present on parent (e.g. html or body) */
        .dark .glass-panel {
          background: rgba(15, 23, 42, 0.4) !important;
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
          background-size: 400% 400%;
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}} />
    </section>
  );
};

export default Hero;
