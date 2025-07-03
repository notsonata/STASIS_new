# 🚀 STASIS - Quick Start Guide

This is a containerized Spring Boot + React web application for student academic information management.

## 📋 Quick Setup Options

### Option 1: Docker Compose (Recommended for Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd STASIS_new

# Start everything with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:8080
# API: http://localhost:8080/api
```

### Option 2: Build Script (Windows/Linux)

```bash
# Linux/Mac
./build-docker.sh --run

# Windows
build-docker.bat --run
```

### Option 3: Manual Docker Build

```bash
# Build the image
docker build -t stasis-webapp .

# Run with external database
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/stasis \
  -e SPRING_DATASOURCE_USERNAME=your-username \
  -e SPRING_DATASOURCE_PASSWORD=your-password \
  stasis-webapp
```

## 🌐 DigitalOcean Deployment

### Method 1: GitHub Integration

1. Push your code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Create new app from GitHub repository
4. Select your repository and main branch
5. DigitalOcean will automatically detect the Dockerfile
6. Add a PostgreSQL database
7. Set environment variables:
   ```
   SPRING_PROFILES_ACTIVE=production
   DATABASE_URL=${stasis-db.DATABASE_URL}
   DB_USERNAME=${stasis-db.USERNAME}  
   DB_PASSWORD=${stasis-db.PASSWORD}
   ```
8. Deploy!

### Method 2: App Spec File

```bash
# Update .do/app.yaml with your GitHub repo
# Then deploy using:
doctl apps create --spec .do/app.yaml
```

## 🗄️ Database Setup

### Local Development
The Docker Compose setup includes PostgreSQL automatically.

### Production
Use DigitalOcean Managed PostgreSQL:
- Go to Databases in DigitalOcean control panel
- Create PostgreSQL cluster
- Use connection details in environment variables

## 🔑 Default Admin Access

```
Username: Superadmin
Password: admin123
```

> ⚠️ **Security Warning**: Change the default admin password in production!

## 📱 Application Features

- **Student Management**: Enrollment, grades, academic records
- **Faculty Management**: Course assignments, schedules
- **Course Management**: Curriculum, prerequisites, sections
- **Schedule Management**: Class timetables, room assignments
- **Admin Tools**: User management, system configuration

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_PROFILES_ACTIVE` | Application profile (local/docker/production) | Yes |
| `DATABASE_URL` | PostgreSQL connection URL | Yes |
| `DB_USERNAME` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `PORT` | Application port (default: 8080) | No |

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

### Logs
```bash
# Docker Compose
docker-compose logs -f stasis-app

# Single container
docker logs -f stasis-local

# DigitalOcean
doctl apps logs <app-id>
```

## 🛠️ Development

### Local Development Setup

1. **Prerequisites**
   - Java 17+
   - Node.js 18+
   - PostgreSQL 15+
   - Maven 3.9+

2. **Backend**
   ```bash
   mvn spring-boot:run
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### File Structure
```
STASIS_new/
├── src/                    # Spring Boot backend
├── frontend/               # React frontend
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Local development
├── .do/app.yaml           # DigitalOcean App Platform
├── .github/workflows/     # CI/CD pipeline
└── build-docker.*         # Build scripts
```

## 🔒 Security

- HTTPS enabled by default on DigitalOcean
- CORS configured for frontend domain
- Environment variables for sensitive data
- Session management with secure cookies
- Input validation on all endpoints

## 📚 API Documentation

### Authentication
```bash
POST /api/auth/login
{
  "username": "Superadmin",
  "password": "admin123"
}
```

### Key Endpoints
- `/api/students` - Student management
- `/api/faculty` - Faculty management  
- `/api/courses` - Course management
- `/api/curriculums` - Curriculum management
- `/api/course-sections` - Section management
- `/actuator/health` - Health check

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   docker stop $(docker ps -q)
   ```

2. **Database connection failed**
   - Check database is running
   - Verify connection credentials
   - Ensure database exists

3. **Frontend not loading**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

4. **Build failures**
   - Ensure Docker has enough memory (4GB+)
   - Check for port conflicts
   - Verify all dependencies are available

### Getting Help

1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check DigitalOcean app logs
5. Review the detailed deployment guide in `DOCKER_DEPLOYMENT.md`

## 💰 Cost Estimation (DigitalOcean)

### Development
- App: Basic ($5/month)
- Database: Development ($15/month)
- **Total: ~$20/month**

### Production
- App: Pro ($12/month)
- Database: Basic ($25/month)
- **Total: ~$37/month**

## 📞 Support

For technical issues:
1. Check logs and health endpoints
2. Review environment variables
3. Consult `DOCKER_DEPLOYMENT.md` for detailed instructions
4. Check DigitalOcean App Platform documentation

---

**Happy coding! 🎉**
