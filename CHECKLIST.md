# DevOps Project Setup Checklist

## ✅ Pre-requisites Setup

### 1. Accounts Setup

- [ ] GitHub account created
- [ ] DockerHub account created
- [ ] AWS account created (with billing enabled)
- [ ] Git configured locally with username and email

### 2. WSL Installation (Windows)

- [ ] WSL2 installed on Windows
- [ ] Ubuntu 20.04 or 22.04 installed in WSL
- [ ] WSL updated: `sudo apt update && sudo apt upgrade -y`

## ✅ Tools Installation

### 3. Install DevOps Tools

- [ ] Run installation script: `./scripts/install-devops-tools.sh`
- [ ] Verify Docker: `docker --version`
- [ ] Verify Docker Compose: `docker-compose --version`
- [ ] Verify Terraform: `terraform --version`
- [ ] Verify Ansible: `ansible --version`
- [ ] Verify AWS CLI: `aws --version`
- [ ] Verify Jenkins: `sudo systemctl status jenkins`
- [ ] Add user to docker group and re-login: `newgrp docker`

### 4. Run Verification

- [ ] Run: `./scripts/verify-setup.sh`
- [ ] Fix any reported issues

## ✅ AWS Configuration

### 5. AWS CLI Setup

- [ ] Run AWS setup script: `./scripts/setup-aws.sh`
- [ ] Configure AWS credentials: Access Key ID and Secret Access Key
- [ ] Set default region (e.g., us-east-1)
- [ ] Test AWS connection: `aws sts get-caller-identity`

### 6. EC2 Key Pair

- [ ] SSH key created at `~/.ssh/devops-key`
- [ ] Public key displayed
- [ ] Go to AWS Console → EC2 → Key Pairs
- [ ] Import key pair with name `devops-key`
- [ ] Paste public key from `~/.ssh/devops-key.pub`
- [ ] Verify key permissions: `chmod 600 ~/.ssh/devops-key.pem`

### 7. Update Terraform Variables

- [ ] Edit `infra/terraform/terraform.tfvars`
- [ ] Update `key_name` to match your AWS key pair name
- [ ] Update `allowed_ssh_cidr` with your IP address (for security)
- [ ] Update `aws_region` if needed

## ✅ Jenkins Configuration

### 8. Access Jenkins

- [ ] Start Jenkins: `sudo systemctl start jenkins`
- [ ] Get initial password: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
- [ ] Open Jenkins in browser: `http://localhost:8080` or `http://<WSL_IP>:8080`
- [ ] Enter initial admin password

### 9. Jenkins Plugins

- [ ] Install suggested plugins
- [ ] Install additional plugins:
  - [ ] Docker Plugin
  - [ ] Docker Pipeline Plugin
  - [ ] Pipeline Plugin
  - [ ] Credentials Binding Plugin
  - [ ] SSH Agent Plugin
  - [ ] Git Plugin

### 10. Create Admin User

- [ ] Create Jenkins admin user
- [ ] Save credentials securely
- [ ] Complete Jenkins setup

### 11. Add Jenkins Credentials

Go to: Manage Jenkins → Manage Credentials → System → Global credentials

- [ ] **DockerHub Credentials**
  - Kind: Username with password
  - ID: `dockerhub`
  - Username: Your DockerHub username
  - Password: Your DockerHub password

- [ ] **AWS Credentials**
  - Kind: Username with password
  - ID: `aws-credentials`
  - Username: Your AWS Access Key ID
  - Password: Your AWS Secret Access Key

### 12. Configure Jenkins for Docker

- [ ] Add jenkins user to docker group: `sudo usermod -aG docker jenkins`
- [ ] Restart Jenkins: `sudo systemctl restart jenkins`
- [ ] Verify Jenkins can run docker: Check in Jenkins script console

## ✅ GitHub Setup

### 13. Push Code to GitHub

