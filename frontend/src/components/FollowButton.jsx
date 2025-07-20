import React, { useState } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

const FollowButton = ({ userId, initialFollowState = false, onToggle }) => {
   const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const handleToggleFollow = async () => {
  if (isLoading) return;

  const token = localStorage.getItem('token');
  if (!token) {
    console.error("🔒 No token found in localStorage");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/follow/${userId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to toggle follow state');
      } else {
        const text = await res.text(); 
        throw new Error(`Unexpected error: ${text.slice(0, 100)}...`);
      }
    }

    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    if (onToggle) onToggle(newFollowState, userId);
  } catch (error) {
    console.error('❌ Toggle follow error:', error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 min-w-[100px] h-10 rounded-lg font-medium transition-all
        ${isFollowing 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'}
        ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        disabled:hover:scale-100
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default FollowButton;
