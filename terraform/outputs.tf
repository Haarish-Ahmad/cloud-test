# --- Database Outputs ---
output "rds_endpoint" {
  description = "The connection endpoint for the AWS RDS MySQL database"
  value       = aws_db_instance.mysql.endpoint
}

# --- Kubernetes (EKS) Outputs ---
output "eks_cluster_name" {
  description = "The name of your Kubernetes cluster"
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "The endpoint for your Kubernetes API server"
  value       = aws_eks_cluster.main.endpoint
}

# --- Helpful Commands ---
output "connect_to_eks_command" {
  description = "Run this exact command in your terminal to connect to the cluster after it builds"
  value       = "aws eks update-kubeconfig --region ap-south-1 --name ${aws_eks_cluster.main.name}"
}
