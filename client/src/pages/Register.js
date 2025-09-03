import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const { register, isAuthenticated, error, clearErrors, loading } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { name, email, password, password2 } = formData;
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    // Redirect if authenticated
    if (isAuthenticated || token) {
      navigate('/', { replace: true });
    }
    
    // Clear any errors
    clearErrors();
    // eslint-disable-next-line
  }, [isAuthenticated, navigate]);
  
  // Reset loading state when auth state changes
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setFormError('Passwords do not match');
    } else {
      setIsLoading(true);
      const result = await register({ name, email, password });
      
      if (result && result.success) {
        // Force navigation to dashboard
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className="container auth-container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card auth-card ${darkMode ? 'bg-dark text-light' : 'bg-light'} shadow`}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="auth-title mb-2">Create Account</h1>
                <p className="auth-subtitle">Join Task Tracker to manage your tasks efficiently</p>
              </div>
              
              {error && (
                <div className="alert alert-danger fade-in" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              {formError && (
                <div className="alert alert-danger fade-in" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {formError}
                </div>
              )}
              
              <form onSubmit={onSubmit} className="auth-form">
                <div className="mb-3 form-group">
                  <label htmlFor="name" className="form-label d-flex align-items-center">
                    <FaUser className="me-2" /> Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="mb-3 form-group">
                  <label htmlFor="email" className="form-label d-flex align-items-center">
                    <FaEnvelope className="me-2" /> Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-3 form-group">
                  <label htmlFor="password" className="form-label d-flex align-items-center">
                    <FaLock className="me-2" /> Password
                  </label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="mb-4 form-group">
                  <label htmlFor="password2" className="form-label d-flex align-items-center">
                    <FaLock className="me-2" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    placeholder="Confirm your password"
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 mt-4 d-flex align-items-center justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" /> Create Account
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-4 text-center auth-links">
                <p>
                  Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
