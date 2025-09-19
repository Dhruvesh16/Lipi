#!/bin/bash

# Lipi Medical Transcription Docker Setup Script
set -e

echo "🏥 Lipi Medical Transcription Platform - Docker Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Building the Lipi application..."

# Build the Docker image
if docker-compose build; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image"
    exit 1
fi

print_status "Starting the Lipi application..."

# Start the application
if docker-compose up -d; then
    print_success "Lipi application started successfully!"
    echo ""
    print_status "Application is now running at:"
    echo "🌐 Application: http://localhost:5000"
    echo "🔧 Health Check: http://localhost:5000/health"
    echo ""
    print_status "To view logs: docker-compose logs -f"
    print_status "To stop the application: docker-compose down"
    echo ""
    print_warning "Note: For production deployment, use: docker-compose --profile production up -d"
else
    print_error "Failed to start the application"
    exit 1
fi

# Wait a bit and check health
print_status "Waiting for application to start..."
sleep 10

# Check if the application is healthy
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Application is healthy and ready to use!"
else
    print_warning "Application may still be starting up. Check logs with: docker-compose logs -f"
fi

echo ""
print_success "Setup complete! 🎉"
echo "You can now test the login and signup dialogs at http://localhost:5000"