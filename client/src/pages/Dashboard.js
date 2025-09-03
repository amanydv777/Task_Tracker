import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskStatistics from '../components/tasks/TaskStatistics';

const Dashboard = () => {
  const { user, loadUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard-container">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="welcome-section p-4 rounded-3 mb-4" 
               style={{ 
                 background: `linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)`,
                 boxShadow: 'var(--shadow-md)'
               }}>
            <h1 className="display-5 fw-bold text-white">
              <i className="fas fa-tasks me-2"></i>
              Welcome, {user ? user.name : 'User'}!
            </h1>
            <p className="lead text-white opacity-90 mb-0">
              Organize, prioritize, and complete your tasks efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Task Statistics Section */}
      <TaskStatistics />
      
      {/* Mobile Task Form Toggle */}
      <div className="d-block d-lg-none mb-4">
        <button 
          className="btn btn-primary w-100 py-3" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#mobileTaskForm" 
          aria-expanded="false" 
          aria-controls="mobileTaskForm"
        >
          <i className="fas fa-plus-circle me-2"></i>
          Add New Task
        </button>
        
        <div className="collapse mt-3" id="mobileTaskForm">
          <div className="card border-0" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body">
              <TaskForm />
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Desktop Task Form - Hidden on mobile */}
        <div className="col-lg-5 d-none d-lg-block">
          <div className="card form-card h-100 border-0" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h4 className="mb-0"><i className="fas fa-plus-circle me-2"></i>Add New Task</h4>
            </div>
            <div className="card-body">
              <TaskForm />
            </div>
          </div>
        </div>
        
        {/* Task List - Full width on mobile */}
        <div className="col-12 col-lg-7">
          <div className="card task-list-card h-100 border-0" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h4 className="mb-0"><i className="fas fa-list-check me-2"></i>Your Tasks</h4>
            </div>
            <div className="card-body">
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
