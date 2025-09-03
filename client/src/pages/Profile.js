import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import Spinner from '../components/layout/Spinner';
import axios from 'axios';

const Profile = () => {
  const { user, loadUser, loading, error, setError } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    avatar: '',
    preferences: {
      defaultView: 'all',
      defaultSort: 'dueDate',
      emailNotifications: false,
      taskReminders: false
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        avatar: user.avatar || '',
        preferences: {
          defaultView: user.preferences?.defaultView || 'all',
          defaultSort: user.preferences?.defaultSort || 'dueDate',
          emailNotifications: user.preferences?.emailNotifications || false,
          taskReminders: user.preferences?.taskReminders || false
        }
      });
    }
  }, [user]);

  const onChange = (e) => {
    if (e.target.name.startsWith('preferences.')) {
      const prefName = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [prefName]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setError(null);

    // Validate passwords if trying to change password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('New passwords do not match');
        setIsSubmitting(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Only send necessary data
      const updateData = {
        name: formData.name,
        email: formData.email,
        preferences: formData.preferences
      };

      // Only include password fields if trying to change password
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // Handle avatar if it's been changed
      if (avatarPreview && avatarPreview !== user?.avatar) {
        // In a real implementation, we would upload the file to a server
        // For this demo, we'll just send the data URL
        updateData.avatar = avatarPreview;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.put('/api/auth/profile', updateData, config);
      
      // Update user in context
      loadUser();
      
      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 profile-card" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-header bg-primary text-white p-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {avatarPreview || user?.avatar ? (
                    <img 
                      src={avatarPreview || user.avatar} 
                      alt="Profile" 
                      className="profile-avatar" 
                    />
                  ) : (
                    <div className="profile-avatar d-flex align-items-center justify-content-center bg-light">
                      <i className="fas fa-user fa-3x text-primary"></i>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="mb-0">{user?.name}</h2>
                  <p className="mb-0 text-white-50">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="card-body p-4 profile-form">
              {successMessage && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-image me-2"></i>Profile Picture
                  </label>
                  <div className="d-flex align-items-center">
                    <button 
                      type="button" 
                      className="btn btn-outline-primary" 
                      onClick={triggerFileInput}
                    >
                      <i className="fas fa-upload me-2"></i>
                      Choose Image
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="d-none" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <small className="text-muted ms-3">
                      {avatarPreview ? 'New image selected' : 'No new image selected'}
                    </small>
                  </div>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="name" className="form-label fw-bold">
                      <i className="fas fa-user me-2"></i>Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-bold">
                      <i className="fas fa-envelope me-2"></i>Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>
                
                <h5 className="mt-4 mb-3 border-bottom pb-2">
                  <i className="fas fa-lock me-2"></i>
                  Change Password
                </h5>
                
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={onChange}
                  />
                  <small className="text-muted">Required only if changing password</small>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={onChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={onChange}
                    />
                  </div>
                </div>
                
                <h5 className="mt-4 mb-3 border-bottom pb-2">
                  <i className="fas fa-cog me-2"></i>
                  Preferences
                </h5>
                
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="defaultView" className="form-label">Default Task View</label>
                    <select
                      className="form-select"
                      id="defaultView"
                      name="preferences.defaultView"
                      value={formData.preferences.defaultView}
                      onChange={onChange}
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending Tasks</option>
                      <option value="completed">Completed Tasks</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="defaultSort" className="form-label">Default Sort Order</label>
                    <select
                      className="form-select"
                      id="defaultSort"
                      name="preferences.defaultSort"
                      value={formData.preferences.defaultSort}
                      onChange={onChange}
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                      <option value="createdAt">Date Created</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="emailNotifications"
                    name="preferences.emailNotifications"
                    checked={formData.preferences.emailNotifications}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Enable Email Notifications
                  </label>
                </div>
                
                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="taskReminders"
                    name="preferences.taskReminders"
                    checked={formData.preferences.taskReminders}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="taskReminders">
                    Enable Task Reminders
                  </label>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
