#!/bin/bash

# STASIS Full Stack Deployment Script for Digital Ocean
# This script deploys both frontend and backend using Docker Compose

set -e

echo "🚀 Starting STASIS Full Stack Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

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

# Check if Docker and Docker Compose are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Create environment file if it doesn't exist
create_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        print_status "Creating environment file..."
        cat > "$ENV_FILE" << EOF
# Database Configuration
DB_PASSWORD=stasis123

# You can override these in production
# DB_PASSWORD=your_secure_password_here
EOF
        print_success "Environment file created at $ENV_FILE"
        print_warning "Please review and update the database password in $ENV_FILE"
    else
        print_status "Environment file already exists"
    fi
}

# Stop existing containers
stop_existing() {
    print_status "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
    print_success "Existing containers stopped"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Build images
    print_status "Building Docker images..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "Services started successfully"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for backend (connecting to Supabase)
    print_status "Waiting for backend to connect to Supabase..."
    timeout 120 bash -c 'until curl -f http://localhost:8080/actuator/health &>/dev/null; do sleep 5; done'
    
    # Wait for frontend
    print_status "Waiting for frontend..."
    timeout 60 bash -c 'until curl -f http://localhost/health &>/dev/null; do sleep 2; done'
    
    print_success "All services are healthy"
}

# Display deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    print_success "🎉 STASIS Full Stack Deployment Completed!"
    echo ""
    echo -e "${GREEN}📊 Service URLs:${NC}"
    echo -e "  Frontend: ${BLUE}http://localhost${NC} (or your domain)"
    echo -e "  Backend API: ${BLUE}http://localhost:8080${NC}"
    echo -e "  Database: ${BLUE}Supabase (external)${NC}"
    echo ""
    echo -e "${GREEN}🔧 Management Commands:${NC}"
    echo -e "  View logs: ${YELLOW}docker-compose logs -f [service_name]${NC}"
    echo -e "  Stop services: ${YELLOW}docker-compose down${NC}"
    echo -e "  Restart services: ${YELLOW}docker-compose restart${NC}"
    echo -e "  View status: ${YELLOW}docker-compose ps${NC}"
    echo ""
    echo -e "${GREEN}🏥 Health Checks:${NC}"
    echo -e "  Frontend: ${BLUE}curl http://localhost/health${NC}"
    echo -e "  Backend: ${BLUE}curl http://localhost:8080/actuator/health${NC}"
}

# Cleanup function
cleanup() {
    if [ $? -ne 0 ]; then
        print_error "Deployment failed. Cleaning up..."
        docker-compose -f "$COMPOSE_FILE" down --remove-orphans || true
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment process
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    STASIS FULL STACK DEPLOY                 ║"
    echo "║                                                              ║"
    echo "║  This script will deploy:                                    ║"
    echo "║  • Spring Boot Backend API (using Supabase DB)              ║"
    echo "║  • React Frontend with Nginx                                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_dependencies
    create_env_file
    stop_existing
    deploy_services
    wait_for_services
    show_status
}

# Run main function
main "$@"
