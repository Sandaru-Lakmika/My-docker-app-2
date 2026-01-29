# Sandaru: EC2 Provisioning → Deployment → Jenkins Automation

This document describes the complete steps to: create an EC2 instance, deploy the application there, and automate the process with a Jenkins pipeline. Follow the steps in order from a WSL environment.

Prerequisites
- WSL2 (Ubuntu) on Windows
- Git configured with your GitHub repo of this project
- AWS account and AWS CLI configured (you will provide credentials)
- DockerHub account
- The repository cloned locally (this repo)

Paths referenced in this repo
- Terraform: `infra/terraform`
- Ansible: `infra/ansible`
- Jenkinsfile (pipeline): `Jenkinsfile` (root) and also `ci/jenkins/Jenkinsfile`
- WSL install script: `scripts/install-devops-tools.sh`
- AWS setup helper: `scripts/setup-aws.sh`

1) Prepare your WSL environment

Install required tools in WSL (this script installs Docker, Terraform, Ansible, AWS CLI, Jenkins, etc.):

```bash
cd ~/path/to/my-docker-app2
chmod +x scripts/*.sh
./scripts/install-devops-tools.sh
```

2) Create SSH keys and import to AWS

Run the helper to configure AWS CLI and generate SSH keypair (it prints the public key):

```bash
./scripts/setup-aws.sh
```

Important notes:
- The script creates the key at `~/.ssh/devops-key` (private) and `~/.ssh/devops-key.pub` (public). Some files in this repo (Jenkinsfile, Ansible inventory, README) reference `~/.ssh/devops-key.pem`. Keep names consistent. Two options:
  - Option A (recommended): copy/rename the private key to the `.pem` name Jenkins/Ansible expect:
    ```bash
    cp ~/.ssh/devops-key ~/.ssh/devops-key.pem
    chmod 600 ~/.ssh/devops-key.pem
    ```
  - Option B: update references in `Jenkinsfile` and `infra/ansible/inventory/hosts` to use `~/.ssh/devops-key`.

3) Import public key into AWS Console

1. Open AWS Console → EC2 → Key Pairs → Import key pair
2. Name: `devops-key`
3. Paste the contents from `~/.ssh/devops-key.pub`

4) Prepare Terraform variables (optional)

Edit `infra/terraform/terraform.tfvars` (or create it) to set region, instance type and restrict SSH access. Example `terraform.tfvars`:

```hcl
aws_region = "eu-north-1"
instance_type = "t3.small"
key_name = "devops-key"
project_name = "my-docker-app2"
environment = "production"
# Restrict SSH to your IP for safety
allowed_ssh_cidr = ["YOUR.IP.ADDRESS/32"]
allowed_http_cidr = ["0.0.0.0/0"]
```

5) Provision EC2 with Terraform (manual run)

From WSL, run:

```bash
cd infra/terraform
terraform init
terraform plan -out=tfplan
terraform apply -auto-approve tfplan

# Get EC2 public IP
terraform output ec2_public_ip
```

Terraform in this repo provisions an Ubuntu EC2 instance, installs Docker and Docker Compose via `user_data`, adds `ubuntu` user to `docker` group, and creates an Elastic IP. The public IP is exposed via `ec2_public_ip` output.

6) Verify SSH and Docker on EC2

From WSL (use the private key file you selected earlier):

```bash
# replace <EC2_IP> with the terraform output
ssh -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>
# or if you use devops-key (no .pem)
ssh -i ~/.ssh/devops-key ubuntu@<EC2_IP>

# On EC2, verify Docker
sudo docker --version
sudo docker ps -a
```

If you see Docker installed and running, the instance is ready for Ansible deployment.

7) Manual Ansible deployment (one-time test)

Update the inventory file `infra/ansible/inventory/hosts` or run Ansible using the dynamic IP (example below):

```bash
# from repo root
EC2_IP=$(terraform -chdir=infra/terraform output -raw ec2_public_ip)
cat > infra/ansible/inventory/hosts <<EOF
[webservers]
$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/devops-key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOF

# Run the playbook (example uses latest image tag)
ansible-playbook -i infra/ansible/inventory/hosts infra/ansible/playbooks/deploy.yml \
  -e "dockerhub_username=YOUR_DOCKERHUB_USERNAME" \
  -e "dockerhub_password=YOUR_DOCKERHUB_PASSWORD" \
  -e "app_name=my-docker-app2" \
  -e "image_tag=latest"
```

