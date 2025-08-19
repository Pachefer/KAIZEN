# 🔄 Guía Completa de DevOps - Entrevistas y Dominio

## 🎯 Introducción a DevOps

**DevOps** es una cultura y conjunto de prácticas que combina desarrollo de software (Dev) con operaciones de TI (Ops), automatizando y optimizando el proceso de entrega de software.

### 🌟 **¿Por qué DevOps?**

- **Entrega continua** - Despliegues rápidos y confiables
- **Colaboración** - Equipos de desarrollo y operaciones unidos
- **Automatización** - Reducción de errores humanos
- **Monitoreo** - Visibilidad completa del sistema
- **Escalabilidad** - Infraestructura como código

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Qué es CI/CD y cuáles son sus beneficios?**

**Respuesta Completa:**

**CI (Continuous Integration):**
- Integración automática de código
- Ejecución de pruebas automáticas
- Construcción automática de artefactos
- Detección temprana de errores

**CD (Continuous Delivery/Deployment):**
- Entrega automática a entornos de prueba
- Despliegue automático a producción
- Rollback automático en caso de fallos
- Entrega continua y confiable

```yaml
# Ejemplo de Pipeline CI/CD con GitHub Actions
# ===========================================

name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  DOCKER_IMAGE: 'mi-aplicacion'
  REGISTRY: 'ghcr.io'

jobs:
  # JOB 1: CI - Integración Continua
  ci:
    name: Continuous Integration
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Instalar dependencias
      run: npm ci
      
    - name: Linting
      run: npm run lint
      
    - name: Tests unitarios
      run: npm run test:unit
      
    - name: Tests de integración
      run: npm run test:integration
      
    - name: Coverage
      run: npm run test:coverage
      
    - name: Build
      run: npm run build
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-files
        path: dist/
        
  # JOB 2: Security Scan
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: ci
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
        
    - name: Run OWASP ZAP scan
      uses: zaproxy/action-full-scan@v0.8.0
      with:
        target: 'http://localhost:3000'
        
  # JOB 3: CD - Despliegue Continuo
  cd-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [ci, security]
    environment: staging
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
          ${{ env.REGISTRY }}/${{ github.repository }}:staging
        cache-from: type=gha
        cache-to: type=gha,mode=max
        
    - name: Deploy to staging
      run: |
        kubectl set image deployment/staging-app \
          app=${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
        
    - name: Run smoke tests
      run: |
        ./scripts/smoke-tests.sh staging
        
  # JOB 4: Deploy to Production
  cd-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: cd-staging
    environment: production
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout código
      uses: actions/checkout@v4
      
    - name: Deploy to production
      run: |
        kubectl set image deployment/production-app \
          app=${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
          
    - name: Run production tests
      run: |
        ./scripts/production-tests.sh
        
    - name: Notify team
      uses: 8398a7/action-slack@v3
      with:
        status: success
        channel: '#deployments'
        text: '🚀 Aplicación desplegada exitosamente en producción!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

# Pipeline de Jenkins (Jenkinsfile)
# =================================

pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'mi-aplicacion'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = 'docker.io/miusuario'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**/*'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
                sh 'snyk test'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh "kubectl set image deployment/staging-app app=${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh './scripts/wait-for-deployment.sh staging'
                sh './scripts/smoke-tests.sh staging'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: '¿Desplegar en producción?'
                sh "kubectl set image deployment/production-app app=${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh './scripts/wait-for-deployment.sh production'
                sh './scripts/production-tests.sh'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'Pipeline falló!'
            // Notificar al equipo
        }
    }
}
```

**Simulador de CI/CD:**

