# Guía Completa de Despliegue en la Nube - Mesio

## Resumen Ejecutivo

Esta guía proporciona instrucciones detalladas para desplegar la aplicación Mesio en diferentes plataformas de nube, incluyendo **Vercel**, **AWS**, **Google Cloud Platform**, **Azure** y **Docker**. Cada plataforma incluye configuraciones optimizadas para producción, monitoreo y escalabilidad.

## 1. Despliegue en Vercel (Recomendado para Next.js)

### 1.1 Configuración Inicial

#### Preparación del Proyecto
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login

# Configurar variables de entorno
cp .env.example .env.production
```

#### Variables de Entorno (.env.production)
```env
# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=https://mesio.vercel.app
NEXT_PUBLIC_API_URL=https://api.mesio.com

# Base de datos
DATABASE_URL=postgresql://username:password@host:port/database

# Autenticación
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://mesio.vercel.app

# PWA
NEXT_PUBLIC_PWA_ENABLED=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your-segment-key
```

#### Configuración de Vercel (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 1.2 Proceso de Despliegue

#### Despliegue Automático con Git
```bash
# Conectar repositorio a Vercel
vercel --prod

# Configurar GitHub Actions para CI/CD
mkdir -p .github/workflows
```

#### GitHub Actions Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
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
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### 1.3 Optimizaciones de Vercel

#### Configuración de Next.js para Vercel
```typescript
// next.config.ts - Optimizado para Vercel
import type {NextConfig} from 'next';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimizaciones para Vercel
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Configuración de imágenes
  images: {
    domains: ['mesio-next-js-pwa.vercel.app', 'api.mesio.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirecciones
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
```

## 2. Despliegue en AWS

### 2.1 Configuración de Infraestructura

#### AWS CDK Stack (infrastructure/app-stack.ts)
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MesioStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC para la aplicación
    const vpc = new ec2.Vpc(this, 'MesioVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Base de datos RDS
    const database = new rds.DatabaseInstance(this, 'MesioDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      databaseName: 'mesio',
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
    });

    // Bucket S3 para assets estáticos
    const assetsBucket = new s3.Bucket(this, 'MesioAssets', {
      bucketName: 'mesio-assets',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'MesioDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(assetsBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin('api.mesio.com'),
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Lambda para SSR
    const ssrFunction = new lambda.Function(this, 'MesioSSRFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DATABASE_URL: database.instanceEndpoint.hostname,
        NODE_ENV: 'production',
      },
      vpc,
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'MesioAPI', {
      restApiName: 'Mesio API',
      description: 'API para la aplicación Mesio',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
      description: 'RDS Database Endpoint',
    });
  }
}
```

#### Dockerfile para AWS
```dockerfile
# Dockerfile.aws
FROM node:18-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos construidos
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 Despliegue con AWS CLI

#### Script de Despliegue (deploy-aws.sh)
```bash
#!/bin/bash

# Configuración
STACK_NAME="mesio-stack"
REGION="us-east-1"
BUCKET_NAME="mesio-deployment-bucket"

echo "🚀 Iniciando despliegue de Mesio en AWS..."

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    exit 1
fi

# Verificar CDK
if ! command -v cdk &> /dev/null; then
    echo "❌ AWS CDK no está instalado"
    exit 1
fi

# Crear bucket de despliegue si no existe
echo "📦 Creando bucket de despliegue..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || echo "Bucket ya existe"

# Bootstrap CDK
echo "🔧 Configurando CDK..."
cdk bootstrap aws://$ACCOUNT_ID/$REGION

# Construir la aplicación
echo "🏗️ Construyendo la aplicación..."
npm run build

# Desplegar stack
echo "🚀 Desplegando stack..."
cdk deploy --require-approval never

# Obtener outputs
echo "📊 Obteniendo información del despliegue..."
aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs' \
    --output table

echo "✅ Despliegue completado exitosamente!"
```

## 3. Despliegue en Google Cloud Platform

### 3.1 Configuración de Cloud Run

#### Dockerfile para GCP
```dockerfile
# Dockerfile.gcp
FROM node:18-alpine AS base

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instalar dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copiar archivos construidos
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["yarn", "start"]
```

#### Cloud Run Service (cloud-run.yaml)
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: mesio-app
  annotations:
    run.googleapis.com/ingress: all
    run.googleapis.com/allow-unauthenticated: "true"
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/PROJECT_ID/mesio-app:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "2"
            memory: "2Gi"
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: mesio-db-secret
              key: database-url
        - name: NEXT_PUBLIC_APP_URL
          value: "https://mesio-app-xxxxx-uc.a.run.app"
```

### 3.2 Despliegue con Google Cloud CLI

#### Script de Despliegue (deploy-gcp.sh)
```bash
#!/bin/bash

# Configuración
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="mesio-app"
IMAGE_NAME="gcr.io/$PROJECT_ID/mesio-app"

echo "🚀 Iniciando despliegue de Mesio en Google Cloud..."

# Verificar gcloud CLI
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI no está instalado"
    exit 1
fi

# Configurar proyecto
echo "🔧 Configurando proyecto..."
gcloud config set project $PROJECT_ID

# Habilitar APIs necesarias
echo "🔌 Habilitando APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Construir y subir imagen
echo "🏗️ Construyendo imagen Docker..."
gcloud builds submit --tag $IMAGE_NAME

# Desplegar en Cloud Run
echo "🚀 Desplegando en Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --timeout 300

# Obtener URL del servicio
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)')

echo "✅ Despliegue completado!"
echo "🌐 URL del servicio: $SERVICE_URL"
```

## 4. Despliegue en Azure

### 4.1 Configuración de Azure App Service

#### Dockerfile para Azure
```dockerfile
# Dockerfile.azure
FROM node:18-alpine AS base

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instalar dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copiar archivos construidos
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["yarn", "start"]
```

#### Azure App Service Configuration (azure-deploy.yml)
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
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
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'mesio-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

### 4.2 Despliegue con Azure CLI

#### Script de Despliegue (deploy-azure.sh)
```bash
#!/bin/bash

# Configuración
RESOURCE_GROUP="mesio-rg"
APP_NAME="mesio-app"
LOCATION="eastus"
PLAN_NAME="mesio-plan"

echo "🚀 Iniciando despliegue de Mesio en Azure..."

# Verificar Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI no está instalado"
    exit 1
fi

# Login en Azure
echo "🔐 Iniciando sesión en Azure..."
az login

# Crear grupo de recursos
echo "📦 Creando grupo de recursos..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Crear plan de App Service
echo "📋 Creando plan de App Service..."
az appservice plan create \
    --name $PLAN_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku B1 \
    --is-linux

# Crear aplicación web
echo "🌐 Creando aplicación web..."
az webapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $PLAN_NAME \
    --deployment-local-git

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
    NODE_ENV=production \
    PORT=8080

# Configurar Docker
echo "🐳 Configurando Docker..."
az webapp config container set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --docker-custom-image-name mesio-app:latest

# Obtener URL de la aplicación
APP_URL=$(az webapp show \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --query "defaultHostName" \
    --output tsv)

echo "✅ Despliegue completado!"
echo "🌐 URL de la aplicación: https://$APP_URL"
```

## 5. Despliegue con Docker

### 5.1 Configuración Multi-Stage

#### Dockerfile Optimizado
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN yarn build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Cambiar propietario
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  mesio-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/mesio
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - mesio-network

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=mesio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - mesio-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - mesio-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - mesio-app
    networks:
      - mesio-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  mesio-network:
    driver: bridge
```

### 5.2 Nginx Configuration

#### Nginx Reverse Proxy (nginx.conf)
```nginx
events {
    worker_connections 1024;
}

http {
    upstream mesio_app {
        server mesio-app:3000;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name localhost;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";

        # Static files caching
        location /_next/static/ {
            alias /app/.next/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://mesio_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://mesio_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Main application
        location / {
            proxy_pass http://mesio_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## 6. Monitoreo y Observabilidad

### 6.1 Configuración de Logging

#### Winston Logger (lib/logger.ts)
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mesio-app' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 6.2 Health Checks

#### Health Check Endpoint (app/api/health/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/database';
import { checkRedisConnection } from '@/lib/redis';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Verificar conexión a base de datos
    const dbStatus = await checkDatabaseConnection();
    
    // Verificar conexión a Redis
    const redisStatus = await checkRedisConnection();
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };
    
    const isHealthy = dbStatus.status === 'healthy' && redisStatus.status === 'healthy';
    
    return NextResponse.json(health, {
      status: isHealthy ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 503,
    });
  }
}
```

## 7. CI/CD Pipeline Completo

### 7.1 GitHub Actions Workflow Completo

#### Workflow Principal (.github/workflows/main.yml)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

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
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Build application
      run: npm run build

  security:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level moderate
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

  build-and-push:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=sha
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Implementar lógica de despliegue a staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment..."
        # Implementar lógica de despliegue a producción
```

## 8. Configuración de Monitoreo

### 8.1 Sentry para Error Tracking

#### Configuración de Sentry (lib/sentry.ts)
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'mesio.com'],
    }),
  ],
});

