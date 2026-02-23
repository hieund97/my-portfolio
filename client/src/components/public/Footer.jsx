import { FaFacebook, FaGithub, FaHeart, FaLinkedin, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = ({ profile = {}, socialLinks = [] }) => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

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
    <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and copyright */}
          <div className="text-center md:text-left">
            <a href="#hero" className="font-display text-xl font-bold gradient-text">
              HieuIsADev
            </a>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              © {currentYear} {profile.name || 'Your Name'}. All rights reserved.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>

          {/* Made with love */}
          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-500">
            {t('footer.madeWith')} <FaHeart className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
