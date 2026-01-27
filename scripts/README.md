# DevOps Tools Installation and Setup Scripts

This directory contains scripts to help you set up your WSL environment with all necessary DevOps tools.

## Prerequisites

- Windows with WSL2 installed
- Ubuntu 20.04 or 22.04 in WSL

## Installation Steps

### 1. Install All DevOps Tools

Run the main installation script:

```bash
cd scripts
chmod +x install-devops-tools.sh
./install-devops-tools.sh
```

This script installs:

- Docker & Docker Compose
- Terraform
- Ansible (with Docker modules)
- AWS CLI
- Jenkins
- Java (for Jenkins)
- Python & pip

### 2. Configure AWS

After installing the tools, configure your AWS credentials:

```bash
chmod +x setup-aws.sh
./setup-aws.sh
```

This script will:

- Configure AWS CLI with your credentials
- Create an SSH key pair for EC2
- Display the public key to import to AWS

### 3. Setup Jenkins

Configure Jenkins for your CI/CD pipeline:

```bash
chmod +x setup-jenkins.sh
./setup-jenkins.sh
```

This script will:

- Start Jenkins service
- Display the initial admin password
- Show the Jenkins URL
- List required plugins and credentials

## Manual Steps After Installation

### AWS Configuration

1. Import your SSH public key to AWS EC2:
   - Go to AWS Console > EC2 > Key Pairs
   - Click "Actions" > "Import key pair"
   - Name it "devops-key"
   - Paste the public key from `~/.ssh/devops-key.pub`

2. Verify Terraform can access AWS:
   ```bash
   cd infra/terraform
   terraform init
   terraform plan
   ```

### Jenkins Configuration

1. Access Jenkins at `http://localhost:8080` (or your WSL IP)

2. Enter the initial admin password

3. Install suggested plugins plus:
   - Docker Plugin
   - Docker Pipeline Plugin
   - SSH Agent Plugin

4. Add credentials:
   - **DockerHub** (username/password) - ID: `dockerhub`
   - **AWS** (username/password) - ID: `aws-credentials`
     - Username: Your AWS Access Key ID
     - Password: Your AWS Secret Access Key
   - **EC2 SSH Key** (SSH Username with private key) - ID: `ec2-ssh-key`

5. Create a new Pipeline job:
   - Point to your GitHub repository
   - Configure webhook for automatic builds

### GitHub Webhook

1. Go to your GitHub repository > Settings > Webhooks
2. Add webhook:
   - Payload URL: `http://YOUR_JENKINS_IP:8080/github-webhook/`
   - Content type: `application/json`
   - Events: "Just the push event"

## Testing the Setup

### Test Docker

```bash
docker run hello-world
docker-compose --version
```

### Test Terraform

```bash
cd infra/terraform
terraform init
terraform plan
```

### Test Ansible

```bash
cd infra/ansible
ansible --version
ansible-playbook --syntax-check playbooks/deploy.yml
```

### Test AWS CLI

```bash
aws sts get-caller-identity
aws ec2 describe-regions
```

## Troubleshooting

### Docker permission denied

```bash
newgrp docker
# Or log out and log back in
```

### Jenkins not starting

```bash
sudo systemctl status jenkins
sudo journalctl -u jenkins -f
```

### AWS credentials not working

```bash
aws configure list
cat ~/.aws/credentials
```

## Next Steps

After successful setup:

1. Push code to GitHub
2. Jenkins will automatically trigger
3. Pipeline will build, push to DockerHub, provision EC2, and deploy

## Security Notes

- Change default passwords in production
- Restrict AWS security group IPs
- Use IAM roles instead of access keys when possible
- Enable MFA on AWS account
- Regularly rotate credentials
