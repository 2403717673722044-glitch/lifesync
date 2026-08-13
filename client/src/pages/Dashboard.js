import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaClock, 
  FaMoneyBillWave, 
  FaBullseye,
  FaHeartbeat,
  FaCalendarCheck,
  FaPlus
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    diaryEntries: 0,
    tasksToday: 0,
    expenses: 0,
    goals: 0,
    healthRecords: 0,
    habitsCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from API
    setTimeout(() => {
      setStats({
        diaryEntries: 12,
        tasksToday: 5,
        expenses: 8,
        goals: 3,
        healthRecords: 4,
        habitsCompleted: 7
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {getGreeting()}, {user?.name || 'User'}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's your life overview for today
          </p>
        </div>
        <div className="dashboard-actions">
          <Link to="/diary/new" className="action-btn">
            <FaPlus /> New Diary
          </Link>
          <Link to="/schedule/new" className="action-btn">
            <FaPlus /> Add Task
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          icon={<FaBook />}
          title="Diary Entries"
          value={stats.diaryEntries}
          subtitle="This month"
          color="blue"
        />
        <DashboardCard
          icon={<FaClock />}
          title="Tasks Today"
          value={stats.tasksToday}
          subtitle="Pending tasks"
          color="orange"
        />
        <DashboardCard
          icon={<FaMoneyBillWave />}
          title="Expenses"
          value={`$${stats.expenses}`}
          subtitle="This month"
          color="green"
        />
        <DashboardCard
          icon={<FaBullseye />}
          title="Goals"
          value={stats.goals}
          subtitle="In progress"
          color="purple"
        />
        <DashboardCard
          icon={<FaHeartbeat />}
          title="Health Records"
          value={stats.healthRecords}
          subtitle="Tracked this week"
          color="red"
        />
        <DashboardCard
          icon={<FaCalendarCheck />}
          title="Habits Completed"
          value={stats.habitsCompleted}
          subtitle="This week"
          color="pink"
        />
      </div>

      <div className="dashboard-bottom">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">📔</span>
              <div>
                <p className="activity-title">Wrote in diary</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💰</span>
              <div>
                <p className="activity-title">Added expense: Lunch</p>
                <p className="activity-time">4 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🎯</span>
              <div>
                <p className="activity-title">Completed goal: Exercise</p>
                <p className="activity-time">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/diary/new" className="quick-action-btn">📔 Write Diary</Link>
            <Link to="/schedule/new" className="quick-action-btn">⏰ Add Task</Link>
            <Link to="/expenses/new" className="quick-action-btn">💰 Add Expense</Link>
            <Link to="/goals/new" className="quick-action-btn">🎯 Set Goal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;