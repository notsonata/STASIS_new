# STASIS Full Stack Deployment Guide

## Overview

This guide covers deploying both the React frontend and Spring Boot backend on the same Digital Ocean droplet using Docker Compose.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Digital Ocean Droplet                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Nginx     │  │ Spring Boot │  │    PostgreSQL       │  │
│  │ (Frontend)  │  │  (Backend)  │  │   (Database)        │  │
│  │   Port 80   │  │  Port 8080  │  │    Port 5432        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                 │                    │            │
│         └─── /api/* ──────┘                    │            │
│                           └────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Services

1. **Frontend (Nginx + React)**
   - Serves static React files
   - Proxies `/api/*` requests to backend
   - Runs on port 80

2. **Backend (Spring Boot)**
   - REST API server
   - Runs on port 8080
   - Context path: `/api`

3. **Database (PostgreSQL)**
   - Data persistence
   - Runs on port 5432
   - Volume mounted for data persistence

## Prerequisites

### Digital Ocean Droplet Requirements
- **Minimum**: 2GB RAM, 1 vCPU, 25GB SSD
- **Recommended**: 4GB RAM, 2 vCPU, 50GB SSD
- **OS**: Ubuntu 20.04 LTS or later

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Git
- curl (for health checks)

## Quick Start

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Deploy Application

```bash
# Clone repository
git clone <your-repository-url>
cd STASIS_new

# Make deployment script executable
chmod +x deploy-full-stack.sh

# Run deployment
./deploy-full-stack.sh
```

### 3. Verify Deployment

```bash
# Check service status
docker-compose ps

# Test health endpoints
curl http://localhost/health
curl http://localhost:8080/api/actuator/health

# View logs
docker-compose logs -f
```

## Configuration

### Environment Variables

Create or modify `.env` file:

```bash
# Database Configuration
DB_PASSWORD=your_secure_password_here

# Optional: Override default settings
# POSTGRES_DB=stasis
# POSTGRES_USER=postgres
```

### Production Customization

#### 1. Domain Configuration

Update `frontend/nginx.conf`:
```nginx
server_name your-domain.com www.your-domain.com;
```

#### 2. SSL Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Update docker-compose.yml to mount SSL certificates
# Add to frontend service volumes:
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

#### 3. Database Security

```bash
# Generate secure password
openssl rand -base64 32

# Update .env file
echo "DB_PASSWORD=your_generated_password" > .env
```

## Management Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f [service_name]

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

### Database Management

```bash
# Connect to database
docker-compose exec database psql -U postgres -d stasis

# Backup database
docker-compose exec database pg_dump -U postgres stasis > backup.sql

# Restore database
docker-compose exec -T database psql -U postgres stasis < backup.sql
```

### Updates and Maintenance

```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
./deploy-full-stack.sh

# View resource usage
docker stats

# Clean up unused images
docker system prune -a
```

## Monitoring and Health Checks

### Health Endpoints

- **Frontend**: `http://localhost/health`
- **Backend**: `http://localhost:8080/api/actuator/health`
- **Database**: Checked via backend health endpoint

### Log Monitoring

```bash
# Real-time logs for all services
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Log rotation (add to crontab)
0 2 * * * docker system prune -f
```

### Resource Monitoring

```bash
# Container resource usage
docker stats

# Disk usage
df -h
docker system df

# Memory usage
free -h
```

## Troubleshooting

### Common Issues

#### 1. Backend Connection Issues

```bash
# Check backend logs
docker-compose logs backend

# Verify database connection
docker-compose exec backend curl -f http://localhost:8080/api/actuator/health

# Check network connectivity
docker-compose exec frontend ping backend
```

#### 2. Database Connection Issues

```bash
# Check database logs
docker-compose logs database

# Test database connection
docker-compose exec database pg_isready -U postgres

# Connect to database manually
docker-compose exec database psql -U postgres -d stasis
```

#### 3. Frontend Issues

```bash
# Check nginx logs
docker-compose logs frontend

# Test nginx configuration
docker-compose exec frontend nginx -t

# Check proxy configuration
curl -v http://localhost/api/actuator/health
```

### Performance Issues

#### 1. Memory Issues

```bash
# Check memory usage
docker stats
free -h

# Increase JVM heap size (add to docker-compose.yml backend environment)
JAVA_OPTS: "-Xmx1g -Xms512m"
```

#### 2. Database Performance

```bash
# Monitor database performance
docker-compose exec database psql -U postgres -d stasis -c "SELECT * FROM pg_stat_activity;"

# Optimize database (add to application-production.properties)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

## Security Considerations

### 1. Firewall Configuration

```bash
# Configure UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 2. Database Security

- Use strong passwords
- Limit database access to backend container only
- Regular backups
- Monitor access logs

### 3. Application Security

- Keep Docker images updated
- Use non-root users in containers
- Implement proper authentication
- Regular security updates

## Backup Strategy

### 1. Database Backup

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T database pg_dump -U postgres stasis > "backup_${DATE}.sql"
```

### 2. Application Backup

```bash
#!/bin/bash
# backup-app.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "app_backup_${DATE}.tar.gz" \
  docker-compose.yml \
  .env \
  frontend/ \
  src/ \
  pom.xml
```

### 3. Automated Backups

Add to crontab:
```bash
# Daily database backup at 2 AM
0 2 * * * /path/to/backup-db.sh

# Weekly application backup on Sunday at 3 AM
0 3 * * 0 /path/to/backup-app.sh
```

## Scaling Considerations

### Horizontal Scaling

```yaml
# docker-compose.yml modifications for scaling
services:
  backend:
    deploy:
      replicas: 2
  
  frontend:
    # Add load balancer configuration
```

### Vertical Scaling

```yaml
# Resource limits
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Check service health
   - Review logs for errors
   - Monitor resource usage

2. **Monthly**:
   - Update Docker images
   - Clean up unused resources
   - Review security logs

3. **Quarterly**:
   - Update system packages
   - Review and update SSL certificates
   - Performance optimization review

### Getting Help

1. Check service logs: `docker-compose logs [service]`
2. Verify configuration files
3. Test network connectivity between services
4. Review this documentation
5. Check Docker and application documentation

## Conclusion

This deployment setup provides a robust, scalable solution for running the STASIS application on a single Digital Ocean droplet. The containerized approach ensures consistency across environments and simplifies maintenance and updates.
