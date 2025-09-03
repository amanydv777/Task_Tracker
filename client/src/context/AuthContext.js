import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'AUTH_ERROR' });
        return false;
      }
      
      // Set token in axios headers
      setAuthToken(token);
      
      const res = await axios.get('/api/auth/me');
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data
      });
      
      return true;
    } catch (err) {
      // Clear token if invalid
      localStorage.removeItem('token');
      setAuthToken(null);
      
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Server Error'
      });
      
      return false;
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      // Set token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set token in axios headers
      setAuthToken(res.data.token);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      await loadUser();
      toast.success('Registration successful! Welcome to Task Tracker!');
      
      // Return success for component to handle navigation if needed
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Server Error'
      });
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      // Set token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set token in axios headers
      setAuthToken(res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Load user data
      await loadUser();
      toast.success('Login successful! Welcome back!');
      
      // Return success for component to handle navigation if needed
      return { success: true };
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Server Error'
      });
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/auth/profile', formData);
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data
      });
      
      toast.success(res.data.message || 'Profile updated successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Set error manually
  const setError = (errorMessage) => {
    dispatch({
      type: 'AUTH_ERROR',
      payload: errorMessage
    });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERROR' });

  // Check if user is logged in on first load
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
        updateProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
