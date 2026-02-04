# Terraform Configuration for AWS EC2 Instance
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: Configure S3 backend for state management
  # backend "s3" {
  #   bucket = "my-terraform-state-bucket"
  #   key    = "devops-project/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region     = "eu-north-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

data "aws_instance" "existing_instance" {
  instance_id = "i-0d8e67243526a67b3" // Replace with the actual instance ID
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c33fcb753a7176f6"
  instance_type = "t3.small"
  key_name      = "devops-key"
  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
    Name        = "my-docker-app2-server"
    Project     = "my-docker-app2"
  }

  lifecycle {
    ignore_changes = [
      ami,
      tags,
    ]
  }

  # Reference the existing instance
  id = "i-0d8e67243526a67b3"
}

resource "aws_security_group" "app_sg" {
  name        = "my-docker-app2-sg"
  description = "Security group for my-docker-app2"
  vpc_id      = "vpc-01d216790ed061b7e"

  tags = {
    Environment = "production"
    ManagedBy   = "Terraform"
    Name        = "my-docker-app2-sg"
    Project     = "my-docker-app2"
  }

  lifecycle {
    ignore_changes = [
      name,
    ]
  }
}
