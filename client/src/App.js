import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DiaryList from './pages/Diary/DiaryList';
import DiaryForm from './pages/Diary/DiaryForm';
import DiaryDetail from './pages/Diary/DiaryDetail';
import ScheduleList from './pages/Schedule/ScheduleList';
import ScheduleForm from './pages/Schedule/ScheduleForm';
import ExpenseList from './pages/Expenses/ExpenseList';
import ExpenseForm from './pages/Expenses/ExpenseForm';
import GoalList from './pages/Goals/GoalList';
import GoalForm from './pages/Goals/GoalForm';
import Profile from './pages/Profile/Profile';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    document.body.className = `${mode} ${theme}`;
    document.documentElement.setAttribute('data-theme', mode);
  }, [theme, mode]);

  return (
    <div className={`app ${mode} ${theme}`}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />
          } />
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          
          <Route path="/diary" element={
            <ProtectedRoute><DiaryList /></ProtectedRoute>
          } />
          <Route path="/diary/new" element={
            <ProtectedRoute><DiaryForm /></ProtectedRoute>
          } />
          <Route path="/diary/edit/:id" element={
            <ProtectedRoute><DiaryForm /></ProtectedRoute>
          } />
          <Route path="/diary/:id" element={
            <ProtectedRoute><DiaryDetail /></ProtectedRoute>
          } />
          
          <Route path="/schedule" element={
            <ProtectedRoute><ScheduleList /></ProtectedRoute>
          } />
          <Route path="/schedule/new" element={
            <ProtectedRoute><ScheduleForm /></ProtectedRoute>
          } />
          <Route path="/schedule/edit/:id" element={
            <ProtectedRoute><ScheduleForm /></ProtectedRoute>
          } />
          
          <Route path="/expenses" element={
            <ProtectedRoute><ExpenseList /></ProtectedRoute>
          } />
          <Route path="/expenses/new" element={
            <ProtectedRoute><ExpenseForm /></ProtectedRoute>
          } />
          <Route path="/expenses/edit/:id" element={
            <ProtectedRoute><ExpenseForm /></ProtectedRoute>
          } />
          
          <Route path="/goals" element={
            <ProtectedRoute><GoalList /></ProtectedRoute>
          } />
          <Route path="/goals/new" element={
            <ProtectedRoute><GoalForm /></ProtectedRoute>
          } />
          <Route path="/goals/edit/:id" element={
            <ProtectedRoute><GoalForm /></ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;