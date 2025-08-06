# ☁️ GUÍA COMPLETA DE DESPLIEGUE EN LA NUBE
## Azure, AWS, Google Cloud, Docker, Kubernetes y Más

---

## 📋 **INTRODUCCIÓN AL DESPLIEGUE EN LA NUBE**

El despliegue en la nube es fundamental para aplicaciones modernas. Esta guía cubre las principales plataformas y herramientas de despliegue.

### **🎯 Plataformas Cubiertas:**
- **Microsoft Azure** - Servicios cloud de Microsoft
- **Amazon Web Services (AWS)** - Plataforma cloud líder
- **Google Cloud Platform (GCP)** - Servicios de Google
- **Docker** - Containerización
- **Kubernetes** - Orquestación de contenedores
- **Heroku** - Plataforma como servicio
- **Vercel** - Despliegue frontend
- **Netlify** - Hosting estático

---

## 🐳 **DOCKER - CONTAINERIZACIÓN**

### **1. Configuración Básica de Docker**

```dockerfile
# Dockerfile para aplicación React
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile para backend Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
```

### **2. Docker Compose para Aplicación Completa**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  # Redis para caché
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # Backend API
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/mern-app?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
      CLIENT_URL: http://localhost:3000
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network
    restart: unless-stopped

  # Frontend React
  frontend:
    build: ./client
    ports:
      - "3000:80"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - app-network
    restart: unless-stopped

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - app-network
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### **3. Scripts de Docker**

```bash
#!/bin/bash
# deploy.sh - Script de despliegue con Docker

echo "🚀 Iniciando despliegue..."

# Construir imágenes
echo "📦 Construyendo imágenes Docker..."
docker-compose build

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Iniciar servicios
echo "▶️ Iniciando servicios..."
docker-compose up -d

# Verificar estado
echo "🔍 Verificando estado de servicios..."
docker-compose ps

# Mostrar logs
echo "📋 Logs de servicios:"
docker-compose logs --tail=50

echo "✅ Despliegue completado!"
```

---

## ☸️ **KUBERNETES - ORQUESTACIÓN**

### **1. Configuración de Kubernetes**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: mern-app
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: mern-app
data:
  NODE_ENV: "production"
  CLIENT_URL: "https://app.example.com"
  MONGODB_URI: "mongodb://mongodb-service:27017/mern-app"
  REDIS_URL: "redis://redis-service:6379"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: mern-app
type: Opaque
data:
  JWT_SECRET: eW91ci1zZWNyZXQta2V5 # base64 encoded
  MONGODB_PASSWORD: cGFzc3dvcmQ= # base64 encoded
```

### **2. Deployments**

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: mern-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/mern-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        - name: MONGODB_URI
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: MONGODB_URI
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: mern-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/mern-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "https://api.example.com"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

### **3. Services**

```yaml
# k8s/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: mern-app
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: mern-app
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

### **4. Ingress**

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: mern-app
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - app.example.com
    - api.example.com
    secretName: app-tls
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

### **5. Scripts de Kubernetes**

```bash
#!/bin/bash
# k8s-deploy.sh

echo "🚀 Desplegando en Kubernetes..."

# Crear namespace
kubectl apply -f k8s/namespace.yaml

# Aplicar configuraciones
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Desplegar aplicaciones
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Crear servicios
kubectl apply -f k8s/services.yaml

# Configurar ingress
kubectl apply -f k8s/ingress.yaml

# Verificar estado
echo "🔍 Verificando estado..."
kubectl get pods -n mern-app
kubectl get services -n mern-app
kubectl get ingress -n mern-app

echo "✅ Despliegue en Kubernetes completado!"
```

---

## ☁️ **MICROSOFT AZURE**

### **1. Azure Container Instances (ACI)**

```yaml
# azure/aci-deployment.yaml
apiVersion: 2019-12-01
location: eastus
name: mern-backend
properties:
  containers:
  - name: backend
    properties:
      image: your-registry.azurecr.io/mern-backend:latest
      ports:
      - port: 5000
      environmentVariables:
      - name: NODE_ENV
        value: "production"
      - name: MONGODB_URI
        value: "mongodb://your-mongodb-connection-string"
      resources:
        requests:
          cpu: 1.0
          memoryInGB: 1.5
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: 5000
```

### **2. Azure Kubernetes Service (AKS)**

