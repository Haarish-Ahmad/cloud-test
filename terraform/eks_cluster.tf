# --- 1. CONTROL PLANE IAM ROLE ---
resource "aws_iam_role" "cluster_role" {
  name = "ecommerce-manual-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = ["sts:AssumeRole", "sts:TagSession"]
      Effect = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cluster_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role_policy_attachment" "cluster_compute_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSComputePolicy"
}

resource "aws_iam_role_policy_attachment" "cluster_lb_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSLoadBalancingPolicy"
}

resource "aws_iam_role_policy_attachment" "cluster_network_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSNetworkingPolicy"
}

resource "aws_iam_role_policy_attachment" "cluster_storage_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSBlockStoragePolicy"
}

# --- 2. NODE IAM ROLE ---
resource "aws_iam_role" "node_role" {
  name = "ecommerce-eks-node-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Grants the nodes permission to join the cluster
resource "aws_iam_role_policy_attachment" "node_policy_1" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

# Grants the nodes permission to download Docker images from AWS ECR
resource "aws_iam_role_policy_attachment" "node_policy_2" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# --- 3. EKS CLUSTER ---
resource "aws_eks_cluster" "main" {
  name     = "ecommerce-eks-cluster"
  role_arn = aws_iam_role.cluster_role.arn
  version  = "1.31"

  bootstrap_self_managed_addons = false

  vpc_config {
    subnet_ids              = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  access_config {
    authentication_mode                         = "API"
    bootstrap_cluster_creator_admin_permissions = true
  }

  compute_config {
    enabled       = true
    node_pools    = ["general-purpose", "system"]
    node_role_arn = aws_iam_role.node_role.arn
  }

  kubernetes_network_config {
    elastic_load_balancing {
      enabled = true
    }
  }

  storage_config {
    block_storage {
      enabled = true
    }
  }
}

# --- 4. CLOUDWATCH OBSERVABILITY ---

# Grant the EKS Auto Mode nodes permission to send data to CloudWatch
resource "aws_iam_role_policy_attachment" "node_policy_cloudwatch" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Install the CloudWatch agent directly into the cluster
resource "aws_eks_addon" "cloudwatch_observability" {
  cluster_name  = aws_eks_cluster.main.name
  addon_name    = "aws-cloudwatch-observability"
  
  addon_version = "v3.7.0-eksbuild.1" 

  depends_on = [
    aws_eks_cluster.main,
    aws_iam_role_policy_attachment.node_policy_cloudwatch
  ]
}
