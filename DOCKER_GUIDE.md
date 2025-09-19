# Docker Deployment Guide for Lipi Medical Transcription Platform

This guide explains how to deploy and test the Lipi application using Docker containers with the new authentication dialog features.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### 1. Build and Start the Application

```bash
# Make the setup script executable
chmod +x docker-setup.sh

# Run the setup script
./docker-setup.sh
```

Or manually:

```bash
# Build the application
npm run build

# Start with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 2. Access the Application

Once started, the application will be available at:
- **Main Application**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 3. Test Authentication Dialogs

The application now includes enhanced login and signup flows with success/error dialogs:

#### Login Testing
1. Navigate to http://localhost:5000/login
2. **Test Successful Login**:
   - User Type: Doctor
   - Email: `sarah.johnson@hospital.com`
   - Password: `doctor123`
   - ✅ Should show success dialog and redirect to doctor dashboard

   - User Type: Patient  
   - Email: `john.doe@email.com`
   - Password: `patient123`
   - ✅ Should show success dialog and redirect to patient dashboard

3. **Test Failed Login**:
   - Use any invalid email/password combination
   - ❌ Should show error dialog with descriptive message

#### Signup Testing
1. Navigate to http://localhost:5000/signup
2. **Test Successful Signup**:
   - Fill out all required fields with valid data
   - ✅ Should show success dialog and redirect to dashboard

3. **Test Failed Signup**:
   - Try using existing email: `sarah.johnson@hospital.com`
   - ❌ Should show error dialog about email already existing

## Docker Configuration

### Development Mode
```bash
# Start in development mode (default)
docker-compose up -d
```

### Production Mode
```bash
# Start with Nginx reverse proxy
docker-compose --profile production up -d
```

## Container Architecture

### Services

1. **lipi-app**: Main application container
   - Port: 5000
   - Health check endpoint: `/health`
   - Automatic restart on failure

2. **nginx** (production profile): Reverse proxy
   - Port: 80 (HTTP), 443 (HTTPS)
   - Gzip compression enabled
   - Security headers configured

### Volumes
- `uploads`: Persistent storage for uploaded files

### Networks
- `lipi-network`: Internal communication between services

## Health Monitoring

The application includes a health check endpoint that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## Testing Scripts

### Automated Testing
```bash
# Run comprehensive tests
chmod +x docker-test.sh
./docker-test.sh
```

### Manual Testing Checklist

- [ ] Application starts without errors
- [ ] Health check endpoint responds
- [ ] Login page loads correctly
- [ ] Signup page loads correctly
- [ ] Success dialogs appear for valid credentials
- [ ] Error dialogs appear for invalid credentials
- [ ] Role-based dashboard routing works
- [ ] Theme toggle functionality works
- [ ] Static assets load properly

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "3000:5000"  # Use port 3000 instead
   ```

2. **Build failures**
   ```bash
   # Clean and rebuild
   docker-compose down --volumes
   docker-compose build --no-cache
   ```

3. **Application not responding**
   ```bash
   # Check container logs
   docker-compose logs lipi-app
   
   # Check container status
   docker-compose ps
   ```

4. **Authentication dialogs not working**
   - Ensure JavaScript is enabled in browser
   - Check browser console for errors
   - Verify dialog components are properly imported

### Log Analysis
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs lipi-app
docker-compose logs nginx
```

## Security Features

### Authentication Security
- Password validation with complexity requirements
- Session-based authentication
- Role-based access control (doctor/patient)
- Input validation and sanitization

### Container Security
- Non-root user in container
- Security headers in Nginx configuration
- HTTPS ready (certificates needed for production)
- Volume permissions properly configured

## Performance Optimization

### Build Optimization
- Multi-stage Docker build
- Node.js production mode
- Static asset optimization
- Gzip compression enabled

### Runtime Optimization
- Health checks for container orchestration
- Automatic restart policies
- Resource limits (can be configured)
- CDN-ready static asset serving

## Production Deployment

For production deployment:

1. **SSL/TLS Setup**:
   ```bash
   # Add SSL certificates to ./ssl/ directory
   # Update nginx.conf for HTTPS configuration
   docker-compose --profile production up -d
   ```

2. **Environment Variables**:
   ```bash
   # Create .env file
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_database_url
   ```

3. **Monitoring**:
   - Set up log aggregation
   - Monitor health check endpoint
   - Configure alerts for container failures

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs
3. Verify all prerequisites are installed
4. Ensure network connectivity to required ports

---

**Note**: This Docker setup includes all the latest features including role-based dashboards, success/error dialogs for authentication, and comprehensive health monitoring.