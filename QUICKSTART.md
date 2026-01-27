# Quick Reference Guide

## Essential Commands

### Local Development

```bash
# Start application locally
docker-compose up --build

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Access database
docker exec -it mysql_db mysql -u root -prootpassword carservice
```

### WSL Setup

```bash
# Install all tools
cd scripts
chmod +x *.sh
./install-devops-tools.sh

# Configure AWS
./setup-aws.sh

# Setup Jenkins
./setup-jenkins.sh
```

### Jenkins Credentials

Add these in Jenkins (Manage Jenkins → Credentials):

1. **DockerHub** (ID: `dockerhub`)
   - Type: Username with password
   - Username: Your DockerHub username
   - Password: Your DockerHub password

2. **AWS** (ID: `aws-credentials`)
   - Type: Username with password
   - Username: AWS Access Key ID
   - Password: AWS Secret Access Key

### Terraform Commands

```bash
cd infra/terraform

terraform init                    # Initialize
terraform validate                # Validate configuration
terraform plan                    # Preview changes
terraform apply                   # Apply changes
terraform destroy                 # Destroy all resources
terraform output                  # Show outputs
terraform output ec2_public_ip    # Get EC2 IP
```

### Ansible Commands

```bash
cd infra/ansible

# Test connectivity
ansible -i inventory/hosts webservers -m ping

# Deploy application
ansible-playbook -i inventory/hosts playbooks/deploy.yml \
  -e "dockerhub_username=YOUR_USERNAME" \
  -e "dockerhub_password=YOUR_PASSWORD" \
  -e "app_name=my-docker-app2" \
  -e "image_tag=latest"

# Deploy with verbose output
ansible-playbook -i inventory/hosts playbooks/deploy.yml -vvv
```

### Docker Commands

```bash
# Build images
docker build -t my-app-backend:latest ./backend
docker build -t my-app-frontend:latest ./frontend

# Tag images
docker tag my-app-backend:latest username/my-app-backend:latest

# Push images
docker push username/my-app-backend:latest

# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all images
docker rmi -f $(docker images -q)

# Clean up everything
docker system prune -a
```

## URLs

- **Jenkins**: http://localhost:8080
- **Frontend (local)**: http://localhost:3000
- **Backend (local)**: http://localhost:5000
- **MySQL (local)**: localhost:3306
- **Frontend (EC2)**: http://\<EC2_IP\>:3000
- **Backend (EC2)**: http://\<EC2_IP\>:5000

## File Locations

- SSH Key: `~/.ssh/devops-key` and `~/.ssh/devops-key.pub`
- AWS Config: `~/.aws/config` and `~/.aws/credentials`
- Jenkins Home: `/var/lib/jenkins`
- Jenkins Password: `/var/lib/jenkins/secrets/initialAdminPassword`

## Troubleshooting Quick Fixes

```bash
# Docker permission denied
sudo usermod -aG docker $USER
newgrp docker

# Jenkins not starting
sudo systemctl restart jenkins
sudo journalctl -u jenkins -f

# AWS CLI not configured
aws configure

# EC2 SSH access denied
chmod 600 ~/.ssh/devops-key.pem
ssh -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>

# Port already in use
sudo lsof -i :8080
sudo kill -9 <PID>
```

## Pipeline Trigger

```bash
# Method 1: Push to GitHub (automatic via webhook)
git add .
git commit -m "Your message"
git push origin main

# Method 2: Manual trigger in Jenkins UI
# Go to Jenkins → Your Job → Build Now
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Edit and set:

- `DOCKERHUB_USERNAME`: Your DockerHub username
- `DB_PASSWORD`: Strong MySQL password
- `JWT_SECRET`: Random secure string

## Security Checklist

- [ ] Change default MySQL password
- [ ] Change JWT secret
- [ ] Update AWS security group to restrict IPs
- [ ] Enable AWS MFA
- [ ] Never commit `.env` or `.pem` files
- [ ] Use strong passwords in production
- [ ] Regularly rotate AWS credentials
- [ ] Keep all tools updated

## Common Issues

1. **Build fails**: Check Docker is running (`docker ps`)
2. **Push fails**: Verify DockerHub credentials
3. **Terraform fails**: Check AWS credentials (`aws sts get-caller-identity`)
4. **Ansible fails**: Verify EC2 SSH access and key permissions
5. **Health check fails**: Wait 30-60 seconds for containers to start

## Support

For issues or questions:

1. Check the main [README.md](README.md)
2. Check [scripts/README.md](scripts/README.md)
3. Review Jenkins console output
4. Check container logs: `docker logs <container_name>`
