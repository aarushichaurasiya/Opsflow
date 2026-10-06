terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# RDS PostgreSQL
resource "aws_db_instance" "opsflow_db" {
  identifier        = "opsflow-postgres"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t4g.micro"
  allocated_storage = 20
  username          = "dbadmin"
  password          = var.db_password
  skip_final_snapshot = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "opsflow_redis" {
  cluster_id           = "opsflow-redis"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# S3 Bucket for Files
resource "aws_s3_bucket" "opsflow_files" {
  bucket = "opsflow-files-${var.environment}"
}

# Variables
variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (e.g. staging, prod)"
  type        = string
  default     = "staging"
}
