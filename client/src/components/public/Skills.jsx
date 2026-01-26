import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    SiAmazonwebservices,
    SiDocker,
    SiFigma,
    SiGit,
    SiJavascript,
    SiMongodb,
    SiNodedotjs,
    SiPostgresql,
    SiPython,
    SiReact,
    SiTailwindcss,
    SiTypescript
} from 'react-icons/si';
import { useLanguage } from '../../contexts/LanguageContext';

const Skills = ({ skills = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const getSkillIcon = (iconName) => {
    const icons = {
      react: SiReact,
      node: SiNodedotjs,
      nodejs: SiNodedotjs,
      typescript: SiTypescript,
      javascript: SiJavascript,
      python: SiPython,
      mongodb: SiMongodb,
      postgresql: SiPostgresql,
      docker: SiDocker,
      tailwind: SiTailwindcss,
      tailwindcss: SiTailwindcss,
      git: SiGit,
      aws: SiAmazonwebservices,
      figma: SiFigma,
    };
    const Icon = icons[iconName?.toLowerCase()];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  const categories = ['frontend', 'backend', 'tools', 'other'];

  const groupedSkills = categories.reduce((acc, category) => {
    acc[category] = skills.filter(s => s.category === category);
    return acc;
  }, {});

  // Default skills if none provided
  const defaultSkills = [
    { id: 1, name: 'React', category: 'frontend', proficiency: 90, icon: 'react' },
    { id: 2, name: 'TypeScript', category: 'frontend', proficiency: 85, icon: 'typescript' },
    { id: 3, name: 'Node.js', category: 'backend', proficiency: 88, icon: 'nodejs' },
    { id: 4, name: 'Python', category: 'backend', proficiency: 80, icon: 'python' },
    { id: 5, name: 'MongoDB', category: 'backend', proficiency: 82, icon: 'mongodb' },
    { id: 6, name: 'Docker', category: 'tools', proficiency: 75, icon: 'docker' },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;
  const displayGrouped = categories.reduce((acc, category) => {
    acc[category] = displaySkills.filter(s => s.category === category);
    return acc;
  }, {});

  return (
    <section id="skills" className="section">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="badge mb-4"
            >
              {t('skills.badge')}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              {t('skills.title')} <span className="gradient-text">{t('skills.titleHighlight')}</span>
            </motion.h2>
          </div>

          {/* Skills grid by category */}
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => {
              const categorySkills = displayGrouped[category];
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + categoryIndex * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">
                    {t(`skills.${category}`)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-600 dark:text-primary-400">
                            {getSkillIcon(skill.icon)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{skill.name}</h4>
                          </div>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="skill-bar">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                            transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                            className="skill-progress"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
