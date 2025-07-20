import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FollowerCount = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

       const response = await axios.get(
         `${API_BASE_URL}/auth/profile/${userId}/`,
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
  }, [userId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass dark:glass-dark rounded-2xl p-6 flex items-center justify-center"
      >
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-neonCyan animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Loading profile...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass dark:glass-dark rounded-2xl p-6 border-2 border-red-200 dark:border-red-800"
      >
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Profile</h3>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!profileData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass dark:glass-dark rounded-2xl p-6"
      >
        <div className="text-center text-gray-600 dark:text-gray-400">
          No profile data available
        </div>
      </motion.div>
    );
  }

  const { user, profile } = profileData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass dark:glass-dark rounded-2xl p-6 shadow-lg hover:shadow-spaceGlow transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-0.5">
          <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-neonCyan font-bold text-lg">
                {user.username[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-orbitron font-bold text-gray-800 dark:text-white">
            {user.username}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Profile Statistics
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Followers */}
        <motion.div
          className="bg-gradient-to-br from-neonCyan/10 to-neonCyan/5 dark:from-neonCyan/20 dark:to-neonCyan/10 rounded-xl p-4 border border-neonCyan/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neonCyan/20 rounded-lg">
              <Users className="w-6 h-6 text-neonCyan" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neonCyan">
                {profile.followers_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Followers
              </div>
            </div>
          </div>
        </motion.div>

        {/* Following */}
        <motion.div
          className="bg-gradient-to-br from-neonPurple/10 to-neonPurple/5 dark:from-neonPurple/20 dark:to-neonPurple/10 rounded-xl p-4 border border-neonPurple/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neonPurple/20 rounded-lg">
              <UserPlus className="w-6 h-6 text-neonPurple" />
            </div>
            <div>
              <div className="text-2xl font-bold text-neonPurple">
                {profile.following_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Following
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Profile ID: {user.id}</span>
          <span>
            Ratio: {profile.followers_count > 0 
              ? (profile.following_count / profile.followers_count).toFixed(2)
              : '∞'
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FollowerCount;