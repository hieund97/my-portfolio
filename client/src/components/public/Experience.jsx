import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiBriefcase } from 'react-icons/hi';

const Experience = ({ experience = [] }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Default experience if none provided
  const defaultExperience = [
    {
      id: 1,
      company: 'Tech Company',
      position: 'Senior Developer',
      startDate: '2022-01',
      endDate: null,
      current: true,
      description: 'Leading development of core products, mentoring junior developers, and implementing best practices.',
    },
    {
      id: 2,
      company: 'Startup Inc',
      position: 'Full Stack Developer',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: 'Built scalable web applications and microservices architecture for rapid product iteration.',
    },
    {
      id: 3,
      company: 'Digital Agency',
      position: 'Junior Developer',
      startDate: '2018-09',
      endDate: '2020-05',
      current: false,
      description: 'Developed client websites and e-commerce solutions using modern web technologies.',
    },
  ];

  const displayExperience = experience.length > 0 ? experience : defaultExperience;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="section">
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
              Experience
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              My <span className="gradient-text">Journey</span>
            </motion.h2>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500 transform md:-translate-x-1/2" />

              {/* Experience items */}
              {displayExperience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className={`relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900 transform -translate-x-1/2 mt-6 z-10">
                    {exp.current && (
                      <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-700/50 transition-all duration-300"
                    >
                      {/* Date badge */}
                      <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Position and company */}
                      <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                      <div className={`flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <HiBriefcase className="w-4 h-4" />
                        <span>{exp.company}</span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {exp.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
