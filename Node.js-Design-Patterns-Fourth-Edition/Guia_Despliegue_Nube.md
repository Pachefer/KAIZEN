# Guía de Despliegue en la Nube - Node.js Design Patterns

## 🚀 Introducción al Despliegue en la Nube

Esta guía cubre el despliegue de aplicaciones Node.js que implementan patrones de diseño en diferentes plataformas cloud, incluyendo configuración, CI/CD, monitoreo y escalabilidad.

## 1. Preparación del Proyecto

### 1.1 Estructura del Proyecto

```bash
proyecto-nodejs/
├── src/
│   ├── patterns/
│   │   ├── creational/
│   │   ├── structural/
│   │   ├── behavioral/
│   │   └── advanced/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── tests/
├── config/
├── scripts/
├── docker/
├── kubernetes/
├── terraform/
├── .github/
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### 1.2 Configuración de Entorno

```bash
# .env.example
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### 1.3 Scripts de Package.json

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "npm run clean && npm run compile",
    "compile": "babel src -d dist",
    "clean": "rimraf dist",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "docker:build": "docker build -t nodejs-patterns .",
    "docker:run": "docker run -p 3000:3000 nodejs-patterns",
    "deploy:staging": "npm run build && npm run deploy:staging:upload",
    "deploy:production": "npm run build && npm run deploy:production:upload"
  }
}
```

## 2. Dockerización

### 2.1 Dockerfile Multi-Stage

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Etapa de build
FROM base AS builder

# Instalar dependencias de desarrollo
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias y código compilado
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["npm", "start"]
```

### 2.2 Docker Compose para Desarrollo

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/nodejs_patterns
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./src:/app/src
      - ./tests:/app/tests
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nodejs_patterns
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 2.3 Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app_servers {
        server app:3000;
        # Agregar más instancias para load balancing
        # server app2:3000;
        # server app3:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 3. Despliegue en AWS

### 3.1 Configuración de AWS CLI

```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciales
aws configure
# AWS Access Key ID: [TU_ACCESS_KEY]
# AWS Secret Access Key: [TU_SECRET_KEY]
# Default region name: us-east-1
# Default output format: json
```

### 3.2 ECS (Elastic Container Service)

```yaml
# aws/ecs-task-definition.json
{
  "family": "nodejs-patterns",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "nodejs-patterns",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/nodejs-patterns:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nodejs-patterns",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

### 3.3 ECR (Elastic Container Registry)

```bash
# Crear repositorio ECR
aws ecr create-repository --repository-name nodejs-patterns

# Autenticarse con ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Taggear imagen
docker tag nodejs-patterns:latest ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/nodejs-patterns:latest

# Subir imagen
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/nodejs-patterns:latest
```

### 3.4 RDS (Relational Database Service)

```bash
# Crear instancia RDS
aws rds create-db-instance \
  --db-instance-identifier nodejs-patterns-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password PASSWORD123 \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --multi-az \
  --deletion-protection
```

## 4. Despliegue en Google Cloud Platform

### 4.1 Configuración de GCP

```bash
# Instalar Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Inicializar proyecto
gcloud init
gcloud config set project YOUR_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

### 4.2 Cloud Run

```yaml
# gcp/cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: nodejs-patterns
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
      - image: gcr.io/YOUR_PROJECT_ID/nodejs-patterns:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4.3 Cloud Build

```yaml
# gcp/cloudbuild.yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/nodejs-patterns:$COMMIT_SHA', '.']
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$PROJECT_ID/nodejs-patterns:$COMMIT_SHA']
- name: 'gcr.io/cloud-builders/docker'
  args: ['tag', 'gcr.io/$PROJECT_ID/nodejs-patterns:$COMMIT_SHA', 'gcr.io/$PROJECT_ID/nodejs-patterns:latest']
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/$PROJECT_ID/nodejs-patterns:latest']
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
  - 'run'
  - 'deploy'
  - 'nodejs-patterns'
  - '--image'
  - 'gcr.io/$PROJECT_ID/nodejs-patterns:$COMMIT_SHA'
  - '--region'
  - 'us-central1'
  - '--platform'
  - 'managed'
  - '--allow-unauthenticated'
images:
- 'gcr.io/$PROJECT_ID/nodejs-patterns:$COMMIT_SHA'
- 'gcr.io/$PROJECT_ID/nodejs-patterns:latest'
```

## 5. Despliegue en Azure

### 5.1 Azure Container Instances

```bash
# Instalar Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login a Azure
az login

# Crear grupo de recursos
az group create --name nodejs-patterns-rg --location eastus

# Crear instancia de contenedor
az container create \
  --resource-group nodejs-patterns-rg \
  --name nodejs-patterns \
  --image YOUR_REGISTRY/nodejs-patterns:latest \
  --dns-name-label nodejs-patterns \
  --ports 3000 \
  --environment-variables NODE_ENV=production PORT=3000
```

### 5.2 Azure Container Registry

```bash
# Crear registro de contenedores
az acr create --resource-group nodejs-patterns-rg \
  --name nodejspatternsregistry --sku Basic

# Login al registro
az acr login --name nodejspatternsregistry

# Taggear y subir imagen
docker tag nodejs-patterns:latest nodejspatternsregistry.azurecr.io/nodejs-patterns:latest
docker push nodejspatternsregistry.azurecr.io/nodejs-patterns:latest
```

## 6. Kubernetes

### 6.1 Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-patterns
  labels:
    app: nodejs-patterns
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs-patterns
  template:
    metadata:
      labels:
        app: nodejs-patterns
    spec:
      containers:
      - name: nodejs-patterns
        image: nodejs-patterns:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
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
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: logs
        emptyDir: {}
```

### 6.2 Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nodejs-patterns-service
spec:
  selector:
    app: nodejs-patterns
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### 6.3 Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nodejs-patterns-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: tls-secret
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nodejs-patterns-service
            port:
              number: 80
```

## 7. CI/CD con GitHub Actions

### 7.1 Workflow de Despliegue

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
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
      run: npm run test:coverage
    
    - name: Run linting
      run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to ECR
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Deploy to ECS
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: aws/ecs-task-definition.json
        service: nodejs-patterns-service
        cluster: nodejs-patterns-cluster
        wait-for-service-stability: true
```

## 8. Monitoreo y Observabilidad

### 8.1 Health Check Endpoint

```javascript
// src/health.js
import { Router } from 'express'

const router = Router()

router.get('/health', async (req, res) => {
  try {
    // Verificar base de datos
    const dbStatus = await checkDatabase()
    
    // Verificar Redis
    const redisStatus = await checkRedis()
    
    // Verificar memoria
    const memoryUsage = process.memoryUsage()
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      redis: redisStatus,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      },
      version: process.env.npm_package_version || '1.0.0'
    }
    
    res.status(200).json(healthStatus)
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

async function checkDatabase() {
  try {
    // Implementar verificación de base de datos
    return { status: 'connected', responseTime: 5 }
  } catch (error) {
    return { status: 'disconnected', error: error.message }
  }
}

async function checkRedis() {
  try {
    // Implementar verificación de Redis
    return { status: 'connected', responseTime: 2 }
  } catch (error) {
    return { status: 'disconnected', error: error.message }
  }
}

export default router
```

### 8.2 Logging con Winston

```javascript
// src/utils/logger.js
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nodejs-patterns' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

### 8.3 Métricas con Prometheus

```javascript
// src/metrics.js
import prometheus from 'prom-client'

// Contadores
export const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'route', 'status']
})

