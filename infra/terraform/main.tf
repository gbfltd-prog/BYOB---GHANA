terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.5.1"

  name = "byob-vpc"
  cidr = "10.10.0.0/16"

  azs             = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets = ["10.10.1.0/24", "10.10.2.0/24", "10.10.3.0/24"]
  public_subnets  = ["10.10.101.0/24", "10.10.102.0/24", "10.10.103.0/24"]

  enable_nat_gateway = true
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.11.0"
  cluster_name    = "byob-cluster"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = concat(module.vpc.private_subnets, module.vpc.public_subnets)

  eks_managed_node_groups = {
    default = {
      desired_size = 3
      max_size     = 5
      min_size     = 2
      instance_types = ["t3.medium"]
    }
  }
}

data "aws_availability_zones" "available" {}

resource "aws_db_instance" "postgres" {
  identifier = "byob-postgres"
  engine     = "postgres"
  instance_class = "db.t3.micro"
  username = var.db_username
  password = var.db_password
  db_name  = "byob"
  allocated_storage = 20
  skip_final_snapshot = true
  vpc_security_group_ids = [module.vpc.default_security_group_id]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "byob-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}
