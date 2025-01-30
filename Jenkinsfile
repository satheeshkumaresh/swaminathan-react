pipeline {
    agent {
        label 'jenkins_server'
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

        stage('code pull') {
            steps {
                sh """
                    cd ${DEPLOY_PATH}
                    git pull origin master
                    git branch
                    """
            }
        }

        stage('Build') {
            steps {
                dir("${DEPLOY_PATH}") {
                    sh """
                        yarn install 
                        yarn build
                    """
                }
            }
        }
    }
}
