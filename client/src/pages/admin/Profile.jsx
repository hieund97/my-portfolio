import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiCheck, HiLockClosed, HiSave, HiUpload } from 'react-icons/hi';
import { authService, profileService } from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    telegramId: '',
    heroTagline: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPass, setChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.get();
        setProfile(res.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await profileService.update(profile);
      setProfile(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setChangingPass(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPassMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPassMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to change password',
      });
    } finally {
      setChangingPass(false);
    }
  };

  const [uploading2, setUploading2] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await profileService.uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatar: res.data.avatar }));
      setMessage({ type: 'success', text: 'Avatar uploaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload avatar' });
    } finally {
      setUploading(false);
    }
  };

  const handleAvatar2Upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading2(true);
    try {
      const res = await profileService.uploadAvatar2(file);
      setProfile((prev) => ({ ...prev, avatar2: res.data.avatar2 }));
      setMessage({ type: 'success', text: 'Second avatar uploaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload second avatar' });
    } finally {
      setUploading2(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold mb-6">Edit Profile</h1>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}
          >
            <HiCheck className="w-5 h-5" />
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4">Avatars</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Primary Avatar */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-medium text-slate-500">
                  Primary Avatar
                </span>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    {profile.avatar ? (
                      <img
                        src={`/uploads/${profile.avatar}`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {profile.name?.charAt(0) || 'P'}
                      </span>
                    )}
                  </div>
                  <label
                    className={`btn-secondary cursor-pointer ${
                      uploading ? 'opacity-50' : ''
                    }`}
                  >
                    <HiUpload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Secondary Avatar */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-medium text-slate-500">
                  Secondary Avatar (Flip)
                </span>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-primary-500 flex items-center justify-center">
                    {profile.avatar2 ? (
                      <img
                        src={`/uploads/${profile.avatar2}`}
                        alt="Avatar 2"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {profile.name?.charAt(0) || 'S'}
                      </span>
                    )}
                  </div>
                  <label
                    className={`btn-secondary cursor-pointer ${
                      uploading2 ? 'opacity-50' : ''
                    }`}
                  >
                    <HiUpload className="w-5 h-5" />
                    {uploading2 ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatar2Upload}
                      className="hidden"
                      disabled={uploading2}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={profile.title || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Hero Tagline_
                </label>
                <input
                  type="text"
                  name="heroTagline"
                  value={profile.heroTagline || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="Building the future, one line of code at a time."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Bio / About</label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telegram ID
                </label>
                <input
                  type="text"
                  name="telegramId"
                  value={profile.telegramId || ''}
                  onChange={handleChange}
                  className="input"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            <HiSave className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-display font-bold mb-6">Account Security</h2>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          {passMessage.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-xl text-sm ${
                passMessage.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}
            >
              {passMessage.text}
            </motion.div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
                className="input"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                required
                className="input"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                className="input"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={changingPass}
              className="btn-secondary mt-2 disabled:opacity-50"
            >
              <HiLockClosed className="w-5 h-5" />
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

