pipeline {
agent any

```
stages {

    stage('Hello') {
        steps {
            echo 'Hello from Jenkins!'
        }
    }

    stage('Checkout') {
        steps {
            echo 'GitHub repository checked out successfully'
        }
    }

    stage('Docker Test') {
        steps {
            sh 'docker version'
            sh 'docker ps'
            sh 'docker-compose version'
        }
    }

    stage('Build') {
        steps {
            echo 'Building CreditDebitNote application...'
            sh 'docker-compose build'
        }
    }

    stage('Test') {
        steps {
            echo 'Running tests...'
        }
    }
}
```

}
