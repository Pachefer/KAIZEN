# 🐳 Guía Completa de Docker - Entrevistas y Dominio

## 🎯 Introducción a Docker

**Docker** es una plataforma de contenedores que permite empaquetar aplicaciones y sus dependencias en unidades estandarizadas llamadas contenedores, garantizando consistencia entre diferentes entornos.

### 🌟 **¿Por qué Docker?**

- **Consistencia** - Mismo entorno en desarrollo, pruebas y producción
- **Portabilidad** - Funciona en cualquier sistema con Docker
- **Aislamiento** - Aplicaciones independientes y seguras
- **Eficiencia** - Menor uso de recursos que máquinas virtuales
- **Escalabilidad** - Fácil replicación y distribución

---

## 🔥 **PREGUNTAS FUNDAMENTALES DE ENTREVISTA**

### 🔴 **PREGUNTA 1: ¿Cuál es la diferencia entre Docker y máquinas virtuales?**

**Respuesta Completa:**

**Máquinas Virtuales (VMs):**
- Sistema operativo completo
- Hipervisor para abstracción de hardware
- Mayor uso de recursos
- Tiempo de inicio lento
- Aislamiento completo

**Docker (Contenedores):**
- Comparte kernel del host
- Aislamiento a nivel de proceso
- Menor uso de recursos
- Inicio instantáneo
- Aislamiento de aplicación

```bash
# Ejemplo de comparación Docker vs VM
# ===================================

# DOCKER - Contenedor ligero
docker run -d \
  --name web-app \
  -p 8080:80 \
  -v /app/data:/var/www/html \
  -e NODE_ENV=production \
  nginx:alpine

# VM - Sistema completo
# Requiere: Hipervisor (VMware, VirtualBox, Hyper-V)
# Sistema operativo completo
# Aplicaciones y dependencias
# Mayor tiempo de inicio y recursos

# Comparación de recursos
echo "=== COMPARACIÓN DE RECURSOS ==="
echo "Docker Container:"
echo "  - Memoria: 50-200 MB"
echo "  - Disco: 100-500 MB"
echo "  - Inicio: 1-5 segundos"
echo "  - Aislamiento: Proceso"
echo ""
echo "Máquina Virtual:"
echo "  - Memoria: 1-4 GB"
echo "  - Disco: 10-50 GB"
echo "  - Inicio: 30-300 segundos"
echo "  - Aislamiento: Sistema completo"
```

**Simulador de Docker vs VM:**