```javascript
// ci-cd-simulator.js
class CICDSimulator {
  constructor() {
    this.pipelines = new Map();
    this.deployments = new Map();
    this.testResults = new Map();
    this.stages = [
      'Checkout',
      'Install Dependencies',
      'Lint',
      'Test',
      'Build',
      'Security Scan',
      'Docker Build',
      'Deploy to Staging',
      'Deploy to Production'
    ];
  }

  // Crear pipeline CI/CD
  createPipeline(name, config) {
    const pipeline = {
      name: name,
      config: config,
      status: 'idle',
      currentStage: 0,
      startTime: null,
      endTime: null,
      stages: this.stages.map(stage => ({
        name: stage,
        status: 'pending',
        startTime: null,
        endTime: null,
        duration: 0,
        logs: []
      }))
    };

    this.pipelines.set(name, pipeline);
    console.log(`✅ Pipeline creado: ${name}`);
    
    return pipeline;
  }

  // Ejecutar pipeline
  async executePipeline(name) {
    const pipeline = this.pipelines.get(name);
    if (!pipeline) {
      console.log(`❌ Pipeline '${name}' no encontrado`);
      return false;
    }

    console.log(`🚀 Ejecutando pipeline: ${name}`);
    pipeline.status = 'running';
    pipeline.startTime = new Date();
    pipeline.currentStage = 0;

    // Ejecutar cada etapa
    for (let i = 0; i < pipeline.stages.length; i++) {
      const stage = pipeline.stages[i];
      stage.status = 'running';
      stage.startTime = new Date();

      console.log(`\n📋 Ejecutando etapa: ${stage.name}`);
      
      // Simular ejecución de la etapa
      const success = await this.executeStage(stage, pipeline.config);
      
      stage.endTime = new Date();
      stage.duration = (stage.endTime - stage.startTime) / 1000;
      
      if (success) {
        stage.status = 'success';
        console.log(`   ✅ ${stage.name} completado en ${stage.duration.toFixed(2)}s`);
        pipeline.currentStage = i + 1;
      } else {
        stage.status = 'failed';
        console.log(`   ❌ ${stage.name} falló en ${stage.duration.toFixed(2)}s`);
        pipeline.status = 'failed';
        pipeline.endTime = new Date();
        return false;
      }
    }

    // Pipeline completado exitosamente
    pipeline.status = 'success';
    pipeline.endTime = new Date();
    const totalDuration = (pipeline.endTime - pipeline.startTime) / 1000;
    
    console.log(`\n🎉 Pipeline '${name}' completado exitosamente en ${totalDuration.toFixed(2)}s`);
    return true;
  }

  // Ejecutar etapa individual
  async executeStage(stage, config) {
    const stageConfig = this.getStageConfig(stage.name, config);
    
    // Simular tiempo de ejecución
    const executionTime = stageConfig.baseTime + (Math.random() * stageConfig.variability);
    
    // Simular logs
    stage.logs.push(`Iniciando ${stage.name}...`);
    
    // Simular diferentes tipos de fallos
    const failureRate = stageConfig.failureRate || 0.05;
    const willFail = Math.random() < failureRate;
    
    if (willFail) {
      stage.logs.push(`Error en ${stage.name}: ${stageConfig.errorMessage || 'Error desconocido'}`);
      await this.sleep(executionTime * 1000);
      return false;
    }
    
    // Simular progreso
    for (let i = 0; i < 3; i++) {
      stage.logs.push(`${stage.name} en progreso... (${(i + 1) * 33}%)`);
      await this.sleep((executionTime * 1000) / 3);
    }
    
    stage.logs.push(`${stage.name} completado exitosamente`);
    return true;
  }

  // Configuración de etapas
  getStageConfig(stageName, config) {
    const defaultConfigs = {
      'Checkout': { baseTime: 2, variability: 1, failureRate: 0.01 },
      'Install Dependencies': { baseTime: 30, variability: 15, failureRate: 0.05 },
      'Lint': { baseTime: 10, variability: 5, failureRate: 0.02 },
      'Test': { baseTime: 45, variability: 20, failureRate: 0.08 },
      'Build': { baseTime: 60, variability: 30, failureRate: 0.03 },
      'Security Scan': { baseTime: 25, variability: 10, failureRate: 0.04 },
      'Docker Build': { baseTime: 90, variability: 45, failureRate: 0.06 },
      'Deploy to Staging': { baseTime: 30, variability: 15, failureRate: 0.07 },
      'Deploy to Production': { baseTime: 45, variability: 20, failureRate: 0.10 }
    };

    return { ...defaultConfigs[stageName], ...config[stageName] };
  }

  // Simular despliegue
  simulateDeployment(environment, imageTag) {
    console.log(`\n🚀 Desplegando en ${environment}...`);
    
    const deployment = {
      environment: environment,
      imageTag: imageTag,
      status: 'deploying',
      startTime: new Date(),
      replicas: 3,
      healthChecks: []
    };

    // Simular health checks
    for (let i = 0; i < deployment.replicas; i++) {
      deployment.healthChecks.push({
        pod: `pod-${i}`,
        status: 'starting',
        ready: false
      });
    }

    this.deployments.set(`${environment}-${imageTag}`, deployment);

    // Simular progreso del despliegue
    this.simulateDeploymentProgress(deployment);
    
    return deployment;
  }

  // Simular progreso del despliegue
  async simulateDeploymentProgress(deployment) {
    const stages = ['starting', 'running', 'ready'];
    
    for (let i = 0; i < deployment.replicas; i++) {
      for (let j = 0; j < stages.length; j++) {
        await this.sleep(2000 + Math.random() * 3000);
        
        deployment.healthChecks[i].status = stages[j];
        if (stages[j] === 'ready') {
          deployment.healthChecks[i].ready = true;
        }
        
        console.log(`   Pod ${i + 1}: ${stages[j]}`);
      }
    }

    // Verificar si todos los pods están listos
    const allReady = deployment.healthChecks.every(check => check.ready);
    
    if (allReady) {
      deployment.status = 'success';
      console.log(`✅ Despliegue en ${deployment.environment} completado exitosamente`);
    } else {
      deployment.status = 'failed';
      console.log(`❌ Despliegue en ${deployment.environment} falló`);
    }

    deployment.endTime = new Date();
  }

  // Ejecutar tests
  runTests(environment, testType) {
    console.log(`\n🧪 Ejecutando ${testType} en ${environment}...`);
    
    const testResult = {
      environment: environment,
      type: testType,
      startTime: new Date(),
      tests: [],
      summary: {}
    };

    // Simular diferentes tipos de tests
    switch (testType) {
      case 'smoke':
        testResult.tests = this.generateSmokeTests();
        break;
      case 'integration':
        testResult.tests = this.generateIntegrationTests();
        break;
      case 'e2e':
        testResult.tests = this.generateE2ETests();
        break;
      default:
        testResult.tests = this.generateBasicTests();
    }

    // Ejecutar tests
    testResult.tests.forEach(test => {
      test.status = Math.random() > 0.1 ? 'passed' : 'failed';
      test.duration = 0.5 + Math.random() * 2;
    });

    // Generar resumen
    const passed = testResult.tests.filter(t => t.status === 'passed').length;
    const total = testResult.tests.length;
    
    testResult.summary = {
      total: total,
      passed: passed,
      failed: total - passed,
      successRate: (passed / total) * 100
    };

    testResult.endTime = new Date();
    
    console.log(`   Tests ejecutados: ${total}`);
    console.log(`   Tests exitosos: ${passed}`);
    console.log(`   Tests fallidos: ${total - passed}`);
    console.log(`   Tasa de éxito: ${testResult.summary.successRate.toFixed(1)}%`);

    this.testResults.set(`${environment}-${testType}`, testResult);
    return testResult;
  }

  // Generar tests de humo
  generateSmokeTests() {
    return [
      { name: 'Homepage loads', description: 'Verificar que la página principal carga' },
      { name: 'Login form', description: 'Verificar que el formulario de login está presente' },
      { name: 'API health check', description: 'Verificar que la API responde' },
      { name: 'Database connection', description: 'Verificar conexión a base de datos' }
    ];
  }

  // Generar tests de integración
  generateIntegrationTests() {
    return [
      { name: 'User registration flow', description: 'Flujo completo de registro de usuario' },
      { name: 'Payment processing', description: 'Procesamiento de pagos' },
      { name: 'Email sending', description: 'Envío de emails' },
      { name: 'File upload', description: 'Subida de archivos' },
      { name: 'Search functionality', description: 'Funcionalidad de búsqueda' },
      { name: 'Data export', description: 'Exportación de datos' }
    ];
  }

  // Generar tests end-to-end
  generateE2ETests() {
    return [
      { name: 'Complete user journey', description: 'Viaje completo del usuario' },
      { name: 'Admin panel access', description: 'Acceso al panel de administración' },
      { name: 'Mobile responsiveness', description: 'Responsividad móvil' },
      { name: 'Cross-browser compatibility', description: 'Compatibilidad entre navegadores' },
      { name: 'Performance under load', description: 'Rendimiento bajo carga' }
    ];
  }

  // Generar tests básicos
  generateBasicTests() {
    return [
      { name: 'Basic functionality', description: 'Funcionalidad básica' },
      { name: 'Error handling', description: 'Manejo de errores' }
    ];
  }

  // Mostrar resumen del pipeline
  showPipelineSummary(name) {
    const pipeline = this.pipelines.get(name);
    if (!pipeline) {
      console.log(`❌ Pipeline '${name}' no encontrado`);
      return;
    }

    console.log(`\n📊 RESUMEN DEL PIPELINE: ${name}`);
    console.log('-'.repeat(50));
    
    console.log(`Estado: ${pipeline.status}`);
    console.log(`Tiempo total: ${pipeline.endTime ? 
      ((pipeline.endTime - pipeline.startTime) / 1000).toFixed(2) + 's' : 'En ejecución'}`);
    
    console.log('\n📋 ESTADOS DE LAS ETAPAS:');
    pipeline.stages.forEach((stage, index) => {
      const statusIcon = stage.status === 'success' ? '✅' : 
                        stage.status === 'failed' ? '❌' : 
                        stage.status === 'running' ? '🔄' : '⏳';
      
      console.log(`   ${statusIcon} ${stage.name}: ${stage.status}`);
      if (stage.duration > 0) {
        console.log(`      Duración: ${stage.duration.toFixed(2)}s`);
      }
    });

    // Estadísticas
    const successfulStages = pipeline.stages.filter(s => s.status === 'success').length;
    const totalStages = pipeline.stages.length;
    
    console.log(`\n📈 ESTADÍSTICAS:`);
    console.log(`   Etapas completadas: ${successfulStages}/${totalStages}`);
    console.log(`   Tasa de éxito: ${((successfulStages / totalStages) * 100).toFixed(1)}%`);
  }

  // Ejecutar demostración completa
  async runDemo() {
    console.log('🔄 SIMULADOR DE CI/CD');
    console.log('=' .repeat(60));
    
    // Crear pipeline
    console.log('\n🚀 CREANDO PIPELINE CI/CD...');
    
    const pipelineConfig = {
      'Test': { failureRate: 0.15 }, // 15% de fallo en tests
      'Security Scan': { failureRate: 0.20 }, // 20% de fallo en security scan
      'Deploy to Production': { failureRate: 0.25 } // 25% de fallo en producción
    };
    
    this.createPipeline('main-pipeline', pipelineConfig);
    
    // Ejecutar pipeline
    console.log('\n🔄 EJECUTANDO PIPELINE...');
    
    const success = await this.executePipeline('main-pipeline');
    
    if (success) {
      // Simular despliegue
      console.log('\n🚀 SIMULANDO DESPLIEGUE...');
      
      this.simulateDeployment('staging', 'v1.2.3');
      await this.sleep(5000);
      
      this.simulateDeployment('production', 'v1.2.3');
      await this.sleep(5000);
      
      // Ejecutar tests
      console.log('\n🧪 EJECUTANDO TESTS...');
      
      this.runTests('staging', 'smoke');
      this.runTests('staging', 'integration');
      this.runTests('production', 'e2e');
    }
    
    // Mostrar resumen
    this.showPipelineSummary('main-pipeline');
    
    console.log('\n🎉 Demostración completada!');
  }

  // Utilidad para sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar simulador
const cicdSimulator = new CICDSimulator();
cicdSimulator.runDemo();
```

