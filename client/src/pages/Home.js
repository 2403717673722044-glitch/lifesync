import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '📔', title: 'Digital Diary', desc: 'Write your thoughts, memories, and daily reflections' },
    { icon: '⏰', title: 'Smart Schedule', desc: 'Plan your day with intelligent scheduling' },
    { icon: '💰', title: 'Expense Tracker', desc: 'Track your income and expenses easily' },
    { icon: '🎯', title: 'Goal Setting', desc: 'Set and achieve your personal goals' },
    { icon: '💪', title: 'Habit Builder', desc: 'Build positive habits and track progress' },
    { icon: '📊', title: 'Analytics', desc: 'Get insights about your life patterns' },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Personal Life Management System
          </h1>
          <p className="hero-subtitle">
            Sync your life in one place. Manage diary, schedule, expenses, 
            and personal development all in one beautiful app.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <span>📱</span>
            <span>📔</span>
            <span>⏰</span>
            <span>💰</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle">
            LifeSync brings together all the tools you need to manage your life
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Sync Your Life?</h2>
          <p>Join thousands of users who have simplified their life management</p>
          <Link to="/register" className="btn-primary">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;