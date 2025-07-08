#!/bin/bash

# STASIS Docker Debug Script
# This script helps debug Docker deployment issues

set -e

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

# Check Docker system
check_docker_system() {
    print_status "Checking Docker system..."
    echo ""
    
    print_status "Docker version:"
    docker --version
    echo ""
    
    print_status "Docker Compose version:"
    docker-compose --version
    echo ""
    
    print_status "Docker system info:"
    docker system df
    echo ""
    
    print_status "Available disk space:"
    df -h
    echo ""
}

# Check container status
check_containers() {
    print_status "Checking container status..."
    echo ""
    
    print_status "All containers:"
    docker ps -a
    echo ""
    
    print_status "STASIS containers only:"
    docker ps -a --filter "name=stasis"
    echo ""
}

# Check logs
check_logs() {
    print_status "Checking container logs..."
    echo ""
    
    if docker ps -a --filter "name=stasis-backend" --format "{{.Names}}" | grep -q "stasis-backend"; then
        print_status "Backend logs (last 20 lines):"
        docker logs stasis-backend --tail 20
        echo ""
    else
        print_warning "Backend container not found"
    fi
    
    if docker ps -a --filter "name=stasis-frontend" --format "{{.Names}}" | grep -q "stasis-frontend"; then
        print_status "Frontend logs (last 20 lines):"
        docker logs stasis-frontend --tail 20
        echo ""
    else
        print_warning "Frontend container not found"
    fi
}

# Test health endpoints
test_health() {
    print_status "Testing health endpoints..."
    echo ""
    
    print_status "Testing backend health:"
    if curl -f http://localhost:8080/actuator/health 2>/dev/null; then
        print_success "Backend health check passed"
        curl -s http://localhost:8080/actuator/health | jq . 2>/dev/null || curl -s http://localhost:8080/actuator/health
    else
        print_error "Backend health check failed"
    fi
    echo ""
    
    print_status "Testing frontend health:"
    if curl -f http://localhost/health 2>/dev/null; then
        print_success "Frontend health check passed"
        curl -s http://localhost/health
    else
        print_error "Frontend health check failed"
    fi
    echo ""
}

# Check network connectivity
check_network() {
    print_status "Checking Docker network..."
    echo ""
    
    print_status "Docker networks:"
    docker network ls
    echo ""
    
    if docker network ls --filter "name=stasis" --format "{{.Name}}" | grep -q "stasis"; then
        print_status "STASIS network details:"
        docker network inspect stasis_new_stasis-network 2>/dev/null || docker network inspect stasis-network 2>/dev/null || print_warning "STASIS network not found"
        echo ""
    fi
}

# Clean up function
cleanup_containers() {
    print_status "Cleaning up containers and images..."
    echo ""
    
    print_status "Stopping and removing containers..."
    docker-compose down --remove-orphans || true
    
    print_status "Removing unused images..."
    docker image prune -f
    
    print_status "Removing unused volumes..."
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Main menu
show_menu() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    STASIS DOCKER DEBUG                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo "1. Check Docker system"
    echo "2. Check container status"
    echo "3. Check container logs"
    echo "4. Test health endpoints"
    echo "5. Check network connectivity"
    echo "6. Clean up containers and images"
    echo "7. Run all checks"
    echo "8. Exit"
    echo ""
    read -p "Select an option (1-8): " choice
    
    case $choice in
        1) check_docker_system ;;
        2) check_containers ;;
        3) check_logs ;;
        4) test_health ;;
        5) check_network ;;
        6) cleanup_containers ;;
        7) 
            check_docker_system
            check_containers
            check_logs
            test_health
            check_network
            ;;
        8) exit 0 ;;
        *) print_error "Invalid option. Please try again." ;;
    esac
}

# Main function
main() {
    while true; do
        show_menu
        echo ""
        read -p "Press Enter to continue or Ctrl+C to exit..."
        clear
    done
}

# Run main function
main "$@"
