# PARTE II: NEXT.JS 15 Y APP ROUTER

## 🚀 **CAPÍTULO 4: NEXT.JS 15 - CONFIGURACIÓN INICIAL**

### 🟢 **NIVEL BÁSICO: Crear tu Primera Aplicación Next.js**

#### **Instalación con create-next-app:**
```bash
# Crear nueva aplicación Next.js
npx create-next-app@latest mi-aplicacion --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navegar al directorio
cd mi-aplicacion

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

#### **Estructura de Archivos Básica:**
```
mi-aplicacion/
├── src/
│   ├── app/                    # App Router (nuevo sistema)
│   │   ├── globals.css         # Estilos globales
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Página principal (/)
│   │   └── favicon.ico         # Icono de la aplicación
│   ├── components/             # Componentes reutilizables
│   ├── lib/                    # Utilidades y configuraciones
│   └── types/                  # Tipos de TypeScript
├── public/                     # Archivos estáticos
├── prisma/                     # Base de datos (si usas Prisma)
├── package.json                # Dependencias y scripts
├── next.config.js              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
└── tsconfig.json               # Configuración de TypeScript
```

#### **Página Principal Básica:**
```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-center text-gray-900 mb-8">
          ¡Bienvenido a Next.js 15!
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
          La plataforma más moderna para crear aplicaciones web full-stack con React
        </p>
        <div className="flex justify-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Comenzar
          </button>
        </div>
      </div>
    </main>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Configuración Avanzada y Optimizaciones**

#### **Configuración de Next.js:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar experimental features
  experimental: {
    // Optimizaciones de React 19
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    // Mejoras en el bundler
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Configuración de imágenes
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuración de headers HTTP
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
  
  // Configuración de redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Configuración de rewrites
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

#### **Configuración de Tailwind CSS Avanzada:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Habilitar modo oscuro
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
```

---

### 🔴 **NIVEL AVANZADO: Configuración Empresarial y Micro-Frontends**

#### **Configuración para Micro-Frontends:**
```typescript
// next.config.js para arquitectura de micro-frontends
const { ModuleFederationPlugin } = require('webpack').container;

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'host-app',
          remotes: {
            'remote-app': 'remoteApp@http://localhost:3001/remoteEntry.js',
            'auth-module': 'authModule@http://localhost:3002/remoteEntry.js',
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
            'react-dom': {
              singleton: true,
              requiredVersion: '^18.0.0',
            },
          },
        })
      );
    }
    return config;
  },
  
  // Configuración de build optimizada
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
};

module.exports = nextConfig;
```

---

## 🗂️ **CAPÍTULO 5: SISTEMA DE ENRUTAMIENTO BASADO EN ARCHIVOS**

### 🟢 **NIVEL BÁSICO: Páginas y Rutas Simples**

#### **Crear Páginas Básicas:**
```tsx
// src/app/about/page.tsx - Ruta: /about
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Acerca de Nosotros</h1>
      <p className="text-lg text-gray-600">
        Somos una empresa dedicada al desarrollo de software de alta calidad.
      </p>
    </div>
  );
}

// src/app/contact/page.tsx - Ruta: /contact
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Contacto</h1>
      <div className="max-w-md">
        <p className="mb-4">Email: info@empresa.com</p>
        <p>Teléfono: +1 234 567 890</p>
      </div>
    </div>
  );
}
```

#### **Navegación entre Páginas:**
```tsx
// src/components/Navigation.tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Mi App
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Inicio
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Acerca de
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Rutas Dinámicas y Parámetros**

#### **Rutas Dinámicas:**
```tsx
// src/app/blog/[slug]/page.tsx - Ruta: /blog/cualquier-titulo
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">
        {decodeURIComponent(slug)}
      </h1>
      <div className="prose prose-lg max-w-none">
        <p>Contenido del blog post...</p>
      </div>
    </article>
  );
}
```

#### **Rutas con Múltiples Parámetros:**
```tsx
// src/app/category/[category]/product/[id]/page.tsx
// Ruta: /category/electronics/product/123
interface ProductPageProps {
  params: {
    category: string;
    id: string;
  };
  searchParams: {
    color?: string;
    size?: string;
  };
}

export default function ProductPage({ params, searchParams }: ProductPageProps) {
  const { category, id } = params;
  const { color, size } = searchParams;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <span className="text-gray-500">Categoría: {category}</span>
        <span className="mx-2">•</span>
        <span className="text-gray-500">ID: {id}</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Producto {id}</h1>
      
      {color && <p>Color seleccionado: {color}</p>}
      {size && <p>Tamaño seleccionado: {size}</p>}
    </div>
  );
}
```

#### **Generación de Rutas Estáticas:**
```tsx
// src/app/blog/[slug]/page.tsx
interface BlogPost {
  slug: string;
  title: string;
  content: string;
}

// Generar rutas estáticas en tiempo de build
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // En un caso real, esto vendría de una API o base de datos
  const posts: BlogPost[] = [
    { slug: 'primer-post', title: 'Primer Post', content: 'Contenido...' },
    { slug: 'segundo-post', title: 'Segundo Post', content: 'Contenido...' },
    { slug: 'tercer-post', title: 'Tercer Post', content: 'Contenido...' },
  ];
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // ... resto del componente
}
```