```bash
#!/bin/bash
# docker-vs-vm-simulator.sh

class DockerVsVMSimulator {
    constructor() {
        this.testCount = 0;
        this.dockerWins = 0;
        this.vmWins = 0;
        this.scenarios = this.setupScenarios();
    }

    setupScenarios() {
        return [
            {
                name: 'Tiempo de Inicio',
                description: 'Comparar velocidad de inicio',
                dockerMetric: '2 segundos',
                vmMetric: '45 segundos',
                winner: 'docker',
                reason: 'Docker comparte el kernel del host'
            },
            {
                name: 'Uso de Memoria',
                description: 'Comparar consumo de memoria',
                dockerMetric: '150 MB',
                vmMetric: '2.5 GB',
                winner: 'docker',
                reason: 'Contenedores comparten recursos del host'
            },
            {
                name: 'Uso de Disco',
                description: 'Comparar espacio en disco',
                dockerMetric: '300 MB',
                vmMetric: '25 GB',
                winner: 'docker',
                reason: 'No requiere sistema operativo completo'
            },
            {
                name: 'Aislamiento de Seguridad',
                description: 'Comparar nivel de aislamiento',
                dockerMetric: 'Proceso',
                vmMetric: 'Sistema completo',
                winner: 'vm',
                reason: 'VM proporciona aislamiento completo del kernel'
            },
            {
                name: 'Portabilidad',
                description: 'Facilidad de despliegue',
                dockerMetric: 'Muy alta',
                vmMetric: 'Media',
                winner: 'docker',
                reason: 'Contenedores son independientes del host'
            }
        ];
    }

    runSimulation() {
        console.log('🐳 SIMULADOR DE DOCKER vs MÁQUINAS VIRTUALES');
        console.log('=' .repeat(60));

        console.log('\n📋 Analizando escenarios de comparación...\n');

        this.scenarios.forEach((scenario, index) => {
            this.testCount++;
            console.log(`🧪 ESCENARIO ${index + 1}: ${scenario.name}`);
            console.log('-'.repeat(60));
            console.log(`📝 Descripción: ${scenario.description}`);
            
            console.log('\n📊 MÉTRICAS:');
            console.log(`   Docker: ${scenario.dockerMetric}`);
            console.log(`   VM: ${scenario.vmMetric}`);
            
            // Determinar ganador
            if (scenario.winner === 'docker') {
                console.log('   🏆 Ganador: Docker');
                this.dockerWins++;
            } else {
                console.log('   🏆 Ganador: Máquina Virtual');
                this.vmWins++;
            }
            
            console.log(`   💡 Razón: ${scenario.reason}`);
            console.log();
        });

        this.showFinalSummary();
    }

    showFinalSummary() {
        console.log('🎉 RESUMEN FINAL DE LA COMPARACIÓN');
        console.log('=' .repeat(50));

        console.log('\n📊 Estadísticas:');
        console.log(`   Escenarios analizados: ${this.testCount}`);
        console.log(`   Docker gana: ${this.dockerWins}`);
        console.log(`   VM gana: ${this.vmWins}`);

        console.log('\n💡 LECCIONES APRENDIDAS:');
        console.log('   ✅ DOCKER:');
        console.log('      - Mejor para desarrollo y despliegue');
        console.log('      - Menor uso de recursos');
        console.log('      - Inicio más rápido');
        console.log('      - Mejor portabilidad');
        
        console.log('   ✅ MÁQUINAS VIRTUALES:');
        console.log('      - Mejor aislamiento de seguridad');
        console.log('      - Compatibilidad completa de SO');
        console.log('      - Ideal para entornos críticos');
        console.log('      - Mejor para aplicaciones legacy');

        console.log('\n🚨 CUÁNDO USAR CADA UNO:');
        console.log('   🔴 Usa Docker cuando:');
        console.log('      - Desarrollas aplicaciones modernas');
        console.log('      - Necesitas despliegue rápido');
        console.log('      - Quieres optimizar recursos');
        console.log('      - Trabajas con microservicios');
        
        console.log('   🔴 Usa VM cuando:');
        console.log('      - Necesitas aislamiento completo');
        console.log('      - Ejecutas aplicaciones legacy');
        console.log('      - Requieres diferentes kernels');
        console.log('      - Seguridad es crítica');

        console.log('\n🌟 CONCLUSIÓN:');
        console.log('   📱 Docker es ideal para la mayoría de casos de uso modernos');
        console.log('   🔄 Las VMs siguen siendo útiles para casos específicos');
        console.log('   🎯 La elección depende de los requisitos específicos');
    }
}

// Ejecutar simulador
const simulator = new DockerVsVMSimulator();
simulator.runSimulation();
```

---

### 🔴 **PREGUNTA 2: ¿Qué es Dockerfile y cómo se construye una imagen?**

**Respuesta Completa:**

**Dockerfile** es un archivo de texto que contiene instrucciones para construir una imagen de Docker. Define el entorno, dependencias y configuración de la aplicación.

**Instrucciones principales:**
- **FROM** - Imagen base
- **RUN** - Comandos de instalación
- **COPY/ADD** - Copiar archivos
- **WORKDIR** - Directorio de trabajo
- **EXPOSE** - Puerto expuesto
- **CMD/ENTRYPOINT** - Comando de inicio

```dockerfile
# Ejemplo de Dockerfile para aplicación Node.js
# =============================================

# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa 2: Producción
FROM nginx:alpine

# Instalar dependencias adicionales
RUN apk add --no-cache curl

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar propietario de archivos
RUN chown -R nodejs:nodejs /usr/share/nginx/html && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /etc/nginx/conf.d

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

# Dockerfile para aplicación Python
# =================================

FROM python:3.11-slim

# Variables de entorno
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Crear usuario no-root
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]

# Dockerfile para aplicación Java
# ===============================

FROM openjdk:17-jdk-slim

# Variables de entorno
ENV JAVA_OPTS="-Xmx512m -Xms256m" \
    APP_HOME="/app"

# Establecer directorio de trabajo
WORKDIR $APP_HOME

# Copiar JAR de la aplicación
COPY target/*.jar app.jar

# Crear usuario no-root
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser $APP_HOME
USER appuser

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Construir y ejecutar imágenes
# =============================

# Construir imagen
docker build -t mi-aplicacion:latest .

# Construir con etiqueta específica
docker build -t mi-aplicacion:v1.0.0 .

# Construir con argumentos
docker build \
  --build-arg NODE_ENV=production \
  --build-arg VERSION=1.0.0 \
  -t mi-aplicacion:latest .

# Ejecutar contenedor
docker run -d \
  --name mi-app \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -v /app/data:/app/data \
  mi-aplicacion:latest

# Ejecutar con variables de entorno
docker run -d \
  --name mi-app \
  -p 8080:8080 \
  --env-file .env \
  mi-aplicacion:latest

# Ejecutar con red personalizada
docker run -d \
  --name mi-app \
  --network mi-red \
  -p 8080:8080 \
  mi-aplicacion:latest
```

