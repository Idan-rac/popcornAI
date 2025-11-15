terraform {
  backend "s3" {
    bucket         = "popcorn-project-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "popcorn-terraform-locks"
    encrypt        = true
  }
}