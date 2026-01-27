# DevOps CI/CD Pipeline Project

A complete DevOps CI/CD pipeline implementation using Docker, Jenkins, Terraform, Ansible, and AWS EC2.

## 🎯 Project Overview

This project demonstrates a fully automated CI/CD pipeline that:

1. **Builds** Docker images for a full-stack application (React frontend + Node.js backend + MySQL)
2. **Pushes** images to DockerHub
3. **Provisions** AWS EC2 infrastructure using Terraform
4. **Deploys** the application to EC2 using Ansible
5. **Monitors** deployment health and status

## 🏗️ Architecture

```
GitHub → Jenkins → Docker Build → DockerHub → Terraform (EC2) → Ansible → Deployment
```

### Technology Stack

- **Source Control**: Git, GitHub
- **CI/CD**: Jenkins
- **Containerization**: Docker, Docker Compose
- **Container Registry**: DockerHub
- **Infrastructure as Code**: Terraform
- **Configuration Management**: Ansible
- **Cloud Provider**: AWS EC2
- **Application**: React (Frontend) + Node.js/Express (Backend) + MySQL (Database)

## 📁 Project Structure

```
my-docker-app2/
├── frontend/                  # React frontend application
│   ├── src/
│   ├── public/
│   ├── Dockerfile            # Production-ready multi-stage Dockerfile
│   ├── nginx.conf            # Nginx configuration for serving React app
│   └── package.json
├── backend/                   # Node.js/Express backend API
│   ├── Dockerfile            # Production-ready Dockerfile
│   ├── index.js
│   └── package.json
├── infra/
│   ├── terraform/            # AWS infrastructure provisioning
│   │   ├── main.tf           # Provider configuration
│   │   ├── variables.tf      # Variable definitions
│   │   ├── ec2.tf           # EC2 instance and security group
│   │   ├── outputs.tf        # Output values
│   │   └── terraform.tfvars  # Variable values
│   └── ansible/              # Deployment automation
│       ├── ansible.cfg       # Ansible configuration
│       ├── inventory/
│       │   └── hosts         # Dynamic inventory (updated by Jenkins)
│       └── playbooks/
│           ├── deploy.yml    # Main deployment playbook
│           └── docker-compose.yml.j2  # Docker Compose template
├── scripts/                   # Setup and installation scripts
│   ├── install-devops-tools.sh  # Install all tools in WSL
│   ├── setup-jenkins.sh      # Jenkins configuration helper
│   ├── setup-aws.sh          # AWS configuration helper
│   └── README.md
├── Jenkinsfile               # Jenkins pipeline definition
├── docker-compose.yml        # Local development and production deployment
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Windows with WSL2 (Ubuntu 20.04/22.04)
- GitHub account
- DockerHub account
- AWS account
- Basic knowledge of DevOps tools

### Step 1: Install Tools in WSL

```bash
# Clone the repository
git clone <your-repo-url>
cd my-docker-app2

