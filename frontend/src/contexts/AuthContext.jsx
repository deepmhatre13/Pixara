import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Set token on axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check user on load
  useEffect(() => {
   
  
    const checkAuth = async () => {
  if (token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  }
  setLoading(false);
};

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
      username,
      password,
    });

    const { access, refresh } = response.data;

    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    setToken(access);

    const profileRes = await axios.get(`${API_BASE_URL}/auth/user/profile/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    setUser(profileRes.data);

    return { success: true };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      error: error.response?.data?.detail || 'Login failed',
    };
  }
};

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);

      const { access, refresh } = response.data;

      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);

      const profileRes = await axios.get(`${API_BASE_URL}/auth/user/profile/`);
      setUser(profileRes.data);

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);

      const data = error.response?.data;
      let errorMessage = 'Registration failed';

      if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          errorMessage = `${firstKey}: ${data[firstKey][0]}`;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/user/profile/`, profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error.response?.data || 'Profile update failed',
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
