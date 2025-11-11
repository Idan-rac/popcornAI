#========================== vpc outputs ==========================================================

output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnets
}



output "default_security_group_id" {
  description = "The default security group ID for the VPC"
  value       = module.vpc.default_security_group_id
}


output "database_subnet_group" {
  description = "The name of the database subnet group"
  value       = module.vpc.database_subnet_group
}

output "database_security_group_id" {
  description = "The ID of the RDS security group"
  value       = aws_security_group.rds_sg.id
}