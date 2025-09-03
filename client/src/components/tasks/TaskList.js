import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import TaskFilters from './TaskFilters';
import Spinner from '../layout/Spinner';

const TaskList = () => {
  const { tasks, loading, getTasks } = useContext(TaskContext);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line
  }, []);
  
  // Apply filters and sorting whenever tasks or filter settings change
  useEffect(() => {
    if (!tasks) return;
    
    let result = [...tasks];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(task => task.status === filterStatus);
    }
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter(task => task.priority === filterPriority);
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(task => 
        task.categories && 
        task.categories.includes(filterCategory)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          // Sort by due date (tasks with no due date go to the end)
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          // Sort by priority (high > medium > low)
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          // Sort alphabetically by title
          return a.title.localeCompare(b.title);
        case 'createdAt':
          // Sort by creation date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    
    setFilteredTasks(result);
  }, [tasks, filterStatus, filterPriority, filterCategory, sortBy]);

  if (loading) {
    return <Spinner />;
  }

  if (tasks.length === 0 && !loading) {
    return (
      <div className="alert alert-info text-center">
        <h4>No tasks found</h4>
        <p>Add a task to get started!</p>
      </div>
    );
  }
  
  return (
    <div>
      <TaskFilters 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      {filteredTasks.length === 0 && !loading ? (
        <div className="alert alert-info">
          <i className="fas fa-info-circle me-2"></i>
          No tasks match your current filters
        </div>
      ) : (
        <div className="task-list-container">
          {filteredTasks.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      )}
      
      <div className="task-count mt-3 text-end">
        <span className="badge bg-secondary">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} displayed
        </span>
      </div>
    </div>
  );
};

export default TaskList;
