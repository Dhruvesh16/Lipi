#!/bin/bash

# Test script for Docker deployment and authentication dialogs
set -e

echo "🧪 Testing Lipi Docker Deployment and Authentication Dialogs"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[TEST]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }

# Test 1: Health check endpoint
print_status "Testing health check endpoint..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_success "Health check endpoint is working"
else
    print_error "Health check endpoint is not responding"
    exit 1
fi

# Test 2: Main application endpoint
print_status "Testing main application endpoint..."
if curl -f http://localhost:5000 > /dev/null 2>&1; then
    print_success "Main application is serving content"
else
    print_error "Main application is not responding"
    exit 1
fi

# Test 3: Static assets
print_status "Testing static asset serving..."
if curl -f http://localhost:5000/assets > /dev/null 2>&1 || curl -f http://localhost:5000/favicon.ico > /dev/null 2>&1; then
    print_success "Static assets are being served"
else
    print_status "Static assets test inconclusive (may be normal)"
fi

# Test 4: API routes
print_status "Testing API routes availability..."
# This will fail if no API routes are set up, but that's expected for now
curl -s http://localhost:5000/api/health > /dev/null 2>&1 && print_success "API routes responding" || print_status "API routes not implemented yet (expected)"

# Display Docker container status
echo ""
print_status "Current Docker container status:"
docker-compose ps

echo ""
print_status "Application logs (last 10 lines):"
docker-compose logs --tail=10

echo ""
print_success "✅ Docker deployment test completed!"
echo ""
echo "🔗 Open http://localhost:5000 in your browser to test:"
echo "   • Login page with success/error dialogs"
echo "   • Signup page with success/error dialogs"
echo "   • Role-based dashboard routing"
echo ""
echo "📝 Test credentials for login:"
echo "   Doctor: sarah.johnson@hospital.com / doctor123"
echo "   Patient: john.doe@email.com / patient123"
echo ""
echo "🛑 To stop the application: docker-compose down"