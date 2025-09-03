import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <footer className="footer mt-auto py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              <i className="fas fa-tasks me-2"></i>
              <strong>Task Tracker</strong> &copy; {new Date().getFullYear()}
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="social-links">
              <a href="#!" className="social-link" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="#!" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#!" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
