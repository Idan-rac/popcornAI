variable "database_subnet_group" {
  description = "Name of the database subnet group"
  type        = string
}

variable "security_group_ids" {
  description = "List of security group IDs for the RDS instance"
  type        = list(string)
}