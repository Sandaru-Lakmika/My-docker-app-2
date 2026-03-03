# AutoCare Service Center - DevOps CI/CD Project

A complete DevOps pipeline that automatically builds, pushes, and deploys a full-stack web application to AWS EC2.

## 🎯 Project Overview

This project demonstrates a **CI/CD pipeline** using:

| Tool          | Purpose                          |
| ------------- | -------------------------------- |
| **Docker**    | Containerize frontend & backend  |
| **Jenkins**   | Automate build and deployment    |
| **Terraform** | Provision AWS EC2 infrastructure |
| **Ansible**   | Deploy application to EC2        |
| **DockerHub** | Store Docker images              |
| **AWS EC2**   | Host the application             |

## 📁 Project Structure

```
my-docker-app2/
├── frontend/                 # React frontend app
│   ├── Dockerfile
│   └── src/
├── backend/                  # Node.js backend API
│   ├── Dockerfile
│   └── index.js
├── infra/
│   ├── terraform/            # Infrastructure as Code (AWS EC2)
│   └── ansible/              # Configuration Management (Deployment)
├── scripts/                  # Setup scripts for WSL
├── docker-compose.yml        # Container orchestration
├── Jenkinsfile               # CI/CD pipeline definition
└── README.md
```

## 🔄 CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        JENKINS PIPELINE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   1. CHECKOUT          2. BUILD              3. PUSH                │
│   ┌─────────┐         ┌─────────┐          ┌─────────┐              │
│   │ GitHub  │ ──────► │ Docker  │ ───────► │DockerHub│              │
│   │  Code   │         │ Images  │          │  Push   │              │
│   └─────────┘         └─────────┘          └─────────┘              │
│                                                   │                  │
│                                                   ▼                  │
│   5. VERIFY            4. DEPLOY                                    │
│   ┌─────────┐         ┌─────────┐                                   │
│   │  Curl   │ ◄────── │ Ansible │ ◄────── Pull images from DockerHub│
│   │  Test   │         │  to EC2 │                                   │
│   └─────────┘         └─────────┘                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 🛠️ DevOps Tools Used

### 1. Docker (Containerization)

- **frontend/Dockerfile** - Builds React app with Nginx
- **backend/Dockerfile** - Builds Node.js API
- **docker-compose.yml** - Runs all containers together

### 2. Jenkins (CI/CD)

- **Jenkinsfile** - Defines the pipeline stages:
  - Checkout code from GitHub
  - Build Docker images
  - Push to DockerHub
  - Deploy to EC2 using Ansible
  - Verify deployment

### 3. Terraform (Infrastructure as Code)

- **infra/terraform/** - Used for initial AWS setup:
  - EC2 instance provisioning
  - Security groups
  - Network configuration
  - _Note: Infrastructure is created once, then Jenkins deploys to existing EC2_

### 4. Ansible (Configuration Management)

- **infra/ansible/** - Deploys application:
  - Connects to EC2 via SSH
  - Pulls Docker images
  - Runs containers with docker-compose

## 🚀 How to Run

### Local Development

```bash
# Start all services locally
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Production Deployment (via Jenkins)

1. Push code to GitHub
2. Jenkins automatically:
   - Builds Docker images
   - Pushes to DockerHub
   - Deploys to EC2 via Ansible
3. App is live at: `http://<EC2-IP>:3000`

## 📋 Application Stack

| Component | Technology        | Port |
| --------- | ----------------- | ---- |
| Frontend  | React + Nginx     | 3000 |
| Backend   | Node.js + Express | 5000 |
| Database  | MySQL             | 3306 |

## 🔑 Key Files

| File                                 | Description               |
| ------------------------------------ | ------------------------- |
| `Jenkinsfile`                        | CI/CD pipeline stages     |
| `docker-compose.yml`                 | Container orchestration   |
| `frontend/Dockerfile`                | Frontend container build  |
| `backend/Dockerfile`                 | Backend container build   |
| `infra/terraform/main.tf`            | AWS provider & EC2 config |
| `infra/terraform/ec2.tf`             | EC2 instance definition   |
| `infra/ansible/playbooks/deploy.yml` | Deployment automation     |

## 👨‍💻 Author

**EC5207 - DevOps**  
5th Semester Project





# Someone clones your repo
git clone <your-repo>
cd my-docker-app2

# They run your scripts to setup their machine
chmod +x scripts/*.sh
./scripts/install-devops-tools.sh    # Installs Docker, Terraform, Ansible, Jenkins, etc.
./scripts/setup-aws.sh               # Configures their AWS credentials
./scripts/setup-jenkins.sh           # Sets up their local Jenkins
./scripts/verify-setup.sh            # Verifies everything works

# Now they can:
docker-compose up --build            # Run app locally
terraform plan                       # Test infrastructure changes
ansible-playbook ...                 # Test deployments
# Test webhook automation Wed Mar  4 02:01:44 +0530 2026
