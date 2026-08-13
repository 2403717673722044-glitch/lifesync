import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaEdit, FaTrash, FaArrowLeft, FaCalendar, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Diary.css';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/diary/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setEntry(res.data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Entry not found');
      navigate('/diary');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/diary/${id}`, {
        headers: { 'x-auth-token': token }
      });
      toast.success('Entry deleted successfully');
      navigate('/diary');
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return (
      <div className="diary-loading">
        <div className="spinner"></div>
        <p>Loading entry...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="diary-not-found">
        <h2>Entry not found</h2>
        <Link to="/diary" className="back-link">Back to Diary</Link>
      </div>
    );
  }

  return (
    <div className="diary-detail-container">
      <div className="diary-detail-header">
        <button onClick={() => navigate('/diary')} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <div className="detail-actions">
          <Link to={`/diary/edit/${entry._id}`} className="detail-btn edit">
            <FaEdit /> Edit
          </Link>
          <button onClick={() => setShowDeleteModal(true)} className="detail-btn delete">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="diary-detail-content">
        <div className="detail-mood">
          <span className="mood-emoji">{entry.mood.split(' ')[0]}</span>
          <span className="mood-text">{entry.mood}</span>
        </div>

        <h1 className="detail-title">{entry.title}</h1>

        <div className="detail-meta">
          <span className="meta-item">
            <FaCalendar />
            {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
          </span>
          {entry.location && (
            <span className="meta-item">
              <FaMapMarkerAlt />
              {entry.location}
            </span>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <span className="meta-item">
              <FaTag />
              {entry.tags.map(tag => `#${tag}`).join(' ')}
            </span>
          )}
        </div>

        <div className="detail-body">
          {entry.content.split('\n').map((paragraph, index) => (
            <p key={index} className="detail-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="detail-footer">
          <span className="detail-timestamp">
            Last updated: {format(parseISO(entry.updatedAt), 'MMM d, yyyy h:mm a')}
          </span>
          {entry.isPrivate && (
            <span className="detail-private">🔒 Private</span>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3>Delete Entry</h3>
            <p>Are you sure you want to delete "{entry.title}"?</p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default DiaryDetail;