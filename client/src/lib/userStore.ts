// User store that interfaces with MongoDB backend API
// Handles authentication and user management

export interface User {
  _id?: string; // MongoDB ObjectId
  id?: string; // Compatibility with existing code
  email: string;
  password?: string; // Only used for signup, not returned from API
  name: string;
  userType: 'doctor' | 'patient';
  // Doctor specific fields
  specialty?: string;
  organization?: string;
  license?: string;
  // Patient specific fields
  age?: number;
  mrn?: string;
  dateOfBirth?: string | Date;
  phone?: string;
  medicalRecordNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API base URL
const API_BASE = '/api';

// Current user state management
let currentUser: User | null = null;

// Demo users for display (same as backend initial data)
const demoUsers: User[] = [
  // Sample doctors
  { 
    email: "sarah.johnson@hospital.com",
    name: "Dr. Sarah Johnson",
    userType: "doctor",
    specialty: "Cardiology",
    organization: "City General Hospital",
    license: "MD12345"
  },
  { 
    email: "michael.chen@hospital.com",
    name: "Dr. Michael Chen",
    userType: "doctor",
    specialty: "Internal Medicine",
    organization: "City General Hospital",
    license: "MD12346"
  },
  { 
    email: "emily.rodriguez@hospital.com",
    name: "Dr. Emily Rodriguez",
    userType: "doctor",
    specialty: "Pediatrics",
    organization: "Children's Hospital",
    license: "MD12347"
  },
  // Sample patients
  { 
    email: "john.smith@email.com",
    name: "John Smith",
    userType: "patient",
    age: 45, 
    mrn: "MRN001",
    dateOfBirth: "1979-03-15",
    phone: "+1-555-0123",
    medicalRecordNumber: "MRN001"
  },
  { 
    email: "maria.garcia@email.com",
    name: "Maria Garcia",
    userType: "patient",
    age: 32, 
    mrn: "MRN002",
    dateOfBirth: "1992-07-22",
    phone: "+1-555-0124",
    medicalRecordNumber: "MRN002"
  },
  { 
    email: "robert.johnson@email.com",
    name: "Robert Johnson",
    userType: "patient",
    age: 67, 
    mrn: "MRN003",
    dateOfBirth: "1957-11-08",
    phone: "+1-555-0125",
    medicalRecordNumber: "MRN003"
  }
];

// Load current user from localStorage
const loadCurrentUser = (): User | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem('lipi_current_user');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error loading current user:', error);
  }
  return null;
};

// Save current user to localStorage
const saveCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    if (user) {
      localStorage.setItem('lipi_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lipi_current_user');
    }
  } catch (error) {
    console.warn('Error saving current user:', error);
  }
};

// Initialize user store
const initializeUserStore = () => {
  if (typeof window !== 'undefined') {
    currentUser = loadCurrentUser();
    console.log('UserStore initialized, current user:', currentUser?.email || 'none');
  }
};

// Call initialization
initializeUserStore();

export const userStore = {
  // Initialize store (call this on client side)
  initialize: () => {
    initializeUserStore();
  },

  // Get demo users for display
  getDemoUsers: (): User[] => demoUsers,

  // Get current user
  getCurrentUser: (): User | null => currentUser,

  // API-based authentication
  authenticate: async (email: string, password: string, userType: 'doctor' | 'patient'): Promise<User | null> => {
    try {
      console.log('API Authentication attempt:', { email, userType });
      
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        currentUser = data.user;
        saveCurrentUser(currentUser);
        console.log('Login successful:', currentUser?.email);
        return currentUser;
      } else {
        console.log('Login failed:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  },

  // Legacy authentication for demo purposes (fallback)
  authenticateDemo: (email: string, password: string, userType: 'doctor' | 'patient'): User | null => {
    console.log('Demo Authentication attempt:', { email, userType });
    
    // Check demo credentials
    const demoPasswords = {
      doctor: 'doctor123',
      patient: 'patient123'
    };

    if (password !== demoPasswords[userType]) {
      console.log('Demo login failed: incorrect password');
      return null;
    }

    const user = demoUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.userType === userType
    );

    if (user) {
      currentUser = user;
      saveCurrentUser(currentUser);
      console.log('Demo login successful:', user.email);
      return user;
    }

    console.log('Demo login failed: user not found');
    return null;
  },

  // API-based user creation
  addUser: async (userData: Omit<User, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
    try {
      console.log('API Creating user:', userData.email);

      const response = await fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('User created successfully:', data.user.email);
        return data.user;
      } else {
        console.log('User creation failed:', data.error);
        return null;
      }
    } catch (error) {
      console.error('User creation error:', error);
      return null;
    }
  },

  // Logout
  logout: () => {
    currentUser = null;
    saveCurrentUser(null);
    console.log('User logged out');
  },

  // Get all users (for development)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`/api/users`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    return [];
  },

  // Get demo credentials info
  getDemoCredentials: () => {
    const doctors = demoUsers.filter(u => u.userType === 'doctor').slice(0, 2);
    const patients = demoUsers.filter(u => u.userType === 'patient').slice(0, 2);
    
    return {
      doctors: doctors.map(u => ({ email: u.email, password: 'doctor123' })),
      patients: patients.map(u => ({ email: u.email, password: 'patient123' }))
    };
  }
};
