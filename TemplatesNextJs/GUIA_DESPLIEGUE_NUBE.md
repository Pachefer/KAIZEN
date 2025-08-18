# 🚀 Guía Completa de Despliegue en la Nube - TemplatesNextJs

> **Despliegue paso a paso de todos los proyectos en diferentes plataformas cloud**

---

## 🎯 **Descripción General**

Esta guía proporciona instrucciones detalladas para desplegar cada proyecto de TemplatesNextJs en diferentes plataformas de nube. Cada proyecto tiene configuraciones específicas que se detallan individualmente.

---

## 🍕 **1. Yummer - Online Food**

### **🏗️ Arquitectura de Despliegue**
- **Frontend**: Next.js 15 (Vercel/Netlify)
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MongoDB Atlas
- **CMS**: Payload CMS
- **Storage**: AWS S3 / Cloudinary

### **🚀 Despliegue en Vercel (Recomendado)**

#### **PASO 1: Preparar el Proyecto**
```bash
# 1. Navegar al proyecto
cd "TemplatesNextJs/Yummer – Online Food/yummer"

# 2. Verificar dependencias
npm install

# 3. Build de producción
npm run build

# 4. Verificar que funciona localmente
npm run start
```

#### **PASO 2: Configurar Vercel**
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Desplegar
vercel

# 4. Seguir las instrucciones:
# - Project name: yummer-food-app
# - Directory: ./
# - Override settings: No
```

#### **PASO 3: Variables de Entorno**
```bash
# En Vercel Dashboard > Settings > Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yummer
PAYLOAD_SECRET=tu-secreto-super-seguro
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
NEXT_PUBLIC_API_URL=https://tu-api.vercel.app
```

#### **PASO 4: Despliegue Automático**
```bash
# 1. Conectar con GitHub
# 2. Configurar auto-deploy en main branch
# 3. Cada push se despliega automáticamente
```

### **🗄️ Despliegue de Base de Datos (MongoDB Atlas)**

#### **PASO 1: Crear Cluster**
1. Ir a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear cuenta gratuita
3. Crear nuevo cluster (M0 Free)
4. Elegir región cercana

#### **PASO 2: Configurar Usuario y Red**
```bash
# 1. Database Access > Add New Database User
Username: yummer_user
Password: contraseña-segura
Role: Read and write to any database

# 2. Network Access > Add IP Address
# Para desarrollo: 0.0.0.0/0 (cuidado en producción)
# Para producción: IP específica del servidor
```

#### **PASO 3: Obtener Connection String**
```bash
# 1. Clusters > Connect > Connect your application
# 2. Copiar connection string
mongodb+srv://yummer_user:password@cluster.mongodb.net/yummer?retryWrites=true&w=majority
```

### **🎛️ Despliegue del CMS (Payload)**

#### **PASO 1: Configurar Payload**
```typescript
// src/payload.config.ts
import { buildConfig } from 'payload/config';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Yummer Admin'
    }
  },
  collections: [
    // ... tus colecciones
  ]
});
```

#### **PASO 2: Variables de Entorno del CMS**
```bash
PAYLOAD_SECRET=tu-secreto-super-seguro
PAYLOAD_PUBLIC_SERVER_URL=https://tu-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yummer
```

---

## 🚚 **2. Mesio - Food Delivery**

### **🏗️ Arquitectura de Despliegue**
- **Frontend**: Next.js 15 (Vercel/Netlify)
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MongoDB Atlas
- **CMS**: Payload CMS
- **Storage**: AWS S3 / Cloudinary
- **PWA**: Service Workers + Manifest

### **🚀 Despliegue en Vercel**

#### **PASO 1: Preparar el Proyecto**
```bash
# 1. Navegar al proyecto
cd "TemplatesNextJs/Mesio – Food Delivery/mesio"

# 2. Verificar dependencias
npm install

# 3. Build de producción
npm run build

# 4. Verificar PWA
npm run build && npm run start
```

#### **PASO 2: Configurar PWA**
```json
// public/manifest.json
{
  "name": "Mesio - Food Delivery",
  "short_name": "Mesio",
  "description": "Entrega de comida a domicilio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b6b",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### **PASO 3: Variables de Entorno**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mesio
PAYLOAD_SECRET=tu-secreto-super-seguro
NEXT_PUBLIC_API_URL=https://tu-api.vercel.app
NEXT_PUBLIC_APP_NAME=Mesio
NEXT_PUBLIC_APP_DESCRIPTION=Entrega de comida a domicilio
```

### **🗄️ Base de Datos (MongoDB Atlas)**

#### **PASO 1: Configurar Colecciones**
```javascript
// En MongoDB Atlas, crear índices
db.dishes.createIndex({ name: 'text', description: 'text' });
db.dishes.createIndex({ category: 1, isAvailable: 1 });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ status: 1, createdAt: -1 });
```

---

## 🏦 **3. Teofin - Mobile Banking**

### **🏗️ Arquitectura de Despliegue**
- **Frontend**: Next.js 15 (Vercel/Netlify)
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MongoDB Atlas
- **Seguridad**: JWT + HTTPS + Rate Limiting
- **Monitoreo**: Prometheus + Grafana

### **🚀 Despliegue en AWS (Recomendado para Fintech)**

#### **PASO 1: Preparar AWS**
```bash
# 1. Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 2. Configurar credenciales
aws configure
# AWS Access Key ID: tu-access-key
# AWS Secret Access Key: tu-secret-key
# Default region name: us-east-1
# Default output format: json
```

#### **PASO 2: Crear EC2 Instance**
```bash
# 1. Crear instancia EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t3.micro \
  --key-name tu-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx

