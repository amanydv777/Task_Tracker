import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { ThemeContext } from '../../context/ThemeContext';
import CategorySelector from './CategorySelector';

const TaskForm = () => {
  const { addTask, currentTask, updateTask, loading } = useContext(TaskContext);
  const { darkMode } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categories: []
  });

  const { title, description, priority, dueDate, categories } = task;

  // If currentTask changes (for editing), update form
  useEffect(() => {
    if (currentTask !== null) {
      setTask({
        title: currentTask.title,
        description: currentTask.description || '',
        priority: currentTask.priority,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().substr(0, 10) : '',
        categories: currentTask.categories || []
      });
    } else {
      // Reset form if not editing
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categories: []
      });
    }
  }, [currentTask]);

  const onChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (title === '') {
      alert('Please enter a title for the task');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (currentTask !== null) {
        await updateTask(currentTask._id, task);
      } else {
        await addTask(task);
      }
  
      // Clear form
      setTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categories: []
      });
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      <div className="mb-4">
        <label htmlFor="title" className="form-label fw-bold">
          <i className="fas fa-heading me-2"></i>Task Title
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="What needs to be done?"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="form-label fw-bold">
          <i className="fas fa-align-left me-2"></i>Description
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Add details about this task..."
          rows="3"
        ></textarea>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <label htmlFor="priority" className="form-label fw-bold">
            <i className="fas fa-flag me-2"></i>Priority
          </label>
          <div className="priority-selector">
            <select
              className="form-select"
              id="priority"
              name="priority"
              value={priority}
              onChange={onChange}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>
        
        <div className="col-md-6">
          <label htmlFor="dueDate" className="form-label fw-bold">
            <i className="far fa-calendar-alt me-2"></i>Due Date
          </label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={onChange}
          />
        </div>
      </div>
      
      <CategorySelector 
        categories={categories} 
        setCategories={(newCategories) => setTask({...task, categories: newCategories})} 
      />
      
      <div className="d-grid gap-2">
        <button 
          type="submit" 
          className={`btn ${currentTask ? 'btn-success' : 'btn-primary'} btn-lg`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {currentTask ? 'Updating...' : 'Adding...'}
            </>
          ) : currentTask ? (
            <><i className="fas fa-save me-2"></i>Update Task</>
          ) : (
            <><i className="fas fa-plus-circle me-2"></i>Add Task</>
          )}
        </button>
        
        {currentTask && (
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => {
              setTask({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                categories: []
              });
            }}
          >
            <i className="fas fa-times me-2"></i>Cancel Editing
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
