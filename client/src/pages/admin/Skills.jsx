import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaJava, FaMicrosoft } from 'react-icons/fa';
import { HiCheck, HiCreditCard, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';
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
import Select, { components } from 'react-select';
import { useTheme } from '../../contexts/ThemeContext';
import { skillsService } from '../../services/api';

const categoryOptions = ['frontend', 'backend', 'payments', 'tools', 'other'];
const iconOptions = [
  'react', 'nodejs', 'typescript', 'javascript', 'python', 'mongodb', 'postgresql', 
  'docker', 'tailwind', 'git', 'aws', 'figma', 'vuejs', 'php', 'java', 'googlecloud', 
  'azure', 'kubernetes', 'rabbitmq', 'mysql', 'redis', 'nextjs', 'nestjs', 'flutter', 
  'firebase', 'supabase', 'graphql', 'redux', 'sass', 'mui', 'wordpress', 'laravel', 
  'springboot', 'linux', 'nginx', 'express', 'prisma', 'stripe', 'paypal', 'vnpay', 'momo', 'payoo'
];

const Skills = () => {
  const { isDark } = useTheme();
  
  const getSkillIcon = (iconName, size = "w-5 h-5") => {
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
      vue: SiVuedotjs,
      vuejs: SiVuedotjs,
      php: SiPhp,
      java: FaJava,
      gcp: SiGooglecloud,
      googlecloud: SiGooglecloud,
      azure: FaMicrosoft,
      kubernetes: SiKubernetes,
      k8s: SiKubernetes,
      rabbitmq: SiRabbitmq,
      mysql: SiMysql,
      redis: SiRedis,
      nextjs: SiNextdotjs,
      nestjs: SiNestjs,
      flutter: SiFlutter,
      firebase: SiFirebase,
      supabase: SiSupabase,
      graphql: SiGraphql,
      redux: SiRedux,
      sass: SiSass,
      mui: SiMui,
      wordpress: SiWordpress,
      laravel: SiLaravel,
      springboot: SiSpringboot,
      linux: SiLinux,
      nginx: SiNginx,
      express: SiExpress,
      prisma: SiPrisma,
      stripe: SiStripe,
      paypal: SiPaypal,
      vnpay: HiCreditCard,
      momo: HiCreditCard,
      payoo: HiCreditCard,
    };
    const Icon = icons[iconName?.toLowerCase()];
    
    // Custom SVG for specific icons not in library
    if (iconName?.toLowerCase() === 'momo') {
      return (
        <svg viewBox="0 0 24 24" className={`${size} fill-current text-[#ae196e]`}>
          <path d="M18.5 2h-13C3.57 2 2 3.57 2 5.5v13c0 1.93 1.57 3.5 3.5 3.5h13c1.93 0 3.5-1.57 3.5-3.5v-13c0-1.93-1.57-3.5-3.5-3.5zM9 17H7v-7h2v7zm4 0h-2v-7h2v7zm4 0h-2v-7h2v7zm-8-9H7V6h2v2zm4 0h-2V6h2v2zm4 0h-2V6h2v2z"/>
        </svg>
      );
    }
    
    if (iconName?.toLowerCase() === 'vnpay') {
      return (
        <svg viewBox="0 0 24 24" className={`${size} fill-current text-[#005baa]`}>
          <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM7 7v10h2l3-6 3 6h2V7h-2v6l-3-6-3 6V7H7z"/>
        </svg>
      );
    }

    if (iconName?.toLowerCase() === 'payoo') {
      return (
        <svg viewBox="0 0 24 24" className={`${size} fill-current text-[#79bc42]`}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v10h-2V7zm-4 4h2l1 2 1-2h2l-2 4 2 4H7l1-2 1 2h2l-2-4 2-4z"/>
        </svg>
      );
    }

    return Icon ? <Icon className={size} /> : null;
  };

  const IconOption = (props) => (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getSkillIcon(props.data.value, "w-4 h-4")}
        </div>
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const IconSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        {getSkillIcon(props.data.value, "w-4 h-4")}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? 'rgb(30 41 59 / 0.5)' : '#fff',
      borderColor: state.isFocused ? 'rgb(99 102 241)' : isDark ? 'rgb(51 65 85 / 0.5)' : 'rgb(241 245 249)',
      borderRadius: '0.75rem',
      padding: '0.125rem 0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'rgb(99 102 241)' : isDark ? 'rgb(71 85 105)' : 'rgb(226 232 240)',
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? 'rgb(15 23 42)' : '#fff',
      border: isDark ? '1px solid rgb(51 65 85)' : '1px solid rgb(241 245 249)',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'rgb(99 102 241)' 
        : state.isFocused 
          ? isDark ? 'rgb(30 41 59)' : 'rgb(241 245 249)'
          : 'transparent',
      color: state.isSelected 
        ? '#fff' 
        : isDark ? 'rgb(203 213 225)' : 'rgb(51 65 85)',
      '&:active': {
        backgroundColor: 'rgb(99 102 241)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? 'rgb(226 232 240)' : 'rgb(51 65 85)',
    }),
    input: (base) => ({
      ...base,
      color: isDark ? 'rgb(226 232 240)' : 'rgb(51 65 85)',
    }),
  };

  const selectOptions = iconOptions.map(icon => ({
    value: icon,
    label: icon.charAt(0).toUpperCase() + icon.slice(1)
  }));

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'frontend', proficiency: 80, icon: '' });
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await skillsService.getAll();
      setSkills(res.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency, icon: skill.icon || '' });
    } else {
      setEditingSkill(null);
      setFormData({ name: '', category: 'frontend', proficiency: 80, icon: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        await skillsService.update(editingSkill.id, formData);
      } else {
        await skillsService.create(formData);
      }
      fetchSkills();
      closeModal();
    } catch (error) {
      console.error('Failed to save skill:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsService.delete(id);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  const groupedSkills = categoryOptions.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">Skills</h1>
          <button onClick={() => openModal()} className="btn-primary">
            <HiPlus className="w-5 h-5" /> Add Skill
          </button>
        </div>

        {categoryOptions.map(category => (
          groupedSkills[category].length > 0 && (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold capitalize mb-4">{category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSkills[category].map(skill => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                          {getSkillIcon(skill.icon) || <span className="text-xl">⚡</span>}
                        </div>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(skill)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ))}

        {skills.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No skills added yet. Click "Add Skill" to get started.
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="input"
                    placeholder="React"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Proficiency ({formData.proficiency}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                    className="w-full accent-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Icon (optional)</label>
                  <Select
                    options={selectOptions}
                    value={selectOptions.find(opt => opt.value === formData.icon)}
                    onChange={(opt) => setFormData(prev => ({ ...prev, icon: opt ? opt.value : '' }))}
                    placeholder="Search or Select Icon..."
                    isClearable
                    styles={selectStyles}
                    components={{ Option: IconOption, SingleValue: IconSingleValue }}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    <HiCheck className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Skills;

