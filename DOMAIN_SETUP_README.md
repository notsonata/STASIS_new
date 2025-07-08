# STASIS Domain Deployment Guide

## Complete Domain Setup (Production Ready)

Your STASIS application is now configured for complete domain deployment with SSL, monitoring, and automated backups.

### Architecture Overview

```
Internet → Nginx Proxy (SSL) → Docker Services
                ↓
        ┌─────────────────┐
        │   Main Nginx    │  ← Handles SSL, domain routing, rate limiting
        │   Port 80/443   │
        └─────────────────┘
                ↓
        ┌─────────────────┐
        │   Frontend      │  ← React app served by internal Nginx
        │   Port 3001     │
        └─────────────────┘
                ↓ /api/*
        ┌─────────────────┐
        │   Backend       │  ← Spring Boot API
        │   Port 8080     │
        └─────────────────┘
                ↓
        ┌─────────────────┐
        │   Database      │  ← PostgreSQL
        │   Port 5432     │
        └─────────────────┘
```

## Deployment Options

### Option 1: One-Command Domain Setup (Recommended)

```bash
# On your Digital Ocean droplet:
git clone <your-repository-url>
cd STASIS_new
sudo ./setup-domain.sh your-domain.com
```

**What this does:**
- ✅ Installs Docker, Docker Compose, Nginx, Certbot
- ✅ Configures domain and SSL certificates
- ✅ Sets up main Nginx proxy with security headers
- ✅ Deploys all Docker services
- ✅ Configures firewall (UFW)
- ✅ Sets up automated monitoring
- ✅ Creates backup system
- ✅ Moves app to `/opt/stasis` for production

### Option 2: Manual Docker-Only Setup

```bash
# Install dependencies manually
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Deploy services
./deploy-full-stack.sh

# Access via IP (no SSL)
http://your-droplet-ip:3001
```

## Key Files Created

| File | Purpose |
|------|---------|
| `nginx-proxy.conf` | Main Nginx configuration with SSL and domain routing |
| `docker-compose.yml` | Orchestrates all services (frontend on port 3001) |
| `setup-domain.sh` | Complete production setup script |
| `deploy-full-stack.sh` | Docker services deployment |
| `frontend/nginx.conf` | Internal Nginx for React app (accepts any server name) |

## Production Features

### SSL & Security
- Automatic SSL certificate generation with Let's Encrypt
- HTTP to HTTPS redirect
- Security headers (HSTS, XSS protection, etc.)
- Rate limiting on API endpoints

### Monitoring & Maintenance
- Health checks for all services
- Automated container restart on failure
- Disk space monitoring and cleanup
- Memory usage alerts

### Backup System
- Daily database backups
- Application configuration backups
- Automatic cleanup (keeps 7 days)
- Backup logs in `/var/log/stasis-backup.log`

## Management Commands

```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart services
./deploy-full-stack.sh

# Manual backup
sudo /usr/local/bin/stasis-backup.sh

# Check monitoring logs
sudo tail -f /var/log/stasis-monitor.log

# SSL certificate renewal (automatic, but manual if needed)
sudo certbot renew
```

## File Locations (Production)

```
/opt/stasis/                    # Main application directory
├── docker-compose.yml          # Service orchestration
├── deploy-full-stack.sh        # Deployment script
├── frontend/                   # React application
├── src/                        # Spring Boot backend
└── .env                        # Environment variables

/etc/nginx/sites-available/stasis    # Main Nginx configuration
/etc/letsencrypt/live/your-domain/   # SSL certificates
/opt/backups/                        # Automated backups
/var/log/stasis-*.log               # Application logs
```

## Health Check URLs

After deployment, verify these endpoints:

- **Frontend**: `https://your-domain.com/health`
- **Backend**: `https://your-domain.com/api/actuator/health`
- **Full App**: `https://your-domain.com`

## Troubleshooting

### Services Not Starting
```bash
cd /opt/stasis
docker-compose logs -f
```

### SSL Issues
```bash
sudo certbot certificates
sudo nginx -t
sudo systemctl restart nginx
```

### Domain Not Resolving
- Verify DNS A record points to droplet IP
- Check firewall: `sudo ufw status`
- Test with: `dig your-domain.com`

## Updates

To update the application:

```bash
cd /opt/stasis
git pull origin main
./deploy-full-stack.sh
```

The setup automatically handles:
- Building new Docker images
- Database migrations
- Zero-downtime deployment
- Health checks before switching traffic
