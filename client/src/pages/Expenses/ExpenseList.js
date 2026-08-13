import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { FaPlus, FaEdit, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Expense.css';

const ExpenseList = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/expenses', {
        headers: { 'x-auth-token': token }
      });
      setExpenses(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      toast.error('Failed to load expenses');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/expenses/${id}`, {
          headers: { 'x-auth-token': token }
        });
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (err) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(e => e.type === filter);

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="expense-loading">
        <div className="spinner"></div>
        <p>Loading your expenses...</p>
      </div>
    );
  }

  return (
    <div className="expense-container">
      <div className="expense-header">
        <div>
          <h1 className="expense-title">💰 Expenses</h1>
          <p className="expense-subtitle">
            Track your income and expenses
          </p>
        </div>
        <Link to="/expenses/new" className="expense-add-btn">
          <FaPlus /> Add Transaction
        </Link>
      </div>

      <div className="expense-summary">
        <div className="summary-card income">
          <span className="summary-label">Total Income</span>
          <span className="summary-value">${totalIncome.toFixed(2)}</span>
        </div>
        <div className="summary-card expense">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-value">${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="summary-card balance">
          <span className="summary-label">Balance</span>
          <span className="summary-value">${(totalIncome - totalExpenses).toFixed(2)}</span>
        </div>
      </div>

      <div className="expense-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
          onClick={() => setFilter('income')}
        >
          Income
        </button>
        <button 
          className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
          onClick={() => setFilter('expense')}
        >
          Expenses
        </button>
      </div>

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="expense-empty">
            <div className="empty-icon">💳</div>
            <h3>No transactions found</h3>
            <p>Start tracking your income and expenses</p>
            <Link to="/expenses/new" className="empty-btn">
              Add Transaction
            </Link>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense._id} className="expense-item">
              <div className="expense-item-left">
                <div className="expense-icon">
                  {expense.type === 'income' ? '📈' : '📉'}
                </div>
                <div className="expense-info">
                  <h3>{expense.title}</h3>
                  <span className="expense-category">{expense.category}</span>
                  <span className={`expense-type ${expense.type}`}>
                    {expense.type}
                  </span>
                </div>
              </div>
              <div className="expense-item-right">
                <span className={`expense-amount ${expense.type}`}>
                  {expense.type === 'income' ? '+' : '-'} ${expense.amount.toFixed(2)}
                </span>
                <span className="expense-date">
                  {format(parseISO(expense.date), 'MMM d, yyyy')}
                </span>
                <div className="expense-item-actions">
                  <Link to={`/expenses/edit/${expense._id}`} className="action-btn edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(expense._id)} className="action-btn delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;