#!/bin/bash

# STASIS Docker Build and Deploy Script
# This script builds the Docker image and optionally runs it locally

set -e

echo "🚀 Starting STASIS Docker build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
BUILD_ONLY=false
RUN_LOCAL=false
PUSH_REGISTRY=false
IMAGE_NAME="stasis-webapp"
TAG="latest"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --run)
            RUN_LOCAL=true
            shift
            ;;
        --push)
            PUSH_REGISTRY=true
            shift
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --build-only    Only build the Docker image"
            echo "  --run           Build and run locally"
            echo "  --push          Build and push to registry"
            echo "  --tag TAG       Specify image tag (default: latest)"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Check if we're in the correct directory
if [[ ! -f "Dockerfile" || ! -f "pom.xml" || ! -d "frontend" ]]; then
    print_error "Please run this script from the STASIS project root directory"
    exit 1
fi

print_status "Found project files"

# Build the Docker image
echo ""
echo "🏗️  Building Docker image..."
echo "   Image: ${IMAGE_NAME}:${TAG}"

if docker build -t "${IMAGE_NAME}:${TAG}" .; then
    print_status "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Tag as latest if not already
if [[ "$TAG" != "latest" ]]; then
    docker tag "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:latest"
    print_status "Tagged image as latest"
fi

if [[ "$BUILD_ONLY" == "true" ]]; then
    echo ""
    print_status "Build complete! Use the following commands to run:"
    echo "   Local: docker run -p 8080:8080 ${IMAGE_NAME}:${TAG}"
    echo "   Compose: docker-compose up"
    exit 0
fi

if [[ "$RUN_LOCAL" == "true" ]]; then
    echo ""
    echo "🐳 Starting local container..."
    
    # Stop any existing container
    if docker ps -q -f name=stasis-local; then
        print_warning "Stopping existing container..."
        docker stop stasis-local > /dev/null 2>&1 || true
        docker rm stasis-local > /dev/null 2>&1 || true
    fi
    
    # Run the container
    docker run -d \
        --name stasis-local \
        -p 8080:8080 \
        -e SPRING_PROFILES_ACTIVE=docker \
        -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/stasis \
        -e SPRING_DATASOURCE_USERNAME=postgres \
        -e SPRING_DATASOURCE_PASSWORD=123 \
        "${IMAGE_NAME}:${TAG}"
    
    print_status "Container started successfully"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend: http://localhost:8080"
    echo "   API: http://localhost:8080/api"
    echo "   Health: http://localhost:8080/actuator/health"
    echo ""
    echo "📋 Container commands:"
    echo "   Logs: docker logs -f stasis-local"
    echo "   Stop: docker stop stasis-local"
    echo "   Remove: docker rm stasis-local"
fi

if [[ "$PUSH_REGISTRY" == "true" ]]; then
    echo ""
    print_warning "Registry push not implemented yet"
    echo "   To push manually:"
    echo "   1. Tag: docker tag ${IMAGE_NAME}:${TAG} your-registry/stasis-webapp:${TAG}"
    echo "   2. Push: docker push your-registry/stasis-webapp:${TAG}"
fi

echo ""
print_status "Script completed successfully! 🎉"
