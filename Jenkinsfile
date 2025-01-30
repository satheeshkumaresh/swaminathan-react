pipeline {
    agent {
        label 'jenkins_server'  // Run pipeline on the configured Jenkins node
    }

    environment {
        WORKSPACE_PATH = "/opt/jenkins/workspace/React_Deploy"
        DEPLOY_PATH = "/var/www/html/New-React"
    }

    stages {
        stage('Checkout Code') {
            steps {
                dir("${WORKSPACE_PATH}") {
                    git branch: 'master', 
                        credentialsId: 'Satheeshkumaresh_github_access', 
                        url: 'https://github.com/satheeshkumaresh/swaminathan-react.git'
                }
            }
        }

        stage('Deployment Started') {
            steps {
                sh 'echo "Starting the deployment process..."'
            }
        }

        stage('Code Pull') {
            steps {
                dir("${WORKSPACE_PATH}") {
                    withCredentials([usernamePassword(credentialsId: 'Satheeshkumaresh_github_access', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                            git reset --hard HEAD  # Avoid merge conflicts
                            git clean -fd          # Remove untracked files
                            git pull https://${GIT_USER}:${GIT_PASS}@github.com/satheeshkumaresh/swaminathan-react.git development
                            git branch
                        """
                    }
                }
            }
        }

        stage('Sync Code to master Directory') {
            steps {
                sh """
                    rsync -av --delete ${WORKSPACE_PATH}/ ${DEPLOY_PATH}/
                """
            }
        }
    }
}