---

### 🔴 **NIVEL AVANZADO: Rutas Anidadas y Grupos de Rutas**

#### **Grupos de Rutas (Route Groups):**
```tsx
// src/app/(marketing)/page.tsx - Ruta: /
// src/app/(marketing)/about/page.tsx - Ruta: /about
// src/app/(marketing)/contact/page.tsx - Ruta: /contact

// src/app/(dashboard)/dashboard/page.tsx - Ruta: /dashboard
// src/app/(dashboard)/dashboard/profile/page.tsx - Ruta: /dashboard/profile

// Layout específico para marketing
// src/app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        {/* Header de marketing */}
      </header>
      <main>{children}</main>
      <footer className="bg-gray-800 text-white">
        {/* Footer de marketing */}
      </footer>
    </div>
  );
}

// Layout específico para dashboard
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        {/* Navegación del dashboard */}
      </nav>
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm">
          {/* Sidebar del dashboard */}
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

#### **Rutas Anidadas Complejas:**
```tsx
// src/app/admin/users/[userId]/posts/[postId]/edit/page.tsx
// Ruta: /admin/users/123/posts/456/edit
interface EditPostPageProps {
  params: {
    userId: string;
    postId: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { userId, postId } = params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <span>Admin</span>
          <span className="mx-2">/</span>
          <span>Usuarios</span>
          <span className="mx-2">/</span>
          <span>{userId}</span>
          <span className="mx-2">/</span>
          <span>Posts</span>
          <span className="mx-2">/</span>
          <span>{postId}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Editar</span>
        </nav>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">
        Editar Post {postId} del Usuario {userId}
      </h1>
      
      {/* Formulario de edición */}
    </div>
  );
}
```

---

## 🎨 **CAPÍTULO 6: LAYOUTS Y TEMPLATES**

### 🟢 **NIVEL BÁSICO: Layout Principal y Anidado**

#### **Layout Principal:**
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mi Aplicación Next.js',
  description: 'Una aplicación moderna construida con Next.js 15 y React 19',
  keywords: ['Next.js', 'React', 'TypeScript', 'Full-Stack'],
  authors: [{ name: 'Tu Nombre' }],
  openGraph: {
    title: 'Mi Aplicación Next.js',
    description: 'Una aplicación moderna construida con Next.js 15 y React 19',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Mi Aplicación. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

#### **Layout Anidado:**
```tsx
// src/app/dashboard/layout.tsx
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Templates y Layouts Condicionales**

#### **Template (se recrea en cada navegación):**
```tsx
// src/app/dashboard/template.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Verificar autenticación en cada navegación
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <div className="dashboard-template">
      {children}
    </div>
  );
}
```

#### **Layout Condicional:**
```tsx
// src/app/layout.tsx
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  
  return (
    <html lang="es">
      <body>
        {isMobile ? (
          <MobileLayout>{children}</MobileLayout>
        ) : (
          <DesktopLayout>{children}</DesktopLayout>
        )}
      </body>
    </html>
  );
}

function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-layout">
      <MobileHeader />
      <main className="mobile-main">{children}</main>
      <MobileFooter />
    </div>
  );
}

function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="desktop-layout">
      <DesktopHeader />
      <div className="flex">
        <DesktopSidebar />
        <main className="desktop-main">{children}</main>
      </div>
      <DesktopFooter />
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Layouts Dinámicos y Metadatos Avanzados**

#### **Metadatos Dinámicos:**
```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generar metadatos dinámicamente
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  
  // En un caso real, esto vendría de una API o base de datos
  const post = await fetchPost(slug);
  
  if (!post) {
    return {
      title: 'Post no encontrado',
      description: 'El post que buscas no existe',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  // ... resto del componente
}
```

#### **Layout con Context y Providers:**
```tsx
// src/app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            gcTime: 10 * 60 * 1000, // 10 minutos
          },
        },
      })
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// src/app/layout.tsx
import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Crea una aplicación con tres páginas: Home, About y Contact, usando el App Router.

### **Ejercicio Intermedio:**
Implementa un sistema de blog con rutas dinámicas y metadatos generados dinámicamente.

### **Ejercicio Avanzado:**
Crea una aplicación de dashboard con layouts anidados, grupos de rutas y autenticación condicional.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta segunda parte hemos cubierto:
- ✅ Configuración inicial de Next.js 15
- ✅ Sistema de enrutamiento basado en archivos (App Router)
- ✅ Rutas estáticas y dinámicas
- ✅ Layouts y templates
- ✅ Metadatos y SEO
- ✅ Configuraciones avanzadas para producción

En el siguiente capítulo aprenderemos sobre Server Components vs Client Components.
