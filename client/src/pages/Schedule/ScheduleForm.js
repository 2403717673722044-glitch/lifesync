import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Schedule.css';

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    priority: 'Medium',
    status: 'Pending'
  });

  const categories = ['Work', 'Study', 'Exercise', 'Meal', 'Sleep', 'Leisure', 'Social', 'Personal', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/schedule/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const data = res.data.data;
      setFormData({
        title: data.title,
        description: data.description || '',
        category: data.category,
        date: format(parseISO(data.date), 'yyyy-MM-dd'),
        startTime: data.startTime,
        endTime: data.endTime,
        priority: data.priority,
        status: data.status
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load task');
      navigate('/schedule');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        ? `http://localhost:5001/api/schedule/${id}`
        : 'http://localhost:5001/api/schedule';
      const method = id ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { 'x-auth-token': token }
      });

      toast.success(id ? 'Task updated successfully!' : 'Task created successfully!');
      navigate('/schedule');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="schedule-loading">
        <div className="spinner"></div>
        <p>Loading task...</p>
      </div>
    );
  }

  return (
    <div className="schedule-form-container">
      <div className="schedule-form-header">
        <h1>{id ? '✏️ Edit Task' : '📝 New Task'}</h1>
        <button onClick={() => navigate('/schedule')} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What do you need to do?"
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
            placeholder="Add details about this task..."
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
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
            />
          </div>

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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/schedule')}
            className="form-btn cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="form-btn submit"
          >
            <FaSave /> {loading ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;