#!/bin/bash

# AWS Configuration Script
# This script helps set up AWS credentials and EC2 key pair

set -e

echo "=========================================="
echo "AWS Configuration Helper"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Configure AWS CLI
print_info "Configuring AWS CLI..."
echo ""
echo "You will need:"
echo "  - AWS Access Key ID"
echo "  - AWS Secret Access Key"
echo "  - Default region (e.g., us-east-1)"
echo "  - Default output format (json recommended)"
echo ""
read -p "Press Enter to continue with AWS configuration..."

aws configure

print_success "AWS CLI configured"
echo ""

# Create SSH key pair
print_info "Creating SSH key pair for EC2..."
SSH_KEY_PATH="$HOME/.ssh/devops-key"

if [ -f "$SSH_KEY_PATH" ]; then
    print_info "SSH key already exists at $SSH_KEY_PATH"
    read -p "Do you want to create a new one? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Using existing SSH key"
    else
        rm -f "$SSH_KEY_PATH" "$SSH_KEY_PATH.pub"
        ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N "" -C "devops-key"
        print_success "New SSH key created"
    fi
else
    ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_PATH" -N "" -C "devops-key"
    print_success "SSH key created at $SSH_KEY_PATH"
fi

chmod 600 "$SSH_KEY_PATH"
chmod 644 "$SSH_KEY_PATH.pub"

echo ""
print_info "Public key content (copy this):"
echo "=========================================="
cat "$SSH_KEY_PATH.pub"
echo "=========================================="
echo ""

print_info "Next steps:"
echo "  1. Go to AWS Console > EC2 > Key Pairs"
echo "  2. Click 'Actions' > 'Import key pair'"
echo "  3. Name it 'devops-key'"
echo "  4. Paste the public key shown above"
echo "  5. Click 'Import key pair'"
echo ""

print_info "Testing AWS connection..."
if aws sts get-caller-identity &> /dev/null; then
    print_success "AWS connection successful!"
    echo ""
    aws sts get-caller-identity
else
    print_error "AWS connection failed. Please check your credentials."
    exit 1
fi

echo ""
print_success "AWS configuration completed!"
