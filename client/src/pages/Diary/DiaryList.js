import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaCalendar, FaTag } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Diary.css';

const DiaryList = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const moods = [
    '😊 Happy', '😢 Sad', '😡 Angry', '😌 Calm', 
    '🤔 Thoughtful', '🥰 Grateful', '😰 Anxious', 
    '😴 Tired', '💪 Motivated', '🤗 Loved'
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, filterMood, filterDate]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/diary', {
        headers: { 'x-auth-token': token }
      });
      setEntries(res.data.data);
      setFilteredEntries(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching diary:', err);
      toast.error('Failed to load diary entries');
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMood !== 'all') {
      filtered = filtered.filter(entry => entry.mood === filterMood);
    }

    if (filterDate) {
      filtered = filtered.filter(entry =>
        format(parseISO(entry.date), 'yyyy-MM-dd') === filterDate
      );
    }

    setFilteredEntries(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/diary/${id}`, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Entry deleted successfully');
      fetchEntries();
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const getMoodEmoji = (mood) => {
    return mood.split(' ')[0] || '📝';
  };

  if (loading) {
    return (
      <div className="diary-loading">
        <div className="spinner"></div>
        <p>Loading your diary entries...</p>
      </div>
    );
  }

  return (
    <div className="diary-container">
      <div className="diary-header">
        <div>
          <h1 className="diary-title">📔 My Diary</h1>
          <p className="diary-subtitle">
            {entries.length} entries • {new Date().toLocaleDateString()}
          </p>
        </div>
        <Link to="/diary/new" className="diary-add-btn">
          <FaPlus /> New Entry
        </Link>
      </div>

      <div className="diary-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search diary entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Moods</option>
            {moods.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-date"
          />

          {(searchTerm || filterMood !== 'all' || filterDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMood('all');
                setFilterDate('');
              }}
              className="clear-filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="diary-empty">
          <div className="empty-icon">📝</div>
          <h3>No diary entries found</h3>
          <p>Start writing your thoughts and memories today</p>
          <Link to="/diary/new" className="empty-btn">
            Write Your First Entry
          </Link>
        </div>
      ) : (
        <div className="diary-grid">
          {filteredEntries.map((entry) => (
            <div key={entry._id} className="diary-card">
              <div className="diary-card-header">
                <div className="diary-card-mood">
                  {getMoodEmoji(entry.mood)}
                </div>
                <div className="diary-card-actions">
                  <Link to={`/diary/edit/${entry._id}`} className="action-btn edit">
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedEntry(entry);
                      setShowDeleteModal(true);
                    }}
                    className="action-btn delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <Link to={`/diary/${entry._id}`} className="diary-card-content">
                <h3 className="diary-card-title">{entry.title}</h3>
                <p className="diary-card-preview">
                  {entry.content.substring(0, 150)}
                  {entry.content.length > 150 && '...'}
                </p>
              </Link>

              <div className="diary-card-footer">
                <div className="diary-card-date">
                  <FaCalendar />
                  <span>{format(parseISO(entry.date), 'MMM d, yyyy')}</span>
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="diary-card-tags">
                    <FaTag />
                    <span>{entry.tags.slice(0, 2).join(', ')}</span>
                    {entry.tags.length > 2 && <span>+{entry.tags.length - 2}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && selectedEntry && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3>Delete Entry</h3>
            <p>Are you sure you want to delete "{selectedEntry.title}"?</p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedEntry._id)}
                className="modal-btn delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryList;