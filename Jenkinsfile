pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        AWS_CREDENTIALS = credentials('aws-credentials')
        EC2_SSH_KEY = credentials('ec2-ssh-key')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                sh 'docker build -t sandaru13/my-docker-app2-backend ./backend'
                sh 'docker build -t sandaru13/my-docker-app2-frontend ./frontend'
            }
        }
        stage('Push Docker Images') {
            steps {
                sh 'docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW'
                sh 'docker push sandaru13/my-docker-app2-backend'
                sh 'docker push sandaru13/my-docker-app2-frontend'
            }
        }
        stage('Provision Infrastructure') {
            steps {
                sh '''
                cd infra/terraform
                terraform init
                terraform apply -auto-approve
                '''
            }
        }
        stage('Deploy Application') {
            steps {
                sh '''
                EC2_IP=$(terraform -chdir=infra/terraform output -raw ec2_public_ip)
                echo "[webservers]" > infra/ansible/inventory/hosts
                echo "$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/devops-key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'" >> infra/ansible/inventory/hosts
                ansible-playbook -i infra/ansible/inventory/hosts infra/ansible/playbooks/deploy.yml \
                  -e "dockerhub_username=$DOCKERHUB_CREDENTIALS_USR" \
                  -e "dockerhub_password=$DOCKERHUB_CREDENTIALS_PSW" \
                  -e "app_name=my-docker-app2" \
                  -e "image_tag=latest"
                '''
            }
        }
        stage('Verify Deployment') {
            steps {
                sh 'curl http://$(terraform -chdir=infra/terraform output -raw ec2_public_ip):3000'
            }
        }
    }
}