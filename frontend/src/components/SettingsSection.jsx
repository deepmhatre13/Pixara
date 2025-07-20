import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, MapPin, FileText, Phone, Globe, Calendar, 
  Camera, Upload, Moon, Sun, Trash2, Save, AlertTriangle,
  Edit3, Users, Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SettingsSection = () => {
  const { user, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    gender: '',
    birthdate: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: isDark ? Moon : Sun },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        website: user.website || '',
        gender: user.gender || '',
        birthdate: user.birthdate || '',
      });
      setProfilePreview(user.profile_picture);
      setCoverPreview(user.cover_photo);
    }
  }, [user]);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'profile') {
          setProfilePicture(file);
          setProfilePreview(e.target.result);
        } else {
          setCoverPhoto(file);
          setCoverPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });
      
      if (profilePicture) formData.append('profile_picture', profilePicture);
      if (coverPhoto) formData.append('cover_photo', coverPhoto);

      const result = await updateProfile(formData);
      if (result.success) {
        showFeedback('success', 'Profile updated successfully!');
      } else {
        showFeedback('error', 'Failed to update profile');
      }
    } catch (error) {
      showFeedback('error', 'An error occurred while updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      showFeedback('success', 'Account deletion initiated');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  const renderProfileSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >

      {/* Profile Picture Section */}
      <div className="glass dark:glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-orbitron font-bold text-gray-800 dark:text-white mb-6">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center overflow-hidden">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-neonCyan" />
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'profile')}
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-full hover:shadow-neon transition-all duration-300 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </label>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Upload new picture</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">JPG, PNG or GIF. Max size 5MB</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="glass dark:glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-orbitron font-bold text-gray-800 dark:text-white mb-6">
          Profile Information
        </h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                  placeholder="Enter website URL"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Birth Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={profileData.birthdate}
                  onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                placeholder="Enter location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isUpdating}
            className="w-full py-3 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-lg hover:shadow-neon transition-all duration-300 font-medium disabled:opacity-50 btn-neon flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-5 h-5" />
            <span>{isUpdating ? 'Updating...' : 'Save Changes'}</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );

  const renderAppearanceSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="glass dark:glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-orbitron font-bold text-gray-800 dark:text-white mb-6">
          Appearance Settings
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isDark ? (
              <Moon className="w-6 h-6 text-neonPurple" />
            ) : (
              <Sun className="w-6 h-6 text-neonCyan" />
            )}
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Dark Mode
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-16 h-8 bg-gradient-to-r from-neonCyan to-neonPurple rounded-full p-1 shadow-lg hover:shadow-neon transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
              animate={{
                x: isDark ? 24 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-spacePurple" />
              ) : (
                <Sun className="w-4 h-4 text-neonCyan" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderDangerSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="glass dark:glass-dark rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
        <h3 className="text-xl font-orbitron font-bold text-red-600 dark:text-red-400 mb-6 flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6" />
          <span>Danger Zone</span>
        </h3>
        
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
            Delete Account
          </h4>
          <p className="text-sm text-red-700 dark:text-red-400 mb-4">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>
          
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Delete Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'appearance':
        return renderAppearanceSection();
      case 'danger':
        return renderDangerSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-softSky to-white dark:from-spaceBlack dark:to-spacePurple">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </motion.div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                feedback.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass dark:glass-dark rounded-2xl p-4 sticky top-8">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-neonCyan/20 to-neonPurple/20 text-neonCyan border border-neonCyan/30'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 hover:text-neonCyan'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass dark:glass-dark rounded-2xl w-full max-w-md p-6 border-2 border-red-200 dark:border-red-800"
            >
              <div className="text-center mb-6">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Delete Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This action cannot be undone. Type "DELETE" to confirm.
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white mb-4"
              />

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: deleteConfirmation === 'DELETE' ? 1.02 : 1 }}
                  whileTap={{ scale: deleteConfirmation === 'DELETE' ? 0.98 : 1 }}
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsSection;