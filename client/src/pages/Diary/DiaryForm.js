import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaSave, FaTimes, FaTag } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Diary.css';

const DiaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '😊 Happy',
    tags: [],
    date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    isPrivate: true
  });
  const [tagInput, setTagInput] = useState('');

  const moods = [
    '😊 Happy', '😢 Sad', '😡 Angry', '😌 Calm', 
    '🤔 Thoughtful', '🥰 Grateful', '😰 Anxious', 
    '😴 Tired', '💪 Motivated', '🤗 Loved'
  ];

  useEffect(() => {
    if (id) {
      fetchEntry();
    }
  }, [id]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/diary/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const entry = res.data.data;
      setFormData({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags || [],
        date: format(parseISO(entry.date), 'yyyy-MM-dd'),
        location: entry.location || '',
        isPrivate: entry.isPrivate
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load entry');
      navigate('/diary');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please add a title');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Please add content');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = id 
        ? `http://localhost:5001/api/diary/${id}`
        : 'http://localhost:5001/api/diary';
      const method = id ? 'put' : 'post';

      const res = await axios[method](url, formData, {
        headers: { 'x-auth-token': token }
      });

      toast.success(id ? 'Entry updated successfully!' : 'Entry created successfully!');
      navigate(`/diary/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="diary-loading">
        <div className="spinner"></div>
        <p>Loading entry...</p>
      </div>
    );
  }

  return (
    <div className="diary-form-container">
      <div className="diary-form-header">
        <h1>{id ? '✏️ Edit Entry' : '📝 New Diary Entry'}</h1>
        <button onClick={() => navigate('/diary')} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="diary-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What's on your mind?"
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mood">How are you feeling?</label>
            <select
              id="mood"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="form-select"
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

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
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your thoughts, feelings, and experiences..."
            className="form-textarea"
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where are you?"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input-group">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tags (e.g., important, work, travel)"
              className="form-input tag-input"
            />
            <button type="button" onClick={handleAddTag} className="add-tag-btn">
              <FaTag /> Add
            </button>
          </div>
          <div className="tags-container">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag-item">
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
            />
            <span>Make this entry private</span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/diary')}
            className="form-btn cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="form-btn submit"
          >
            <FaSave /> {loading ? 'Saving...' : id ? 'Update Entry' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryForm;