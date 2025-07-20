import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, Heart, User, Settings, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    //{ icon: PlusSquare, label: 'Create', path: '/create' },
    //{ icon: Heart, label: 'Activity', path: '/activity' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/Settings' },
  ];

  if (!isAuthenticated) return null;

  return (
    <motion.div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        className="glass dark:glass-dark rounded-l-2xl p-4 shadow-lg border-l-2 border-neonCyan/30"
        animate={{ width: isExpanded ? 200 : 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col space-y-4">
          {menuItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link key={path} to={path}>
                <motion.div
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-neonCyan/20 to-neonPurple/20 text-neonCyan' 
                      : 'hover:bg-white/10 text-gray-600 dark:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon 
                    className={`w-6 h-6 ${isActive ? 'text-neonCyan glow-effect' : 'group-hover:text-neonCyan'} transition-colors duration-300`} 
                  />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`font-medium whitespace-nowrap ${
                          isActive ? 'text-neonCyan' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </div>
        
        {/* Floating Animation Indicator */}
        <motion.div
          className="absolute -left-2 top-4 w-1 h-8 bg-gradient-to-b from-neonCyan to-neonPurple rounded-full"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;