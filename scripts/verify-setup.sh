#!/bin/bash

# Post-Installation Verification Script
# Run this script to verify all tools are installed correctly

set -e

echo "=========================================="
echo "DevOps Tools Verification"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 is installed${NC}"
        if [ "$2" != "" ]; then
            echo "  Version: $($2)"
        fi
        return 0
    else
        echo -e "${RED}✗ $1 is NOT installed${NC}"
        return 1
    fi
}

echo "Checking required tools..."
echo ""

# Check Docker
check_command "docker" "docker --version"
if docker ps &> /dev/null; then
    echo -e "${GREEN}  ✓ Docker daemon is running${NC}"
else
    echo -e "${YELLOW}  ⚠ Docker daemon is not running or permission denied${NC}"
    echo -e "${YELLOW}    Run: sudo systemctl start docker${NC}"
    echo -e "${YELLOW}    Or: newgrp docker${NC}"
fi
echo ""

# Check Docker Compose
check_command "docker-compose" "docker-compose --version"
echo ""

# Check Terraform
check_command "terraform" "terraform --version | head -n1"
echo ""

# Check Ansible
check_command "ansible" "ansible --version | head -n1"
check_command "ansible-playbook" "ansible-playbook --version | head -n1"
echo ""

# Check AWS CLI
check_command "aws" "aws --version"
if [ -f ~/.aws/credentials ]; then
    echo -e "${GREEN}  ✓ AWS credentials file exists${NC}"
else
    echo -e "${YELLOW}  ⚠ AWS credentials not configured${NC}"
    echo -e "${YELLOW}    Run: aws configure${NC}"
fi
echo ""

# Check Java
check_command "java" "java -version 2>&1 | head -n1"
echo ""

# Check Jenkins
check_command "jenkins" "jenkins --version 2>&1 || echo 'Jenkins service'"
if systemctl is-active --quiet jenkins; then
    echo -e "${GREEN}  ✓ Jenkins service is running${NC}"
else
    echo -e "${YELLOW}  ⚠ Jenkins service is not running${NC}"
    echo -e "${YELLOW}    Run: sudo systemctl start jenkins${NC}"
fi
echo ""

# Check Git
check_command "git" "git --version"
echo ""

# Check Python
check_command "python3" "python3 --version"
check_command "pip3" "pip3 --version"
echo ""

# Check SSH
if [ -f ~/.ssh/devops-key ]; then
    echo -e "${GREEN}✓ SSH key exists at ~/.ssh/devops-key${NC}"
else
    echo -e "${YELLOW}⚠ SSH key not found${NC}"
    echo -e "${YELLOW}  Run: ssh-keygen -t rsa -b 4096 -f ~/.ssh/devops-key${NC}"
fi
echo ""

# Check project structure
echo "Checking project structure..."
echo ""

directories=(
    "frontend"
    "backend"
    "infra/terraform"
    "infra/ansible"
    "scripts"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir/ exists${NC}"
    else
        echo -e "${RED}✗ $dir/ does NOT exist${NC}"
    fi
done
echo ""

# Check critical files
files=(
    "Jenkinsfile"
    "docker-compose.yml"
    "frontend/Dockerfile"
    "backend/Dockerfile"
    "infra/terraform/main.tf"
    "infra/ansible/playbooks/deploy.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file does NOT exist${NC}"
    fi
done
echo ""

echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If any tools are missing, run: ./scripts/install-devops-tools.sh"
echo "2. Configure AWS: ./scripts/setup-aws.sh"
echo "3. Setup Jenkins: ./scripts/setup-jenkins.sh"
echo "4. Test locally: docker-compose up"
echo "5. Set up GitHub webhook and push code to trigger pipeline"
echo ""
