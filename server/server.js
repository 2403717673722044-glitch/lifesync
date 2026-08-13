const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

// ============================================
// IMPORT ALL ROUTES
// ============================================

const authRoutes = require('./src/routes/authRoutes');
const diaryRoutes = require('./src/routes/diaryRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const goalRoutes = require('./src/routes/goalRoutes');

// ============================================
// USE ALL ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);

// ============================================
// TEST ROUTES
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: 'LifeSync API is running!',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  res.json({
    status: 'OK',
    database: states[state] || 'Unknown',
    databaseName: mongoose.connection.name || 'N/A',
    host: mongoose.connection.host || 'N/A',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  console.log('❌ Route not found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
    console.log(`\n📝 Available Routes:`);
    console.log(`   /api/auth    - Authentication (register, login)`);
    console.log(`   /api/diary   - Diary entries (CRUD)`);
    console.log(`   /api/schedule - Schedule tasks (CRUD)`);
    console.log(`   /api/expenses - Expenses (CRUD)`);
    console.log(`   /api/goals   - Goals (CRUD)`);
    console.log(`\n🔗 Health Check: http://localhost:${PORT}/api/health`);
  });
};

startServer();