import mongoose, { Document, Schema } from 'mongoose';

// Define the user interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  userType: 'doctor' | 'patient';
  // Doctor specific fields
  specialty?: string;
  organization?: string;
  license?: string;
  // Patient specific fields
  dateOfBirth?: Date;
  phone?: string;
  medicalRecordNumber?: string;
  age?: number;
  mrn?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the OPD Record interface
export interface IOPDRecord extends Document {
  doctorId: string;
  patientDetails: {
    name: string;
    age: string;
    gender: string;
    phoneNumber?: string;
    address?: string;
  };
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  examination: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  recordingTranscript: string;
  audioRecordingUrl?: string;
  recordingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema for MongoDB
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true
  },
  // Doctor specific fields
  specialty: {
    type: String,
    required: false
  },
  organization: {
    type: String,
    required: false
  },
  license: {
    type: String,
    required: false
  },
  // Patient specific fields
  dateOfBirth: {
    type: Date,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  medicalRecordNumber: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  mrn: {
    type: String,
    required: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save hook to generate MRN for patients
userSchema.pre('save', function(next) {
  if (this.userType === 'patient' && !this.medicalRecordNumber) {
    this.medicalRecordNumber = `MRN${Date.now().toString().slice(-6)}`;
    this.mrn = this.medicalRecordNumber; // Set alias
  }
  next();
});

// Create User model
export const User = mongoose.model<IUser>('User', userSchema);

// OPD Record Schema for MongoDB
const opdRecordSchema = new Schema<IOPDRecord>({
  doctorId: {
    type: String,
    required: true
  },
  patientDetails: {
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false }
  },
  chiefComplaint: {
    type: String,
    required: true
  },
  historyOfPresentIllness: {
    type: String,
    required: false
  },
  pastMedicalHistory: {
    type: String,
    required: false
  },
  examination: {
    type: String,
    required: false
  },
  diagnosis: {
    type: String,
    required: false
  },
  treatment: {
    type: String,
    required: false
  },
  followUp: {
    type: String,
    required: false
  },
  recordingTranscript: {
    type: String,
    required: false
  },
  audioRecordingUrl: {
    type: String,
    required: false
  },
  recordingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create OPD Record model
export const OPDRecord = mongoose.model<IOPDRecord>('OPDRecord', opdRecordSchema);

// Database connection function
export const connectDB = async (): Promise<void> => {
  try {
    // For local development, use local MongoDB instance
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lipi-medical';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to local MongoDB:', mongoURI);

    // Create initial users if database is empty
    await createInitialUsers();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Make sure MongoDB is installed and running locally:');
    console.log('   - Install: https://docs.mongodb.com/manual/installation/');
    console.log('   - Start: sudo systemctl start mongod (Linux) or brew services start mongodb/brew/mongodb-community (Mac)');
    console.log('   - Or use MongoDB Atlas cloud service');
    process.exit(1);
  }
};

// Function to create initial demo users
const createInitialUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Creating initial demo users...');
      
      const initialUsers = [
        // Sample doctors
        {
          email: "sarah.johnson@hospital.com",
          password: "doctor123",
          name: "Dr. Sarah Johnson",
          userType: "doctor",
          specialty: "Cardiology",
          organization: "City General Hospital",
          license: "MD12345"
        },
        {
          email: "michael.chen@hospital.com",
          password: "doctor123",
          name: "Dr. Michael Chen",
          userType: "doctor",
          specialty: "Internal Medicine",
          organization: "City General Hospital",
          license: "MD12346"
        },
        {
          email: "emily.rodriguez@hospital.com",
          password: "doctor123",
          name: "Dr. Emily Rodriguez",
          userType: "doctor",
          specialty: "Pediatrics",
          organization: "Children's Hospital",
          license: "MD12347"
        },
        // Sample patients
        {
          email: "john.smith@email.com",
          password: "patient123",
          name: "John Smith",
          userType: "patient",
          dateOfBirth: new Date("1979-03-15"),
          phone: "+1-555-0123",
          medicalRecordNumber: "MRN001",
          age: 45,
          mrn: "MRN001"
        },
        {
          email: "maria.garcia@email.com",
          password: "patient123",
          name: "Maria Garcia",
          userType: "patient",
          dateOfBirth: new Date("1992-07-22"),
          phone: "+1-555-0124",
          medicalRecordNumber: "MRN002",
          age: 32,
          mrn: "MRN002"
        },
        {
          email: "robert.johnson@email.com",
          password: "patient123",
          name: "Robert Johnson",
          userType: "patient",
          dateOfBirth: new Date("1957-11-08"),
          phone: "+1-555-0125",
          medicalRecordNumber: "MRN003",
          age: 67,
          mrn: "MRN003"
        }
      ];

      await User.insertMany(initialUsers);
      console.log('✅ Initial demo users created successfully');
    }
  } catch (error) {
    console.error('Error creating initial users:', error);
  }
};

// Close database connection
export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};