export const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de requests HTTP',
  labelNames: ['method', 'route']
})

// Gauge para memoria
export const memoryUsage = new prometheus.Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Uso de memoria en bytes',
  labelNames: ['type']
})

// Función para actualizar métricas de memoria
export function updateMemoryMetrics() {
  const memUsage = process.memoryUsage()
  memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed)
  memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal)
  memoryUsage.set({ type: 'external' }, memUsage.external)
}

// Endpoint para métricas
export function getMetricsEndpoint(req, res) {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(prometheus.register.metrics())
}
```

## 9. Escalabilidad y Performance

### 9.1 Load Balancing

```javascript
// src/load-balancer.js
import cluster from 'cluster'
import os from 'os'

if (cluster.isMaster) {
  const numCPUs = os.cpus().length
  
  console.log(`Master ${process.pid} is running`)
  console.log(`Forking for ${numCPUs} CPUs`)
  
  // Crear workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    console.log('Starting a new worker...')
    cluster.fork()
  })
  
  // Monitorear workers
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`)
  })
  
} else {
  // Código del worker
  import('./server.js')
}
```

### 9.2 Caching con Redis

```javascript
// src/services/cache.js
import Redis from 'ioredis'

class CacheService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
    this.defaultTTL = 3600 // 1 hora
  }
  
  async get(key) {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Error getting from cache:', error)
      return null
    }
  }
  
  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error setting cache:', error)
      return false
    }
  }
  
  async del(key) {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Error deleting from cache:', error)
      return false
    }
  }
  
  async flush() {
    try {
      await this.redis.flushall()
      return true
    } catch (error) {
      console.error('Error flushing cache:', error)
      return false
    }
  }
}

export default new CacheService()
```

## 10. Seguridad

### 10.1 Helmet para Headers de Seguridad

```javascript
// src/middleware/security.js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

export const securityMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: 'Demasiados requests desde esta IP'
  })
]
```

### 10.2 Validación de Entrada

```javascript
// src/middleware/validation.js
import Joi from 'joi'

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.details.map(detail => detail.message)
      })
    }
    
    next()
  }
}

// Esquemas de validación
export const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).max(120)
})

export const productSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('electronics', 'clothing', 'books').required()
})
```

## 11. Scripts de Despliegue

### 11.1 Script de Despliegue Automatizado

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "Uso: ./deploy.sh <environment> <version>"
    echo "Ejemplo: ./deploy.sh production v1.2.0"
    exit 1
