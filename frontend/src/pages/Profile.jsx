import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Edit2, MapPin, Calendar, Heart, MessageCircle, Globe, Phone, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import FollowerCount from '../components/FollowerCount';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
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
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
   const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const profile = profileData?.profile;
const profileUser = profileData?.user;

useEffect(() => {
  const fetchProfileData = async () => {
    if (!user?.id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(
        `${API_BASE_URL}/auth/profile/${user.id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProfileData(response.data);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to load profile data'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProfileData();
}, [user]);



  useEffect(() => {
    fetchUserPosts();
    if (user) {
      setEditData({
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

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/user/${user?.id}/`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
  };

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

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      Object.keys(editData).forEach(key => {
        formData.append(key, editData[key]);
      });
      
      if (profilePicture) formData.append('profile_picture', profilePicture);
      if (coverPhoto) formData.append('cover_photo', coverPhoto);

      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-softSky to-white dark:from-spaceBlack dark:to-spacePurple">
      <div className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Cover Photo */}
        <div className="glass dark:glass-dark rounded-2xl overflow-hidden mb-8">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-neonCyan/20 to-neonPurple/20">
          
          
            
          </div>

          {/* Profile Header */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 -mt-16 md:-mt-20">
              {/* Profile Picture */}
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-1">
                  <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center overflow-hidden">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt={user?.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-neonCyan">
                        {user?.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'profile')}
                  className="hidden"
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-full hover:shadow-neon transition-all duration-300 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h1 className="text-3xl font-orbitron font-bold text-gray-800 dark:text-white">
                    {user?.username}
                  </h1>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-2 md:mt-0 px-4 py-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-lg hover:shadow-neon transition-all duration-300 btn-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 className="w-4 h-4 inline mr-2" />
                    Edit Profile
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neonCyan">{userPosts.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neonPurple">{(profile?.followers_count || 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neonPink">{(profile?.following_count || 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="space-y-2">
                  {user?.bio && (
                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {user?.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user?.website && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-neonCyan hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user?.date_joined).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={editData.website}
                          onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                          placeholder="Enter website URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Gender
                        </label>
                        <select
                          value={editData.gender}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
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
                        <input
                          type="date"
                          value={editData.birthdate}
                          onChange={(e) => setEditData({ ...editData, birthdate: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <motion.button
                        type="submit"
                        disabled={isUpdating}
                        className="px-6 py-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-lg hover:shadow-neon transition-all duration-300 btn-neon disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isUpdating ? 'Updating...' : 'Save Changes'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Follower Count Component */}
        {user && (
          <div className="mb-8">
           
          </div>
        )}

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-orbitron font-bold text-gray-800 dark:text-white">
            Your Posts
          </h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-12 glass dark:glass-dark rounded-2xl">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your first moment with the world!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;