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
  ami                                  = data.aws_instance.existing_instance.ami
  instance_type                        = data.aws_instance.existing_instance.instance_type
  key_name                             = data.aws_instance.existing_instance.key_name
  subnet_id                            = data.aws_instance.existing_instance.subnet_id
  vpc_security_group_ids               = data.aws_instance.existing_instance.vpc_security_group_ids

  tags = {
    Name        = "my-docker-app2-server"
    Environment = "production"
    ManagedBy   = "Terraform"
    Project     = "my-docker-app2"
  }
}
