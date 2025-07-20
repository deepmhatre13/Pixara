import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';
import FollowButton from './FollowButton';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PostCard = ({ post, onLike, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.user.is_following);
const [editing, setEditing] = useState(false);
const [editedCaption, setEditedCaption] = useState(post.caption);

  const handleLike = async () => {
    try {
      await onLike(post.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const isOwner = user?.id === post.user.id;

  return (
    <motion.div
      className="glass dark:glass-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-spaceGlow transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
  <div className="p-4 flex justify-between items-start">
  <div className="flex flex-col items-start space-y-2">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neonCyan to-neonPurple p-0.5">
        <div className="w-full h-full rounded-full bg-white dark:bg-spaceBlack flex items-center justify-center">
          {post.user.profile_picture ? (
            <img
              src={post.user.profile_picture}
              alt={post.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-neonCyan font-bold">
              {post.user.username[0].toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {post.user.username}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>

    {!isOwner && (
      <FollowButton
        userId={post.user.id}
  initialFollowState={isFollowing}
  onToggle={(newState) => setIsFollowing(newState)}
      />
    )}
  </div>

  {isOwner && (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </motion.button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-lg shadow-lg border border-white/20 dark:border-white/10 z-10"
          >
            <button
             onClick={() => {
             setEditing(true);
            setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={async () => {
            try {
            await axios.delete(`${API_BASE_URL}/posts/${post.id}/`);
              toast.success('Post deleted');
   
          } catch (err) {
               toast.error('Failed to delete post');
             console.error(err);
         } finally {
         setShowMenu(false);
           }
    }}

              className="w-full px-4 py-2 text-left hover:bg-red-500/10 flex items-center space-x-2 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}
</div>


      {/* Image */}
      {post.image && (
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 dark:text-white mb-4 leading-relaxed">
          {post.caption}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-neonPink' : 'text-gray-600 dark:text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </motion.button>
            
            <motion.button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-neonCyan transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{post.comments_count}</span>
            </motion.button>
            
            <motion.button
              className="text-gray-600 dark:text-gray-400 hover:text-neonCyan transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
          </div>
          
          <motion.button
            className="text-gray-600 dark:text-gray-400 hover:text-neonCyan transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CommentSection postId={post.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostCard;