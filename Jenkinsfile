pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Cloning Git') {
      steps {
        git 'https://github.com/Murder-by-numberS/wowkeyb-be'
      }
    }
        
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }     

    stage('Fun Stage') {
      steps {
        sh 'echo fun'
      }
    }  
  }
}