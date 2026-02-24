import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiCode, HiExternalLink } from 'react-icons/hi';
import { useLanguage } from '../../contexts/LanguageContext';

const Projects = ({ projects = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  // Navigation and Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Default projects if none provided
  const defaultProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application with payment processing, inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      featured: true,
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Real-time collaborative task management application with team features and progress tracking. Manage tasks with efficiency.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSocket'],
      featured: true,
    },
    {
      id: 3,
      title: 'AI Chat Assistant',
      description: 'An intelligent chatbot powered by machine learning for customer support automation. Can be integrated into multiple platforms.',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      featured: true,
    },
    {
      id: 4,
      title: 'Corporate Portfolio',
      description: 'A modern, blazing fast portfolio for a corporate entity showcasing their services, team members, and contact forms.',
      technologies: ['Vue', 'TailwindCSS', 'Firebase'],
      featured: true,
    }
  ];

  const displayProjects = projects.length > 0 ? projects : defaultProjects;

  const maxIndex = Math.max(0, displayProjects.length - itemsPerView);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      // Show 2 items on lg screens, 1 item on smaller screens
      setItemsPerView(window.innerWidth >= 1024 ? 2 : 1);
    };
    handleResize(); // trigger on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure currentIndex stays within bounds if window resize changes maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  // Autoplay Logic
  useEffect(() => {
    if (isHovered) return; // Pause on hover
    
    // Auto slide every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovered, maxIndex]);

  const prevSlide = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const nextSlide = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1));

  return (
    <section id="projects" className="section bg-slate-50/50 dark:bg-[#0B0F19] relative py-24 md:py-32 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-primary-300/10 dark:bg-primary-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-300/10 dark:bg-cyan-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10 max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header Area With Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="text-left">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-primary-600 dark:text-cyan-400 mb-3 px-3 py-1 bg-primary-50 dark:bg-cyan-500/10 border border-primary-100 dark:border-cyan-500/20 rounded-full"
              >
                {t('projects.badge')}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white"
              >
                {t('projects.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-primary-400 dark:to-cyan-400">{t('projects.titleHighlight')}</span>
              </motion.h2>
            </div>

            {/* Top Navigation Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${currentIndex === 0 ? 'bg-slate-100/50 dark:bg-slate-800/50 border-transparent text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-cyan-500/50 active:scale-95 cursor-pointer'}`}
                aria-label="Previous Project"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center ${currentIndex >= maxIndex ? 'bg-slate-100/50 dark:bg-slate-800/50 border-transparent text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-cyan-500/50 active:scale-95 cursor-pointer'}`}
                aria-label="Next Project"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider Container */}
          <div 
            className="overflow-hidden -mx-4 px-4 pb-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div 
              className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {displayProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {/* Card Design */}
                  <div className="h-full flex flex-col bg-white dark:bg-slate-800/60 rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/60 dark:border-white/10 group transition-all duration-300 hover:shadow-2xl hover:border-primary-200 dark:hover:border-white/20">
                    
                    {/* Visual Area (Object-fit contain ensures full logo/image visibility) */}
                    <a 
                      href={project.liveUrl || project.githubUrl || '#'}
                      target={project.liveUrl || project.githubUrl ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-12 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-white/5 cursor-pointer"
                    >
                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-slate-900/20 dark:bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 backdrop-blur-[2px]">
                        <span className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <HiExternalLink className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </span>
                      </div>

                      {/* Background artistic glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-primary-400/20 to-cyan-400/20 dark:from-primary-500/20 dark:to-cyan-500/20 blur-[60px] rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-70" />
                      
                      {project.image ? (
                        <img 
                          src={`/uploads/${project.image}`} 
                          alt={project.title}
                          className="w-full h-full object-contain filter drop-shadow-xl relative z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-700 ease-out group-hover:scale-105">
                          <HiCode className="w-20 h-20 text-slate-300 dark:text-slate-700 drop-shadow-lg" />
                        </div>
                      )}
                    </a>

                    {/* Content Area */}
                    <div className="flex-grow flex flex-col p-6 sm:p-8 md:p-10">
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-3">
                          {project.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-8 line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies?.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Indicator (Optional bottom decoration) */}
          {displayProjects.length > itemsPerView && (
            <div className="flex justify-center mt-2">
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      currentIndex === idx 
                        ? 'w-8 bg-primary-500 dark:bg-cyan-400' 
                        : 'w-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
