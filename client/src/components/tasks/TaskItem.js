import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';

const TaskItem = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useContext(TaskContext);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, title, description, status, priority, dueDate, categories = [] } = task;

  // Format date if it exists
  const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date';

  // Get priority class
  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'badge rounded-pill bg-danger';
      case 'medium':
        return 'badge rounded-pill bg-warning text-dark';
      case 'low':
        return 'badge rounded-pill bg-info text-dark';
      default:
        return 'badge rounded-pill bg-secondary';
    }
  };
  
  // Get priority icon
  const getPriorityIcon = () => {
    switch (priority) {
      case 'high':
        return 'fas fa-exclamation-circle';
      case 'medium':
        return 'fas fa-exclamation';
      case 'low':
        return 'fas fa-arrow-down';
      default:
        return 'fas fa-minus';
    }
  };

  return (
    <div className={`card mb-4 task-card priority-${priority} ${status === 'completed' ? 'task-completed' : ''}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className={`card-title mb-1 fw-bold ${status === 'completed' ? 'text-decoration-line-through' : ''}`}>
              <i className={`${getPriorityIcon()} me-2`}></i>
              {title}
            </h5>
            <div className="mt-2">
              <span className={`${getPriorityClass()} me-2`}>
                <i className={`${getPriorityIcon()} me-1`}></i>
                {priority}
              </span>
              <span className={`badge rounded-pill ${status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                {status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="task-actions">
            <button
              className={`btn btn-sm ${status === 'pending' ? 'btn-outline-success' : 'btn-outline-warning'} me-2`}
              onClick={async () => {
                setIsToggling(true);
                await toggleTaskStatus(_id);
                setIsToggling(false);
              }}
              disabled={isToggling || isDeleting}
            >
              {isToggling ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : status === 'pending' ? (
                <><i className="fas fa-check me-1"></i> Complete</>
              ) : (
                <><i className="fas fa-undo me-1"></i> Reopen</>
              )}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={async () => {
                setIsDeleting(true);
                await deleteTask(_id);
                // No need to set isDeleting to false as the component will unmount
              }}
              disabled={isToggling || isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : (
                <i className="fas fa-trash-alt"></i>
              )}
            </button>
          </div>
        </div>
        
        <div className="card-text mb-3 task-description">
          {description}
        </div>
        
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="task-categories mt-3">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <span key={index} className="badge bg-secondary category-tag">
                  <i className="fas fa-tag me-1"></i>
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <div className="due-date">
            <i className="far fa-calendar-alt me-1"></i>
            <small>{formattedDate}</small>
          </div>
          <div className="task-meta">
            <small className="text-muted">
              {dueDate && (
                <>
                  <i className="far fa-clock me-1"></i>
                  {new Date(dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </>
              )}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
