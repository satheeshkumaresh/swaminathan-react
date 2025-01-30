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

        stage('Code Pull') {
            steps {
                dir("${DEPLOY_PATH}") {
                    withCredentials([usernamePassword(credentialsId: 'Satheeshkumaresh_github_access', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                            git reset --hard HEAD  # Avoid merge conflicts
                            git clean -fd          # Remove untracked files
                            git pull https://${GIT_USER}:${GIT_PASS}@github.com/satheeshkumaresh/swaminathan-react.git master
                            git branch
                        """
                    }
                }
            }
        }
    }
}

