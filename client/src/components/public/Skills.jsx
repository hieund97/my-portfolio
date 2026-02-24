import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaJava, FaMicrosoft } from 'react-icons/fa';
import {
  SiAmazonwebservices,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGooglecloud,
  SiGraphql,
  SiJavascript,
  SiKubernetes,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPaypal,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiRabbitmq,
  SiReact,
  SiRedis,
  SiRedux,
  SiSass,
  SiSpringboot,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWordpress
} from 'react-icons/si';
import { useLanguage } from '../../contexts/LanguageContext';

const Skills = ({ skills = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const getSkillIcon = (iconName) => {
    const icons = {
      react: { icon: SiReact, color: '#61DAFB' },
      node: { icon: SiNodedotjs, color: '#339933' },
      nodejs: { icon: SiNodedotjs, color: '#339933' },
      typescript: { icon: SiTypescript, color: '#3178C6' },
      javascript: { icon: SiJavascript, color: '#F7DF1E' },
      python: { icon: SiPython, color: '#3776AB' },
      mongodb: { icon: SiMongodb, color: '#47A248' },
      postgresql: { icon: SiPostgresql, color: '#4169E1' },
      docker: { icon: SiDocker, color: '#2496ED' },
      tailwind: { icon: SiTailwindcss, color: '#06B6D4' },
      tailwindcss: { icon: SiTailwindcss, color: '#06B6D4' },
      git: { icon: SiGit, color: '#F05032' },
      aws: { icon: SiAmazonwebservices, color: '#232F3E' },
      figma: { icon: SiFigma, color: '#F24E1E' },
      vue: { icon: SiVuedotjs, color: '#4FC08D' },
      vuejs: { icon: SiVuedotjs, color: '#4FC08D' },
      php: { icon: SiPhp, color: '#777BB4' },
      java: { icon: FaJava, color: '#007396' },
      gcp: { icon: SiGooglecloud, color: '#4285F4' },
      googlecloud: { icon: SiGooglecloud, color: '#4285F4' },
      azure: { icon: FaMicrosoft, color: '#00A4EF' },
      kubernetes: { icon: SiKubernetes, color: '#326CE5' },
      k8s: { icon: SiKubernetes, color: '#326CE5' },
      rabbitmq: { icon: SiRabbitmq, color: '#FF6600' },
      mysql: { icon: SiMysql, color: '#4479A1' },
      redis: { icon: SiRedis, color: '#DC382D' },
      nextjs: { icon: SiNextdotjs, color: '#000000' },
      nestjs: { icon: SiNestjs, color: '#E0234E' },
      flutter: { icon: SiFlutter, color: '#02569B' },
      firebase: { icon: SiFirebase, color: '#FFCA28' },
      supabase: { icon: SiSupabase, color: '#3ECF8E' },
      graphql: { icon: SiGraphql, color: '#E10098' },
      redux: { icon: SiRedux, color: '#764ABC' },
      sass: { icon: SiSass, color: '#CC6699' },
      mui: { icon: SiMui, color: '#007FFF' },
      wordpress: { icon: SiWordpress, color: '#21759B' },
      laravel: { icon: SiLaravel, color: '#FF2D20' },
      springboot: { icon: SiSpringboot, color: '#6DB33F' },
      linux: { icon: SiLinux, color: '#FCC624' },
      nginx: { icon: SiNginx, color: '#009639' },
      express: { icon: SiExpress, color: '#000000' },
      prisma: { icon: SiPrisma, color: '#2D3748' },
      stripe: { icon: SiStripe, color: '#008CDD' },
      paypal: { icon: SiPaypal, color: '#003087' },
      vnpay: { icon: null, color: '#005baa' },
      momo: { icon: null, color: '#ae196e' },
      payoo: { icon: null, color: '#79bc42' },
    };
    
    const iconKey = iconName?.toLowerCase();
    const skillData = icons[iconKey];
    if (!skillData && !['momo', 'vnpay', 'payoo'].includes(iconKey)) return null;
    
    const iconClass = "w-8 h-8 transition-transform duration-300 group-hover:scale-110";

    if (iconKey === 'momo') {
      return (
        <svg viewBox="0 0 24 24" className={iconClass} style={{ fill: icons.momo.color }}>
          <path d="M18.5 2h-13C3.57 2 2 3.57 2 5.5v13c0 1.93 1.57 3.5 3.5 3.5h13c1.93 0 3.5-1.57 3.5-3.5v-13c0-1.93-1.57-3.5-3.5-3.5zM9 17H7v-7h2v7zm4 0h-2v-7h2v7zm4 0h-2v-7h2v7zm-8-9H7V6h2v2zm4 0h-2V6h2v2zm4 0h-2V6h2v2z"/>
        </svg>
      );
    }

    if (iconKey === 'vnpay') {
      return (
        <svg viewBox="0 0 24 24" className={iconClass} style={{ fill: icons.vnpay.color }}>
          <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM7 7v10h2l3-6 3 6h2V7h-2v6l-3-6-3 6V7H7z"/>
        </svg>
      );
    }

    if (iconKey === 'payoo') {
      return (
        <svg viewBox="0 0 24 24" className={iconClass} style={{ fill: icons.payoo.color }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v10h-2V7zm-4 4h2l1 2 1-2h2l-2 4 2 4H7l1-2 1 2h2l-2-4 2-4z"/>
        </svg>
      );
    }

    const IconComponent = skillData.icon;
    return <IconComponent className={iconClass} style={{ color: skillData.color }} />;
  };


  const categories = ['frontend', 'backend', 'payments', 'tools', 'other'];

  const categoryTitles = {
    frontend: 'FE',
    backend: 'BE',
    payments: 'PA',
    tools: 'DO', // DevOps/Cloud mapping
    other: 'DB'  // Database mapping
  };

  // Default skills if none provided
  const defaultSkills = [
    { id: 1, name: 'React', category: 'frontend', icon: 'react' },
    { id: 2, name: 'Next.js', category: 'frontend', icon: 'nextjs' },
    { id: 3, name: 'TypeScript', category: 'frontend', icon: 'typescript' },
    { id: 4, name: 'Tailwind CSS', category: 'frontend', icon: 'tailwind' },
    { id: 5, name: 'Node.js', category: 'backend', icon: 'nodejs' },
    { id: 6, name: 'Python', category: 'backend', icon: 'python' },
    { id: 7, name: 'Docker', category: 'tools', icon: 'docker' },
    { id: 8, name: 'AWS', category: 'tools', icon: 'aws' },
    { id: 9, name: 'PostgreSQL', category: 'other', icon: 'postgresql' },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;
  const displayGrouped = categories.reduce((acc, category) => {
    acc[category] = displaySkills.filter(s => s.category === category);
    return acc;
  }, {});

  return (
    <section id="skills" className="relative py-20 bg-slate-50 dark:bg-[#0B0F19] overflow-hidden transition-colors duration-500">
      <div className="container-custom relative z-10 w-full max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-12"
        >
          {/* Section header */}
          <div className="text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-primary-600 dark:text-cyan-400 mb-3"
            >
              Tech Stack
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white"
            >
              Technologies & Tools
            </motion.h2>
          </div>

          {/* Core Layout: Rows of categories */}
          <div className="flex flex-col gap-6 md:gap-8">
            {categories.map((category, categoryIndex) => {
              const categorySkills = displayGrouped[category];
              if (categorySkills.length === 0) return null;

              // Override category titles for better SaaS terminology if using default categories
              let displayCategoryTitle = t(`skills.${category}`);
              if (category === 'tools') displayCategoryTitle = 'DevOps & Cloud';
              if (category === 'other') displayCategoryTitle = 'Database & Architecture';

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + categoryIndex * 0.1 }}
                  className="flex flex-col md:flex-row gap-4 md:gap-8 items-start relative group"
                >
                  {/* Category Label (Left Side) - Fixed width on Desktop */}
                  <div className="w-full md:w-48 lg:w-56 flex-shrink-0 pt-2 border-b md:border-b-0 border-slate-200 dark:border-white/10 md:border-r md:pr-4">
                    <h3 className="text-sm tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400 pb-2 md:pb-0">
                      {displayCategoryTitle}
                    </h3>
                  </div>

                  {/* Tech Chips (Right Side) - Flex Wrap */}
                  <div className="flex flex-wrap gap-2.5 md:gap-3 flex-1">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.4 + index * 0.03 }}
                        className="cursor-pointer"
                      >
                        {/* Compact Chip Glass Card */}
                        <div className="relative group/chip tech-chip bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:border-primary-300 dark:hover:border-white/20 rounded-lg px-3 py-2 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                           {/* Hover Neon Glow Effect */}
                           <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover/chip:from-primary-500/5 group-hover/chip:to-cyan-500/5 opacity-0 group-hover/chip:opacity-100 transition-opacity duration-200"></div>
                           
                           <div className="relative z-10 flex items-center justify-center filter group-hover/chip:brightness-110 transition-all duration-200 scale-90 group-hover/chip:scale-100">
                              {getSkillIcon(skill.icon)}
                           </div>
                           <h4 className="relative z-10 font-medium text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap group-hover/chip:text-slate-900 dark:group-hover/chip:text-white transition-colors duration-200">
                              {skill.name}
                           </h4>
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

      <style dangerouslySetInnerHTML={{__html: `
        .tech-chip {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}} />
    </section>
  );
};

export default Skills;