---

### 🔴 **PREGUNTA 2: ¿Qué es Infrastructure as Code (IaC) y qué herramientas se usan?**

**Respuesta Completa:**

**Infrastructure as Code (IaC)** es la práctica de gestionar y aprovisionar infraestructura de computación a través de archivos de configuración en lugar de configuraciones manuales.

**Herramientas principales:**
- **Terraform** - Multi-cloud, declarativo
- **AWS CloudFormation** - AWS nativo, JSON/YAML
- **Ansible** - Configuración, orquestación
- **Chef/Puppet** - Configuración de servidores
- **Pulumi** - Programación general

```yaml
# Ejemplo de Infrastructure as Code
# =================================

# Terraform - Infraestructura multi-cloud
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "mi-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# VPC y Networking
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnets[count.index]
  availability_zone = var.availability_zones[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]
  
  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

# Security Groups
resource "aws_security_group" "web" {
  name_prefix = "${var.project_name}-web-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-web-sg"
  }
}

resource "aws_security_group" "database" {
  name_prefix = "${var.project_name}-db-"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-db-sg"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name = "${var.project_name}-ecs-cluster"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.app_cpu
  memory                   = var.app_memory
  
  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn
  
  container_definitions = jsonencode([
    {
      name  = "app"
      image = var.app_image
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
  
  tags = {
    Name = "${var.project_name}-task-def"
  }
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.web.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }
  
  depends_on = [aws_lb_listener.app]
  
  tags = {
    Name = "${var.project_name}-ecs-service"
  }
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = var.environment == "production"
  
  tags = {
    Name = "${var.project_name}-alb"
  }
}

resource "aws_lb_target_group" "app" {
  name     = "${var.project_name}-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
  
  tags = {
    Name = "${var.project_name}-target-group"
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"
  
  engine         = "postgres"
  engine_version = "14.7"
  instance_class = var.db_instance_class
  
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = var.environment == "production" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "production"
  
  tags = {
    Name = "${var.project_name}-rds"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id
  
  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# CloudWatch Logs
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}-app"
  retention_in_days = var.environment == "production" ? 30 : 7
  
  tags = {
    Name = "${var.project_name}-app-logs"
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "mi-aplicacion"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-west-2a", "us-west-2b"]
}

variable "app_cpu" {
  description = "App CPU units"
  type        = number
  default     = 256
}

variable "app_memory" {
  description = "App memory (MiB)"
  type        = number
  default     = 512
}

variable "app_desired_count" {
  description = "App desired count"
  type        = number
  default     = 2
}

variable "app_image" {
  description = "App Docker image"
  type        = string
  default     = "nginx:alpine"
}

variable "db_instance_class" {
  description = "DB instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "DB allocated storage (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "DB max allocated storage (GB)"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "miapp"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Outputs
output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.app.dns_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos de DevOps**
   - Cultura y principios
   - Automatización
   - Monitoreo y observabilidad

2. **CI/CD y Pipelines**
   - GitHub Actions, Jenkins, GitLab CI
   - Automatización de tests
   - Despliegue continuo

3. **Infrastructure as Code**
   - Terraform, CloudFormation
   - Ansible, Chef, Puppet
   - Gestión de configuración

4. **Contenedores y Orquestación**
   - Docker, Kubernetes
   - Microservicios
   - Service mesh

5. **Monitoreo y Observabilidad**
   - Prometheus, Grafana
   - ELK Stack
   - APM y tracing

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Pipeline CI/CD completo con GitHub Actions**
2. **Infraestructura como código con Terraform**
3. **Aplicación containerizada con Kubernetes**
4. **Sistema de monitoreo con Prometheus y Grafana**
5. **Automatización de infraestructura con Ansible**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de DevOps! 🔄**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como ingeniero de DevOps! 🎯**
