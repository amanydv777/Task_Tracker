import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { ThemeContext } from '../../context/ThemeContext';

const TaskStatistics = () => {
  const { tasks, loading } = useContext(TaskContext);
  const { darkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    dueSoon: 0,
    overdue: 0
  });

  useEffect(() => {
    if (!tasks || loading) return;

    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);

    const newStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      mediumPriority: tasks.filter(task => task.priority === 'medium').length,
      lowPriority: tasks.filter(task => task.priority === 'low').length,
      dueSoon: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate > now && dueDate <= threeDaysFromNow;
      }).length,
      overdue: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        return new Date(task.dueDate) < now;
      }).length
    };

    setStats(newStats);
  }, [tasks, loading]);

  // Calculate completion percentage
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  if (loading || stats.total === 0) {
    return null;
  }

  return (
    <div className="task-statistics mb-4">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100 border-0" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-chart-pie me-2"></i>
                Task Overview
              </h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Completion Rate:</span>
                <span className="fw-bold">{completionPercentage}%</span>
              </div>
              
              <div className="progress mb-4" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${completionPercentage}%` }} 
                  aria-valuenow={completionPercentage} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              
              <div className="row text-center g-2">
                <div className="col-4">
                  <div className="p-2 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                    <div className="fs-4 fw-bold text-primary">{stats.total}</div>
                    <div className="small">Total</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <div className="fs-4 fw-bold text-success">{stats.completed}</div>
                    <div className="small">Completed</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                    <div className="fs-4 fw-bold text-warning">{stats.pending}</div>
                    <div className="small">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100 border-0" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-exclamation-circle me-2"></i>
                Priority & Deadlines
              </h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <span className="badge bg-danger me-2">High</span>
                    Priority Tasks
                  </div>
                  <span className="fw-bold">{stats.highPriority}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <span className="badge bg-warning text-dark me-2">Medium</span>
                    Priority Tasks
                  </div>
                  <span className="fw-bold">{stats.mediumPriority}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="badge bg-info text-dark me-2">Low</span>
                    Priority Tasks
                  </div>
                  <span className="fw-bold">{stats.lowPriority}</span>
                </div>
              </div>
              
              <div className="alert alert-warning mb-2 p-2" style={{ opacity: stats.dueSoon > 0 ? 1 : 0.5 }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-clock me-2"></i>
                    Due Soon (3 days)
                  </div>
                  <span className="fw-bold">{stats.dueSoon}</span>
                </div>
              </div>
              
              <div className="alert alert-danger p-2" style={{ opacity: stats.overdue > 0 ? 1 : 0.5 }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Overdue Tasks
                  </div>
                  <span className="fw-bold">{stats.overdue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatistics;
