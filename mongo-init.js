// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('lipi-medical');

// Create a regular user for the application
db.createUser({
  user: 'lipi-user',
  pwd: 'lipi-password',
  roles: [
    {
      role: 'readWrite',
      db: 'lipi-medical'
    }
  ]
});

// Create initial collections with indexes
db.createCollection('users');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "userType": 1 });
db.users.createIndex({ "medicalRecordNumber": 1 }, { sparse: true });

print('✅ MongoDB initialized successfully with user and indexes');