```bash
#!/bin/bash
# azure-aks-deploy.sh

# Crear grupo de recursos
az group create --name mern-app-rg --location eastus

# Crear cluster AKS
az aks create \
  --resource-group mern-app-rg \
  --name mern-app-cluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Obtener credenciales
az aks get-credentials --resource-group mern-app-rg --name mern-app-cluster

# Desplegar aplicación
kubectl apply -f k8s/

echo "✅ Aplicación desplegada en AKS!"
```

### **3. Azure App Service**

```json
// azure/app-service-config.json
{
  "name": "mern-backend-app",
  "type": "Microsoft.Web/sites",
  "apiVersion": "2021-02-01",
  "location": "East US",
  "properties": {
    "serverFarmId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Web/serverfarms/{app-service-plan}",
    "siteConfig": {
      "nodeVersion": "18.x",
      "appSettings": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "MONGODB_URI",
          "value": "@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/mongodb-uri/)"
        },
        {
          "name": "JWT_SECRET",
          "value": "@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/jwt-secret/)"
        }
      ],
      "linuxFxVersion": "NODE|18-lts"
    }
  }
}
```

### **4. Azure DevOps Pipeline**

```yaml
# azure-pipelines.yml
trigger:
- main

variables:
  dockerRegistryServiceConnection: 'your-acr-service-connection'
  imageRepository: 'mern-backend'
  containerRegistry: 'your-registry.azurecr.io'
  dockerfilePath: '**/Dockerfile'
  tag: '$(Build.BuildId)'

stages:
- stage: Build
  displayName: 'Build and Push'
  jobs:
  - job: Build
    displayName: 'Build'
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: 'Build and push image to container registry'
      inputs:
        command: 'buildAndPush'
        repository: '$(imageRepository)'
        dockerfile: '$(dockerfilePath)'
        containerRegistry: '$(dockerRegistryServiceConnection)'
        tags: |
          $(tag)
          latest

- stage: Deploy
  displayName: 'Deploy to AKS'
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: 'Deploy to AKS'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: KubernetesManifest@0
            displayName: 'Deploy to Kubernetes cluster'
            inputs:
              action: 'deploy'
              kubernetesServiceConnection: 'your-aks-service-connection'
              namespace: 'mern-app'
              manifests: 'k8s/*.yaml'
              containers: '$(containerRegistry)/$(imageRepository):$(tag)'
```

---

## 🌩️ **AMAZON WEB SERVICES (AWS)**

### **1. AWS ECS (Elastic Container Service)**

```json
// aws/ecs-task-definition.json
{
  "family": "mern-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/mern-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:mongodb-uri"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mern-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### **2. AWS EKS (Elastic Kubernetes Service)**

```bash
#!/bin/bash
# aws-eks-deploy.sh

# Crear cluster EKS
eksctl create cluster \
  --name mern-app-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# Configurar kubectl
aws eks update-kubeconfig --region us-east-1 --name mern-app-cluster

# Desplegar aplicación
kubectl apply -f k8s/

echo "✅ Aplicación desplegada en EKS!"
```

### **3. AWS Lambda con API Gateway**

```javascript
// aws/lambda/handler.js
const AWS = require('aws-sdk');
const mongoose = require('mongoose');

// Configurar MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    
    // Manejar diferentes rutas
    switch (path) {
      case '/api/users':
        if (httpMethod === 'GET') {
          return await getUsers();
        } else if (httpMethod === 'POST') {
          return await createUser(JSON.parse(body));
        }
        break;
      
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not Found' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};

async function getUsers() {
  const users = await User.find().select('-password');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(users)
  };
}

async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(user)
  };
}
```

### **4. AWS CodePipeline**

```yaml
# aws/buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Writing image definitions file...
      - printf '[{"name":"backend","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
  files: imagedefinitions.json
```

---

## ☁️ **GOOGLE CLOUD PLATFORM (GCP)**

### **1. Google Kubernetes Engine (GKE)**

```bash
#!/bin/bash
# gcp-gke-deploy.sh

# Crear cluster GKE
gcloud container clusters create mern-app-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-medium \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10

# Obtener credenciales
gcloud container clusters get-credentials mern-app-cluster --zone us-central1-a

# Desplegar aplicación
kubectl apply -f k8s/

echo "✅ Aplicación desplegada en GKE!"
```

### **2. Google Cloud Run**

```yaml
# gcp/cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: mern-backend
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/PROJECT_ID/mern-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
```

### **3. Google Cloud Build**

```yaml
# gcp/cloudbuild.yaml
steps:
  # Construir imagen de backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mern-backend:$COMMIT_SHA', './server']
  
  # Construir imagen de frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mern-frontend:$COMMIT_SHA', './client']
  
  # Push de imágenes
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mern-backend:$COMMIT_SHA']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mern-frontend:$COMMIT_SHA']
  
  # Desplegar en Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'mern-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/mern-backend:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/mern-backend:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/mern-frontend:$COMMIT_SHA'
