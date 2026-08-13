const mongoose = require('mongoose');

// Test both connection formats
const testConnections = async () => {
  console.log('🔍 Testing MongoDB Atlas Connections...\n');

  // Option 1: SRV Connection
  try {
    console.log('📡 Testing SRV Connection...');
    const srvUri = 'mongodb+srv://Thanushya:yashh2006@cluster0.hlbgkst.mongodb.net/lifesync?retryWrites=true&w=majority';
    await mongoose.connect(srvUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ SRV Connection SUCCESS!');
    await mongoose.connection.close();
    console.log('🔒 Connection closed\n');
  } catch (err) {
    console.log('❌ SRV Connection FAILED:', err.message);
    console.log('💡 Trying alternative format...\n');
  }

  // Option 2: Standard Connection
  try {
    console.log('📡 Testing Standard Connection...');
    const standardUri = 'mongodb://Thanushya:yashh2006@cluster0.hlbgkst.mongodb.net:27017/lifesync?retryWrites=true&w=majority';
    await mongoose.connect(standardUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Standard Connection SUCCESS!');
    await mongoose.connection.close();
    console.log('🔒 Connection closed\n');
  } catch (err) {
    console.log('❌ Standard Connection FAILED:', err.message);
  }

  console.log('\n💡 If both failed:');
  console.log('1. Check your internet connection');
  console.log('2. Make sure your IP 103.130.89.139 is whitelisted');
  console.log('3. Check if your password "yashh2006" is correct');
  console.log('4. Try using a VPN or different network');
  console.log('5. Check if MongoDB Atlas cluster is active (not paused)');
};

testConnections();