The Ansible playbook will:
- Ensure Docker and Docker Compose are ready
- Pull images `${dockerhub_username}/my-docker-app2-frontend` and `...-backend` with the given tag
- Render `docker-compose.yml` from `infra/ansible/playbooks/docker-compose.yml.j2` into `/opt/app/docker-compose.yml`
- Start containers via `docker-compose up -d`

8) Configure Jenkins to automate the flow

Steps in Jenkins UI (assumes Jenkins installed in WSL or server):

1. Add Credentials
   - DockerHub (ID: `dockerhub`): Username & Password
   - AWS (ID: `aws-credentials`): Access Key ID (username) & Secret Access Key (password)

2. Create a new Pipeline job
   - Name: `my-docker-app2-pipeline`
   - Pipeline script from SCM
   - SCM: Git, Repository: your GitHub repo URL
   - Script Path: choose either `Jenkinsfile` (root) or `ci/jenkins/Jenkinsfile`.

3. Ensure Jenkins user has access to Docker (if Jenkins runs on same host): add to docker group

4. Webhook for automatic builds
   - In GitHub repo settings → Webhooks: add `http://<JENKINS_HOST>:8080/github-webhook/` with `application/json` and push events

What the pipeline does (implemented in `Jenkinsfile`):
- Checkout code
- Build backend and frontend Docker images, tag with `TIMESTAMP-COMMIT` and `latest`
- Login to DockerHub and push images
- Run Terraform (`infra/terraform`) to provision/update EC2; writes EC2 IP to `ec2_ip.txt`
- Update `infra/ansible/inventory/hosts` with EC2 IP and run Ansible playbook to deploy
- Verify application by curling `http://<EC2_IP>:3000`

9) Triggering and testing pipeline

Locally, trigger a push to GitHub to activate the webhook and start the pipeline. Or run pipeline manually from Jenkins.

Useful Jenkins troubleshooting steps
- Ensure credentials IDs match (`dockerhub`, `aws-credentials`).
- Ensure the Jenkins node (agent) where pipeline runs has Docker and Terraform installed (or run Jenkins in Docker with privilege/host docker socket).
- If Ansible fails to SSH, confirm `~/.ssh/devops-key.pem` exists on the Jenkins user and has `chmod 600`.

10) Common troubleshooting commands (WSL)

```bash
# Check ssh key permissions
ls -l ~/.ssh/devops-key*
chmod 600 ~/.ssh/devops-key*

# Check Terraform outputs
cd infra/terraform
terraform output

# Check Ansible syntax
ansible-playbook --syntax-check infra/ansible/playbooks/deploy.yml

# Manually run Ansible with verbosity
ansible-playbook -i infra/ansible/inventory/hosts infra/ansible/playbooks/deploy.yml -vvv

# SSH with verbose output
ssh -vvv -i ~/.ssh/devops-key.pem ubuntu@<EC2_IP>
```

11) Security & cleanup notes
- Do NOT leave `allowed_ssh_cidr = ["0.0.0.0/0"]` in production — restrict to your IP.
- Remove unused EC2, EIP, and other resources when done: `terraform destroy -auto-approve` in `infra/terraform`.

12) Checklist before first Jenkins run
- [ ] `~/.ssh/devops-key.pem` exists and is readable by Jenkins user
- [ ] DockerHub credentials added to Jenkins (ID: `dockerhub`)
- [ ] AWS credentials added to Jenkins (ID: `aws-credentials`)
- [ ] GitHub webhook configured
- [ ] `infra/terraform/terraform.tfvars` configured with your CIDR and other values

If you want, I can:
- Make private key naming consistent across files (rename references to `devops-key` → `devops-key.pem` or vice versa) and update `Jenkinsfile`/inventory.
- Run a validation script to confirm all tools available on your WSL host.

---

File created: `sandaru.md` — see repository root.
