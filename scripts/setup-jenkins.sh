#!/bin/bash

# Jenkins Setup Script
# This script helps configure Jenkins for the CI/CD pipeline

set -e

echo "=========================================="
echo "Jenkins Configuration Helper"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Start Jenkins
print_info "Starting Jenkins service..."
sudo systemctl start jenkins
sudo systemctl enable jenkins
print_success "Jenkins service started"

# Get initial admin password
print_info "Retrieving Jenkins initial admin password..."
if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    echo ""
    echo "=========================================="
    echo "Jenkins Initial Admin Password:"
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    echo "=========================================="
    echo ""
fi

# Get Jenkins URL
JENKINS_IP=$(hostname -I | awk '{print $1}')
echo "Jenkins is accessible at: http://${JENKINS_IP}:8080"
echo ""

print_info "Required Jenkins Plugins:"
echo "  1. Git Plugin"
echo "  2. Docker Plugin"
echo "  3. Docker Pipeline Plugin"
echo "  4. Pipeline Plugin"
echo "  5. Credentials Binding Plugin"
echo "  6. SSH Agent Plugin"
echo ""

print_info "Credentials to add in Jenkins:"
echo "  1. DockerHub credentials (username/password) - ID: 'dockerhub'"
echo "  2. AWS credentials (username/password or secret text) - ID: 'aws-credentials'"
echo "  3. SSH private key for EC2 - ID: 'ec2-ssh-key'"
echo ""

print_info "Next steps:"
echo "  1. Open Jenkins in browser: http://${JENKINS_IP}:8080"
echo "  2. Enter the initial admin password shown above"
echo "  3. Install suggested plugins"
echo "  4. Create admin user"
echo "  5. Add the required credentials"
echo "  6. Create a new Pipeline job pointing to your GitHub repository"
echo "  7. Configure GitHub webhook for automatic builds"
echo ""

print_success "Jenkins configuration helper completed!"