**Simulador de Dockerfile:**

```bash
#!/bin/bash
# dockerfile-simulator.sh

class DockerfileSimulator {
    constructor() {
        this.dockerfiles = new Map();
        this.buildResults = new Map();
        this.testCount = 0;
        this.successCount = 0;
    }

    // Crear Dockerfile de ejemplo
    createDockerfile(name, type) {
        let dockerfile = '';
        
        switch (type) {
            case 'nodejs':
                dockerfile = this.createNodeJSDockerfile();
                break;
            case 'python':
                dockerfile = this.createPythonDockerfile();
                break;
            case 'java':
                dockerfile = this.createJavaDockerfile();
                break;
            case 'nginx':
                dockerfile = this.createNginxDockerfile();
                break;
            default:
                dockerfile = this.createBasicDockerfile();
        }
        
        this.dockerfiles.set(name, {
            content: dockerfile,
            type: type,
            created_at: new Date()
        });
        
        console.log(`✅ Dockerfile creado: ${name} (${type})`);
        return dockerfile;
    }

    // Crear Dockerfile de Node.js
    createNodeJSDockerfile() {
        return `# Dockerfile para aplicación Node.js
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;
    }

    // Crear Dockerfile de Python
    createPythonDockerfile() {
        return `# Dockerfile para aplicación Python
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]`;
    }

    // Crear Dockerfile de Java
    createJavaDockerfile() {
        return `# Dockerfile para aplicación Java
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]`;
    }

    // Crear Dockerfile de Nginx
    createNginxDockerfile() {
        return `# Dockerfile para servidor Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;
    }

    // Crear Dockerfile básico
    createBasicDockerfile() {
        return `# Dockerfile básico
FROM ubuntu:20.04

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY . .

EXPOSE 8080

CMD ["echo", "Hello Docker!"]`;
    }

    // Simular construcción de imagen
    simulateBuild(name, options = {}) {
        const dockerfile = this.dockerfiles.get(name);
        if (!dockerfile) {
            console.log(`❌ Dockerfile '${name}' no encontrado`);
            return false;
        }

        console.log(`🔨 Construyendo imagen: ${name}`);
        console.log(`   Tipo: ${dockerfile.type}`);
        
        // Simular proceso de construcción
        const buildTime = this.calculateBuildTime(dockerfile.type, options);
        const buildSuccess = this.simulateBuildProcess(dockerfile, options);
        
        if (buildSuccess) {
            console.log(`   ✅ Construcción exitosa en ${buildTime.toFixed(2)}s`);
            this.successCount++;
            
            // Calcular tamaño de imagen
            const imageSize = this.calculateImageSize(dockerfile.type);
            console.log(`   📦 Tamaño de imagen: ${imageSize}`);
            
            // Generar hash de imagen
            const imageHash = this.generateImageHash(name);
            console.log(`   🆔 Hash de imagen: ${imageHash}`);
            
            this.buildResults.set(name, {
                success: true,
                build_time: buildTime,
                image_size: imageSize,
                image_hash: imageHash,
                timestamp: new Date()
            });
        } else {
            console.log(`   ❌ Construcción fallida`);
            this.buildResults.set(name, {
                success: false,
                error: 'Error durante la construcción',
                timestamp: new Date()
            });
        }
        
        this.testCount++;
        return buildSuccess;
    }

    // Calcular tiempo de construcción
    calculateBuildTime(type, options) {
        let baseTime = 0;
        
        switch (type) {
            case 'nodejs':
                baseTime = 45;
                break;
            case 'python':
                baseTime = 60;
                break;
            case 'java':
                baseTime = 90;
                break;
            case 'nginx':
                baseTime = 30;
                break;
            default:
                baseTime = 50;
        }
        
        // Ajustar por opciones
        if (options.noCache) baseTime *= 0.8;
        if (options.parallel) baseTime *= 0.7;
        if (options.optimize) baseTime *= 1.2;
        
        // Agregar variabilidad
        return baseTime + (Math.random() * 20 - 10);
    }

    // Simular proceso de construcción
    simulateBuildProcess(dockerfile, options) {
        // Simular diferentes etapas de construcción
        const stages = [
            'Descargando imagen base...',
            'Ejecutando comandos RUN...',
            'Copiando archivos...',
            'Configurando puertos...',
            'Finalizando construcción...'
        ];
        
        stages.forEach((stage, index) => {
            const delay = 500 + Math.random() * 1000;
            setTimeout(() => {
                console.log(`      ${stage}`);
            }, delay * index);
        });
        
        // Simular éxito/fallo (90% éxito)
        return Math.random() > 0.1;
    }

    // Calcular tamaño de imagen
    calculateImageSize(type) {
        const baseSizes = {
            'nodejs': '150 MB',
            'python': '200 MB',
            'java': '400 MB',
            'nginx': '50 MB'
        };
        
        const baseSize = baseSizes[type] || '200 MB';
        return baseSize;
    }

    // Generar hash de imagen
    generateImageHash(name) {
        const timestamp = Date.now();
        const hash = Math.random().toString(36).substring(2, 15);
        return `${name}_${hash}_${timestamp}`;
    }

    // Analizar Dockerfile
    analyzeDockerfile(name) {
        const dockerfile = this.dockerfiles.get(name);
        if (!dockerfile) {
            console.log(`❌ Dockerfile '${name}' no encontrado`);
            return;
        }

        console.log(`\n🔍 ANÁLISIS DEL DOCKERFILE: ${name}`);
        console.log('-'.repeat(50));
        
        const analysis = this.performAnalysis(dockerfile.content);
        
        console.log(`📊 Puntuación: ${analysis.score}/100`);
        console.log(`📝 Tipo: ${dockerfile.type}`);
        console.log(`🕒 Creado: ${dockerfile.created_at.toLocaleString()}`);
        
        console.log('\n✅ ASPECTOS POSITIVOS:');
        analysis.positive.forEach(point => {
            console.log(`   • ${point}`);
        });
        
        console.log('\n⚠️  ASPECTOS A MEJORAR:');
        analysis.negative.forEach(point => {
            console.log(`   • ${point}`);
        });
        
        console.log('\n💡 RECOMENDACIONES:');
        analysis.recommendations.forEach(rec => {
            console.log(`   • ${rec}`);
        });
    }

    // Realizar análisis del Dockerfile
    performAnalysis(content) {
        let score = 0;
        const positive = [];
        const negative = [];
        const recommendations = [];
        
        // Verificar FROM
        if (content.includes('FROM')) {
            score += 20;
            positive.push('Usa instrucción FROM');
        } else {
            score -= 20;
            negative.push('Falta instrucción FROM');
        }
        
        // Verificar WORKDIR
        if (content.includes('WORKDIR')) {
            score += 15;
            positive.push('Define directorio de trabajo');
        } else {
            score -= 10;
            recommendations.push('Considerar usar WORKDIR');
        }
        
        // Verificar EXPOSE
        if (content.includes('EXPOSE')) {
            score += 10;
            positive.push('Expone puertos');
        } else {
            score -= 5;
            recommendations.push('Considerar exponer puertos con EXPOSE');
        }
        
        // Verificar CMD o ENTRYPOINT
        if (content.includes('CMD') || content.includes('ENTRYPOINT')) {
            score += 15;
            positive.push('Define comando de inicio');
        } else {
            score -= 15;
            negative.push('Falta comando de inicio');
        }
        
        // Verificar optimizaciones
        if (content.includes('--no-cache')) {
            score += 10;
            positive.push('Optimiza caché de paquetes');
        }
        
        if (content.includes('USER')) {
            score += 10;
            positive.push('Usa usuario no-root');
        } else {
            score -= 10;
            recommendations.push('Considerar usar usuario no-root por seguridad');
        }
        
        // Verificar multi-stage builds
        if (content.includes('AS ') && content.includes('--from=')) {
            score += 20;
            positive.push('Implementa multi-stage build');
        }
        
        // Normalizar puntuación
        score = Math.max(0, Math.min(100, score));
        
        return { score, positive, negative, recommendations };
    }

    // Ejecutar demostración completa
    runDemo() {
        console.log('🐳 SIMULADOR DE DOCKERFILE');
        console.log('=' .repeat(60));
        
        // Crear diferentes tipos de Dockerfiles
        console.log('\n🚀 CREANDO DOCKERFILES...');
        
        this.createDockerfile('app-nodejs', 'nodejs');
        this.createDockerfile('app-python', 'python');
        this.createDockerfile('app-java', 'java');
        this.createDockerfile('app-nginx', 'nginx');
        
        // Construir imágenes
        console.log('\n🔨 CONSTRUYENDO IMÁGENES...');
        
        this.simulateBuild('app-nodejs', { optimize: true });
        this.simulateBuild('app-python', { noCache: true });
        this.simulateBuild('app-java', { parallel: true });
        this.simulateBuild('app-nginx');
        
        // Analizar Dockerfiles
        console.log('\n🔍 ANALIZANDO DOCKERFILES...');
        
        this.analyzeDockerfile('app-nodejs');
        this.analyzeDockerfile('app-python');
        this.analyzeDockerfile('app-java');
        this.analyzeDockerfile('app-nginx');
        
        // Mostrar resumen
        this.showBuildSummary();
        
        console.log('\n🎉 Demostración completada!');
    }

    // Mostrar resumen de construcciones
    showBuildSummary() {
        console.log('\n📊 RESUMEN DE CONSTRUCCIONES');
        console.log('-'.repeat(50));
        
        console.log(`   Total de construcciones: ${this.testCount}`);
        console.log(`   Construcciones exitosas: ${this.successCount}`);
        console.log(`   Tasa de éxito: ${((this.successCount / this.testCount) * 100).toFixed(1)}%`);
        
        console.log('\n🏗️  RESULTADOS POR DOCKERFILE:');
        
        for (const [name, result] of this.buildResults) {
            if (result.success) {
                console.log(`   ✅ ${name}: ${result.build_time.toFixed(2)}s, ${result.image_size}`);
            } else {
                console.log(`   ❌ ${name}: ${result.error}`);
            }
        }
        
        console.log('\n💡 LECCIONES APRENDIDAS:');
        console.log('   📱 Usar imágenes base apropiadas');
        console.log('   🔄 Optimizar capas de Docker');
        console.log('   🎯 Implementar multi-stage builds');
        console.log('   🔒 Seguir mejores prácticas de seguridad');
        console.log('   📦 Minimizar tamaño de imagen final');
    }
}

// Ejecutar simulador
const dockerfileSimulator = new DockerfileSimulator();
dockerfileSimulator.runDemo();
```

---

## 📚 **RECURSOS ADICIONALES DE ESTUDIO**

### 🎯 **Conceptos Clave para Dominar:**

1. **Fundamentos de Docker**
   - Contenedores e imágenes
   - Dockerfile y build context
   - Registros y repositorios

2. **Docker Compose**
   - Servicios y redes
   - Volúmenes y variables de entorno
   - Orquestación de múltiples contenedores

3. **Docker Hub y Registros**
   - Subir y descargar imágenes
   - Tags y versiones
   - Seguridad y escaneo

4. **Docker en Producción**
   - Swarm mode
   - Kubernetes con Docker
   - Monitoreo y logging

5. **Mejores Prácticas**
   - Seguridad de contenedores
   - Optimización de imágenes
   - CI/CD con Docker

### 🚀 **Proyectos Prácticos Recomendados:**

1. **Aplicación multi-contenedor con Docker Compose**
2. **Pipeline CI/CD con Docker**
3. **Microservicios con Docker Swarm**
4. **Sistema de monitoreo con contenedores**
5. **Infraestructura como código con Docker**

---

## 🎉 **Conclusión**

Esta guía completa te ha proporcionado:

- ✅ **Preguntas fundamentales** de entrevistas técnicas
- ✅ **Simuladores interactivos** para practicar
- ✅ **Explicaciones detalladas** de cada concepto
- ✅ **Código ejecutable** para experimentar
- ✅ **Estrategias** para responder preguntas técnicas

**¡Ahora estás preparado para dominar cualquier entrevista técnica de Docker! 🐳**

**Recuerda: La práctica hace al maestro. Ejecuta los simuladores, construye proyectos y mantén tu conocimiento actualizado. ¡Buena suerte en tu carrera como ingeniero de DevOps! 🎯**
