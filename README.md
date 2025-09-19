# Lipi Medical Transcription Platform

A modern medical transcription platform with AI-powered features, built with React, Node.js, and MongoDB.

## Quick Start

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **MongoDB** - [Installation guide](https://docs.mongodb.com/manual/installation/)

### Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Lipi
   npm install --legacy-peer-deps
   ```

2. **Start MongoDB**
   ```bash
   # On Linux (Fedora/RHEL/CentOS)
   sudo systemctl start mongod
   
   # On Ubuntu/Debian
   sudo systemctl start mongodb
   
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # On Windows
   net start MongoDB
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Visit [http://localhost:5000](http://localhost:5000)

## Features

- **Role-based Authentication** - Separate login for doctors and patients
- **Real-time Medical Transcription** - AI-powered voice-to-text
- **Clinical Notes Management** - Structured note-taking and storage
- **Dashboard** - Role-specific dashboards for doctors and patients
- **Modern UI** - Built with React and Tailwind CSS

## Demo Credentials

### Doctors
- **Email:** sarah.johnson@hospital.com **Password:** doctor123
- **Email:** michael.chen@hospital.com **Password:** doctor123
- **Email:** emily.rodriguez@hospital.com **Password:** doctor123

### Patients
- **Email:** john.smith@email.com **Password:** patient123
- **Email:** maria.garcia@email.com **Password:** patient123
- **Email:** robert.johnson@email.com **Password:** patient123

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** Custom user store with localStorage persistence
- **UI Components:** Radix UI primitives

## Development

### Database

The application connects to a local MongoDB instance at `mongodb://localhost:27017/lipi-medical`. Initial demo users are automatically created on first startup.

### API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration  
- `GET /api/users` - Get all users (development)
- `GET /health` - Health check

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and stores
│   └── hooks/           # Custom React hooks
├── server/              # Node.js backend
│   ├── database.ts      # MongoDB configuration
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry point
└── shared/              # Shared TypeScript schemas
```

## Environment Variables

Create a `.env` file for custom configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lipi-medical
```

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running:**
   ```bash
   sudo systemctl status mongod
   ```

2. **Start MongoDB if not running:**
   ```bash
   sudo systemctl start mongod
   ```

3. **Check MongoDB logs:**
   ```bash
   sudo journalctl -u mongod -f
   ```

### Port Already in Use

If port 5000 is already in use, either:
- Stop the conflicting process
- Change the port in the `.env` file

### Build Issues

If you encounter dependency conflicts:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```