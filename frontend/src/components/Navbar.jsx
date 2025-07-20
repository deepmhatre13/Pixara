import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${API_BASE_URL.replace('/api', '')}${imagePath}`;
  };

  
  const renderUserAvatar = () => {
    if (!user) return <User className="w-4 h-4 text-neonCyan" />;

    const profileImageUrl = getImageUrl(user.profile_picture);

    return profileImageUrl ? (
      <img
        src={profileImageUrl}
        alt={user.username}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => {
        
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : (
      <span className="text-neonCyan font-bold text-sm">
        {user.username?.[0]?.toUpperCase() || 'U'}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 glass dark:glass-dark border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              PixaraX
            </motion.div>
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users, posts..."
                  className="w-full pl-10 pr-4 py-2 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-neonCyan backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <motion.button
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-neonCyan dark:hover:text-neonCyan transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="w-5 h-5" />
                </motion.button>
                
                <Link to="/profile">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-0.5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center overflow-hidden relative">
                      {renderUserAvatar()}
                     
                      <span 
                        className="text-neonCyan font-bold text-sm absolute inset-0 flex items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </motion.div>
                </Link>
                
                <motion.button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <motion.button
                    className="px-4 py-2 text-neonCyan border border-neonCyan rounded-full hover:bg-neonCyan hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    className="px-4 py-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-full hover:shadow-neon transition-all duration-300 btn-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;