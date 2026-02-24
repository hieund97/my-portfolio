import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import {
    HiCheck,
    HiExternalLink,
    HiMenu,
    HiPencil,
    HiPlus,
    HiTrash,
    HiUpload,
    HiX,
} from 'react-icons/hi';
import { projectsService } from '../../services/api';

const SortableProjectCard = ({
  project,
  openModal,
  handleDelete,
  handleImageUpload,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 overflow-hidden group h-full flex flex-col"
    >
      <div className="relative h-40 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
        {project.image ? (
          <img
            src={`/uploads/${project.image}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 cursor-grab active:cursor-grabbing hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm opacity-0 group-hover:opacity-100 z-20"
        >
          <HiMenu className="w-4 h-4" />
        </div>

        <label className="absolute bottom-2 right-2 p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-colors">
          <HiUpload className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, project.id)}
            className="hidden"
          />
        </label>
        {project.featured && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded bg-yellow-500 text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{project.title}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => openModal(project)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {project.technologies?.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-700"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-700">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-auto pt-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <HiExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = async () => {
    try {
      const res = await projectsService.getAll();
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description || '',
        technologies: project.technologies || [],
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured || false,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        featured: false,
      });
    }
    setTechInput('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        await projectsService.update(editingProject.id, formData);
      } else {
        await projectsService.create(formData);
      }
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleImageUpload = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await projectsService.uploadImage(projectId, file);
      fetchProjects();
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      try {
        const items = newProjects.map((p, idx) => ({
          id: p.id,
          displayOrder: idx + 1,
        }));
        await projectsService.reorder(items);
      } catch (error) {
        console.error('Failed to reorder projects:', error);
        // Optional: Revert on error
        fetchProjects();
      }
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">Projects</h1>
          <button onClick={() => openModal()} className="btn-primary">
            <HiPlus className="w-5 h-5" /> Add Project
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={projects} strategy={rectSortingStrategy}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  openModal={openModal}
                  handleDelete={handleDelete}
                  handleImageUpload={handleImageUpload}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No projects yet. Click "Add Project" to get started.
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg my-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold">
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 max-h-[60vh] overflow-y-auto"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="input resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' && (e.preventDefault(), addTech())
                      }
                      className="input flex-1"
                      placeholder="React"
                    />
                    <button type="button" onClick={addTech} className="btn-secondary">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-slate-100 dark:bg-slate-700"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-red-500"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          liveUrl: e.target.value,
                        }))
                      }
                      className="input"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          githubUrl: e.target.value,
                        }))
                      }
                      className="input"
                      placeholder="https://github.com/"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium">Featured project</span>
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
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

export default Projects;
