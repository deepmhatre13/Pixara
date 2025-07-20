import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/`);

      const data = response.data;

      // Handle if backend returns { posts: [...] } or just [...]
      const fetchedPosts = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
        ? data.posts
        : [];

      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_BASE_URL}/posts/${postId}/like/`);
      fetchPosts(); // Refresh after like
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}/`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditPost = (post) => {
    alert('Edit functionality would be implemented here');
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-softSky to-white dark:from-spaceBlack dark:to-spacePurple">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent mb-2"
          >
            Welcome to PixaraX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Share your moments with the universe
          </motion.p>
        </div>

        {/* Create Post Button */}
        <motion.button
          onClick={() => setShowCreatePost(true)}
          className="w-full mb-8 p-4 glass dark:glass-dark rounded-2xl border-2 border-dashed border-neonCyan/30 hover:border-neonCyan/60 transition-all duration-300 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 group-hover:text-neonCyan transition-colors">
            <Plus className="w-6 h-6" />
            <span className="font-medium">Create a new post</span>
          </div>
        </motion.button>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to share something amazing!
              </p>
            </motion.div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePost
            onClose={() => setShowCreatePost(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
