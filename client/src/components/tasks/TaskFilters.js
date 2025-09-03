import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';

const TaskFilters = ({ 
  filterStatus, 
  setFilterStatus, 
  filterPriority, 
  setFilterPriority,
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory
}) => {
  const { tasks } = useContext(TaskContext);
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // Extract unique categories from all tasks
  useEffect(() => {
    if (!tasks) return;
    
    const allCategories = new Set();
    tasks.forEach(task => {
      if (task.categories && task.categories.length > 0) {
        task.categories.forEach(category => allCategories.add(category));
      }
    });
    
    setAvailableCategories(Array.from(allCategories).sort());
  }, [tasks]);

  return (
    <div className="task-filters mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3 d-md-none">
        <h5 className="mb-0">Task Filters</h5>
        <button 
          className="btn btn-sm btn-outline-primary" 
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className={`fas ${showFilters ? 'fa-chevron-up' : 'fa-chevron-down'} me-1`}></i>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`filter-controls ${showFilters ? 'd-block' : 'd-none'} d-md-block`}>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="form-group">
              <label htmlFor="filterStatus" className="form-label">
                <i className="fas fa-filter me-2"></i>Status
              </label>
              <select
                id="filterStatus"
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-md-4">
            <div className="form-group">
              <label htmlFor="filterPriority" className="form-label">
                <i className="fas fa-flag me-2"></i>Priority
              </label>
              <select
                id="filterPriority"
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-md-4">
            <div className="form-group">
              <label htmlFor="sortBy" className="form-label">
                <i className="fas fa-sort me-2"></i>Sort By
              </label>
              <select
                id="sortBy"
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>
          </div>
          
          {availableCategories.length > 0 && (
            <div className="col-12 col-sm-6 col-md-4">
              <div className="form-group">
                <label htmlFor="filterCategory" className="form-label">
                  <i className="fas fa-tags me-2"></i>Category
                </label>
                <select
                  id="filterCategory"
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
