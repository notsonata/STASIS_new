#!/bin/bash

# Simple STASIS Deployment Script (No Health Checks)
# Use this if the main deployment fails due to health check issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🚀 STASIS Simple Deployment"
echo "=========================="
echo ""

# Clean up any existing containers
print_status "Cleaning up existing containers..."
docker-compose -f docker-compose-simple.yml down --remove-orphans 2>/dev/null || true

# Build and start services
print_status "Building Docker images..."
docker-compose -f docker-compose-simple.yml build --no-cache

print_status "Starting services..."
docker-compose -f docker-compose-simple.yml up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose-simple.yml ps

# Test database connection
print_status "Testing database connection..."
sleep 10
if docker exec stasis-database pg_isready -U postgres > /dev/null 2>&1; then
    print_success "Database is ready"
else
    print_warning "Database may still be starting up"
fi

# Test backend
print_status "Testing backend..."
sleep 20
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    print_success "Backend is responding"
else
    print_warning "Backend may still be starting up"
fi

# Test frontend
print_status "Testing frontend..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "Frontend is responding"
else
    print_warning "Frontend may still be starting up"
fi

echo ""
print_success "Deployment completed!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:8080"
echo "   Database: localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose-simple.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose-simple.yml down"
echo "   Restart: docker-compose -f docker-compose-simple.yml restart"
echo ""
