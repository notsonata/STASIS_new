#!/bin/bash

# STASIS Health Check Script
# This script checks if the application is running properly

# Configuration
APP_URL="${APP_URL:-http://localhost:8080}"
HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-/actuator/health}"
TIMEOUT="${TIMEOUT:-10}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "🏥 STASIS Health Check"
echo "Application URL: $APP_URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Check if application is responding
echo "1. Checking application availability..."
if curl -f -s --max-time "$TIMEOUT" "$APP_URL$HEALTH_ENDPOINT" > /dev/null; then
    print_status "Application is responding"
else
    print_error "Application is not responding"
    echo "   Tried: $APP_URL$HEALTH_ENDPOINT"
    exit 1
fi

# Get health status
echo ""
echo "2. Checking health status..."
HEALTH_RESPONSE=$(curl -s --max-time "$TIMEOUT" "$APP_URL$HEALTH_ENDPOINT")

if [ $? -eq 0 ]; then
    STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$STATUS" = "UP" ]; then
        print_status "Health status: UP"
    else
        print_error "Health status: $STATUS"
        echo "Response: $HEALTH_RESPONSE"
        exit 1
    fi
else
    print_error "Failed to get health status"
    exit 1
fi

# Check frontend availability
echo ""
echo "3. Checking frontend availability..."
if curl -f -s --max-time "$TIMEOUT" "$APP_URL/" > /dev/null; then
    print_status "Frontend is accessible"
else
    print_warning "Frontend may not be accessible"
fi

# Check API endpoints
echo ""
echo "4. Checking API endpoints..."
API_ENDPOINTS=(
    "/api/students"
    "/api/faculty" 
    "/api/courses"
    "/api/programs"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if curl -f -s --max-time "$TIMEOUT" "$APP_URL$endpoint" > /dev/null; then
        print_status "API endpoint $endpoint is accessible"
    else
        print_warning "API endpoint $endpoint may require authentication"
    fi
done

echo ""
print_status "Health check completed successfully! 🎉"

# Optional: Log to file
if [ -n "$LOG_FILE" ]; then
    echo "$(date): Health check passed" >> "$LOG_FILE"
fi
