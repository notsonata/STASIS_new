# STASIS Web Application - Docker Deployment Guide

This guide covers deploying the STASIS Spring Boot + React application using Docker on DigitalOcean App Platform.

## 📋 Prerequisites

- GitHub repository containing your code
- DigitalOcean account
- PostgreSQL database (can be provisioned through DigitalOcean)

## 🏗️ Project Structure

The application consists of:
- **Backend**: Spring Boot API (Java 17)
- **Frontend**: React application (Node.js 18)
- **Database**: PostgreSQL 15

## 🐳 Docker Configuration

### Multi-stage Dockerfile

The project uses a multi-stage Dockerfile that:
1. Builds the React frontend
2. Builds the Spring Boot backend
3. Creates a production runtime image

### Key Files Created

- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Local development with PostgreSQL
- `.dockerignore` - Excludes unnecessary files from Docker context
- Application configuration files for different environments

## 🚀 Local Development with Docker

### 1. Start the Application

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build
```

### 2. Access the Application

- Frontend: http://localhost:8080
- API: http://localhost:8080/api
- Health Check: http://localhost:8080/actuator/health

### 3. Stop the Application

```bash
docker-compose down

# Remove volumes as well
docker-compose down -v
```

## ☁️ DigitalOcean App Platform Deployment

### Method 1: Using DigitalOcean Control Panel

1. **Connect GitHub Repository**
   - Log into DigitalOcean App Platform
   - Create new app from GitHub repository
   - Select your repository and branch (main)

2. **Configure Build Settings**
   - Build Command: Automatic (uses Dockerfile)
   - Run Command: `java -jar app.jar`
   - Port: 8080

3. **Add Database**
   - Add PostgreSQL database component
   - Choose appropriate size (db-s-dev-database for testing)

4. **Set Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=production
   DATABASE_URL=${stasis-db.DATABASE_URL}
   DB_USERNAME=${stasis-db.USERNAME}
   DB_PASSWORD=${stasis-db.PASSWORD}
   PORT=8080
   ```

### Method 2: Using App Spec File

1. **Update .do/app.yaml**
   - Replace `your-username/your-repo-name` with your GitHub repo
   - Adjust instance sizes as needed

2. **Deploy via CLI**
   ```bash
   # Install doctl CLI
   # Configure authentication
   doctl auth init

   # Deploy using app spec
   doctl apps create --spec .do/app.yaml
   ```

### Method 3: Manual Docker Build

```bash
# Build the Docker image
docker build -t stasis-app .

# Tag for registry
docker tag stasis-app your-registry/stasis-app:latest

# Push to container registry
docker push your-registry/stasis-app:latest
```

## 🔧 Configuration Profiles

### Development (application-local.properties)
- Local PostgreSQL database
- Debug logging enabled
- CORS configured for localhost:3000

### Docker (application-docker.properties)
- Environment variable based configuration
- Optimized for containerized deployment
- Health checks enabled

### Production (application-production.properties)
- Environment variable based configuration
- Production logging levels
- Security headers enabled
- Connection pool optimized

## 🔍 Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `production` |
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://...` |
| `DB_USERNAME` | Database username | `stasis_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `PORT` | Application port | `8080` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE` | Max DB connections | `10` |
| `SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE` | Min idle connections | `2` |

## 🏥 Health Checks

The application includes Spring Boot Actuator for health monitoring:

- **Endpoint**: `/actuator/health`
- **Response**: JSON with application status
- **Used by**: DigitalOcean App Platform for monitoring

## 📊 Monitoring

### Application Logs

```bash
# DigitalOcean App Platform
# View logs in the control panel or via CLI
doctl apps logs your-app-id --type=build
doctl apps logs your-app-id --type=deploy
```

### Database Monitoring

- Monitor connection pool usage
- Track query performance
- Set up alerts for connection failures

## 🔒 Security Considerations

### Production Checklist

- [ ] Use strong database passwords
- [ ] Enable HTTPS (handled by DigitalOcean)
- [ ] Configure proper CORS origins
- [ ] Set secure session cookies
- [ ] Enable security headers
- [ ] Use environment variables for secrets

### Database Security

- [ ] Use managed PostgreSQL with SSL
- [ ] Restrict database access to app only
- [ ] Regular database backups
- [ ] Monitor for suspicious activity

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies in package.json and pom.xml
   - Ensure sufficient build resources

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is accessible from app

3. **Static File Serving Issues**
   - Verify React build is copied correctly
   - Check WebConfig.java configuration
   - Ensure index.html is accessible

### Debug Commands

```bash
# Local testing
docker-compose logs stasis-app
docker exec -it stasis-app /bin/bash

# Check if React build exists
docker exec -it stasis-app ls -la /app/static/

# Test database connection
docker exec -it stasis-postgres psql -U postgres -d stasis
```

## 📈 Scaling

### Horizontal Scaling

- Increase instance count in App Platform
- Configure session management (Redis/database)
- Use external file storage for uploads

### Database Scaling

- Upgrade to larger database instance
- Implement read replicas
- Optimize database queries

## 💰 Cost Optimization

### Development
- Use db-s-dev-database for testing
- Use basic-xxs instance size
- Scale down when not in use

### Production
- Monitor resource usage
- Scale instances based on traffic
- Use CDN for static assets

## 📚 Additional Resources

- [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Docker Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices/)
- [PostgreSQL on DigitalOcean](https://docs.digitalocean.com/products/databases/postgresql/)

## 🤝 Support

For issues related to:
- **Application**: Check logs and health endpoints
- **Deployment**: Review DigitalOcean App Platform logs
- **Database**: Monitor PostgreSQL metrics and logs
