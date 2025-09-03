import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  requestNotificationPermission, 
  registerServiceWorker, 
  sendTaskDueNotification,
  sendTaskStatusNotification
} from '../services/notificationService';

// Create context
export const TaskContext = createContext();

// Initial state
const initialState = {
  tasks: [],
  currentTask: null,
  loading: true,
  error: null
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case 'GET_TASK':
      return {
        ...state,
        currentTask: action.payload,
        loading: false
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
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
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  
  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        await registerServiceWorker();
      }
    };
    
    initNotifications();
  }, []);

  // Get all tasks
  const getTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.get('/api/tasks');
      
      dispatch({
        type: 'GET_TASKS',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error fetching tasks'
      });
      toast.error(err.response?.data?.message || 'Error fetching tasks');
    }
  };

  // Get single task
  const getTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.get(`/api/tasks/${id}`);
      
      dispatch({
        type: 'GET_TASK',
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error fetching task'
      });
      toast.error(err.response?.data?.message || 'Error fetching task');
    }
  };

  // Add task
  const addTask = async (task) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.post('/api/tasks', task);
      
      dispatch({
        type: 'ADD_TASK',
        payload: res.data.data
      });
      
      toast.success('Task added successfully');
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error adding task'
      });
      toast.error(err.response?.data?.message || 'Error adding task');
    }
  };

  // Update task
  const updateTask = async (id, task) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.put(`/api/tasks/${id}`, task);
      
      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data.data
      });
      
      toast.success('Task updated successfully');
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error updating task'
      });
      toast.error(err.response?.data?.message || 'Error updating task');
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.put(`/api/tasks/${id}/toggle`);
      const updatedTask = res.data.data;
      
      dispatch({
        type: 'UPDATE_TASK',
        payload: updatedTask
      });
      
      // Send notification for task status change
      sendTaskStatusNotification(updatedTask, updatedTask.status);
      
      toast.success('Task status updated');
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error updating task status'
      });
      toast.error(err.response?.data?.message || 'Error updating task status');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      await axios.delete(`/api/tasks/${id}`);
      
      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
      
      toast.success('Task deleted successfully');
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data?.message || 'Error deleting task'
      });
      toast.error(err.response?.data?.message || 'Error deleting task');
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        currentTask: state.currentTask,
        loading: state.loading,
        error: state.error,
        getTasks,
        getTask,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        clearErrors
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
