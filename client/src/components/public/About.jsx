import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiLocationMarker, HiMail } from 'react-icons/hi';
import { useLanguage } from '../../contexts/LanguageContext';

const About = ({ profile = {} }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="about" className="section bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="badge mb-4"
            >
              {t('about.badge')}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold text-balance"
            >
              {t('about.title')}{' '}
              <span className="gradient-text">{t('about.titleHighlight')}</span>
            </motion.h2>
          </div>

          {/* Content grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image/Avatar side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl transform rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl transform -rotate-3 opacity-10" />
                
                {/* Main image container */}
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  {profile.avatar ? (
                    <img 
                      src={`/uploads/${profile.avatar}`} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full aspect-square bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
                      <span className="text-8xl font-bold gradient-text">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {profile.bio || 'A passionate developer with a love for creating beautiful, functional web experiences. I specialize in building modern applications using cutting-edge technologies.'}
                </p>
              </div>

              {/* Info cards */}
              <div className="grid gap-4 mt-8">
                {profile.location && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      <HiLocationMarker className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-500">{t('about.location')}</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
                
                {profile.email && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="p-3 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                      <HiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-500">{t('about.email')}</p>
                      <a href={`mailto:${profile.email}`} className="font-medium hover:text-primary-600 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
