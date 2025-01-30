pipeline {
    agent {
        label 'jenkins_server'  // Run pipeline on the configured Jenkins slave
    }

    environment {
        DEPLOY_PATH = "/var/www/html/demoproject"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'Satheeshkumaresh_github_access', url: 'https://github.com/satheeshkumaresh/mydemo_project.git'
            }
        }

        stage('Build') {
            steps {
                sh 'echo "Building the application..."'
                // Add your build commands here (e.g., npm install, mvn package)
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    cd ${DEPLOY_PATH}
                    git pull origin main
                    git branch
                    """
            }
        }
    }
}