# Make scripts executable
chmod +x scripts/*.sh

# Install all DevOps tools
./scripts/install-devops-tools.sh

# Log out and log back in (or run: newgrp docker)
```

### Step 2: Configure AWS

```bash
# Run AWS configuration script
./scripts/setup-aws.sh

# This will:
# 1. Configure AWS CLI with your credentials
# 2. Create SSH key pair for EC2
# 3. Display public key to import to AWS Console
```

**Important**: Import your SSH public key to AWS:

1. Go to AWS Console → EC2 → Key Pairs
2. Click "Actions" → "Import key pair"
3. Name: `devops-key`
4. Paste content from `~/.ssh/devops-key.pub`

### Step 3: Setup Jenkins

```bash
# Run Jenkins configuration script
./scripts/setup-jenkins.sh
```

Access Jenkins at `http://localhost:8080` (or your WSL IP) and:

1. Enter initial admin password (displayed by script)
2. Install suggested plugins + these additional plugins:
   - Docker Plugin
   - Docker Pipeline Plugin
   - Pipeline Plugin
   - Credentials Binding Plugin
   - SSH Agent Plugin

3. Add credentials in Jenkins:

   **DockerHub Credentials** (ID: `dockerhub`):
   - Kind: Username with password
   - Username: Your DockerHub username
   - Password: Your DockerHub password

   **AWS Credentials** (ID: `aws-credentials`):
   - Kind: Username with password
   - Username: Your AWS Access Key ID
   - Password: Your AWS Secret Access Key

4. Create a new Pipeline job:
   - Name: `my-docker-app2-pipeline`
   - Type: Pipeline
   - Pipeline Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your GitHub repo URL
   - Script Path: `Jenkinsfile`

### Step 4: Configure GitHub Webhook

1. Go to your GitHub repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://YOUR_JENKINS_IP:8080/github-webhook/`
   - Content type: `application/json`
   - Events: "Just the push event"
   - Active: ✓

### Step 5: Deploy!

```bash
# Make any change to your code
git add .
git commit -m "Trigger pipeline"
git push origin main
```

Jenkins will automatically:

1. ✅ Checkout code
2. 🐳 Build Docker images
3. 📤 Push to DockerHub
4. 🏗️ Provision EC2 with Terraform
5. 🚀 Deploy with Ansible
6. ✅ Verify deployment

## 🔧 Manual Testing

### Test Locally with Docker Compose

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env

# Build and run
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# View database tables
docker exec -it mysql_db mysql -u root -prootpassword carservice
# SHOW TABLES;
# SELECT * FROM users;
# SELECT * FROM bookings;
# EXIT;
```

### Test Terraform

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan

# Apply (create EC2)
terraform apply

# Destroy (when done testing)
terraform destroy
```

### Test Ansible

```bash
cd infra/ansible

# Check syntax
ansible-playbook --syntax-check playbooks/deploy.yml

# Dry run
ansible-playbook -i inventory/hosts playbooks/deploy.yml --check

# Deploy
ansible-playbook -i inventory/hosts playbooks/deploy.yml \
  -e "dockerhub_username=YOUR_USERNAME" \
  -e "dockerhub_password=YOUR_PASSWORD" \
  -e "app_name=my-docker-app2" \
  -e "image_tag=latest"
```

## 📊 Pipeline Stages

### 1. Checkout

- Fetches latest code from GitHub
- Records Git commit ID

### 2. Build Docker Images

- Builds backend image (Node.js)
- Builds frontend image (React + Nginx)
- Tags with both commit ID and `latest`

### 3. Push to DockerHub

- Authenticates with DockerHub
- Pushes all images with tags

### 4. Provision Infrastructure

- Runs Terraform to create/update EC2 instance
- Configures security groups
- Installs Docker on EC2
- Exports EC2 IP for next stage

### 5. Deploy with Ansible

- Connects to EC2 via SSH
- Pulls latest Docker images
- Generates docker-compose.yml from template
- Starts containers
- Verifies health

### 6. Verify Deployment

- Checks if application is responding
- Displays application URL
- Reports success/failure

## 🔒 Security Considerations

### Development

- Default passwords in `.env.example` are for development only
- Never commit `.env` file to Git

### Production

1. **Change all default passwords**:

   ```bash
   # Strong MySQL password
   DB_PASSWORD=<generate-strong-password>

   # Secure JWT secret
   JWT_SECRET=<generate-random-secret>
   ```

2. **Restrict security group IPs**:
   - Edit `infra/terraform/terraform.tfvars`
   - Change `allowed_ssh_cidr` to your IP only

   ```hcl
   allowed_ssh_cidr = ["YOUR.IP.ADDRESS/32"]
   ```

3. **Use IAM roles** instead of access keys when possible

4. **Enable AWS MFA**

5. **Rotate credentials regularly**

6. **Use Secrets Manager** for production secrets

## 🐛 Troubleshooting

### Docker Permission Denied

```bash
sudo usermod -aG docker $USER
newgrp docker
# Or log out and log back in
```

### Jenkins Build Fails at Docker Build

- Ensure Jenkins user is in docker group:
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```

### Terraform Cannot Connect to AWS

```bash
# Verify credentials
aws sts get-caller-identity

# Check Terraform
cd infra/terraform
terraform init
terraform plan
```

### Ansible Cannot Connect to EC2

- Verify SSH key permissions:
  ```bash
  chmod 600 ~/.ssh/devops-key.pem
  ```
- Test manual SSH:
  ```bash
  ssh -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>
  ```
- Check security group allows SSH from Jenkins server

### Application Not Accessible

- Check EC2 security group allows ports 3000, 5000
- Verify containers are running on EC2:
  ```bash
  ssh -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>
  docker ps
  docker logs frontend_c
  docker logs backend_c
  ```

## 📚 Additional Resources

### Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Documentation](https://docs.ansible.com/)

### Useful Commands

```bash
# Docker
docker ps                          # List running containers
docker logs <container>            # View container logs
docker-compose logs -f             # Follow logs
docker system prune -a             # Clean up everything

# Terraform
terraform init                     # Initialize
terraform plan                     # Preview changes
terraform apply                    # Apply changes
terraform destroy                  # Destroy infrastructure
terraform output                   # Show outputs

# Ansible
ansible-playbook --syntax-check    # Check syntax
ansible-playbook --check           # Dry run
ansible-playbook -vvv              # Verbose output

# Jenkins
sudo systemctl start jenkins       # Start Jenkins
sudo systemctl status jenkins      # Check Jenkins status
sudo journalctl -u jenkins -f      # Follow Jenkins logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational purposes.

## 👥 Authors

- Your Name - DevOps Engineering Student

## 🙏 Acknowledgments

- Course: EC5207 DevOps
- Semester: 5th
- Institution: Campus Education

---

**Note**: This is a learning project. For production use, implement additional security measures, monitoring, logging, and backup strategies.