```

---

## 🚀 **PLATAFORMAS COMO SERVICIO (PaaS)**

### **1. Heroku**

```json
// heroku/app.json
{
  "name": "mern-app",
  "description": "MERN Stack Application",
  "repository": "https://github.com/your-username/mern-app",
  "logo": "https://node-js-sample.herokuapp.com/node.png",
  "keywords": ["node", "express", "react", "mongodb"],
  "env": {
    "NODE_ENV": {
      "description": "Environment",
      "value": "production"
    },
    "MONGODB_URI": {
      "description": "MongoDB connection string",
      "required": true
    },
    "JWT_SECRET": {
      "description": "JWT secret key",
      "generator": "secret"
    }
  },
  "formation": {
    "web": {
      "quantity": 1,
      "size": "basic"
    }
  },
  "addons": [
    {
      "plan": "mongolab:sandbox"
    },
    {
      "plan": "heroku-redis:hobby-dev"
    }
  ],
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
```

```bash
#!/bin/bash
# heroku-deploy.sh

# Login a Heroku
heroku login

# Crear aplicación
heroku create mern-app-backend

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Desplegar
git push heroku main

# Abrir aplicación
heroku open

echo "✅ Aplicación desplegada en Heroku!"
```

### **2. Vercel (Frontend)**

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-api.herokuapp.com"
  }
}
```

### **3. Netlify**

```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  REACT_APP_API_URL = "https://your-backend-api.herokuapp.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  REACT_APP_API_URL = "https://your-production-api.com"

[context.deploy-preview.environment]
  REACT_APP_API_URL = "https://your-staging-api.com"
```

---

## 🔧 **CI/CD PIPELINES**

### **1. GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker images
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./server/Dockerfile
        push: true
        tags: your-username/mern-backend:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

### **2. GitLab CI/CD**

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
    - npm run lint

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA ./server
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
    - curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    - chmod +x ./kubectl
  script:
    - ./kubectl apply -f k8s/
  only:
    - main
```

---

## 📊 **MONITOREO Y LOGGING**

### **1. Prometheus y Grafana**

```yaml
# monitoring/prometheus-config.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'mern-backend'
    static_configs:
      - targets: ['backend-service:5000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

### **2. ELK Stack (Elasticsearch, Logstash, Kibana)**

```yaml
# logging/elk-stack.yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

---

## 🔒 **SEGURIDAD Y COMPLIANCE**

### **1. HTTPS y Certificados SSL**

```yaml
# security/ssl-certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-certificate
  namespace: mern-app
spec:
  secretName: app-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - app.example.com
  - api.example.com
```

### **2. Network Policies**

```yaml
# security/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: mern-app
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: mern-app
    ports:
    - protocol: TCP
      port: 5000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: mern-app
    ports:
    - protocol: TCP
      port: 27017
```

---

## 🎯 **MEJORES PRÁCTICAS DE DESPLIEGUE**

### **✅ Seguridad:**
1. **Usar secrets management** para credenciales
2. **Implementar HTTPS** en todas las comunicaciones
3. **Configurar network policies** en Kubernetes
4. **Escanear vulnerabilidades** en imágenes Docker
5. **Rotar credenciales** regularmente
6. **Implementar RBAC** en Kubernetes

### **✅ Performance:**
1. **Usar CDN** para assets estáticos
2. **Implementar caching** en múltiples niveles
3. **Optimizar imágenes** Docker
4. **Configurar autoscaling** apropiadamente
5. **Monitorear métricas** de rendimiento
6. **Usar load balancing** efectivo

### **✅ Escalabilidad:**
1. **Diseñar para escalar horizontalmente**
2. **Usar microservicios** cuando sea apropiado
3. **Implementar circuit breakers**
4. **Configurar health checks**
5. **Usar message queues** para tareas pesadas
6. **Implementar graceful shutdown**

### **✅ Observabilidad:**
1. **Logging estructurado** con niveles apropiados
2. **Métricas de aplicación** y infraestructura
3. **Tracing distribuido** para microservicios
4. **Alertas proactivas** para problemas
5. **Dashboards** para monitoreo en tiempo real
6. **Documentación** de arquitectura y despliegue

---

*¡Esta guía te proporciona todo lo necesario para desplegar aplicaciones modernas en cualquier plataforma cloud!* ☁️🚀✨ 