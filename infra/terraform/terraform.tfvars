# AWS Region
aws_region = "eu-north-1"

# EC2 Instance Type
instance_type = "t3.medium"

# SSH Key Name (create this in AWS console first)
key_name = "devops-key"

# Project Configuration
project_name = "my-docker-app2"
environment  = "production"

# Security - IMPORTANT: Change these to your actual IP addresses
allowed_ssh_cidr  = ["0.0.0.0/0"]  # Change to your IP: ["YOUR_IP/32"]
allowed_http_cidr = ["0.0.0.0/0"]
