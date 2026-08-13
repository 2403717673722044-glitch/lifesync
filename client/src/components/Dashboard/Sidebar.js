import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaClock, 
  FaMoneyBillWave, 
  FaBullseye,
  FaHeartbeat,
  FaUser,
  FaCog
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/diary', icon: <FaBook />, label: 'Diary' },
    { path: '/schedule', icon: <FaClock />, label: 'Schedule' },
    { path: '/expenses', icon: <FaMoneyBillWave />, label: 'Expenses' },
    { path: '/goals', icon: <FaBullseye />, label: 'Goals' },
    { path: '/health', icon: <FaHeartbeat />, label: 'Health' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📱</span>
          <span className="sidebar-logo-text">LifeSync</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img src="/default-avatar.png" alt="User" className="sidebar-avatar" />
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">John Doe</p>
            <p className="sidebar-user-email">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;