# 2. Conectar via SSH
ssh -i tu-key.pem ubuntu@tu-ip-publica
```

#### **PASO 3: Configurar Servidor**
```bash
# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Instalar Nginx
sudo apt install nginx -y
```

#### **PASO 4: Desplegar Aplicación**
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/teofin.git
cd teofin

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
nano .env

# 4. Build y start
npm run build
pm2 start dist/server.js --name "teofin-server"
pm2 startup
pm2 save
```

#### **PASO 5: Configurar Nginx**
```nginx
# /etc/nginx/sites-available/teofin
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### **PASO 6: Configurar SSL con Let's Encrypt**
```bash
# 1. Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# 2. Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# 3. Renovar automáticamente
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **🗄️ Base de Datos (MongoDB Atlas)**

#### **PASO 1: Configurar Seguridad**
```javascript
// Crear índices de seguridad
db.users.createIndex({ email: 1 });
db.users.createIndex({ nationalId: 1 });
db.users.createIndex({ phone: 1 });
db.accounts.createIndex({ userId: 1, accountType: 1 });
db.transactions.createIndex({ transactionId: 1 });
```

---

## 🎮 **4. Betwins - Online Crypto Gaming**

### **🏗️ Arquitectura de Despliegue**
- **Frontend**: Next.js 15 (Vercel/Netlify)
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MongoDB Atlas
- **WebSockets**: Socket.io + Redis
- **Blockchain**: Ethereum/BSC Integration
- **Monitoreo**: Prometheus + Grafana

### **🚀 Despliegue en DigitalOcean (Recomendado para Gaming)**

#### **PASO 1: Crear Droplet**
```bash
# 1. Ir a DigitalOcean Dashboard
# 2. Create > Droplets
# 3. Configuración recomendada:
#    - Image: Ubuntu 22.04 LTS
#    - Size: Basic > Regular > $12/mo (2GB RAM)
#    - Datacenter: NYC3 (o el más cercano)
#    - Authentication: SSH Key
```

#### **PASO 2: Configurar Servidor**
```bash
# 1. Conectar via SSH
ssh root@tu-ip

# 2. Crear usuario no-root
adduser betwins
usermod -aG sudo betwins

# 3. Configurar firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw allow 5000
ufw enable
```

#### **PASO 3: Instalar Dependencias**
```bash
# 1. Actualizar sistema
apt update && apt upgrade -y

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 3. Instalar Redis
apt install redis-server -y
systemctl enable redis-server

# 4. Instalar PM2
npm install -g pm2
```

#### **PASO 4: Desplegar Aplicación**
```bash
# 1. Cambiar a usuario betwins
su - betwins

# 2. Clonar repositorio
git clone https://github.com/tu-usuario/betwins.git
cd betwins

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
nano .env

# 5. Build y start
npm run build
pm2 start dist/server.js --name "betwins-server"
pm2 startup
pm2 save
```

#### **PASO 5: Configurar WebSockets y Redis**
```typescript
// src/server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Manejar conexiones de WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  socket.on('join-game', (gameId) => {
    socket.join(`game-${gameId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});
```

### **🗄️ Base de Datos (MongoDB Atlas)**

#### **PASO 1: Configurar Colecciones de Gaming**
```javascript
// Crear índices para gaming
db.users.createIndex({ username: 1 });
db.users.createIndex({ walletAddress: 1 });
db.games.createIndex({ gameId: 1 });
db.gamesessions.createIndex({ sessionId: 1 });
db.gamesessions.createIndex({ userId: 1, createdAt: -1 });
```

---

## 🌐 **5. Despliegue Frontend (Todos los Proyectos)**

### **🚀 Vercel (Recomendado)**

#### **PASO 1: Configurar Vercel.json**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://tu-api.vercel.app"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### **PASO 2: Despliegue Automático**
```bash
# 1. Conectar con GitHub
# 2. Configurar auto-deploy
# 3. Cada push a main se despliega automáticamente
```

### **🚀 Netlify (Alternativa)**

#### **PASO 1: Configurar netlify.toml**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔒 **6. Configuración de Seguridad**

### **🔐 Variables de Entorno Críticas**
```bash
# Todas las aplicaciones
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=tu-secreto-super-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=24h

# API Keys
API_KEY=tu-api-key-secreta
API_SECRET=tu-api-secret-secreta

