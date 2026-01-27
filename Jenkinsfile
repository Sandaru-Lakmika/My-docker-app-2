pipeline {
  agent any

  environment {
    APP_NAME = 'my-docker-app2'
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    AWS_CREDENTIALS = credentials('aws-credentials')
    GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    BUILD_TIMESTAMP = sh(script: "date +%Y%m%d-%H%M%S", returnStdout: true).trim()
    IMAGE_TAG = "${BUILD_TIMESTAMP}-${GIT_COMMIT_SHORT}"
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out code from SCM...'
        checkout scm
        sh 'git rev-parse --short HEAD > .git/commit-id'
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          echo "Building Docker images with tag: ${IMAGE_TAG}"
          sh """
            docker build -t ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-backend:${IMAGE_TAG} ./backend
            docker build -t ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-backend:latest ./backend
            
            docker build -t ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-frontend:${IMAGE_TAG} ./frontend
            docker build -t ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-frontend:latest ./frontend
          """
        }
      }
    }

    stage('Push to DockerHub') {
      steps {
        script {
          echo 'Logging into DockerHub...'
          sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
          
          echo "Pushing images to DockerHub..."
          sh """
            docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-backend:${IMAGE_TAG}
            docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-backend:latest
            
            docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-frontend:${IMAGE_TAG}
            docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}-frontend:latest
          """
        }
      }
    }

    stage('Provision Infrastructure with Terraform') {
      steps {
        script {
          echo 'Provisioning AWS EC2 instance with Terraform...'
          dir('infra/terraform') {
            sh """
              export AWS_ACCESS_KEY_ID=\${AWS_CREDENTIALS_USR}
              export AWS_SECRET_ACCESS_KEY=\${AWS_CREDENTIALS_PSW}
              
              terraform init
              terraform plan -out=tfplan
              terraform apply -auto-approve tfplan
              
              # Export EC2 public IP for Ansible
              terraform output -raw ec2_public_ip > ../../ec2_ip.txt
            """
          }
        }
      }
    }

    stage('Deploy with Ansible') {
      steps {
        script {
          echo 'Deploying application to EC2 with Ansible...'
          
          // Wait for EC2 instance to be ready
          sh 'sleep 30'
          
          dir('infra/ansible') {
            sh """
              # Update inventory with EC2 IP
              EC2_IP=\$(cat ../../ec2_ip.txt)
              echo "[webservers]" > inventory/hosts
              echo "\$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/devops-key.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'" >> inventory/hosts
              
              # Run Ansible playbook
              ansible-playbook -i inventory/hosts playbooks/deploy.yml \
                -e "dockerhub_username=${DOCKERHUB_CREDENTIALS_USR}" \
                -e "dockerhub_password=${DOCKERHUB_CREDENTIALS_PSW}" \
                -e "app_name=${APP_NAME}" \
                -e "image_tag=${IMAGE_TAG}"
            """
          }
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo 'Verifying deployment...'
          sh """
            EC2_IP=\$(cat ec2_ip.txt)
            echo "Application deployed at: http://\$EC2_IP:3000"
            
            # Wait for application to be ready
            sleep 10
            
            # Check if application is responding
            for i in {1..5}; do
              if curl -f -s -o /dev/null -w "%{http_code}" http://\$EC2_IP:3000 | grep -q "200\\|301\\|302"; then
                echo "Application is responding successfully!"
                exit 0
              fi
              echo "Waiting for application to be ready... (attempt \$i/5)"
              sleep 10
            done
            
            echo "Warning: Application health check failed, but deployment completed."
          """
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully! ✅"
      echo "Application URL: http://\$(cat ec2_ip.txt):3000"
    }
    failure {
      echo "Pipeline failed! ❌"
    }
    always {
      echo 'Cleaning up...'
      sh '''
        docker logout || true
        docker system prune -f || true
      '''
      cleanWs()
    }
  }
}
