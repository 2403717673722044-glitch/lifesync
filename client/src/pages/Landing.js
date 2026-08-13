import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

const Landing = () => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const themes = [
    { 
      id: 'pinky', 
      name: '🌸 Pinky', 
      description: 'For Girls',
      icon: '🌸',
      color: '#ff6b9d',
      bg: '#fff5f7'
    },
    { 
      id: 'spidey', 
      name: '🕷️ Spidey', 
      description: 'For Boys',
      icon: '🕷️',
      color: '#e62429',
      bg: '#0a0a1a'
    },
    { 
      id: 'normal', 
      name: '🌙 Normal', 
      description: 'For Everyone',
      icon: '🌙',
      color: '#667eea',
      bg: '#f8f9fa'
    }
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
  };

  return (
    <div className="landing">
      <div className="landing-container">
        <div className="landing-header">
          <div className="landing-logo">📱 LifeSync</div>
          <h1>Welcome to LifeSync</h1>
          <p>Your Personal Life Management System</p>
        </div>

        <div className="theme-selection">
          <h2>Choose Your Theme</h2>
          <div className="theme-grid">
            {themes.map((t) => (
              <div
                key={t.id}
                className={`theme-card ${selectedTheme === t.id ? 'selected' : ''}`}
                onClick={() => handleThemeSelect(t.id)}
                style={{
                  borderColor: selectedTheme === t.id ? t.color : 'transparent',
                  background: selectedTheme === t.id ? t.bg : 'white'
                }}
              >
                <div className="theme-icon" style={{ color: t.color }}>
                  {t.icon}
                </div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <div 
                  className="theme-preview"
                  style={{
                    background: t.bg,
                    border: `2px solid ${t.color}`
                  }}
                >
                  <span style={{ color: t.color }}>●</span>
                  <span style={{ color: t.color }}>●</span>
                  <span style={{ color: t.color }}>●</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-actions">
          <Link to="/register" className="btn-primary">
            Get Started Free
          </Link>
          <Link to="/login" className="btn-secondary">
            I Already Have an Account
          </Link>
        </div>

        <div className="landing-features">
          <div className="feature-item">
            <span>📔</span>
            <span>Digital Diary</span>
          </div>
          <div className="feature-item">
            <span>⏰</span>
            <span>Smart Schedule</span>
          </div>
          <div className="feature-item">
            <span>💰</span>
            <span>Expense Tracker</span>
          </div>
          <div className="feature-item">
            <span>🎯</span>
            <span>Goal Setting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;