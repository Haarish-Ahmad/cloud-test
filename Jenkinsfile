pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'deploy', url: 'https://github.com/Haarish-Ahmad/cloud-ecommerce-devops.git'
            }
        }

        stage('Prepare Environment') {
            steps {
                // Securely pulls both secret files and copies them to the correct paths
                withCredentials([
                    file(credentialsId: 'backend-env-file', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'root-env-file', variable: 'ROOT_ENV')
                ]) {
                    sh 'cp $BACKEND_ENV backend/.env'
                    sh 'cp $ROOT_ENV .env'
                }
            }
        }

        // --- NEW SONARQUBE STAGE ADDED HERE ---
        stage('SonarQube Analysis') {
	    steps {
		// 1. Automatically injects Node.js into the environment for this stage
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
	
	stage('Trivy Security Scan') {
	    steps {
		script {
		    echo "Enforcing Security Threshold (Cached): Scanning Backend Image..."
		    sh """
		    docker run --rm \
		        -v /var/run/docker.sock:/var/run/docker.sock \
		        -v trivy-db-cache:/root/.cache/trivy \
		        aquasec/trivy:latest image \
		        --severity CRITICAL \
		        --ignore-unfixed \
		        --skip-db-update \
		        --skip-java-db-update \
		        --exit-code 1 \
		        cloud-ecommerce-pipeline-backend:latest
		    """
		    
		    echo "Enforcing Security Threshold (Cached): Scanning Frontend Image..."
		    sh """
		    docker run --rm \
		        -v /var/run/docker.sock:/var/run/docker.sock \
		        -v trivy-db-cache:/root/.cache/trivy \
		        aquasec/trivy:latest image \
		        --severity CRITICAL \
		        --ignore-unfixed \
		        --skip-db-update \
		        --skip-java-db-update \
		        --exit-code 1 \
		        cloud-ecommerce-pipeline-frontend:latest
		    """
		}
	    }
	}
	
        stage('Build and Deploy Containers') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful! Frontend running on 8080, Backend on 3000.'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
