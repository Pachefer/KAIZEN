#!/usr/bin/env python3
"""
Script para procesar y estructurar preguntas de DevOps (380 preguntas)
Incluye traducciones, ejemplos prácticos y mejoras
"""

import json
import re
from datetime import datetime
from pathlib import Path

class DevOps380QuestionProcessor:
    def __init__(self, input_file="devops_380_questions_structured.json"):
        self.input_file = input_file
        self.questions = []
        self.processed_questions = []
        
    def load_questions(self):
        try:
            with open(self.input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.questions = data.get('questions', [])
            print(f"✅ Cargadas {len(self.questions)} preguntas desde {self.input_file}")
            return True
        except FileNotFoundError:
            print(f"❌ No se encontró el archivo {self.input_file}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Error al parsear JSON: {e}")
            return False
    
    def translate_question(self, question_text):
        translations = {
            'What is': '¿Qué es',
            'How does': '¿Cómo funciona',
            'Explain': 'Explica',
            'Describe': 'Describe',
            'What are': '¿Cuáles son',
            'How to': '¿Cómo',
            'Why': '¿Por qué',
            'When': '¿Cuándo',
            'Where': '¿Dónde',
            'Which': '¿Cuál',
            'DevOps': 'DevOps',
            'Docker': 'Docker',
            'Kubernetes': 'Kubernetes',
            'container': 'contenedor',
            'image': 'imagen',
            'deployment': 'despliegue',
            'pipeline': 'pipeline',
            'automation': 'automatización',
            'infrastructure': 'infraestructura',
            'monitoring': 'monitoreo',
            'logging': 'logging',
            'security': 'seguridad',
            'cloud': 'nube',
            'server': 'servidor',
            'network': 'red',
            'database': 'base de datos',
            'application': 'aplicación',
            'service': 'servicio',
            'microservice': 'microservicio',
            'api': 'API',
            'rest': 'REST',
            'json': 'JSON',
            'yaml': 'YAML',
            'script': 'script',
            'shell': 'shell',
            'bash': 'bash',
            'python': 'Python',
            'java': 'Java',
            'node': 'Node.js',
            'git': 'Git',
            'jenkins': 'Jenkins',
            'terraform': 'Terraform',
            'ansible': 'Ansible',
            'prometheus': 'Prometheus',
            'grafana': 'Grafana',
            'elk': 'ELK Stack',
            'aws': 'AWS',
            'azure': 'Azure',
            'gcp': 'GCP',
            'linux': 'Linux',
            'ubuntu': 'Ubuntu',
            'centos': 'CentOS',
            'redhat': 'Red Hat',
            'debian': 'Debian',
            'virtualization': 'virtualización',
            'vm': 'máquina virtual',
            'orchestration': 'orquestación',
            'scaling': 'escalado',
            'load balancer': 'balanceador de carga',
            'proxy': 'proxy',
            'firewall': 'firewall',
            'ssl': 'SSL',
            'tls': 'TLS',
            'certificate': 'certificado',
            'authentication': 'autenticación',
            'authorization': 'autorización',
            'rbac': 'RBAC',
            'secrets': 'secretos',
            'configmap': 'ConfigMap',
            'namespace': 'namespace',
            'pod': 'pod',
            'service': 'servicio',
            'ingress': 'ingress',
            'helm': 'Helm',
            'chart': 'chart',
            'repository': 'repositorio',
            'registry': 'registro',
            'dockerfile': 'Dockerfile',
            'docker-compose': 'docker-compose',
            'volume': 'volumen',
            'mount': 'montaje',
            'port': 'puerto',
            'environment': 'entorno',
            'variable': 'variable',
            'config': 'configuración',
            'backup': 'respaldo',
            'restore': 'restauración',
            'disaster recovery': 'recuperación ante desastres',
            'high availability': 'alta disponibilidad',
            'fault tolerance': 'tolerancia a fallos',
            'performance': 'rendimiento',
            'optimization': 'optimización',
            'caching': 'caché',
            'cdn': 'CDN',
            'database': 'base de datos',
            'mysql': 'MySQL',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'redis': 'Redis',
            'elasticsearch': 'Elasticsearch',
            'kibana': 'Kibana',
            'logstash': 'Logstash',
            'filebeat': 'Filebeat',
            'metricbeat': 'Metricbeat',
            'alerting': 'alertas',
            'dashboard': 'dashboard',
            'visualization': 'visualización',
            'query': 'consulta',
            'index': 'índice',
            'shard': 'shard',
            'replica': 'réplica',
            'cluster': 'cluster',
            'node': 'nodo',
            'master': 'maestro',
            'worker': 'trabajador',
            'etcd': 'etcd',
            'api server': 'servidor API',
            'controller': 'controlador',
            'scheduler': 'planificador',
            'kubelet': 'kubelet',
            'kube-proxy': 'kube-proxy',
            'cni': 'CNI',
            'cri': 'CRI',
            'containerd': 'containerd',
            'runc': 'runc',
            'cgroup': 'cgroup',
            'namespace': 'namespace',
            'seccomp': 'seccomp',
            'apparmor': 'AppArmor',
            'selinux': 'SELinux',
            'capabilities': 'capacidades',
            'privileged': 'privilegiado',
            'non-root': 'no root',
            'user': 'usuario',
            'group': 'grupo',
            'permission': 'permiso',
            'ownership': 'propiedad',
            'chmod': 'chmod',
            'chown': 'chown',
            'umask': 'umask',
            'sticky bit': 'sticky bit',
            'setuid': 'setuid',
            'setgid': 'setgid',
            'process': 'proceso',
            'thread': 'hilo',
            'signal': 'señal',
            'kill': 'kill',
            'ps': 'ps',
            'top': 'top',
            'htop': 'htop',
            'systemctl': 'systemctl',
            'service': 'servicio',
            'daemon': 'daemon',
            'init': 'init',
            'systemd': 'systemd',
            'upstart': 'upstart',
            'sysvinit': 'sysvinit',
            'cron': 'cron',
            'at': 'at',
            'anacron': 'anacron',
            'logrotate': 'logrotate',
            'rsyslog': 'rsyslog',
            'journald': 'journald',
            'dmesg': 'dmesg',
            'tail': 'tail',
            'head': 'head',
            'grep': 'grep',
            'awk': 'awk',
            'sed': 'sed',
            'cut': 'cut',
            'sort': 'sort',
            'uniq': 'uniq',
            'wc': 'wc',
            'find': 'find',
            'locate': 'locate',
            'which': 'which',
            'whereis': 'whereis',
            'type': 'type',
            'alias': 'alias',
            'function': 'función',
            'variable': 'variable',
            'export': 'export',
            'env': 'env',
            'set': 'set',
            'unset': 'unset',
            'readonly': 'readonly',
            'declare': 'declare',
            'local': 'local',
            'global': 'global',
            'scope': 'alcance',
            'parameter': 'parámetro',
            'argument': 'argumento',
            'option': 'opción',
            'flag': 'bandera',
            'switch': 'switch',
            'case': 'case',
            'if': 'if',
            'else': 'else',
            'elif': 'elif',
            'then': 'then',
            'fi': 'fi',
            'for': 'for',
            'while': 'while',
            'until': 'until',
            'do': 'do',
            'done': 'done',
            'break': 'break',
            'continue': 'continue',
            'return': 'return',
            'exit': 'exit',
            'trap': 'trap',
            'exec': 'exec',
            'source': 'source',
            'dot': 'dot',
            'test': 'test',
            '[': '[',
            ']': ']',
            '[[': '[[',
            ']]': ']]',
            '((': '((',
            '))': '))',
            'let': 'let',
            'expr': 'expr',
            'bc': 'bc',
            'dc': 'dc',
            'printf': 'printf',
            'echo': 'echo',
            'cat': 'cat',
            'tac': 'tac',
            'nl': 'nl',
            'less': 'less',
            'more': 'more',
            'most': 'most',
            'view': 'view',
            'vim': 'vim',
            'vi': 'vi',
            'nano': 'nano',
            'emacs': 'emacs',
            'pico': 'pico',
            'ed': 'ed',
            'ex': 'ex',
            'sed': 'sed',
            'awk': 'awk',
            'perl': 'perl',
            'python': 'python',
            'ruby': 'ruby',
            'php': 'php',
            'node': 'node',
            'npm': 'npm',
            'yarn': 'yarn',
            'pip': 'pip',
            'gem': 'gem',
            'composer': 'composer',
            'maven': 'maven',
            'gradle': 'gradle',
            'ant': 'ant',
            'make': 'make',
            'cmake': 'cmake',
            'autotools': 'autotools',
            'configure': 'configure',
            'makefile': 'Makefile',
            'build': 'build',
            'compile': 'compilar',
            'link': 'enlazar',
            'install': 'instalar',
            'package': 'paquete',
            'rpm': 'RPM',
            'deb': 'DEB',
            'tar': 'tar',
            'gzip': 'gzip',
            'bzip2': 'bzip2',
            'xz': 'xz',
            'zip': 'zip',
            'unzip': 'unzip',
            '7z': '7z',
            'rar': 'rar',
            'lzma': 'lzma',
            'lzop': 'lzop',
            'zstd': 'zstd',
            'lz4': 'lz4',
            'brotli': 'brotli',
            'lzo': 'lzo',
            'snappy': 'snappy',
            'lzf': 'lzf',
            'lzjb': 'lzjb',
            'lzrw': 'lzrw',
            'lzss': 'lzss',
            'lzma2': 'lzma2',
            'lzma1': 'lzma1',
            'lzma': 'lzma',
            'lzop': 'lzop',
            'zstd': 'zstd',
            'lz4': 'lz4',
            'brotli': 'brotli',
            'lzo': 'lzo',
            'snappy': 'snappy',
            'lzf': 'lzf',
            'lzjb': 'lzjb',
            'lzrw': 'lzrw',
            'lzss': 'lzss',
            'lzma2': 'lzma2',
            'lzma1': 'lzma1'
        }
        
        translated = question_text
        for eng, esp in translations.items():
            translated = translated.replace(eng, esp)
        
        return translated
    
    def generate_example_code(self, question_text, category='otros'):
        examples = {
            'docker': {
                'title': 'Docker y Contenedores',
                'code': '''# Ejemplo de Docker y contenedores
# Dockerfile para una aplicación Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código de la aplicación
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]

# docker-compose.yml para múltiples servicios
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=app
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:

# Script de automatización para Docker
#!/bin/bash

# Script para automatizar el despliegue con Docker
set -e

echo "🚀 Iniciando despliegue con Docker..."

# Construir imagen
echo "📦 Construyendo imagen Docker..."
docker build -t mi-app:latest .

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Iniciar servicios
echo "▶️ Iniciando servicios..."
docker-compose up -d

# Verificar estado
echo "🔍 Verificando estado de servicios..."
docker-compose ps

# Verificar logs
echo "📋 Mostrando logs..."
docker-compose logs --tail=50

echo "✅ Despliegue completado exitosamente!"''',
                'explanation': 'Este ejemplo muestra cómo crear y gestionar contenedores Docker, incluyendo Dockerfile, docker-compose.yml y scripts de automatización.'
            },
            'kubernetes': {
                'title': 'Kubernetes y Orquestación',
                'code': '''# Ejemplo de Kubernetes y orquestación
# deployment.yaml - Despliegue de aplicación
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
  labels:
    app: mi-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
      - name: mi-app
        image: mi-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# service.yaml - Servicio para exponer la aplicación
apiVersion: v1
kind: Service
metadata:
  name: mi-app-service
spec:
  selector:
    app: mi-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
# ingress.yaml - Configuración de entrada
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mi-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: mi-app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mi-app-service
            port:
              number: 80

---
# secret.yaml - Secretos para la aplicación
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc0BkYjoxMjM0L2FwcA==

# Script de despliegue en Kubernetes
#!/bin/bash

# Script para automatizar el despliegue en Kubernetes
set -e

echo "🚀 Iniciando despliegue en Kubernetes..."

# Aplicar secretos
echo "🔐 Aplicando secretos..."
kubectl apply -f secret.yaml

# Aplicar despliegue
echo "📦 Aplicando despliegue..."
kubectl apply -f deployment.yaml

# Aplicar servicio
echo "🌐 Aplicando servicio..."
kubectl apply -f service.yaml

# Aplicar ingress
echo "🚪 Aplicando ingress..."
kubectl apply -f ingress.yaml

# Verificar estado
echo "🔍 Verificando estado del despliegue..."
kubectl get pods -l app=mi-app
kubectl get services
kubectl get ingress

# Verificar logs
echo "📋 Mostrando logs..."
kubectl logs -l app=mi-app --tail=50

echo "✅ Despliegue en Kubernetes completado!"''',
                'explanation': 'Este ejemplo muestra cómo desplegar aplicaciones en Kubernetes, incluyendo deployments, services, ingress y secretos.'
            },
            'cicd': {
                'title': 'CI/CD y Automatización',
                'code': '''# Ejemplo de CI/CD con Jenkins
# Jenkinsfile - Pipeline de CI/CD
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'mi-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        KUBERNETES_NAMESPACE = 'production'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Obteniendo código del repositorio...'
                checkout scm
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Ejecutando pruebas...'
                sh 'npm install'
                sh 'npm test'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/*.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                echo '📦 Construyendo imagen Docker...'
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
                sh 'docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest'
            }
        }
        
        stage('Security Scan') {
            steps {
                echo '🔒 Escaneando vulnerabilidades...'
                sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${DOCKER_IMAGE}:${DOCKER_TAG}'
            }
        }
        
        stage('Push') {
            steps {
                echo '📤 Subiendo imagen al registro...'
                withCredentials([usernamePassword(credentialsId: 'docker-registry', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}'
                    sh 'docker push ${DOCKER_IMAGE}:${DOCKER_TAG}'
                    sh 'docker push ${DOCKER_IMAGE}:latest'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Desplegando en Kubernetes...'
                sh 'kubectl set image deployment/mi-app mi-app=${DOCKER_IMAGE}:${DOCKER_TAG} -n ${KUBERNETES_NAMESPACE}'
                sh 'kubectl rollout status deployment/mi-app -n ${KUBERNETES_NAMESPACE}'
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Verificando salud de la aplicación...'
                sh 'kubectl wait --for=condition=ready pod -l app=mi-app -n ${KUBERNETES_NAMESPACE} --timeout=300s'
                sh 'curl -f http://mi-app-service.${KUBERNETES_NAMESPACE}.svc.cluster.local/health'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completado exitosamente!'
            emailext (
                subject: "Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} - SUCCESS",
                body: "El pipeline se completó exitosamente. Ver detalles: ${env.BUILD_URL}",
                to: 'devops@company.com'
            )
        }
        failure {
            echo '❌ Pipeline falló!'
            emailext (
                subject: "Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} - FAILURE",
                body: "El pipeline falló. Ver detalles: ${env.BUILD_URL}",
                to: 'devops@company.com'
            )
        }
        always {
            cleanWs()
        }
    }
}

# GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
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
      run: npm test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t mi-app:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push mi-app:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Kubernetes
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        kubectl set image deployment/mi-app mi-app=mi-app:${{ github.sha }}''',
                'explanation': 'Este ejemplo muestra cómo implementar pipelines de CI/CD con Jenkins y GitHub Actions, incluyendo pruebas, construcción, seguridad y despliegue.'
            }
        }
        
        question_lower = question_text.lower()
        
        # Determinar categoría basada en palabras clave
        if any(word in question_lower for word in ['docker', 'container', 'image']):
            return examples['docker']
        elif any(word in question_lower for word in ['kubernetes', 'k8s', 'pod', 'deployment']):
            return examples['kubernetes']
        elif any(word in question_lower for word in ['ci/cd', 'pipeline', 'jenkins', 'automation']):
            return examples['cicd']
        else:
            return {
                'title': 'Ejemplo Genérico de DevOps',
                'code': '''# Ejemplo genérico de DevOps
#!/bin/bash

# Script de automatización básico de DevOps
set -e

echo "🚀 Iniciando proceso de DevOps..."

# Variables de configuración
APP_NAME="mi-aplicacion"
VERSION="1.0.0"
ENVIRONMENT="production"

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Función para verificar dependencias
check_dependencies() {
    log "🔍 Verificando dependencias..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker no está instalado"
        exit 1
    fi
    
    # Verificar kubectl
    if ! command -v kubectl &> /dev/null; then
        echo "❌ kubectl no está instalado"
        exit 1
    fi
    
    log "✅ Todas las dependencias están instaladas"
}

# Función para construir aplicación
build_application() {
    log "📦 Construyendo aplicación..."
    
    # Instalar dependencias
    npm install
    
    # Ejecutar pruebas
    npm test
    
    # Construir aplicación
    npm run build
    
    log "✅ Aplicación construida exitosamente"
}

# Función para crear imagen Docker
build_docker_image() {
    log "🐳 Construyendo imagen Docker..."
    
    docker build -t ${APP_NAME}:${VERSION} .
    docker tag ${APP_NAME}:${VERSION} ${APP_NAME}:latest
    
    log "✅ Imagen Docker construida"
}

# Función para desplegar
deploy() {
    log "🚀 Desplegando aplicación..."
    
    # Aplicar configuración de Kubernetes
    kubectl apply -f k8s/
    
    # Verificar estado del despliegue
    kubectl rollout status deployment/${APP_NAME}
    
    log "✅ Aplicación desplegada exitosamente"
}

# Función para verificar salud
health_check() {
    log "🏥 Verificando salud de la aplicación..."
    
    # Esperar a que la aplicación esté lista
    sleep 30
    
    # Verificar endpoint de salud
    if curl -f http://localhost/health; then
        log "✅ Aplicación saludable"
    else
        log "❌ Aplicación no responde"
        exit 1
    fi
}

# Función principal
main() {
    log "🚀 Iniciando pipeline de DevOps..."
    
    check_dependencies
    build_application
    build_docker_image
    deploy
    health_check
    
    log "🎉 Pipeline completado exitosamente!"
}

# Ejecutar función principal
main "$@"''',
                'explanation': 'Este es un ejemplo básico de DevOps que muestra la estructura fundamental de un script de automatización.'
            }
    
    def generate_unit_tests(self, example_code, category='otros'):
        return f'''# Pruebas unitarias para el ejemplo de DevOps
#!/bin/bash

# Suite de pruebas para el ejemplo de DevOps
# Para ejecutar: ./test_devops_example.sh

set -e

# Colores para output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Función para logging
log() {{
    echo -e "${{GREEN}}[TEST] $1${{NC}}"
}}

error() {{
    echo -e "${{RED}}[ERROR] $1${{NC}}"
}}

warning() {{
    echo -e "${{YELLOW}}[WARNING] $1${{NC}}"
}}

# Función para verificar que un comando existe
test_command_exists() {{
    local cmd=$1
    local test_name=$2
    
    log "Probando que $cmd existe..."
    if command -v $cmd &> /dev/null; then
        log "✅ $test_name: $cmd está instalado"
        return 0
    else
        error "❌ $test_name: $cmd no está instalado"
        return 1
    fi
}}

# Función para verificar sintaxis de script
test_script_syntax() {{
    local script=$1
    local test_name=$2
    
    log "Probando sintaxis de $script..."
    if bash -n "$script"; then
        log "✅ $test_name: Sintaxis correcta"
        return 0
    else
        error "❌ $test_name: Error de sintaxis en $script"
        return 1
    fi
}}

# Función para verificar archivos de configuración
test_config_files() {{
    local config_file=$1
    local test_name=$2
    
    log "Probando archivo de configuración $config_file..."
    if [ -f "$config_file" ]; then
        log "✅ $test_name: $config_file existe"
        return 0
    else
        warning "⚠️ $test_name: $config_file no existe"
        return 1
    fi
}}

# Función para verificar conectividad
test_connectivity() {{
    local host=$1
    local port=$2
    local test_name=$3
    
    log "Probando conectividad a $host:$port..."
    if nc -z "$host" "$port" 2>/dev/null; then
        log "✅ $test_name: Conectividad exitosa a $host:$port"
        return 0
    else
        warning "⚠️ $test_name: No se puede conectar a $host:$port"
        return 1
    fi
}}

# Función para verificar permisos
test_permissions() {{
    local file=$1
    local test_name=$2
    
    log "Probando permisos de $file..."
    if [ -r "$file" ] && [ -w "$file" ]; then
        log "✅ $test_name: Permisos correctos en $file"
        return 0
    else
        error "❌ $test_name: Permisos incorrectos en $file"
        return 1
    fi
}}

# Función principal de pruebas
main() {{
    log "🧪 Iniciando pruebas de DevOps..."
    
    local tests_passed=0
    local tests_failed=0
    
    # Prueba 1: Verificar comandos básicos
    if test_command_exists "docker" "Docker instalado"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if test_command_exists "kubectl" "kubectl instalado"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if test_command_exists "git" "Git instalado"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Prueba 2: Verificar sintaxis de scripts
    if test_script_syntax "devops_example.sh" "Script principal"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Prueba 3: Verificar archivos de configuración
    if test_config_files "package.json" "Package.json"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if test_config_files "Dockerfile" "Dockerfile"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Prueba 4: Verificar conectividad básica
    if test_connectivity "localhost" "80" "Servidor web local"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Prueba 5: Verificar permisos
    if test_permissions "devops_example.sh" "Script ejecutable"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Resumen de pruebas
    log "📊 Resumen de pruebas:"
    log "   ✅ Pruebas exitosas: $tests_passed"
    log "   ❌ Pruebas fallidas: $tests_failed"
    log "   📈 Total: $((tests_passed + tests_failed))"
    
    if [ $tests_failed -eq 0 ]; then
        log "🎉 ¡Todas las pruebas pasaron!"
        exit 0
    else
        error "❌ Algunas pruebas fallaron"
        exit 1
    fi
}}

# Ejecutar pruebas
main "$@"

# Para ejecutar las pruebas:
# chmod +x test_devops_example.sh
# ./test_devops_example.sh'''
    
    def predict_results(self, example_code):
        return '''📊 Predicción de Resultados:

✅ **Resultado Esperado:**
- Los scripts se ejecutarán correctamente
- Los contenedores se construirán sin errores
- Los despliegues se completarán exitosamente
- Las pruebas pasarán todas las validaciones
- No habrá errores de configuración

⚠️ **Posibles Errores:**
- Dependencias faltantes (Docker, kubectl, etc.)
- Problemas de conectividad de red
- Errores de permisos en archivos
- Configuraciones incorrectas
- Problemas de recursos del sistema

🔍 **Para Verificar:**
1. Los scripts tienen permisos de ejecución
2. Todas las dependencias están instaladas
3. La conectividad de red funciona
4. Los archivos de configuración son válidos
5. Los recursos del sistema son suficientes'''
    
    def suggest_improvements(self, question_text, category='otros'):
        improvements = {
            'docker': '''🚀 Mejoras Sugeridas:

1. **Optimización de imágenes:**
   - Usar imágenes base más pequeñas (alpine)
   - Implementar multi-stage builds
   - Optimizar el orden de las capas
   - Usar .dockerignore apropiado

2. **Seguridad:**
   - Ejecutar contenedores como usuario no-root
   - Escanear imágenes en busca de vulnerabilidades
   - Usar secretos para información sensible
   - Implementar políticas de seguridad

3. **Monitoreo:**
   - Configurar health checks
   - Implementar logging centralizado
   - Usar métricas de contenedores
   - Configurar alertas automáticas

4. **Automatización:**
   - Implementar CI/CD pipelines
   - Usar orquestadores (Kubernetes, Docker Swarm)
   - Automatizar backups y restauración
   - Implementar rollbacks automáticos''',
            
            'kubernetes': '''🚀 Mejoras Sugeridas:

1. **Gestión de recursos:**
   - Configurar límites y requests apropiados
   - Implementar HPA (Horizontal Pod Autoscaler)
   - Usar VPA (Vertical Pod Autoscaler)
   - Optimizar el uso de recursos

2. **Seguridad:**
   - Implementar RBAC (Role-Based Access Control)
   - Usar Network Policies
   - Configurar Pod Security Standards
   - Implementar mTLS entre servicios

3. **Monitoreo y observabilidad:**
   - Configurar Prometheus y Grafana
   - Implementar distributed tracing
   - Usar ELK Stack para logging
   - Configurar alertas inteligentes

4. **Automatización:**
   - Usar Helm charts para despliegues
   - Implementar GitOps con ArgoCD
   - Automatizar backups de etcd
   - Configurar auto-scaling basado en métricas''',
            
            'cicd': '''🚀 Mejoras Sugeridas:

1. **Optimización de pipelines:**
   - Implementar caching de dependencias
   - Usar builds paralelos cuando sea posible
   - Optimizar el tiempo de construcción
   - Implementar builds incrementales

2. **Seguridad en CI/CD:**
   - Escanear código en busca de vulnerabilidades
   - Implementar secret scanning
   - Usar SBOM (Software Bill of Materials)
   - Configurar políticas de seguridad

3. **Testing avanzado:**
   - Implementar testing de integración
   - Usar testing de rendimiento
   - Configurar testing de seguridad
   - Implementar testing de compatibilidad

4. **Automatización:**
   - Implementar auto-deployment
   - Configurar rollbacks automáticos
   - Usar feature flags
   - Implementar blue-green deployments'''

        }
        
        question_lower = question_text.lower()
        
        if any(word in question_lower for word in ['docker', 'container', 'image']):
            return improvements['docker']
        elif any(word in question_lower for word in ['kubernetes', 'k8s', 'pod']):
            return improvements['kubernetes']
        elif any(word in question_lower for word in ['ci/cd', 'pipeline', 'jenkins']):
            return improvements['cicd']
        else:
            return '''🚀 Mejoras Sugeridas:

1. **Implementar mejores prácticas de DevOps:**
   - Seguir principios de GitOps
   - Implementar Infrastructure as Code
   - Usar herramientas de monitoreo apropiadas
   - Configurar logging centralizado

2. **Optimizar rendimiento:**
   - Implementar caching apropiado
   - Optimizar builds y despliegues
   - Usar recursos de manera eficiente
   - Implementar auto-scaling

3. **Mejorar seguridad:**
   - Implementar políticas de seguridad
   - Usar secretos apropiadamente
   - Configurar RBAC
   - Escanear vulnerabilidades regularmente

4. **Automatización avanzada:**
   - Implementar pipelines completos
   - Usar herramientas de orquestación
   - Automatizar testing y despliegue
   - Configurar rollbacks automáticos'''
    
    def process_question(self, question_data):
        question_text = question_data['question']
        answer_text = question_data['answer']
        category = question_data.get('category', 'otros')
        
        translated_question = self.translate_question(question_text)
        example = self.generate_example_code(question_text, category)
        unit_tests = self.generate_unit_tests(example['code'], category)
        results_prediction = self.predict_results(example['code'])
        improvements = self.suggest_improvements(question_text, category)
        
        processed_question = {
            'original_question': question_text,
            'translated_question': translated_question,
            'original_answer': answer_text,
            'category': category,
            'example': example,
            'unit_tests': unit_tests,
            'results_prediction': results_prediction,
            'improvements': improvements,
            'page': question_data.get('page', ''),
            'processed_at': datetime.now().isoformat()
        }
        
        return processed_question
    
    def process_all_questions(self, limit=None):
        print(f"\n🔄 Procesando preguntas...")
        
        questions_to_process = self.questions[:limit] if limit else self.questions
        
        for i, question_data in enumerate(questions_to_process, 1):
            print(f"📝 Procesando pregunta {i}/{len(questions_to_process)}")
            
            try:
                processed_question = self.process_question(question_data)
                self.processed_questions.append(processed_question)
            except Exception as e:
                print(f"❌ Error procesando pregunta {i}: {e}")
        
        print(f"✅ Procesadas {len(self.processed_questions)} preguntas")
    
    def save_processed_questions(self, output_file="devops_380_questions_processed.json"):
        print(f"\n💾 Guardando preguntas procesadas en {output_file}")
        
        output_data = {
            'metadata': {
                'source': '380+ DevOps Interview Questions and Answers',
                'author': 'Salunke, Manish',
                'processed_at': datetime.now().isoformat(),
                'total_processed': len(self.processed_questions),
                'version': '1.0'
            },
            'questions': self.processed_questions
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Preguntas procesadas guardadas en {output_file}")
    
    def run_processing(self, limit=None):
        print("🚀 Iniciando procesamiento de preguntas de DevOps (380)")
        print("=" * 60)
        
        if not self.load_questions():
            return False
        
        self.process_all_questions(limit)
        self.save_processed_questions()
        
        print("\n✅ Procesamiento completado exitosamente!")
        return True

def main():
    input_file = "devops_380_questions_structured.json"
    
    if not Path(input_file).exists():
        print(f"❌ Error: No se encontró el archivo {input_file}")
        print("💡 Ejecuta primero extract_devops_380_questions.py")
        return
    
    processor = DevOps380QuestionProcessor(input_file)
    success = processor.run_processing(limit=10)
    
    if success:
        print(f"\n🎉 ¡Procesamiento completado!")
        print(f"📊 Preguntas procesadas: devops_380_questions_processed.json")
    else:
        print("\n❌ El procesamiento falló")

if __name__ == "__main__":
    main() 