#!/bin/bash

echo "🔧 Docker Permission Fix for Lipi Medical Transcription"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if user is already in docker group
if groups $USER | grep -q "docker"; then
    print_success "User $USER is already in the docker group!"
else
    print_status "Adding user $USER to docker group..."
    sudo usermod -aG docker $USER
    print_success "User added to docker group!"
fi

# Check if Docker daemon is running
if ! systemctl is-active --quiet docker; then
    print_status "Starting Docker daemon..."
    sudo systemctl start docker
    sudo systemctl enable docker
    print_success "Docker daemon started!"
fi

print_warning "IMPORTANT: You need to logout and login again for group changes to take effect!"
print_status "Or run this command in your current session:"
echo "newgrp docker"
echo ""
print_status "After that, test Docker with:"
echo "docker --version"
echo "docker-compose build"
echo ""
print_status "Alternative: Run the application directly without Docker:"
echo "npm run dev"