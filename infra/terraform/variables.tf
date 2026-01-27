# Variables for Terraform Configuration
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.medium"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "devops-key"
}

variable "project_name" {
  description = "Project name for tagging resources"
  type        = string
  default     = "my-docker-app2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # WARNING: Change this to your IP for security
}

variable "allowed_http_cidr" {
  description = "CIDR blocks allowed to access HTTP/HTTPS"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
