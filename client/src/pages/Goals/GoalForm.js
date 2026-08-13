import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Goal.css';

const GoalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal Growth',
    targetDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    priority: 'Medium',
    status: 'Not Started',
    isHabit: false,
    habitFrequency: 'Daily'
  });

  const categories = ['Career', 'Health', 'Finance', 'Relationships', 'Personal Growth', 'Education', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Abandoned'];
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  useEffect(() => {
    if (id) {
      fetchGoal();
    }
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/development/goals/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const data = res.data.data;
      setFormData({
        title: data.title,
        description: data.description || '',
        category: data.category,
        targetDate: format(parseISO(data.targetDate), 'yyyy-MM-dd'),
        priority: data.priority,
        status: data.status,
        isHabit: data.isHabit || false,
        habitFrequency: data.habitFrequency || 'Daily'
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load goal');
      navigate('/goals');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please add a title');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = id 
        ? `http://localhost:5001/api/development/goals/${id}`
        : 'http://localhost:5001/api/development/goals';
      const method = id ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { 'x-auth-token': token }
      });

      toast.success(id ? 'Goal updated successfully!' : 'Goal created successfully!');
      navigate('/goals');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="goal-loading">
        <div className="spinner"></div>
        <p>Loading goal...</p>
      </div>
    );
  }

  return (
    <div className="goal-form-container">
      <div className="goal-form-header">
        <h1>{id ? '✏️ Edit Goal' : '🎯 New Goal'}</h1>
        <button onClick={() => navigate('/goals')} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label htmlFor="title">Goal Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What do you want to achieve?"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your goal in detail..."
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">Target Date</label>
            <input
              type="date"
              id="targetDate"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isHabit"
              checked={formData.isHabit}
              onChange={handleChange}
            />
            <span>Make this a habit</span>
          </label>
        </div>

        {formData.isHabit && (
          <div className="form-group">
            <label htmlFor="habitFrequency">Habit Frequency</label>
            <select
              id="habitFrequency"
              name="habitFrequency"
              value={formData.habitFrequency}
              onChange={handleChange}
              className="form-select"
            >
              {frequencies.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="form-btn cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="form-btn submit"
          >
            <FaSave /> {loading ? 'Saving...' : id ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;