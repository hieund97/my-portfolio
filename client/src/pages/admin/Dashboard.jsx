import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    HiBriefcase,
    HiCollection,
    HiEye,
    HiLightningBolt,
    HiMail,
    HiUser
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { ADMIN_PATH } from '../../constants';
import {
    experienceService, messagesService,
    profileService,
    projectsService,
    skillsService
} from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profileRes, skillsRes, projectsRes, expRes, msgsRes, unreadRes] = await Promise.all([
          profileService.get(),
          skillsService.getAll(),
          projectsService.getAll(),
          experienceService.getAll(),
          messagesService.getAll(),
          messagesService.getUnreadCount(),
        ]);

        setProfile(profileRes.data);
        setStats({
          skills: skillsRes.data.length,
          projects: projectsRes.data.length,
          experience: expRes.data.length,
          messages: msgsRes.data.length,
          unreadMessages: unreadRes.data.count,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          Welcome back, <span className="gradient-text">{profile.name || 'Admin'}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your portfolio
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiLightningBolt}
          label="Total Skills"
          value={stats.skills}
          color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
          delay={0.1}
        />
        <StatCard
          icon={HiCollection}
          label="Projects"
          value={stats.projects}
          color="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
          delay={0.2}
        />
        <StatCard
          icon={HiBriefcase}
          label="Experience"
          value={stats.experience}
          color="bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400"
          delay={0.3}
        />
        <StatCard
          icon={HiMail}
          label="Messages"
          value={`${stats.unreadMessages} unread`}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          delay={0.4}
        />
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to={`/${ADMIN_PATH}/profile`}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/30 hover:shadow-lg transition-shadow"
          >
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
              <HiUser className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-semibold">Edit Profile</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update your info</p>
            </div>
          </Link>

          <Link
            to={`/${ADMIN_PATH}/projects`}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
          >
            <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-900/30 shadow-sm">
              <HiCollection className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <p className="font-semibold">Add Project</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Showcase your work</p>
            </div>
          </Link>

          <a
            href="/"
            target="_blank"
            className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
          >
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/30 shadow-sm">
              <HiEye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">View Portfolio</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">See live version</p>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

