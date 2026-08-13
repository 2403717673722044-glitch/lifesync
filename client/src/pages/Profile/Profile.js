import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaUser, FaEnvelope, FaCalendar, FaPalette, FaEdit, FaCamera, FaSun, FaMoon } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { theme, setTheme, mode, toggleMode, isLight } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.profilePicture || '/default-avatar.png');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const themes = [
    { id: 'pinky', name: '🌸 Pinky', color: '#ff6b9d' },
    { id: 'spidey', name: '🕷️ Spidey', color: '#e62429' },
    { id: 'normal', name: '🌙 Normal', color: '#667eea' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Update user profile via API
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success('Avatar updated! Click Save to persist');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header with Avatar */}
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar" onClick={handleAvatarClick}>
              <img src={avatar} alt={user.name || 'Profile'} />
              <div className="avatar-overlay">
                <FaCamera />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <button 
            className="profile-edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Body */}
        <div className="profile-body">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="form-input"
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <button type="submit" className="profile-save-btn">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <FaUser />
                <span>{user.name}</span>
              </div>
              <div className="info-item">
                <FaEnvelope />
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <FaCalendar />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.bio && (
                <div className="info-item bio">
                  <p>{user.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Settings */}
        <div className="profile-themes">
          <h3>
            <FaPalette /> Choose Theme
          </h3>
          <div className="theme-options">
            {themes.map(t => (
              <button
                key={t.id}
                className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
                style={{
                  background: t.color,
                  borderColor: theme === t.id ? t.color : 'transparent'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dark/Light Mode Toggle */}
        <div className="profile-mode">
          <h3>
            {isLight ? <FaSun /> : <FaMoon />} Mode
          </h3>
          <button onClick={toggleMode} className="mode-toggle-big">
            {isLight ? (
              <>
                <FaMoon /> Switch to Dark Mode
              </>
            ) : (
              <>
                <FaSun /> Switch to Light Mode
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;