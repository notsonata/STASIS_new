# STASIS Full Project Deployment on Digital Ocean

## Prerequisites

- Digital Ocean account
- Domain `stasis-edu.tech` configured to point to your droplet IP
- Docker and Docker Compose installed on the droplet
- Project files including `docker-compose.yml`, `Dockerfile.backend`, and frontend directory uploaded to the droplet

## Step 1: Create Digital Ocean Droplet

- Create a new droplet with Ubuntu 20.04 or later
- Choose a plan with sufficient resources (e.g., 2GB RAM or more)
- Add your SSH key for secure access

## Step 2: Install Docker and Docker Compose

SSH into your droplet and run:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

Verify installation:

```bash
docker --version
docker-compose --version
```

## Step 3: Upload Project Files

Upload your project files to the droplet, including:

- `docker-compose.yml`
- `Dockerfile.backend`
- `frontend/` directory

You can use `scp` or any file transfer method.

docker-compose --version
## Step 4: Configure Environment Variables

- Update `frontend/.env.production` to point to backend URL (e.g., `http://localhost:8080`)
- Add any backend environment variables in `docker-compose.yml` under `backend.environment`

## Step 5: Run Docker Compose

From the project root on the droplet, run:

```bash
docker-compose up --build -d
```

This will build and start both backend and frontend containers.

## Step 6: Configure Nginx for SSL and Domain

The frontend container uses Nginx to serve the React app on port 80.

To enable SSL and reverse proxy:

1. Install Certbot on the droplet:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. Obtain SSL certificate for your domain:

```bash
sudo certbot --nginx -d stasis-edu.tech -d www.stasis-edu.tech
```

3. Certbot will update Nginx config to enable HTTPS and redirect HTTP to HTTPS.

4. To proxy backend API through Nginx, update `frontend/nginx.conf` to proxy `/api` requests to `http://backend:8080`.

## Step 7: Configure Firewall

Allow necessary ports:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```
sudo certbot --nginx -d stasis-edu.tech -d www.stasis-edu.tech
docker-compose up --build -d

## Verification Steps

1. **Check if container is running:**
```bash
docker ps | grep stasis-frontend-container
```

2. **Test the application:**
```bash
curl http://localhost/health
```

3. **Check logs if needed:**
```bash
docker logs stasis-frontend-container
```

## Updating Your Application

When you make changes to your frontend:

```bash
cd STASIS-front
git pull origin main
./deploy.sh
```

## Troubleshooting

**Container won't start:**
```bash
docker logs stasis-frontend-container
```

**Nginx issues:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart services:**
```bash
# Restart container
docker restart stasis-frontend-container

# Restart Nginx
sudo systemctl restart nginx
```

## Important Notes

- Your backend is configured to run on IP: 68.183.237.216:8080
- The frontend will proxy API requests to this backend
- Make sure your backend is accessible from your frontend droplet
- SSL certificate will auto-renew via certbot

## Current Configuration

- **Frontend Port:** 80 (inside container)
- **Backend API:** http://68.183.237.216:8080
- **Environment:** Production
- **Source Maps:** Disabled for security

## Next Steps After Deployment

1. Point your domain to your droplet IP
2. Configure SSL with certbot
3. Set up monitoring (optional)
4. Configure backup strategy (optional)

Your STASIS frontend should now be accessible at your domain!
