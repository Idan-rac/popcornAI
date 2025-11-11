#providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

#==================================Configure the AWS Provider======================================
provider "aws" {
  region = "us-east-1"
}


#======================================calling the vpc module======================================
module "vpc" {
  source = "../../modules/vpc"
}

#======================================calling the eks module======================================
module "eks" {
  source = "../../modules/eks"
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
}

#======================================calling the rds module======================================
module "rds" {
  source = "../../modules/rds"
  database_subnet_group = module.vpc.database_subnet_group
  security_group_ids    = module.vpc.database_security_group_id != null ? [module.vpc.database_security_group_id] : []
}

#======================================calling the s3 module======================================
module "s3_bucket" {
  source = "../../modules/s3"
}


