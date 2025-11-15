# ====================================== vpc modul =========================================
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
    
  name = "popcorn-vpc"
  cidr = "10.0.0.0/16"

  azs = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  database_subnets = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]


  single_nat_gateway  = true
  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "dev"
    project = "popcorn"
  }
}


resource "aws_security_group" "rds_sg" {
  vpc_id = module.vpc.vpc_id 
  name   = "popcorn-rds-sg"
  

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = module.vpc.private_subnets_cidr_blocks # מאפשר גישה מהאפליקציה
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "popcorn-rds-sg"
  }
}