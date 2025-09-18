# GUÍA COMPLETA DE DESPLIEGUE CON VERCEL

## ÍNDICE
1. [Introducción a Vercel](#introducción-a-vercel)
2. [Preparación del Proyecto](#preparación-del-proyecto)
3. [Configuración de Vercel](#configuración-de-vercel)
4. [Despliegue Automático](#despliegue-automático)
5. [Configuración de Dominios](#configuración-de-dominios)
6. [Variables de Entorno](#variables-de-entorno)
7. [Monitoreo y Analytics](#monitoreo-y-analytics)
8. [Optimización de Performance](#optimización-de-performance)
9. [Troubleshooting](#troubleshooting)
10. [Mejores Prácticas](#mejores-prácticas)

## INTRODUCCIÓN A VERCEL

### ¿Qué es Vercel?
Vercel es una plataforma de despliegue y hosting optimizada para aplicaciones web modernas, especialmente diseñada para:
- **Next.js** y aplicaciones React
- **Despliegue automático** desde Git
- **Edge Functions** y Serverless
- **CDN global** para máximo rendimiento
- **Integración continua** con GitHub, GitLab, Bitbucket

### Ventajas de Vercel
- ✅ **Despliegue instantáneo** en cada push
- ✅ **Preview deployments** para cada PR
- ✅ **Rollback automático** en caso de errores
- ✅ **SSL automático** y HTTPS
- ✅ **Integración nativa** con Next.js
- ✅ **Analytics y monitoreo** integrados

## PREPARACIÓN DEL PROYECTO

### 1. Estructura del Proyecto
Asegúrate de que tu proyecto tenga la estructura correcta:

```
mi-proyecto/
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json (opcional)
├── .env.local
├── .env.example
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
└── README.md
```

### 2. Dependencias Requeridas
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 3. Scripts de Build
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "vercel-build": "next build"
  }
}
```

### 4. Configuración de Next.js
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para producción
  output: 'standalone',
  
  // Optimizaciones de imágenes
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
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
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Rewrites para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 5. Configuración de TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## CONFIGURACIÓN DE VERCEL

### 1. Instalación de Vercel CLI
```bash
# Instalación global
npm i -g vercel

# Verificar instalación
vercel --version
```

### 2. Login en Vercel
```bash
# Login con tu cuenta
vercel login

# Verificar estado
vercel whoami
```

### 3. Inicialización del Proyecto
```bash
# En el directorio de tu proyecto
vercel init

# O si ya tienes un proyecto
vercel
```

### 4. Archivo de Configuración Vercel
```json
// vercel.json
{
  "version": 2,
  "name": "mi-proyecto-react",
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
    "NEXT_PUBLIC_APP_URL": "@app-url",
    "NEXT_PUBLIC_API_URL": "@api-url"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 5. Configuración de Build
```bash
# Variables de build
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_API_URL
vercel env add DATABASE_URL
vercel env add JWT_SECRET

# Configuración de build
vercel build
```

## DESPLIEGUE AUTOMÁTICO

### 1. Integración con GitHub

#### Configuración de GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Build project
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

#### Configuración de Secrets en GitHub
```bash
# Obtener tokens de Vercel
vercel token list
vercel teams ls
vercel projects ls

# Configurar en GitHub:
# VERCEL_TOKEN: Token de acceso de Vercel
# ORG_ID: ID de la organización
# PROJECT_ID: ID del proyecto
```

### 2. Despliegue Manual
```bash
# Despliegue a preview
vercel

# Despliegue a producción
vercel --prod

# Despliegue específico
vercel --prod --yes
```

### 3. Configuración de Branches
```bash
# Configurar branch de producción
vercel git connect

# Configurar auto-deploy
vercel git connect --yes
```

## CONFIGURACIÓN DE DOMINIOS

### 1. Dominio Personalizado
```bash
# Agregar dominio
vercel domains add mi-app.com

# Verificar configuración
vercel domains inspect mi-app.com

# Configurar DNS
vercel domains verify mi-app.com
```

### 2. Configuración de DNS
```bash
# Registros DNS necesarios
# A Record: 76.76.19.36
# CNAME: cname.vercel-dns.com
# TXT: @

# Verificar propagación
dig mi-app.com
nslookup mi-app.com
```

### 3. Subdominios
```bash
# Agregar subdominio
vercel domains add api.mi-app.com

# Configurar redirección
vercel redirects add /api/* https://api.mi-app.com/$1 301
```

## VARIABLES DE ENTORNO

### 1. Configuración Local
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=local-secret-key
```

### 2. Configuración en Vercel
```bash
# Agregar variables
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_API_URL production
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production

# Agregar para preview
vercel env add NEXT_PUBLIC_APP_URL preview
vercel env add NEXT_PUBLIC_API_URL preview
vercel env add DATABASE_URL preview
vercel env add JWT_SECRET preview
```

### 3. Variables Sensibles
```bash
# Variables que NO deben ser públicas
DATABASE_URL=@database-url
JWT_SECRET=@jwt-secret
API_KEY=@api-key

# Variables que SÍ pueden ser públicas
NEXT_PUBLIC_APP_URL=https://mi-app.com
NEXT_PUBLIC_API_URL=https://api.mi-app.com
```

### 4. Gestión de Variables
```bash
# Listar variables
vercel env ls

# Ver variable específica
vercel env pull .env.production

# Eliminar variable
vercel env rm NEXT_PUBLIC_APP_URL production
```

## MONITOREO Y ANALYTICS

### 1. Vercel Analytics
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Vercel Speed Insights
```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 3. Monitoreo de Performance
```typescript
// src/lib/performance.ts
export const trackPerformance = (metric: string, value: number) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.performance.mark(`${metric}-start`);
    window.performance.mark(`${metric}-end`);
    window.performance.measure(metric, `${metric}-start`, `${metric}-end`);
  }
};

export const trackWebVitals = (metric: any) => {
  console.log('Web Vital:', metric);
  // Enviar a servicio de analytics
};
```

### 4. Logs y Debugging
```bash
# Ver logs en tiempo real
vercel logs

# Ver logs específicos
vercel logs --follow

# Ver logs de función específica
vercel logs --function=api/hello
```

## OPTIMIZACIÓN DE PERFORMANCE

### 1. Configuración de Build
```typescript
// next.config.js
const nextConfig = {
  // Optimización de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compresión
  compress: true,
  
  // Minificación
  swcMinify: true,
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
```

### 2. Lazy Loading
```typescript
// src/components/LazyComponent.tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./HeavyComponent'));

export function LazyWrapper() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Code Splitting
```typescript
// src/app/page.tsx
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Cargando gráfico...</div>,
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DynamicChart />
    </div>
  );
}
```

### 4. Optimización de CSS
```typescript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Purge CSS en producción
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
    ],
  },
};
```

## TROUBLESHOOTING

### 1. Errores Comunes de Build

#### Error: Module not found
```bash
# Verificar dependencias
npm install
npm run build

# Limpiar cache
rm -rf .next
rm -rf node_modules
npm install
```

#### Error: TypeScript compilation
```bash
# Verificar tipos
npm run type-check

# Verificar configuración
npx tsc --noEmit
```

#### Error: Environment variables
```bash
# Verificar variables en Vercel
vercel env ls

# Verificar archivo .env
cat .env.local
```

### 2. Errores de Runtime

#### Error: API routes not working
```typescript
// Verificar estructura de API
// src/app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' });
}
```

#### Error: Database connection
```typescript
// Verificar conexión a base de datos
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`;
    return Response.json({ time: result.rows[0].now });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### 3. Debugging en Producción
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver métricas de performance
vercel analytics

# Ver estado de funciones
vercel functions ls
```

## MEJORES PRÁCTICAS

### 1. Seguridad
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Headers de seguridad
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 2. Performance
```typescript
// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción de mi aplicación',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

// Preload de recursos críticos
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. SEO
```typescript
// src/app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página Principal',
  description: 'Descripción de la página principal',
  openGraph: {
    title: 'Página Principal',
    description: 'Descripción de la página principal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Página Principal',
    description: 'Descripción de la página principal',
  },
};
```

### 4. Testing
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renderiza correctamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('maneja clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## COMANDOS ÚTILES DE VERCEL

### Comandos Básicos
```bash
# Ver estado del proyecto
vercel status

# Ver información del proyecto
vercel project ls

# Ver deployments
vercel ls

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls
```

### Comandos de Despliegue
```bash
# Despliegue rápido
vercel --prod

# Despliegue con confirmación
vercel --prod --yes

# Despliegue específico
vercel --prod --yes --name=mi-deployment
```

### Comandos de Configuración
```bash
# Conectar con Git
vercel git connect

# Configurar dominio
vercel domains add mi-app.com

# Configurar variables
vercel env add VARIABLE_NAME production
```

## CONCLUSIÓN

Esta guía completa de despliegue con Vercel te proporciona:

✅ **Configuración completa** del proyecto
✅ **Despliegue automático** con CI/CD
✅ **Configuración de dominios** personalizados
✅ **Gestión de variables** de entorno
✅ **Monitoreo y analytics** integrados
✅ **Optimización de performance** completa
✅ **Troubleshooting** detallado
✅ **Mejores prácticas** de seguridad y SEO

Con Vercel, tu aplicación React + TypeScript estará:
- **Desplegada automáticamente** en cada push
- **Optimizada para performance** con CDN global
- **Segura** con HTTPS y headers de seguridad
- **Monitoreada** con analytics en tiempo real
- **Escalable** para cualquier tráfico

¡Tu aplicación estará lista para producción en minutos!