- [ ] Create new repository on GitHub
- [ ] Initialize git in project: `git init`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Add files: `git add .`
- [ ] Create .env from .env.example (DON'T commit .env)
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Push: `git push -u origin main`

### 14. Create Jenkins Pipeline Job

- [ ] Create new item in Jenkins
- [ ] Name: `my-docker-app2-pipeline`
- [ ] Type: Pipeline
- [ ] Pipeline definition: Pipeline script from SCM
- [ ] SCM: Git
- [ ] Repository URL: Your GitHub repo URL
- [ ] Branch: `*/main` or `*/master`
- [ ] Script Path: `Jenkinsfile`
- [ ] Save

### 15. Configure GitHub Webhook

- [ ] Get Jenkins URL (must be accessible from internet)
- [ ] Go to GitHub repo → Settings → Webhooks → Add webhook
- [ ] Payload URL: `http://<JENKINS_IP>:8080/github-webhook/`
- [ ] Content type: `application/json`
- [ ] Events: "Just the push event"
- [ ] Active: ✓
- [ ] Add webhook

## ✅ Application Configuration

### 16. Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Update `DOCKERHUB_USERNAME` in `.env`
- [ ] Update `DB_PASSWORD` with strong password
- [ ] Update `JWT_SECRET` with random string
- [ ] **DO NOT** commit `.env` to Git

### 17. Update Docker Compose

- [ ] Verify `docker-compose.yml` has correct settings
- [ ] Update image names with your DockerHub username
- [ ] Save changes

## ✅ Local Testing

### 18. Test Docker Build

- [ ] Build backend: `docker build -t test-backend ./backend`
- [ ] Build frontend: `docker build -t test-frontend ./frontend`
- [ ] Verify images: `docker images`

### 19. Test Docker Compose

- [ ] Run: `docker-compose up --build`
- [ ] Access frontend: http://localhost:3000
- [ ] Access backend: http://localhost:5000
- [ ] Check database: `docker exec -it mysql_db mysql -u root -p<password> carservice`
- [ ] Stop: `docker-compose down`

### 20. Test Terraform (Optional)

- [ ] Navigate: `cd infra/terraform`
- [ ] Initialize: `terraform init`
- [ ] Validate: `terraform validate`
- [ ] Plan: `terraform plan`
- [ ] **DON'T APPLY YET** (Jenkins will do this)

### 21. Test Ansible Syntax

- [ ] Navigate: `cd infra/ansible`
- [ ] Check syntax: `ansible-playbook --syntax-check playbooks/deploy.yml`

## ✅ Pipeline Execution

### 22. Trigger First Build

Method 1 - Manual:

- [ ] Go to Jenkins → Your Pipeline → Build Now
- [ ] Watch console output

Method 2 - Automatic:

- [ ] Make a change to code
- [ ] Commit: `git add . && git commit -m "Test pipeline"`
- [ ] Push: `git push origin main`
- [ ] GitHub webhook triggers Jenkins automatically

### 23. Monitor Pipeline

- [ ] Watch Jenkins console output
- [ ] Verify each stage completes:
  - [ ] Checkout
  - [ ] Build Docker Images
  - [ ] Push to DockerHub
  - [ ] Provision Infrastructure (Terraform)
  - [ ] Deploy with Ansible
  - [ ] Verify Deployment

### 24. Verify Deployment

- [ ] Note EC2 public IP from Jenkins output
- [ ] Wait 2-3 minutes for full deployment
- [ ] Access application: `http://<EC2_IP>:3000`
- [ ] Test application functionality
- [ ] Check backend API: `http://<EC2_IP>:5000`

## ✅ Post-Deployment

### 25. Verify on EC2

- [ ] SSH to EC2: `ssh -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>`
- [ ] Check containers: `docker ps`
- [ ] Check logs: `docker logs frontend_c`
- [ ] Check logs: `docker logs backend_c`
- [ ] Check logs: `docker logs mysql_db`
- [ ] Exit SSH

### 26. Verify on DockerHub

- [ ] Login to DockerHub
- [ ] Verify images are pushed
- [ ] Check image tags

### 27. Test Auto-deployment

- [ ] Make a small change to frontend (e.g., change text in a component)
- [ ] Commit and push
- [ ] Verify Jenkins triggers automatically
- [ ] Verify new version deploys to EC2
- [ ] Verify changes appear on website

## ✅ Cleanup (When Done)

### 28. Destroy Resources (Optional)

- [ ] Navigate: `cd infra/terraform`
- [ ] Destroy: `terraform destroy`
- [ ] Confirm: type `yes`
- [ ] Verify EC2 instance terminated in AWS Console

### 29. Local Cleanup

- [ ] Stop containers: `docker-compose down`
- [ ] Remove images: `docker system prune -a`

## 📝 Troubleshooting Checklist

If pipeline fails:

- [ ] Check Jenkins console output for specific error
- [ ] Verify all credentials are correct in Jenkins
- [ ] Verify AWS credentials: `aws sts get-caller-identity`
- [ ] Verify Docker is running: `docker ps`
- [ ] Check DockerHub login: `docker login`
- [ ] Verify EC2 key pair name matches in terraform.tfvars
- [ ] Check security groups allow necessary ports
- [ ] Verify SSH key permissions: `chmod 600 ~/.ssh/devops-key.pem`
- [ ] Check Terraform state: `cd infra/terraform && terraform show`
- [ ] Check Ansible connectivity: `ansible -i inventory/hosts webservers -m ping`

## 🎉 Success Criteria

Your project is complete when:

- [x] All tools installed and verified
- [x] Jenkins pipeline runs successfully
- [x] Docker images built and pushed to DockerHub
- [x] EC2 instance provisioned via Terraform
- [x] Application deployed via Ansible
- [x] Application accessible via EC2 public IP
- [x] Auto-deployment works on git push
- [x] All services (frontend, backend, database) running on EC2

---

**Congratulations!** You've set up a complete DevOps CI/CD pipeline! 🚀

## Next Steps

- Add monitoring (Prometheus, Grafana)
- Add logging (ELK Stack)
- Implement blue-green deployment
- Add automated tests in pipeline
- Set up SSL/TLS certificates
- Configure custom domain
- Implement backup strategies
