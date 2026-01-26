import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub, FaLinkedin, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiCheck, HiExternalLink, HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import { socialService } from '../../services/api';

const Social = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({ platform: 'github', url: '' });
  const [saving, setSaving] = useState(false);

  const fetchLinks = async () => {
    try {
      const res = await socialService.getAll();
      setLinks(res.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const getIcon = (platform) => {
    const icons = { 
      github: FaGithub, 
      linkedin: FaLinkedin, 
      twitter: FaTwitter,
      facebook: FaFacebook,
      youtube: FaYoutube,
      x: FaXTwitter,
      telegram: FaTelegram
    };
    const Icon = icons[platform?.toLowerCase()] || HiExternalLink;
    return <Icon className="w-5 h-5" />;
  };

  const openModal = (link = null) => {
    setEditingLink(link);
    setFormData(link ? { platform: link.platform, url: link.url } : { platform: 'github', url: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingLink) await socialService.update(editingLink.id, formData);
      else await socialService.create(formData);
      fetchLinks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return;
    await socialService.delete(id);
    setLinks(links.filter(l => l.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Social Links</h1>
        <button onClick={() => openModal()} className="btn-primary"><HiPlus className="w-5 h-5" /> Add</button>
      </div>
      <div className="space-y-3">
        {links.map(link => (
          <div key={link.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700">{getIcon(link.platform)}</div>
            <div className="flex-1">
              <p className="font-medium capitalize">{link.platform}</p>
              <a href={link.url} target="_blank" className="text-sm text-slate-500 truncate block">{link.url}</a>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
              <button onClick={() => openModal(link)} className="p-2 rounded-lg hover:bg-slate-100"><HiPencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-600"><HiTrash className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!links.length && <p className="text-center py-12 text-slate-500">No links yet.</p>}
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl">
              <div className="flex justify-between p-6 border-b border-slate-100 dark:border-slate-700"><h2 className="font-semibold">{editingLink ? 'Edit' : 'Add'} Link</h2><button onClick={() => setIsModalOpen(false)}><HiX /></button></div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium mb-2">Platform</label><select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="input">{['github','linkedin','twitter','facebook','youtube','x','telegram'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">URL</label><input type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} required className="input" /></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1"><HiCheck />Save</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Social;
