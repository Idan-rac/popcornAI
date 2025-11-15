data "aws_secretsmanager_secret_version" "creds" {
  secret_id = "dev/movie2/postgres"
}

locals {
  db_creds = jsondecode(
    data.aws_secretsmanager_secret_version.creds.secret_string
  )
}

module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier         = "popcorn-db-postgres"
  engine             = "postgres"
  engine_version     = "14"       
  instance_class     = "db.t4g.large"  
  port               = 5432

  allocated_storage      = 20
  max_allocated_storage  = 100
  storage_type           = "gp3"
  storage_encrypted      = true


  db_name  = "movie_db"
  username = local.db_creds.username
  password = local.db_creds.password


  iam_database_authentication_enabled = true

  # רשת
  multi_az             = true
  publicly_accessible  = false
  db_subnet_group_name = var.database_subnet_group
  vpc_security_group_ids = var.security_group_ids

  # תחזוקה/גיבויים
  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"
  backup_retention_period = 7
  auto_minor_version_upgrade = true
  deletion_protection = true
  apply_immediately   = false

  # ניטור ולוגים
  monitoring_interval      = 30
  create_monitoring_role   = true
  monitoring_role_name     = "MyRDSMonitoringRole"
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # פרמטרים של פוסטגרס (Parameter Group)
  family = "postgres14"
  parameters = [
    # SSL מומלץ
    { name = "rds.force_ssl", value = "1" },
    # הרחבות נפוצות למעקב
    { name = "shared_preload_libraries", value = "pg_stat_statements" },
    { name = "pg_stat_statements.track", value = "all" },
    # לוגים יותר עשירים (לבחירתך)
    { name = "log_min_duration_statement", value = "2000" }, # מ״ש
  ]

  # אין Option Group בפוסטגרס – אל תגדיר options/major_engine_version של אופציות

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  tags = {
    Owner       = "user"
    Environment = "dev"
  }
}