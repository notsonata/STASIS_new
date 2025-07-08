#!/bin/bash

# STASIS Domain Setup Script
# This script configures the entire project for domain deployment with SSL

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Get domain from user
get_domain() {
    if [ -z "$1" ]; then
        echo -n "Enter your domain name (e.g., stasis-edu.tech): "
        read DOMAIN
    else
        DOMAIN="$1"
    fi
    
    if [ -z "$DOMAIN" ]; then
        print_error "Domain name is required"
        exit 1
    fi
    
    print_status "Configuring for domain: $DOMAIN"
}

# Install required packages
install_dependencies() {
    print_status "Installing required packages..."
    
    apt update
    apt install -y nginx certbot python3-certbot-nginx curl
    
    print_success "Dependencies installed"
}

# Configure main nginx
configure_nginx() {
    print_status "Configuring main Nginx..."
    
    # Update nginx-proxy.conf with the actual domain
    sed -i "s/stasis-edu.tech/$DOMAIN/g" nginx-proxy.conf
    sed -i "s/www.stasis-edu.tech/www.$DOMAIN/g" nginx-proxy.conf
    
    # Copy configuration to nginx sites
    cp nginx-proxy.conf /etc/nginx/sites-available/stasis
    
    # Remove default site and enable stasis site
    rm -f /etc/nginx/sites-enabled/default
    ln -sf /etc/nginx/sites-available/stasis /etc/nginx/sites-enabled/
    
    # Test nginx configuration
    nginx -t
    
    print_success "Nginx configured"
}

# Start Docker services
start_services() {
    print_status "Starting Docker services..."
    
    # Make sure deployment script is executable
    chmod +x deploy-full-stack.sh
    
    # Run the deployment
    ./deploy-full-stack.sh
    
    print_success "Docker services started"
}

# Configure SSL
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Start nginx to handle the challenge
    systemctl start nginx
    systemctl enable nginx
    
    # Get SSL certificate
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
    
    # Set up auto-renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    print_success "SSL certificate configured"
}

# Configure firewall
setup_firewall() {
    print_status "Configuring firewall..."
    
    # Install ufw if not present
    apt install -y ufw
    
    # Configure firewall rules
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    
    print_success "Firewall configured"
}

# Create monitoring script
create_monitoring() {
    print_status "Setting up monitoring..."
    
    cat > /usr/local/bin/stasis-monitor.sh << 'EOF'
#!/bin/bash

# STASIS Health Monitor
LOG_FILE="/var/log/stasis-monitor.log"

log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

# Check if containers are running
if ! docker-compose -f /opt/stasis/docker-compose.yml ps | grep -q "Up"; then
    log_message "Some containers are down, restarting..."
    cd /opt/stasis
    ./deploy-full-stack.sh >> "$LOG_FILE" 2>&1
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    log_message "WARNING: Disk usage is ${DISK_USAGE}%"
    docker system prune -f >> "$LOG_FILE" 2>&1
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -gt 90 ]; then
    log_message "WARNING: Memory usage is ${MEM_USAGE}%"
fi
EOF

    chmod +x /usr/local/bin/stasis-monitor.sh
    
    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/stasis-monitor.sh") | crontab -
    
    print_success "Monitoring configured"
}

# Create backup script
create_backup() {
    print_status "Setting up backup system..."
    
    mkdir -p /opt/backups
    
    cat > /usr/local/bin/stasis-backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/opt/stasis"

# Database backup
docker-compose -f "$APP_DIR/docker-compose.yml" exec -T database pg_dump -U postgres stasis > "$BACKUP_DIR/db_backup_$DATE.sql"

# Application backup
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" -C "$APP_DIR" .

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup completed" >> /var/log/stasis-backup.log
EOF

    chmod +x /usr/local/bin/stasis-backup.sh
    
    # Add daily backup to crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/stasis-backup.sh") | crontab -
    
    print_success "Backup system configured"
}

# Final verification
verify_setup() {
    print_status "Verifying setup..."
    
    # Wait for services to be ready
    sleep 30
    
    # Check if services are responding
    if curl -f "https://$DOMAIN/health" > /dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend health check failed"
    fi
    
    if curl -f "https://$DOMAIN/api/actuator/health" > /dev/null 2>&1; then
        print_success "Backend is responding"
    else
        print_warning "Backend health check failed"
    fi
    
    print_success "Setup verification completed"
}

# Display final information
show_summary() {
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    SETUP COMPLETED!                         ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}🌐 Your STASIS application is now live at:${NC}"
    echo -e "   ${BLUE}https://$DOMAIN${NC}"
    echo -e "   ${BLUE}https://www.$DOMAIN${NC}"
    echo ""
    echo -e "${GREEN}🔧 Management Commands:${NC}"
    echo -e "   View logs: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "   Restart: ${YELLOW}./deploy-full-stack.sh${NC}"
    echo -e "   Monitor: ${YELLOW}tail -f /var/log/stasis-monitor.log${NC}"
    echo -e "   Backup: ${YELLOW}/usr/local/bin/stasis-backup.sh${NC}"
    echo ""
    echo -e "${GREEN}🏥 Health Checks:${NC}"
    echo -e "   Frontend: ${BLUE}https://$DOMAIN/health${NC}"
    echo -e "   Backend: ${BLUE}https://$DOMAIN/api/actuator/health${NC}"
    echo ""
    echo -e "${GREEN}📁 Important Paths:${NC}"
    echo -e "   App Directory: ${YELLOW}/opt/stasis${NC}"
    echo -e "   Nginx Config: ${YELLOW}/etc/nginx/sites-available/stasis${NC}"
    echo -e "   SSL Certs: ${YELLOW}/etc/letsencrypt/live/$DOMAIN/${NC}"
    echo -e "   Backups: ${YELLOW}/opt/backups/${NC}"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    STASIS DOMAIN SETUP                      ║"
    echo "║                                                              ║"
    echo "║  This script will configure your entire STASIS project      ║"
    echo "║  for production deployment with:                            ║"
    echo "║  • Domain configuration                                      ║"
    echo "║  • SSL certificates                                          ║"
    echo "║  • Nginx proxy                                               ║"
    echo "║  • Firewall setup                                            ║"
    echo "║  • Monitoring & backups                                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_root
    get_domain "$1"
    install_dependencies
    
    # Move to /opt/stasis for production deployment
    if [ "$PWD" != "/opt/stasis" ]; then
        print_status "Moving application to /opt/stasis..."
        mkdir -p /opt/stasis
        cp -r . /opt/stasis/
        cd /opt/stasis
    fi
    
    configure_nginx
    start_services
    setup_ssl
    setup_firewall
    create_monitoring
    create_backup
    verify_setup
    show_summary
}

# Run main function
main "$@"
