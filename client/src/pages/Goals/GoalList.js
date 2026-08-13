import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaBullseye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Goal.css';

const GoalList = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/development/goals', {
        headers: { 'x-auth-token': token }
      });
      setGoals(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching goals:', err);
      toast.error('Failed to load goals');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/development/goals/${id}`, {
          headers: { 'x-auth-token': token }
        });
        toast.success('Goal deleted successfully');
        fetchGoals();
      } catch (err) {
        toast.error('Failed to delete goal');
      }
    }
  };

  if (loading) {
    return (
      <div className="goal-loading">
        <div className="spinner"></div>
        <p>Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="goal-container">
      <div className="goal-header">
        <div>
          <h1 className="goal-title">🎯 My Goals</h1>
          <p className="goal-subtitle">
            {goals.length} goals • {goals.filter(g => g.status === 'Completed').length} completed
          </p>
        </div>
        <Link to="/goals/new" className="goal-add-btn">
          <FaPlus /> Set Goal
        </Link>
      </div>

      <div className="goal-list">
        {goals.length === 0 ? (
          <div className="goal-empty">
            <div className="empty-icon">🎯</div>
            <h3>No goals set yet</h3>
            <p>Start setting goals for your personal growth</p>
            <Link to="/goals/new" className="empty-btn">
              Set Your First Goal
            </Link>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal._id} className="goal-item">
              <div className="goal-item-header">
                <div className="goal-info">
                  <h3>{goal.title}</h3>
                  <span className={`goal-status ${goal.status.toLowerCase().replace(' ', '-')}`}>
                    {goal.status}
                  </span>
                  <span className="goal-category">{goal.category}</span>
                </div>
                <div className="goal-item-actions">
                  <Link to={`/goals/edit/${goal._id}`} className="action-btn edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(goal._id)} className="action-btn delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${goal.currentProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{goal.currentProgress}%</span>
              </div>
              <div className="goal-footer">
                <span className="goal-date">
                  Target: {format(parseISO(goal.targetDate), 'MMM d, yyyy')}
                </span>
                {goal.isHabit && (
                  <span className="goal-habit">🔄 Habit • Streak: {goal.habitStreak} days</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalList;