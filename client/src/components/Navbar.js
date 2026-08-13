import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignOutAlt, 
  FaCog, 
  FaPalette,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme, mode, toggleMode, isLight } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const themes = [
    { id: 'pinky', name: '🌸 Pinky', color: '#ff6b9d' },
    { id: 'spidey', name: '🕷️ Spidey', color: '#e62429' },
    { id: 'normal', name: '🌙 Normal', color: '#667eea' }
  ];

  // Public Navbar (when not logged in)
  if (!isAuthenticated) {
    return (
      <nav className="navbar navbar-public">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">📱</span>
            <span className="logo-text">LifeSync</span>
          </Link>
          <div className="navbar-right">
            <button onClick={toggleMode} className="mode-toggle-btn" aria-label="Toggle Theme">
              {isLight ? <FaMoon /> : <FaSun />}
            </button>
            <Link to="/login" className="nav-link login-btn">Login</Link>
            <Link to="/register" className="nav-link register-btn">Register</Link>
          </div>
        </div>
      </nav>
    );
  }

  // Private Navbar (when logged in)
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">LifeSync</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/diary" className="nav-link">📔 Diary</Link>
          </li>
          <li className="nav-item">
            <Link to="/schedule" className="nav-link">⏰ Schedule</Link>
          </li>
          <li className="nav-item">
            <Link to="/expenses" className="nav-link">💰 Expenses</Link>
          </li>
          <li className="nav-item">
            <Link to="/goals" className="nav-link">🎯 Goals</Link>
          </li>
          
          <li className="nav-item user-menu">
            <div className="user-dropdown">
              <button 
                className="user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img 
                  src={user?.profilePicture || '/default-avatar.png'} 
                  alt={user?.name || 'User'} 
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <span className="user-name">{user?.name || 'User'}</span>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <FaUser /> Profile
                  </Link>
                  
                  {/* Theme Selector */}
                  <div className="dropdown-item theme-selector" onClick={() => setShowThemeMenu(!showThemeMenu)}>
                    <FaPalette /> Themes
                    {showThemeMenu && (
                      <div className="theme-options">
                        {themes.map(t => (
                          <button
                            key={t.id}
                            className={`theme-option ${theme === t.id ? 'active' : ''}`}
                            onClick={() => {
                              setTheme(t.id);
                              setShowThemeMenu(false);
                            }}
                            style={{ '--theme-color': t.color }}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Dark/Light Mode Toggle */}
                  <button onClick={toggleMode} className="dropdown-item">
                    {isLight ? <FaMoon /> : <FaSun />}
                    {isLight ? ' Dark Mode' : ' Light Mode'}
                  </button>
                  
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;