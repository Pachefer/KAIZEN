# 🚀 **PARTE II: FILE-BASED ROUTING - VERSIÓN EXPANDIDA**

## 📚 **ANÁLISIS MINUCIOSO DE CADA TEMA**

### **🎯 CAPÍTULO 4: SISTEMA DE ENRUTAMIENTO BASADO EN ARCHIVOS**

#### **🔍 ANÁLISIS DETALLADO: File-Based Routing en Next.js 15**

##### **🟢 NIVEL BÁSICO: Fundamentos del Sistema de Rutas**

###### **¿Qué es File-Based Routing?**
El sistema de enrutamiento basado en archivos de Next.js 15 es una revolución en la organización de aplicaciones web, donde la estructura de carpetas define automáticamente las rutas de la aplicación.

**Principios Fundamentales:**
- **Convención sobre configuración**: La estructura de carpetas define las rutas
- **Rutas anidadas automáticas**: Las subcarpetas crean rutas anidadas
- **Layouts compartidos**: Los archivos `layout.tsx` se aplican automáticamente
- **Rutas dinámicas**: Los corchetes `[param]` crean parámetros dinámicos
- **Rutas catch-all**: Los corchetes con puntos `[...param]` capturan múltiples segmentos

###### **Estructura Básica de Carpetas**
```bash
src/app/
├── page.tsx                 # Ruta: /
├── about/
│   └── page.tsx            # Ruta: /about
├── blog/
│   ├── page.tsx            # Ruta: /blog
│   ├── [slug]/
│   │   └── page.tsx        # Ruta: /blog/[slug]
│   └── category/
│       └── [category]/
│           └── page.tsx    # Ruta: /blog/category/[category]
├── dashboard/
│   ├── layout.tsx          # Layout compartido para /dashboard/*
│   ├── page.tsx            # Ruta: /dashboard
│   ├── profile/
│   │   └── page.tsx        # Ruta: /dashboard/profile
│   └── settings/
│       └── page.tsx        # Ruta: /dashboard/settings
└── api/
    ├── users/
    │   └── route.ts        # API: /api/users
    └── posts/
        └── route.ts        # API: /api/posts
```

###### **Página Principal con Metadata Dinámica**
```tsx
// src/app/page.tsx - Página principal con metadata dinámica
import { Metadata } from 'next';
import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedPosts from '@/components/FeaturedPosts';
import NewsletterSignup from '@/components/NewsletterSignup';

// Metadata estática
export const metadata: Metadata = {
  title: 'Mi Aplicación Next.js 15',
  description: 'La mejor aplicación construida con Next.js 15 y React 19',
  keywords: ['Next.js', 'React', 'Full-Stack', 'Web Development'],
  authors: [{ name: 'Tu Nombre' }],
  creator: 'Tu Nombre',
  publisher: 'Tu Empresa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tuapp.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Mi Aplicación Next.js 15',
    description: 'La mejor aplicación construida con Next.js 15 y React 19',
    url: 'https://tuapp.com',
    siteName: 'Mi Aplicación',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mi Aplicación Next.js 15',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Aplicación Next.js 15',
    description: 'La mejor aplicación construida con Next.js 15 y React 19',
    images: ['/og-image.jpg'],
    creator: '@tuhandle',
    site: '@tuapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
    yandex: 'tu-yandex-verification-code',
    yahoo: 'tu-yahoo-verification-code',
  },
};

// Función para generar metadata dinámica
export async function generateMetadata(): Promise<Metadata> {
  // Obtener datos dinámicos (ejemplo: posts destacados)
  const featuredPosts = await fetchFeaturedPosts();
  
  return {
    title: `Mi Aplicación - ${featuredPosts.length} Posts Destacados`,
    description: `Descubre ${featuredPosts.length} posts increíbles sobre desarrollo web`,
    openGraph: {
      title: `Mi Aplicación - ${featuredPosts.length} Posts Destacados`,
      description: `Descubre ${featuredPosts.length} posts increíbles sobre desarrollo web`,
    },
  };
}

// Función para obtener posts destacados
async function fetchFeaturedPosts() {
  // Simular llamada a API
  return [
    { id: 1, title: 'Introducción a Next.js 15' },
    { id: 2, title: 'React 19 Features' },
    { id: 3, title: 'TypeScript Avanzado' },
  ];
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section con Suspense para streaming */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Posts Destacados */}
      <Suspense fallback={<FeaturedPostsSkeleton />}>
        <FeaturedPosts />
      </Suspense>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </main>
  );
}

// Componentes skeleton para loading
function HeroSectionSkeleton() {
  return (
    <div className="h-96 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
      <div className="container mx-auto px-4 py-16">
        <div className="h-8 bg-white/20 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-white/20 rounded mb-8 w-1/2"></div>
        <div className="h-12 bg-white/20 rounded w-48"></div>
      </div>
    </div>
  );
}

function FeaturedPostsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

##### **🟡 NIVEL INTERMEDIO: Rutas Dinámicas y Parámetros Avanzados**

###### **Sistema de Rutas Dinámicas con Validación**
```tsx
// src/app/blog/[slug]/page.tsx - Página de blog con validación de slug
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogPost from '@/components/BlogPost';
import RelatedPosts from '@/components/RelatedPosts';
import Comments from '@/components/Comments';

