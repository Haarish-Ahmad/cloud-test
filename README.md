# Cloud-Based E-Commerce Application with DevOps Pipeline

A cloud-native e-commerce application built to demonstrate modern **DevOps**, **Cloud**, and **Kubernetes** practices. The project consists of a React frontend, Node.js backend, MySQL database, and a complete CI/CD pipeline deployed on **AWS EKS**.

---

# Features

- Browse available products
- Add and remove items from the shopping cart
- Place customer orders
- Dockerized frontend and backend services
- Automated CI/CD with Jenkins
- Infrastructure provisioning using Terraform
- Deployment on AWS EKS
- Monitoring with Prometheus, Grafana, and CloudWatch
- Static code analysis using SonarQube
- Container vulnerability scanning using Trivy

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React |
| Backend | Node.js, Express |
| Database | MySQL (Amazon RDS) |
| Containerization | Docker |
| Orchestration | Kubernetes (AWS EKS) |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Security Scanning | Trivy |
| Infrastructure as Code | Terraform |
| Cloud Provider | AWS |
| Container Registry | Amazon ECR |
| Monitoring | Prometheus, Grafana, CloudWatch |

---

# Architecture

```text
                    Internet
                        │
                        ▼
          AWS Application Load Balancer
                        │
                        ▼
                 Amazon EKS Cluster
        ┌─────────────────────────────┐
        │                             │
        │     React Frontend Pods     │
        │             │               │
        │             ▼               │
        │     Node.js Backend Pods    │
        └─────────────┬───────────────┘
                      │
                      ▼
              Amazon RDS MySQL

------------------------------------------------

Developer
      │
      ▼
 GitHub Repository
      │
      ▼
    Jenkins
      │
      ├── Build
      ├── SonarQube Analysis
      ├── Trivy Scan
      ├── Docker Build
      ├── Push Images to Amazon ECR
      └── Deploy to Amazon EKS

------------------------------------------------

Monitoring

Prometheus
      │
      ▼
Grafana Dashboard

CloudWatch Logs & Metrics
```

---

# Architecture Overview

### Traffic Layer

Public requests are routed through an AWS Application Load Balancer (ALB) into private subnets inside a secure VPC.

### Compute Layer

Amazon EKS manages Kubernetes worker nodes hosting the React frontend and Express backend.

### Data Layer

Amazon RDS MySQL stores product inventory and customer orders.

### CI/CD Pipeline

A local Dockerized Jenkins instance:

- Pulls source code from GitHub
- Injects environment secrets
- Performs SonarQube analysis
- Executes Trivy security scans
- Builds Docker images
- Pushes images to Amazon ECR
- Deploys workloads to Amazon EKS

### Monitoring

Prometheus collects application metrics, Grafana provides dashboards, and CloudWatch monitors AWS infrastructure and logs.

---

# Project Timeline

| Day | Tasks |
|-----|-------|
| Day 1 | Repository setup, Git workflow, and project structure |
| Day 2-3 | Developed React frontend, Express backend, REST APIs, and MySQL integration |
| Day 4 | Dockerized frontend and backend with Docker Compose |
| Day 5 | Built Jenkins CI/CD pipeline with SonarQube and Trivy |
| Day 6 | Provisioned AWS infrastructure using Terraform |
| Day 7-8 | Deployed application to Amazon EKS and connected Amazon RDS |
| Day 9-10 | Configured Prometheus, Grafana, CloudWatch, and completed documentation |

---

# Project Structure

```text
cloud-ecommerce-devops/
│
├── frontend/               # React application
├── backend/                # Node.js API
├── terraform/              # Infrastructure as Code
├── kubernetes/             # Kubernetes manifests
├── infra/                  # Jenkins & SonarQube Docker Compose
├── monitoring/             # Prometheus & Grafana configuration
├── Jenkinsfile
├── docker-compose.yml
└── README.md
```

---

# Getting Started

## 1. Install Prerequisites

Install the following tools on your Ubuntu machine:

- Docker & Docker Compose
- AWS CLI
- kubectl
- Helm
- MySQL Client

---

## 2. Start Jenkins and SonarQube

```bash
cd infra
docker-compose up -d
```

Open:

- Jenkins → http://localhost:8081
- SonarQube → http://localhost:9000

Default SonarQube credentials:

```
Username: admin
Password: admin
```

---

## 3. Configure Jenkins

Add the following credentials:

- `backend-env-file`
- `root-env-file`
- `sonarqube-token`

Configure the SonarQube server inside Jenkins using:

```
Name: SonarQube-Server
URL: http://sonarqube:9000
```

---

## 4. Provision AWS Infrastructure

```bash
cd terraform

terraform init

terraform plan

terraform apply -auto-approve
```

Update your Kubernetes configuration:

```bash
aws eks update-kubeconfig \
--region ap-south-1 \
--name ecommerce-eks-cluster
```

---

## 5. Seed the Database

Connect to the Amazon RDS instance.

```bash
mysql -h <RDS-ENDPOINT> -u ecommerce_user -p
```

Run:

```sql
USE ecommerce;

INSERT INTO products (name, price, stock)
VALUES
('Mechanical Keyboard',99.99,45),
('Wireless Gaming Mouse',59.99,120),
('4K Ultra HD Monitor',289.50,25);
```

---

## 6. Run the CI/CD Pipeline

Create a Jenkins Pipeline project.

Repository:

```
https://github.com/Haarish-Ahmad/cloud-ecommerce-devops.git
```

Branch:

```
deploy
```

Click **Build Now**.

The pipeline automatically:

- Clones the repository
- Runs SonarQube analysis
- Performs Trivy vulnerability scans
- Builds Docker images
- Pushes images to Amazon ECR
- Deploys to Amazon EKS

---

# Monitoring

Start Grafana:

```bash
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Open:

```
http://localhost:3000
```

Default credentials:

```
Username: admin
Password: admin
```

Configure the following data sources:

- Prometheus
- AWS CloudWatch

---

# Access the Application

Get the Load Balancer service details.

```bash
kubectl get services
```

Example output:

```text
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP                                                               PORT(S)
frontend     LoadBalancer   10.100.10.25    a1b2c3d4e5f6.ap-south-1.elb.amazonaws.com                               80:32456/TCP
```

Copy the **EXTERNAL-IP** (Load Balancer DNS) and open it in your browser:

```text
http://a1b2c3d4e5f6.ap-south-1.elb.amazonaws.com
```

You can also verify the backend API by running:

```bash
curl http://a1b2c3d4e5f6.ap-south-1.elb.amazonaws.com/api/products
```

This will open the live e-commerce application running on Amazon EKS.

Get the Load Balancer endpoint.

Test the backend:

```bash
curl http://<LOAD-BALANCER-DNS>:3000/api/products
```

Open the Load Balancer DNS in your browser to access the application.

---

# CI/CD Workflow

```text
Developer
      │
      ▼
GitHub Repository
      │
      ▼
Jenkins Pipeline
      │
      ├── Checkout Code
      ├── Install Dependencies
      ├── Run Tests
      ├── SonarQube Analysis
      ├── Trivy Scan
      ├── Build Docker Images
      ├── Push Images to Amazon ECR
      └── Deploy to Amazon EKS
```

---

# Author

**Haarish Ahmad**