fi

echo "🚀 Iniciando despliegue a $ENVIRONMENT versión $VERSION"

# Build de la aplicación
echo "📦 Construyendo aplicación..."
npm run build

# Tests
echo "🧪 Ejecutando tests..."
npm run test:coverage

# Build de Docker
echo "🐳 Construyendo imagen Docker..."
docker build -t nodejs-patterns:$VERSION .

# Tag de la imagen
docker tag nodejs-patterns:$VERSION $REGISTRY_URL/nodejs-patterns:$VERSION
docker tag nodejs-patterns:$VERSION $REGISTRY_URL/nodejs-patterns:latest

# Push de la imagen
echo "📤 Subiendo imagen al registro..."
docker push $REGISTRY_URL/nodejs-patterns:$VERSION
docker push $REGISTRY_URL/nodejs-patterns:latest

# Despliegue según el entorno
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌍 Desplegando a producción..."
    kubectl set image deployment/nodejs-patterns nodejs-patterns=$REGISTRY_URL/nodejs-patterns:$VERSION
    kubectl rollout status deployment/nodejs-patterns
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🔍 Desplegando a staging..."
    kubectl set image deployment/nodejs-patterns-staging nodejs-patterns=$REGISTRY_URL/nodejs-patterns:$VERSION
    kubectl rollout status deployment/nodejs-patterns-staging
    
else
    echo "❌ Entorno no válido: $ENVIRONMENT"
    exit 1
fi

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Aplicación disponible en: $APP_URL"
```

### 11.2 Script de Rollback

```bash
#!/bin/bash
# scripts/rollback.sh

ENVIRONMENT=$1
PREVIOUS_VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$PREVIOUS_VERSION" ]; then
    echo "Uso: ./rollback.sh <environment> <previous-version>"
    echo "Ejemplo: ./rollback.sh production v1.1.0"
    exit 1
fi

echo "🔄 Iniciando rollback a versión $PREVIOUS_VERSION en $ENVIRONMENT"

if [ "$ENVIRONMENT" = "production" ]; then
    kubectl set image deployment/nodejs-patterns nodejs-patterns=$REGISTRY_URL/nodejs-patterns:$PREVIOUS_VERSION
    kubectl rollout status deployment/nodejs-patterns
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    kubectl set image deployment/nodejs-patterns-staging nodejs-patterns=$REGISTRY_URL/nodejs-patterns:$PREVIOUS_VERSION
    kubectl rollout status deployment/nodejs-patterns-staging
    
else
    echo "❌ Entorno no válido: $ENVIRONMENT"
    exit 1
fi

echo "✅ Rollback completado exitosamente!"
```

## 12. Monitoreo y Alertas

### 12.1 Configuración de Alertas

```yaml
# monitoring/alerts.yaml
groups:
- name: nodejs-patterns
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Alta tasa de errores HTTP 5xx"
      description: "La tasa de errores HTTP 5xx es {{ $value }} por segundo"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Tiempo de respuesta alto"
      description: "El 95% de las requests toman más de 2 segundos"

  - alert: HighMemoryUsage
    expr: (nodejs_memory_usage_bytes{type="heap_used"} / nodejs_memory_usage_bytes{type="heap_total"}) > 0.9
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Alto uso de memoria"
      description: "El uso de memoria heap está al {{ $value | humanizePercentage }}"
```

## 13. Resumen de Despliegue

### 13.1 Checklist de Despliegue

- [ ] **Preparación**
  - [ ] Tests pasando
  - [ ] Linting sin errores
  - [ ] Variables de entorno configuradas
  - [ ] Secrets y credenciales configurados

- [ ] **Build y Testing**
  - [ ] Build exitoso
  - [ ] Tests unitarios pasando
  - [ ] Tests de integración pasando
  - [ ] Coverage mínimo alcanzado

- [ ] **Docker**
  - [ ] Imagen construida correctamente
  - [ ] Imagen subida al registro
  - [ ] Health checks funcionando

- [ ] **Despliegue**
  - [ ] Despliegue exitoso
  - [ ] Health checks pasando
  - [ ] Métricas funcionando
  - [ ] Logs visibles

- [ ] **Post-Despliegue**
  - [ ] Monitoreo activo
  - [ ] Alertas configuradas
  - [ ] Backup configurado
  - [ ] Documentación actualizada

### 13.2 Comandos Útiles

```bash
# Ver logs en tiempo real
kubectl logs -f deployment/nodejs-patterns

# Escalar deployment
kubectl scale deployment nodejs-patterns --replicas=5

# Ver métricas
kubectl top pods

# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp

# Port forward para debugging
kubectl port-forward deployment/nodejs-patterns 3000:3000

# Ver configuración del deployment
kubectl describe deployment nodejs-patterns
```

Esta guía completa de despliegue en la nube proporciona todas las herramientas y configuraciones necesarias para desplegar aplicaciones Node.js con patrones de diseño en diferentes plataformas cloud, con enfoque en escalabilidad, seguridad y monitoreo.
