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
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh """
                    docker run --rm \
                        -v "\$(pwd):/usr/src" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=cloud-ecommerce \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000 \
                        -Dsonar.login=${SONAR_TOKEN}
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