// Tipos para el post del blog
interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
}

// Función para validar y obtener el post
async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  try {
    // Validar formato del slug
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return null;
    }

    // Simular llamada a API con validación
    const response = await fetch(`${process.env.API_URL}/blog/${slug}`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      return null;
    }

    const post = await response.json();
    
    // Validar estructura de datos
    if (!post.id || !post.title || !post.content) {
      return null;
    }

    return post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Función para generar metadata dinámica
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post No Encontrado',
      description: 'El post que buscas no existe',
    };
  }

  return {
    title: `${post.title} - Mi Blog`,
    description: post.excerpt,
    keywords: [...post.tags, post.category, 'blog', 'desarrollo web'],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`/api/og?title=${encodeURIComponent(post.title)}`],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

// Función para generar parámetros estáticos
export async function generateStaticParams() {
  try {
    // Obtener todos los slugs de posts
    const response = await fetch(`${process.env.API_URL}/blog/slugs`, {
      next: { revalidate: 86400 }, // Revalidar cada día
    });

    if (!response.ok) {
      return [];
    }

    const slugs = await response.json();
    
    // Generar parámetros para build estático
    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Componente principal de la página
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug);

  // Redirigir a 404 si el post no existe
  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {/* Post principal */}
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogPost post={post} />
      </Suspense>

      {/* Posts relacionados */}
      <Suspense fallback={<RelatedPostsSkeleton />}>
        <RelatedPosts 
          currentPostId={post.id}
          category={post.category}
          tags={post.tags}
        />
      </Suspense>

      {/* Comentarios */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments postId={post.id} />
      </Suspense>
    </article>
  );
}

// Componentes skeleton para loading
function BlogPostSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-8 w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedPostsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded mb-8 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommentsSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="h-8 bg-gray-200 rounded mb-8 w-48"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

##### **🔴 NIVEL AVANZADO: Rutas Catch-All y Patrones Complejos**

