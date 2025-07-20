import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Hash } from 'lucide-react';
import PostCard from '../components/PostCard';
import FollowButton from '../components/FollowButton';
import axios from 'axios';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchExplorePosts();
    fetchTrendingHashtags();
  }, []);

  const fetchExplorePosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/explore/`);
    const data = response.data;

    const posts = Array.isArray(data) ? data : data?.results;

    if (!Array.isArray(posts)) {
      throw new Error("Explore endpoint did not return an array.");
    }

    setPosts(posts);
  } catch (error) {
    console.error('❌ Failed to fetch explore posts:', error);

    try {
      // Fallback to /posts/
      const fallbackResponse = await axios.get(`${API_BASE_URL}/posts/`);
      const fallbackData = fallbackResponse.data;

      const fallbackPosts = Array.isArray(fallbackData) ? fallbackData : fallbackData?.results;

      if (Array.isArray(fallbackPosts)) {
        setPosts(fallbackPosts);
      } else {
        setPosts([]);
      }
    } catch (fallbackError) {
      console.error('❌ Fallback fetch failed:', fallbackError);
      setPosts([]);
    }
  } finally {
    setIsLoading(false);
  }
};


  const fetchTrendingHashtags = async () => {
    // Temporary hardcoded data
    setTrendingHashtags([
      { name: 'photography', count: 1234 },
      { name: 'art', count: 987 },
      { name: 'nature', count: 756 },
      { name: 'travel', count: 654 },
      { name: 'food', count: 543 },
    ]);
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_BASE_URL}/posts/${postId}/like/`);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}/`);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditPost = (post) => {
    alert('Edit functionality would be implemented here');
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
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent mb-4"
          >
            Explore PixaraX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mb-6"
          >
            Discover amazing content from creators around the galaxy
          </motion.p>

          
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {!Array.isArray(posts) || posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 glass dark:glass-dark rounded-2xl"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No posts to explore
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for new content!
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Hashtags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass dark:glass-dark rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-neonCyan" />
                <h2 className="text-xl font-orbitron font-bold text-gray-800 dark:text-white">
                  Trending
                </h2>
              </div>
              <div className="space-y-3">
                {trendingHashtags.map((hashtag, index) => (
                  <motion.div
                    key={hashtag.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-neonPurple" />
                      <span className="font-medium text-gray-800 dark:text-white">
                        {hashtag.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {hashtag.count.toLocaleString()} posts
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Suggested Users */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
