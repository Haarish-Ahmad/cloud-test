pipeline {
    agent any

    environment {
        // --- 1. CLOUD VARIABLES ---
        AWS_ACCOUNT_ID = 'YOUR_AWS_ACCOUNT_ID'
        AWS_REGION = 'ap-south-1'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        CLUSTER_NAME = 'ecommerce-eks-cluster'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'deploy', url: 'https://github.com/Haarish-Ahmad/cloud-ecommerce-devops.git'
            }
        }

        stage('Prepare Environment') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'root-env-file', variable: 'ROOT_ENV')
                ]) {
                    sh 'cp $BACKEND_ENV backend/.env'
                    sh 'cp $ROOT_ENV .env'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                nodejs('node-20') {
                    withSonarQubeEnv('SonarQube-Server') {
                        script {
                            def scannerHome = tool 'sonar-scanner'
                            sh """
                            ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=cloud-ecommerce \
                                -Dsonar.sources=.
                            """
                        }
                    }
                }
            }
        }

        // --- NEW CLOUD STAGE 1: UPLOAD TO ECR ---
        stage('Build & Push Docker Images') {
            steps {
                script {
                    // Log Jenkins into AWS securely
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    
                    // Build the local images
                    sh "docker build -t ecommerce-frontend ./frontend"
                    sh "docker build -t ecommerce-backend ./backend"
                    
                    // Tag them with the AWS ECR URL and the unique Jenkins build number
                    sh "docker tag ecommerce-frontend:latest ${ECR_REGISTRY}/ecommerce-frontend:${BUILD_NUMBER}"
                    sh "docker tag ecommerce-backend:latest ${ECR_REGISTRY}/ecommerce-backend:${BUILD_NUMBER}"
                    
                    // Push them up to the cloud storage
                    sh "docker push ${ECR_REGISTRY}/ecommerce-frontend:${BUILD_NUMBER}"
                    sh "docker push ${ECR_REGISTRY}/ecommerce-backend:${BUILD_NUMBER}"
                }
            }
        }

        // --- NEW CLOUD STAGE 2: DEPLOY TO EKS ---
        stage('Deploy to AWS EKS') {
            steps {
                script {
                    // Tell Jenkins how to connect to your EKS cluster
                    sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}"
                    
                    // Dynamically swap the image tags in your K8s YAML files to the new build number
                    sh "sed -i 's/TAG_PLACEHOLDER/${BUILD_NUMBER}/g' k8s/frontend-deployment.yaml"
                    sh "sed -i 's/TAG_PLACEHOLDER/${BUILD_NUMBER}/g' k8s/backend-deployment.yaml"
                    
                    // Launch the application in the cloud!
                    sh "kubectl apply -f k8s/"
                }
            }
        }
    }
    
    post {
        success {
            echo "Deployment successful! Check AWS for the live URL."
        }
        failure {
            echo "Pipeline failed. Check the Jenkins logs."
        }
    }
}