###### **Sistema de Rutas Catch-All con Navegación Jerárquica**
```tsx
// src/app/docs/[...slug]/page.tsx - Sistema de documentación con rutas catch-all
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import DocNavigation from '@/components/DocNavigation';
import DocContent from '@/components/DocContent';
import DocTableOfContents from '@/components/DocTableOfContents';
import DocBreadcrumbs from '@/components/DocBreadcrumbs';

// Tipos para la documentación
interface DocPage {
  id: string;
  slug: string[];
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  relatedPages: string[];
}

interface DocStructure {
  [key: string]: {
    title: string;
    children?: DocStructure;
    page?: DocPage;
  };
}

// Función para obtener la estructura de la documentación
async function getDocStructure(): Promise<DocStructure> {
  try {
    const response = await fetch(`${process.env.API_URL}/docs/structure`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching doc structure:', error);
    return {};
  }
}

// Función para obtener una página específica de la documentación
async function getDocPage(slug: string[]): Promise<DocPage | null> {
  try {
    const slugPath = slug.join('/');
    
    // Validar formato del slug
    if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(slugPath)) {
      return null;
    }

    const response = await fetch(`${process.env.API_URL}/docs/${slugPath}`, {
      next: { revalidate: 1800 }, // Revalidar cada 30 minutos
    });

    if (!response.ok) {
      return null;
    }

    const page = await response.json();
    
    // Validar estructura de datos
    if (!page.id || !page.title || !page.content) {
      return null;
    }

    return page;
  } catch (error) {
    console.error('Error fetching doc page:', error);
    return null;
  }
}

// Función para generar metadata dinámica
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string[] } 
}): Promise<Metadata> {
  const page = await getDocPage(params.slug);

  if (!page) {
    return {
      title: 'Documentación No Encontrada',
      description: 'La página de documentación que buscas no existe',
    };
  }

  return {
    title: `${page.title} - Documentación`,
    description: page.excerpt,
    keywords: [...page.tags, page.category, 'documentación', 'desarrollo'],
    authors: [{ name: page.author }],
    openGraph: {
      title: page.title,
      description: page.excerpt,
      type: 'article',
      tags: page.tags,
    },
    alternates: {
      canonical: `/docs/${params.slug.join('/')}`,
    },
  };
}

// Función para generar parámetros estáticos
export async function generateStaticParams() {
  try {
    const structure = await getDocStructure();
    const params: { slug: string[] }[] = [];

    // Función recursiva para generar todos los parámetros
    function generateParams(
      currentStructure: DocStructure, 
      currentPath: string[] = []
    ) {
      Object.entries(currentStructure).forEach(([key, value]) => {
        const newPath = [...currentPath, key];
        
        if (value.page) {
          params.push({ slug: newPath });
        }
        
        if (value.children) {
          generateParams(value.children, newPath);
        }
      });
    }

    generateParams(structure);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Componente principal de la página de documentación
export default async function DocPage({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  const [page, structure] = await Promise.all([
    getDocPage(params.slug),
    getDocStructure(),
  ]);

  // Redirigir a 404 si la página no existe
  if (!page) {
    notFound();
  }

  // Generar breadcrumbs
  const breadcrumbs = params.slug.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: `/docs/${params.slug.slice(0, index + 1).join('/')}`,
    isLast: index === params.slug.length - 1,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <DocBreadcrumbs items={breadcrumbs} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navegación lateral */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<DocNavigationSkeleton />}>
              <DocNavigation 
                structure={structure}
                currentPath={params.slug}
              />
            </Suspense>
          </aside>

          {/* Contenido principal */}
          <main className="lg:col-span-2">
            <Suspense fallback={<DocContentSkeleton />}>
              <DocContent page={page} />
            </Suspense>
          </main>

          {/* Tabla de contenidos */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<DocTableOfContentsSkeleton />}>
              <DocTableOfContents content={page.content} />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Componentes skeleton para loading
function DocNavigationSkeleton() {
  return (
    <nav className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </nav>
  );
}

function DocContentSkeleton() {
  return (
    <article className="bg-white rounded-lg shadow p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </article>
  );
}

function DocTableOfContentsSkeleton() {
  return (
    <nav className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </nav>
  );
}
```

---

#### **🔍 ANÁLISIS DETALLADO: Route Groups y Organización Avanzada**

##### **🟢 NIVEL BÁSICO: Route Groups para Organización**

###### **Sistema de Route Groups para Separación Lógica**
```tsx
// src/app/(marketing)/layout.tsx - Layout para páginas de marketing
import { Metadata } from 'next';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export const metadata: Metadata = {
  title: {
    default: 'Mi Aplicación - Soluciones de Desarrollo Web',
    template: '%s | Mi Aplicación',
  },
  description: 'Soluciones profesionales de desarrollo web con Next.js 15 y React 19',
  keywords: ['desarrollo web', 'Next.js', 'React', 'full-stack'],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
```

