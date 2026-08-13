import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Expense.css';

const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    type: 'expense',
    paymentMethod: 'Cash',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 
    'Health', 'Education', 'Gifts', 'Savings', 'Rent', 'Insurance', 'Other'];
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];

  useEffect(() => {
    if (id) {
      fetchExpense();
    }
  }, [id]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5001/api/expenses/${id}`, {
        headers: { 'x-auth-token': token }
      });
      const data = res.data.data;
      setFormData({
        title: data.title,
        amount: data.amount,
        category: data.category,
        type: data.type,
        paymentMethod: data.paymentMethod || 'Cash',
        description: data.description || '',
        date: format(parseISO(data.date), 'yyyy-MM-dd')
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load transaction');
      navigate('/expenses');
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
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please add a valid amount');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = id 
        ? `http://localhost:5001/api/expenses/${id}`
        : 'http://localhost:5001/api/expenses';
      const method = id ? 'put' : 'post';

      await axios[method](url, { ...formData, amount: parseFloat(formData.amount) }, {
        headers: { 'x-auth-token': token }
      });

      toast.success(id ? 'Transaction updated successfully!' : 'Transaction created successfully!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="expense-loading">
        <div className="spinner"></div>
        <p>Loading transaction...</p>
      </div>
    );
  }

  return (
    <div className="expense-form-container">
      <div className="expense-form-header">
        <h1>{id ? '✏️ Edit Transaction' : '📝 New Transaction'}</h1>
        <button onClick={() => navigate('/expenses')} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What was this for?"
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
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
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="form-select"
            >
              {paymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about this transaction..."
            className="form-textarea"
            rows="3"
          />
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

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="form-btn cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="form-btn submit"
          >
            <FaSave /> {loading ? 'Saving...' : id ? 'Update Transaction' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;