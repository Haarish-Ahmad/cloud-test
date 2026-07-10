# Create the Frontend ECR Repository
resource "aws_ecr_repository" "frontend" {
  name                 = "ecommerce-frontend"
  force_delete         = true 
}

# Create the Backend ECR Repository
resource "aws_ecr_repository" "backend" {
  name                 = "ecommerce-backend"
  force_delete         = true 
}
