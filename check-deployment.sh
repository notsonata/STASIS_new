#!/bin/bash

echo "=== STASIS Deployment Status Check ==="
echo ""

echo "1. Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2. Docker Compose Services:"
docker-compose ps
echo ""

echo "3. Backend Health Check:"
curl -s http://localhost:8080/actuator/health || echo "Backend not accessible"
echo ""

echo "4. Frontend Health Check:"
curl -s http://localhost/health || echo "Frontend not accessible"
echo ""

echo "5. Container Logs (last 10 lines):"
echo "--- Backend Logs ---"
docker logs stasis-backend --tail 10 2>/dev/null || echo "No backend container found"
echo ""
echo "--- Frontend Logs ---"
docker logs stasis-frontend --tail 10 2>/dev/null || echo "No frontend container found"
echo ""

echo "=== End Status Check ==="
