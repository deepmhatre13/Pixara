import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Edit2, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [safetyCheck, setSafetyCheck] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

const checkCommentSafety = async (text) => {
  const token = getToken();
  if (!token) {
    console.warn('⚠️ No access token found.');
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/predict-comment/`,
      { comment: text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const { labels } = response.data;
    return labels.length === 0; // Safe if no toxicity labels are returned
  } catch (error) {
    console.error('Safety check error:', error.response?.data || error.message);
    return null;
  }
};


  useEffect(() => {
    const runSafetyCheck = async () => {
      if (newComment.trim()) {
        const result = await checkCommentSafety(newComment);
        setSafetyCheck(result);
      } else {
        setSafetyCheck(null);
      }
    };
    runSafetyCheck();
  }, [newComment]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    const token = getToken();
    if (!token) {
      alert('🔒 Please log in to comment.');
      setIsLoading(false);
      return;
    }

    const isSafe = await checkCommentSafety(newComment);
    if (isSafe === false) {
      alert('🚫 This comment may be unsafe. Please revise it.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setSafetyCheck(null);
    } catch (error) {
      console.error('Failed to create comment:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    const token = getToken();
    if (!token) {
      alert('🔒 Login required to edit comments.');
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/comments/${commentId}/`,
        { content: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map(c => (c.id === commentId ? response.data : c)));
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = getToken();
    if (!token) {
      alert('🔒 Login required to delete comments.');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-neonCyan font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-neonCyan text-gray-800 dark:text-white"
            />
            {safetyCheck !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-2 mt-2 px-3 py-1 rounded-full text-sm ${
                  safetyCheck
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                {safetyCheck ? (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>✅ Safe Comment</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>⚠️ Potentially Unsafe</span>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="p-2 bg-gradient-to-r from-neonCyan to-neonPurple text-white rounded-full hover:shadow-neon transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center">
                {comment.user?.profile_picture ? (
                  <img
                    src={comment.user.profile_picture}
                    alt={comment.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-neonCyan font-bold text-sm">
                    {comment.user?.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {comment.user?.username}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>

              {editingComment === comment.id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  />
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="text-neonCyan hover:text-neonPurple"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {comment.content}
                  </p>

                  {user?.id === comment.user?.id && (
                    <div className="flex space-x-2 ml-2">
                      <motion.button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditText(comment.content);
                        }}
                        className="text-gray-400 hover:text-neonCyan"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
