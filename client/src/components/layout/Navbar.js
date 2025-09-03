import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <li className="nav-item dropdown">
        <a 
          className="nav-link dropdown-toggle d-flex align-items-center" 
          href="#!" 
          id="navbarDropdown" 
          role="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          {user && user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="rounded-circle me-2" 
              style={{ width: '30px', height: '30px', objectFit: 'cover' }} 
            />
          ) : (
            <i className="fas fa-user-circle me-2"></i>
          )}
          <span className="d-none d-sm-inline">{user && user.name}</span>
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <Link to="/profile" className="dropdown-item">
              <i className="fas fa-user-cog me-2"></i>
              Profile Settings
            </Link>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button 
              onClick={onLogout} 
              className="dropdown-item text-danger"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link to="/register" className="nav-link">Register</Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">Login</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-check-circle me-2"></i> 
          <span className="fw-bold">Task Tracker</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-3">
              <button 
                onClick={toggleTheme} 
                className="theme-toggle" 
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )}
              </button>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
