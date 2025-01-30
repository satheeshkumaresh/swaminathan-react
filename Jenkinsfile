pipeline {
    agent {
        label 'jenkins_server'  // Run pipeline on the configured Jenkins slave
    }

    environment {
        DEPLOY_PATH = "/var/www/html/New-React"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', credentialsId: 'Satheeshkumaresh_github_access', url: 'https://github.com/satheeshkumaresh/swaminathan-react.git'
            }
        }

        stage('Deployment started') {
            steps {
                sh 'echo "Starting the application..."'
            }
        }

        stage('Code Pull') {
            steps {
                dir("${DEPLOY_PATH}") {
                    sh """
                        git pull origin development
                        git branch
                    """
                }
            }
        }
    }
}
