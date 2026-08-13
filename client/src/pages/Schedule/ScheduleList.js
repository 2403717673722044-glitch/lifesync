import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaClock, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Schedule.css';

const ScheduleList = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/schedule', {
        headers: { 'x-auth-token': token }
      });
      setSchedules(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      toast.error('Failed to load schedules');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/schedule/${id}`, {
          headers: { 'x-auth-token': token }
        });
        toast.success('Task deleted successfully');
        fetchSchedules();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getDaySchedules = () => {
    return schedules.filter(s => 
      format(parseISO(s.date), 'yyyy-MM-dd') === selectedDate
    );
  };

  const todaySchedules = getDaySchedules();

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="spinner"></div>
        <p>Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div>
          <h1 className="schedule-title">⏰ My Schedule</h1>
          <p className="schedule-subtitle">
            {schedules.length} total tasks
          </p>
        </div>
        <Link to="/schedule/new" className="schedule-add-btn">
          <FaPlus /> Add Task
        </Link>
      </div>

      <div className="schedule-date-picker">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
        <span className="date-label">
          {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
        </span>
      </div>

      <div className="schedule-list">
        {todaySchedules.length === 0 ? (
          <div className="schedule-empty">
            <div className="empty-icon">📅</div>
            <h3>No tasks for this day</h3>
            <p>Enjoy your free time or add a new task</p>
            <Link to="/schedule/new" className="empty-btn">
              Add Task
            </Link>
          </div>
        ) : (
          todaySchedules.map((task) => (
            <div key={task._id} className="schedule-item">
              <div className="schedule-item-left">
                <div className="schedule-time">
                  <FaClock />
                  <span>{task.startTime} - {task.endTime}</span>
                </div>
                <div className="schedule-info">
                  <h3>{task.title}</h3>
                  <span className={`schedule-category ${task.category.toLowerCase()}`}>
                    {task.category}
                  </span>
                  <span className={`schedule-priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="schedule-item-actions">
                <Link to={`/schedule/edit/${task._id}`} className="action-btn edit">
                  <FaEdit />
                </Link>
                <button onClick={() => handleDelete(task._id)} className="action-btn delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleList;