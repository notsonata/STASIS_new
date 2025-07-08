#!/bin/bash

# Combined deployment script for frontend and backend on Digital Ocean droplet

set -e

echo "🚀 Starting combined deployment of frontend and backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend configuration
BACKEND_IMAGE_NAME="stasis-backend"
BACKEND_CONTAINER_NAME="stasis-backend-container"
BACKEND_PORT=8080

# Frontend configuration
FRONTEND_IMAGE_NAME="stasis-frontend"
FRONTEND_CONTAINER_NAME="stasis-frontend-container"
FRONTEND_PORT=3000

echo -e "${YELLOW}🔧 Building backend jar with Maven...${NC}"
mvn clean package

echo -e "${YELLOW}📦 Building backend Docker image...${NC}"
docker build -t $BACKEND_IMAGE_NAME -f src/main/Dockerfile .

echo -e "${YELLOW}🛑 Stopping existing backend container (if any)...${NC}"
docker stop $BACKEND_CONTAINER_NAME 2>/dev/null || true
docker rm $BACKEND_CONTAINER_NAME 2>/dev/null || true

echo -e "${YELLOW}🚀 Starting new backend container...${NC}"
docker run -d \
  --name $BACKEND_CONTAINER_NAME \
  -p $BACKEND_PORT:8080 \
  --restart unless-stopped \
  $BACKEND_IMAGE_NAME

echo -e "${YELLOW}🛑 Stopping existing frontend container (if any)...${NC}"
docker stop $FRONTEND_CONTAINER_NAME 2>/dev/null || true
docker rm $FRONTEND_CONTAINER_NAME 2>/dev/null || true

echo -e "${YELLOW}🚀 Starting new frontend container...${NC}"
docker run -d \
  --name $FRONTEND_CONTAINER_NAME \
  -p $FRONTEND_PORT:80 \
  --restart unless-stopped \
  $FRONTEND_IMAGE_NAME

echo -e "${GREEN}✅ Combined deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Backend is now running on port $BACKEND_PORT${NC}"
echo -e "${GREEN}🌐 Frontend is now running on port $FRONTEND_PORT${NC}"
echo -e "${GREEN}📊 Check backend status: docker ps | grep $BACKEND_CONTAINER_NAME${NC}"
echo -e "${GREEN}📊 Check frontend status: docker ps | grep $FRONTEND_CONTAINER_NAME${NC}"
echo -e "${GREEN}📋 View backend logs: docker logs $BACKEND_CONTAINER_NAME${NC}"
echo -e "${GREEN}📋 View frontend logs: docker logs $FRONTEND_CONTAINER_NAME${NC}"
