import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaJava, FaMicrosoft } from 'react-icons/fa';
import { HiCheck, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';
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
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWordpress
} from 'react-icons/si';
import { skillsService } from '../../services/api';

const categoryOptions = ['frontend', 'backend', 'tools', 'other'];
const iconOptions = [
  'react', 'nodejs', 'typescript', 'javascript', 'python', 'mongodb', 'postgresql', 
  'docker', 'tailwind', 'git', 'aws', 'figma', 'vuejs', 'php', 'java', 'googlecloud', 
  'azure', 'kubernetes', 'rabbitmq', 'mysql', 'redis', 'nextjs', 'nestjs', 'flutter', 
  'firebase', 'supabase', 'graphql', 'redux', 'sass', 'mui', 'wordpress', 'laravel', 
  'springboot', 'linux', 'nginx', 'express', 'prisma'
];

const Skills = () => {
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
    };
    const Icon = icons[iconName?.toLowerCase()];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

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
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="input"
                  >
                    <option value="">None</option>
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
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