export default Sentry;
```

### 8.2 Métricas de Performance

#### Web Vitals Tracking (lib/web-vitals.ts)
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  const { name, value, id } = metric;
  
  // Enviar a Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
  
  // Enviar a Sentry
  if (typeof Sentry !== 'undefined') {
    Sentry.metrics.increment('web_vitals', {
      tags: { metric: name },
      value: value,
    });
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

## 9. Checklist de Despliegue

### 9.1 Pre-Despliegue
- [ ] Ejecutar todas las pruebas unitarias
- [ ] Ejecutar pruebas de integración
- [ ] Verificar cobertura de código (>80%)
- [ ] Ejecutar análisis de seguridad
- [ ] Verificar variables de entorno
- [ ] Construir aplicación en modo producción
- [ ] Verificar tamaño del bundle

### 9.2 Despliegue
- [ ] Crear backup de la base de datos
- [ ] Desplegar en ambiente de staging
- [ ] Ejecutar pruebas de smoke
- [ ] Verificar health checks
- [ ] Desplegar en producción
- [ ] Verificar funcionalidad crítica
- [ ] Monitorear métricas de performance

### 9.3 Post-Despliegue
- [ ] Verificar logs de error
- [ ] Monitorear métricas de usuario
- [ ] Verificar alertas de monitoreo
- [ ] Documentar cambios realizados
- [ ] Actualizar documentación de usuario

## Conclusión

Esta guía completa de despliegue en la nube proporciona todas las herramientas y configuraciones necesarias para desplegar Mesio en cualquier plataforma de nube principal. 

**Recomendaciones:**
- **Vercel**: Para desarrollo rápido y despliegues automáticos
- **AWS**: Para aplicaciones empresariales con alta escalabilidad
- **Google Cloud**: Para integración con servicios de ML/AI
- **Azure**: Para empresas que ya usan el ecosistema Microsoft
- **Docker**: Para control total sobre la infraestructura

Cada plataforma incluye configuraciones optimizadas para producción, monitoreo integral y pipelines de CI/CD robustos que aseguran despliegues confiables y mantenibles.
