import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiMenu, HiMoon, HiSun, HiX } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const sectionItems = [
    { name: t('nav.home'), href: '#hero' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = sectionItems.map(item => item.href.replace('#', ''));

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionItems, isHomePage]);

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
    setIsOpen(false);
  };

  const isPricingActive = location.pathname === '/pricing';

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50"
        style={{ opacity: bgOpacity, backdropFilter: blur }}
      />

      <div className="relative container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}
            className="font-display text-2xl font-bold gradient-text"
          >
            HieuIsADev
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {sectionItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isHomePage && activeSection === item.href.replace('#', '')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/pricing"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                isPricingActive
                  ? 'bg-primary-600 text-white dark:bg-cyan-500 ring-2 ring-primary-500/30'
                  : 'bg-primary-50 text-primary-600 dark:bg-cyan-500/10 dark:text-cyan-400 hover:bg-primary-100 dark:hover:bg-cyan-500/20 border border-primary-100 dark:border-cyan-500/20'
              }`}
            >
              {t('nav.pricing')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-1">
            {sectionItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isHomePage && activeSection === item.href.replace('#', '')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/pricing"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold text-center mt-2 transition-all shadow-sm ${
                isPricingActive
                  ? 'bg-primary-600 text-white dark:bg-cyan-500'
                  : 'bg-primary-50 text-primary-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-primary-100 dark:border-cyan-500/20'
              }`}
            >
              {t('nav.pricing')}
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
