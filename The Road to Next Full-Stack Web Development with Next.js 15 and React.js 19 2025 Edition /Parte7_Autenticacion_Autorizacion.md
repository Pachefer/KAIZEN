# PARTE VII: AUTENTICACIÓN, AUTORIZACIÓN Y NAVEGACIÓN AVANZADA

## 🔐 **CAPÍTULO 13: AUTENTICACIÓN Y AUTORIZACIÓN**

### 🟢 **NIVEL BÁSICO: Sistema de Autenticación con NextAuth.js**

#### **Instalación y Configuración:**
```bash
npm install next-auth @auth/prisma-adapter
```

#### **Configuración Básica:**
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

---

### 🟡 **NIVEL INTERMEDIO: Componentes de Autenticación**

#### **Componente de Login:**
```tsx
// src/app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Middleware y Autorización**

#### **Middleware de Autenticación:**
```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isProtectedRoute && !isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
```

---

## 🧭 **CAPÍTULO 14: NAVEGACIÓN AVANZADA**

### 🟢 **NIVEL BÁSICO: Breadcrumbs y Tabs**

#### **Componente de Breadcrumbs:**
```tsx
// src/components/navigation/Breadcrumbs.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-400 hover:text-gray-500">
            Inicio
          </Link>
        </li>
        
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          
          return (
            <li key={segment} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-900 font-medium">
                  {segment}
                </span>
              ) : (
                <Link href={href} className="text-gray-500 hover:text-gray-700">
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Implementa un sistema de login/logout básico con NextAuth.js.

### **Ejercicio Intermedio:**
Crea un sidebar responsive con navegación jerárquica.

### **Ejercicio Avanzado:**
Implementa un sistema de autorización completo con middleware.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta séptima parte hemos cubierto:
- ✅ Sistema de autenticación con NextAuth.js
- ✅ Componentes de login y registro
- ✅ Middleware de autenticación y autorización
- ✅ Navegación avanzada (breadcrumbs, tabs)

En el siguiente capítulo aprenderemos sobre paginación y búsqueda avanzada.
