#!/bin/bash

# STASIS Deployment Debug Script
# This script helps troubleshoot deployment issues

set -e

echo "🔍 STASIS Deployment Debug Tool"
echo "================================"

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

# Check Docker installation
check_docker() {
    print_status "Checking Docker installation..."
    
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker found: $DOCKER_VERSION"
    else
        print_error "Docker not found. Please install Docker first."
        return 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        print_success "Docker Compose found: $COMPOSE_VERSION"
    else
        print_error "Docker Compose not found. Please install Docker Compose."
        return 1
    fi
}

# Check system resources
check_resources() {
    print_status "Checking system resources..."
    
    # Memory check
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    
    if [ "$TOTAL_MEM" -lt 2048 ]; then
        print_warning "Low total memory: ${TOTAL_MEM}MB (recommended: 2GB+)"
    else
        print_success "Total memory: ${TOTAL_MEM}MB"
    fi
    
    if [ "$AVAILABLE_MEM" -lt 1024 ]; then
        print_warning "Low available memory: ${AVAILABLE_MEM}MB"
    else
        print_success "Available memory: ${AVAILABLE_MEM}MB"
    fi
    
    # Disk space check
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    DISK_AVAILABLE=$(df -h / | awk 'NR==2 {print $4}')
    
    if [ "$DISK_USAGE" -gt 80 ]; then
        print_warning "High disk usage: ${DISK_USAGE}% (${DISK_AVAILABLE} available)"
    else
        print_success "Disk usage: ${DISK_USAGE}% (${DISK_AVAILABLE} available)"
    fi
}

# Check required files
check_files() {
    print_status "Checking required files..."
    
    REQUIRED_FILES=(
        "docker-compose.yml"
        "Dockerfile"
        "frontend/Dockerfile"
        "pom.xml"
        "src/main/java/com/stasis/stasis/StasisApplication.java"
        "frontend/package.json"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "Found: $file"
        else
            print_error "Missing: $file"
        fi
    done
}

# Test Docker build
test_backend_build() {
    print_status "Testing backend Docker build..."
    
    if docker build -t stasis-backend-test . --no-cache; then
        print_success "Backend Docker build successful"
        docker rmi stasis-backend-test 2>/dev/null || true
    else
        print_error "Backend Docker build failed"
        return 1
    fi
}

test_frontend_build() {
    print_status "Testing frontend Docker build..."
    
    if docker build -t stasis-frontend-test ./frontend --no-cache; then
        print_success "Frontend Docker build successful"
        docker rmi stasis-frontend-test 2>/dev/null || true
    else
        print_error "Frontend Docker build failed"
        return 1
    fi
}

# Check network connectivity
check_network() {
    print_status "Checking network connectivity..."
    
    if ping -c 1 google.com &> /dev/null; then
        print_success "Internet connectivity: OK"
    else
        print_warning "Internet connectivity: Limited"
    fi
    
    # Check if ports are available
    PORTS=(5432 8080 3001)
    for port in "${PORTS[@]}"; do
        if netstat -tuln | grep -q ":$port "; then
            print_warning "Port $port is already in use"
        else
            print_success "Port $port is available"
        fi
    done
}

# Show container logs if they exist
show_logs() {
    print_status "Checking for existing container logs..."
    
    CONTAINERS=("stasis-database" "stasis-backend" "stasis-frontend")
    
    for container in "${CONTAINERS[@]}"; do
        if docker ps -a --format "table {{.Names}}" | grep -q "$container"; then
            print_status "Logs for $container:"
            docker logs "$container" --tail 20 2>/dev/null || print_warning "No logs available for $container"
            echo ""
        fi
    done
}

# Clean up function
cleanup_containers() {
    print_status "Cleaning up existing containers..."
    
    docker-compose down --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo ""
    check_docker || exit 1
    echo ""
    check_resources
    echo ""
    check_files
    echo ""
    check_network
    echo ""
    show_logs
    echo ""
    
    echo -e "${YELLOW}Would you like to:${NC}"
    echo "1. Test Docker builds"
    echo "2. Clean up containers and try deployment"
    echo "3. Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            echo ""
            test_backend_build
            echo ""
            test_frontend_build
            ;;
        2)
            echo ""
            cleanup_containers
            echo ""
            print_status "Running deployment..."
            ./deploy-full-stack.sh
            ;;
        3)
            print_status "Exiting debug tool"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