# CORS
CORS_ORIGIN=https://tu-dominio.com
```

### **🛡️ Headers de Seguridad**
```typescript
// src/middleware/security.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

## 📊 **7. Monitoreo y Logs**

### **📈 PM2 Monitoring**
```bash
# Ver logs en tiempo real
pm2 logs betwins-server

# Ver estadísticas
pm2 monit

# Ver información del proceso
pm2 show betwins-server

# Reiniciar aplicación
pm2 restart betwins-server
```

### **📊 Prometheus + Grafana**
```typescript
// src/monitoring/metrics.ts
import prometheus from 'prom-client';

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration / 1000);
  });
  
  next();
};
```

---

## 🚀 **8. Scripts de Despliegue Automatizado**

### **📜 Script para Vercel**
```bash
#!/bin/bash
# deploy-vercel.sh

echo "🚀 Desplegando en Vercel..."

# Build del proyecto
npm run build

# Verificar build exitoso
if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
    
    # Desplegar en Vercel
    vercel --prod
    
    echo "🎉 Despliegue completado!"
else
    echo "❌ Error en el build"
    exit 1
fi
```

### **📜 Script para AWS**
```bash
#!/bin/bash
# deploy-aws.sh

echo "🚀 Desplegando en AWS..."

# Variables
EC2_INSTANCE_ID="i-xxxxxxxxx"
EC2_KEY_PATH="~/tu-key.pem"
EC2_USER="ubuntu"
PROJECT_NAME="tu-proyecto"

# Build del proyecto
npm run build

# Crear archivo de despliegue
tar -czf deploy.tar.gz dist/ package.json

# Copiar a EC2
scp -i $EC2_KEY_PATH deploy.tar.gz $EC2_USER@$EC2_INSTANCE_ID:~/

# Ejecutar en EC2
ssh -i $EC2_KEY_PATH $EC2_USER@$EC2_INSTANCE_ID << 'EOF'
    # Parar aplicación
    pm2 stop $PROJECT_NAME
    
    # Extraer archivos
    tar -xzf deploy.tar.gz
    
    # Instalar dependencias
    npm install --production
    
    # Reiniciar aplicación
    pm2 start $PROJECT_NAME
    
    # Limpiar archivos
    rm deploy.tar.gz
EOF

echo "🎉 Despliegue en AWS completado!"
```

---

## 🔧 **9. Solución de Problemas Comunes**

### **❌ Error: "Cannot find module"**
```bash
# Solución: Verificar node_modules
rm -rf node_modules package-lock.json
npm install
```

### **❌ Error: "Port already in use"**
```bash
# Solución: Cambiar puerto o matar proceso
lsof -ti:5000 | xargs kill -9
# O cambiar en .env: PORT=5001
```

### **❌ Error: "MongoDB connection failed"**
```bash
# Solución: Verificar connection string y red
# 1. Verificar MONGODB_URI en .env
# 2. Verificar IP en MongoDB Atlas
# 3. Verificar credenciales
```

### **❌ Error: "Build failed"**
```bash
# Solución: Verificar TypeScript
npm run type-check
npm run lint
# Corregir errores antes del build
```

---

## 📚 **10. Recursos Adicionales**

### **🌐 Plataformas de Despliegue**
- [Vercel](https://vercel.com/) - Frontend y Full-stack
- [Netlify](https://netlify.com/) - Frontend y funciones
- [AWS](https://aws.amazon.com/) - Infraestructura completa
- [DigitalOcean](https://digitalocean.com/) - Droplets y App Platform
- [Heroku](https://heroku.com/) - PaaS simple

### **🗄️ Bases de Datos**
- [MongoDB Atlas](https://www.mongodb.com/atlas) - MongoDB en la nube
- [AWS RDS](https://aws.amazon.com/rds/) - Bases de datos relacionales
- [PlanetScale](https://planetscale.com/) - MySQL serverless

### **🔧 Herramientas de Despliegue**
- [PM2](https://pm2.keymetrics.io/) - Gestor de procesos Node.js
- [Docker](https://docker.com/) - Contenedores
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [CircleCI](https://circleci.com/) - CI/CD alternativo

---

## 🎉 **¡Despliegue Completado!**

### **✅ Checklist Final**
- [ ] Aplicación funcionando en producción
- [ ] Base de datos conectada y funcionando
- [ ] Variables de entorno configuradas
- [ ] SSL/HTTPS configurado
- [ ] Monitoreo y logs funcionando
- [ ] Backup automático configurado
- [ ] CI/CD pipeline funcionando
- [ ] Documentación actualizada

### **🚀 Próximos Pasos**
1. **Configurar monitoreo** de performance
2. **Implementar backup** automático
3. **Configurar alertas** de errores
4. **Optimizar** para SEO
5. **Implementar** CDN para assets
6. **Configurar** análisis de usuarios

---

*✨ **¡Tu aplicación está ahora en la nube y lista para el mundo!** ✨*

---

*Última actualización: Diciembre 2024*  
*Versión: 1.0.0*  
*Estado: Guía de Despliegue Completada* ✅