```tsx
// src/app/(dashboard)/layout.tsx - Layout para páginas del dashboard
import { Metadata } from 'next';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard - Mi Aplicación',
    template: '%s | Dashboard',
  },
  description: 'Panel de control de tu aplicación',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticación
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

##### **🟡 NIVEL INTERMEDIO: Patrones de Navegación Avanzados**

###### **Sistema de Navegación con Estado Persistente**
```tsx
// src/components/navigation/AdvancedNavigation.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface NavigationState {
  expandedSections: string[];
  lastVisited: string[];
  favorites: string[];
  searchHistory: string[];
  collapsed: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  badge?: string;
  isNew?: boolean;
  isBeta?: boolean;
}

interface AdvancedNavigationProps {
  items: NavigationItem[];
  onNavigate?: (href: string) => void;
}

export default function AdvancedNavigation({ 
  items, 
  onNavigate 
}: AdvancedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [navigationState, setNavigationState] = useLocalStorage<NavigationState>(
    'navigation-state',
    {
      expandedSections: [],
      lastVisited: [],
      favorites: [],
      searchHistory: [],
      collapsed: false,
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // Función para navegar a una ruta
  const navigateTo = useCallback((href: string) => {
    // Actualizar historial de visitas
    setNavigationState(prev => ({
      ...prev,
      lastVisited: [
        href,
        ...prev.lastVisited.filter(h => h !== href),
      ].slice(0, 10), // Mantener solo las últimas 10 visitas
    }));

    // Llamar callback personalizado si existe
    if (onNavigate) {
      onNavigate(href);
    } else {
      router.push(href);
    }
  }, [router, onNavigate, setNavigationState]);

  // Función para alternar sección expandida
  const toggleSection = useCallback((sectionId: string) => {
    setNavigationState(prev => ({
      ...prev,
      expandedSections: prev.expandedSections.includes(sectionId)
        ? prev.expandedSections.filter(id => id !== sectionId)
        : [...prev.expandedSections, sectionId],
    }));
  }, [setNavigationState]);

  // Función para agregar/quitar de favoritos
  const toggleFavorite = useCallback((href: string) => {
    setNavigationState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(href)
        ? prev.favorites.filter(h => h !== href)
        : [...prev.favorites, href],
    }));
  }, [setNavigationState]);

  // Función para buscar en la navegación
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    const searchResults = items.filter(item => 
      searchInNavigationItem(item, query.toLowerCase())
    );
    
    setFilteredItems(searchResults);
    
    // Guardar en historial de búsqueda
    if (query.trim()) {
      setNavigationState(prev => ({
        ...prev,
        searchHistory: [
          query,
          ...prev.searchHistory.filter(q => q !== query),
        ].slice(0, 10),
      }));
    }
  }, [items, setNavigationState]);

  // Función recursiva para buscar en items anidados
  const searchInNavigationItem = (item: NavigationItem, query: string): boolean => {
    if (item.label.toLowerCase().includes(query)) {
      return true;
    }
    
    if (item.children) {
      return item.children.some(child => searchInNavigationItem(child, query));
    }
    
    return false;
  }

  // Función para alternar estado colapsado
  const toggleCollapsed = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  }, [setNavigationState]);

  // Efecto para filtrar items cuando cambia la búsqueda
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Función para renderizar un item de navegación
  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = navigationState.expandedSections.includes(item.id);
    const isFavorite = navigationState.favorites.includes(item.href);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="space-y-1">
        <div
          className={`
            group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
            ${isActive
              ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
            ${level > 0 ? 'ml-4' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              navigateTo(item.href);
            }
          }}
        >
          <item.icon
            className={`
              mr-3 h-5 w-5 flex-shrink-0
              ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
            `}
          />
          
          <span className="flex-1">{item.label}</span>
          
          {/* Badges y indicadores */}
          {item.badge && (
            <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.badge}
            </span>
          )}
          
          {item.isNew && (
            <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Nuevo
            </span>
          )}
          
          {item.isBeta && (
            <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Beta
            </span>
          )}
          
          {/* Botón de favorito */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.href);
            }}
            className={`
              ml-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity
              ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
            `}
          >
            <svg className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          
          {/* Flecha para items con hijos */}
          {hasChildren && (
            <svg
              className={`
                ml-auto h-4 w-4 transition-transform
                ${isExpanded ? 'rotate-180' : ''}
              `}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        
        {/* Renderizar hijos si están expandidos */}
        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`
      bg-white border-r border-gray-200 transition-all duration-300
      ${navigationState.collapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header de navegación */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className={`
            font-semibold text-gray-900 transition-opacity
            ${navigationState.collapsed ? 'opacity-0' : 'opacity-100'}
          `}>
            Navegación
          </h2>
          
          <button
            onClick={toggleCollapsed}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Barra de búsqueda */}
        {!navigationState.collapsed && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar en navegación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
      
      {/* Contenido de navegación */}
      <div className="p-4 space-y-2">
        {filteredItems.map(item => renderNavigationItem(item))}
      </div>
      
      {/* Sección de favoritos */}
      {!navigationState.collapsed && navigationState.favorites.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Favoritos</h3>
          <div className="space-y-1">
            {navigationState.favorites.map(href => {
              const item = items.find(i => i.href === href);
              if (!item) return null;
              
              return (
                <div
                  key={href}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md cursor-pointer"
                  onClick={() => navigateTo(href)}
                >
                  <item.icon className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS EXPANDIDOS**

### **🟢 Ejercicio Básico: Sistema de Rutas Básico**
Implementa un sistema de rutas básico con:
- Página principal con metadata dinámica
- Páginas estáticas (about, contact)
- Layout compartido con header y footer
- Navegación entre páginas

### **🟡 Ejercicio Intermedio: Blog con Rutas Dinámicas**
Crea un sistema de blog completo con:
- Rutas dinámicas para posts individuales
- Categorías y tags con rutas anidadas
- Sistema de búsqueda y filtrado
- Paginación de posts
- Metadata dinámica para SEO

### **🔴 Ejercicio Avanzado: Sistema de Documentación**
Implementa un sistema de documentación avanzado con:
- Rutas catch-all para documentación jerárquica
- Sistema de navegación con estado persistente
- Búsqueda en tiempo real
- Favoritos y historial de visitas
- Generación estática de todas las páginas

---

## 📝 **RESUMEN DEL CAPÍTULO EXPANDIDO**

En esta versión expandida de la Parte II hemos cubierto con minuciosidad:

### **🗂️ File-Based Routing:**
- ✅ **Sistema de rutas completo** con convenciones automáticas
- ✅ **Rutas dinámicas** con validación y generación estática
- ✅ **Rutas catch-all** para sistemas jerárquicos complejos
- ✅ **Route groups** para organización lógica de aplicaciones
- ✅ **Metadata dinámica** para SEO optimizado

### **🔧 Patrones Avanzados:**
- ✅ **Generación estática** con `generateStaticParams`
- ✅ **Validación de parámetros** con regex y tipos
- ✅ **Manejo de errores** con `notFound()` y redirecciones
- ✅ **Suspense y streaming** para mejor UX
- ✅ **Navegación inteligente** con estado persistente

### **📱 Componentes de Navegación:**
- ✅ **Navegación lateral** con expansión/colapso
- ✅ **Sistema de favoritos** y historial
- ✅ **Búsqueda en tiempo real** en la navegación
- ✅ **Breadcrumbs dinámicos** para rutas complejas
- ✅ **Estado persistente** con localStorage

En el siguiente capítulo expandido aprenderemos sobre layouts y templates con patrones avanzados y optimizaciones de rendimiento.
