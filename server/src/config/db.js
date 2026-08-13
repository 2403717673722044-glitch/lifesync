const mongoose = require('mongoose');

// ============================================
// DATABASE CONNECTION CONFIG
// ============================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are for MongoDB driver 4.0+
      // No need for useNewUrlParser or useUnifiedTopology
    });

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📍 Port: ${conn.connection.port}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your connection string in .env');
    console.log('3. If using Atlas, check your internet connection');
    console.log('4. Verify your username and password');
    console.log('5. Check if your IP is whitelisted in Atlas');
    process.exit(1);
  }
};

module.exports = connectDB;