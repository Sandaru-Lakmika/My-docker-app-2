#!/bin/bash

# WSL Installation Script for DevOps Tools
# This script installs all necessary tools for the DevOps pipeline

set -e

echo "=========================================="
echo "DevOps Tools Installation Script for WSL"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Update system
print_info "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y
print_success "System updated successfully"

# Install essential packages
print_info "Installing essential packages..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    git \
    wget \
    vim \
    unzip \
    jq
print_success "Essential packages installed"

# Install Docker
print_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_success "Docker is already installed"
fi

# Install Docker Compose
print_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose is already installed"
fi

# Install Terraform
print_info "Installing Terraform..."
if ! command -v terraform &> /dev/null; then
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt-get update
    sudo apt-get install -y terraform
    print_success "Terraform installed successfully"
else
    print_success "Terraform is already installed"
fi

# Install Ansible
print_info "Installing Ansible..."
if ! command -v ansible &> /dev/null; then
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository --yes --update ppa:ansible/ansible
    sudo apt-get install -y ansible
    print_success "Ansible installed successfully"
else
    print_success "Ansible is already installed"
fi

# Install Python and pip (required for Ansible modules)
print_info "Installing Python and pip..."
sudo apt-get install -y python3 python3-pip
sudo pip3 install --upgrade pip
print_success "Python and pip installed"

# Install Ansible Docker module
print_info "Installing Ansible Docker module..."
sudo pip3 install docker docker-compose
ansible-galaxy collection install community.docker
print_success "Ansible Docker module installed"

# Install AWS CLI
print_info "Installing AWS CLI..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
    print_success "AWS CLI installed successfully"
else
    print_success "AWS CLI is already installed"
fi

# Install Jenkins (optional - can also run in Docker)
print_info "Installing Java (required for Jenkins)..."
sudo apt-get install -y openjdk-11-jdk
print_success "Java installed"

print_info "Adding Jenkins repository..."
if ! command -v jenkins &> /dev/null; then
    wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
    sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update
    sudo apt-get install -y jenkins
    print_success "Jenkins installed successfully"
else
    print_success "Jenkins is already installed"
fi

# Create SSH directory
print_info "Setting up SSH directory..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
print_success "SSH directory created"

# Print versions
echo ""
echo "=========================================="
echo "Installation Complete! Installed versions:"
echo "=========================================="
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"
echo "Terraform: $(terraform --version | head -n1)"
echo "Ansible: $(ansible --version | head -n1)"
echo "AWS CLI: $(aws --version)"
echo "Java: $(java -version 2>&1 | head -n1)"
echo "Python: $(python3 --version)"
echo ""

print_info "IMPORTANT: You may need to log out and log back in for Docker group changes to take effect."
print_info "Or run: newgrp docker"
echo ""

print_success "All tools installed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Create SSH key pair for EC2: ssh-keygen -t rsa -b 4096 -f ~/.ssh/devops-key"
echo "3. Upload the public key to AWS EC2 Key Pairs"
echo "4. Configure Jenkins and add credentials"
echo "5. Set up GitHub webhook for automatic builds"
echo ""
