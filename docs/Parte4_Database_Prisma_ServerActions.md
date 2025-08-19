# PARTE IV: BASE DE DATOS, PRISMA Y SERVER ACTIONS

## 🗄️ **CAPÍTULO 9: BASE DE DATOS Y ORM CON PRISMA**

### 🟢 **NIVEL BÁSICO: Configuración Inicial de Prisma**

#### **Instalación y Configuración:**
```bash
# Instalar Prisma
npm install prisma @prisma/client

# Inicializar Prisma
npx prisma init

# Instalar dependencias adicionales
npm install @prisma/client
npm install -D prisma
```

#### **Configuración del Archivo .env:**
```env
# .env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
# O para SQLite (desarrollo)
# DATABASE_URL="file:./dev.db"

# Variables de entorno adicionales
NEXTAUTH_SECRET="tu-secreto-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

#### **Esquema Básico de Prisma:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o "mysql", "sqlite", "sqlserver"
  url      = env("DATABASE_URL")
}

// Modelo de Usuario básico
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  posts     Post[]
  comments  Comment[]
  
  @@map("users")
}

// Modelo de Post básico
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  
  @@map("posts")
}

// Modelo de Comentario básico
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("comments")
}
```

---

### 🟡 **NIVEL INTERMEDIO: Esquemas Avanzados y Relaciones**

#### **Esquema Completo con Relaciones Avanzadas:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums para valores predefinidos
enum UserRole {
  USER
  MODERATOR
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

// Modelo de Usuario avanzado
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  avatar        String?
  bio           String?
  role          UserRole  @default(USER)
  isVerified    Boolean   @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relaciones
  posts         Post[]
  comments      Comment[]
  tickets       Ticket[]
  assignedTickets Ticket[] @relation("AssignedTickets")
  notifications Notification[]
  sessions      Session[]
  
  // Índices para optimización
  @@index([email])
  @@index([role])
  @@index([createdAt])
  @@map("users")
}

// Modelo de Post avanzado
model Post {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  excerpt     String?
  content     String     @db.Text
  featuredImage String?
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  // Relaciones
  authorId    String
  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
  tags        Tag[]
  comments    Comment[]
  likes       Like[]
  
  // Índices
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([authorId])
  @@map("posts")
}

// Modelo de Categoría
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relaciones
  posts       Post[]
  
  @@map("categories")
}

// Modelo de Tag
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())
  
  // Relaciones many-to-many con Post
  posts     Post[]
  
  @@map("tags")
}

// Modelo de Ticket (Sistema de soporte)
model Ticket {
  id          String         @id @default(cuid())
  title       String
  description String         @db.Text
  priority    TicketPriority @default(MEDIUM)
  status      TicketStatus   @default(OPEN)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  resolvedAt  DateTime?
  
  // Relaciones
  authorId    String
  author      User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?          @relation("AssignedTickets", fields: [assigneeId], references: [id])
  categoryId  String?
  category    TicketCategory? @relation(fields: [categoryId], references: [id])
  comments    TicketComment[]
  
  // Índices
  @@index([status])
  @@index([priority])
  @@index([authorId])
  @@index([assigneeId])
  @@map("tickets")
}

// Modelo de Categoría de Ticket
model TicketCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  
  // Relaciones
  tickets     Ticket[]
  
  @@map("ticket_categories")
}

// Modelo de Comentario de Ticket
model TicketComment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  isInternal Boolean @default(false) // Para comentarios internos del equipo
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  ticketId  String
  ticket    Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("ticket_comments")
}

// Modelo de Like para Posts
model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  // Relaciones
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Índice compuesto para evitar likes duplicados
  @@unique([postId, userId])
  @@map("likes")
}

// Modelo de Notificación
model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  isRead    Boolean  @default(false)
  type      String   // "ticket_assigned", "comment_added", etc.
  createdAt DateTime @default(now())
  
  // Relaciones
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead])
  @@map("notifications")
}

// Modelo de Sesión para autenticación
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  createdAt    DateTime @default(now())
  
  // Relaciones
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}
```

---

### 🔴 **NIVEL AVANZADO: Patrones de Base de Datos y Optimizaciones**

#### **Esquema con Soft Deletes y Auditoría:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelo base para auditoría
model BaseModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime? // Soft delete
  createdBy String?
  updatedBy String?
  
  @@map("base_models")
}

// Modelo de Usuario con auditoría completa
model User extends BaseModel {
  email         String    @unique
  name          String?
  password      String
  avatar        String?
  bio           String?
  role          UserRole  @default(USER)
  isVerified    Boolean   @default(false)
  lastLoginAt   DateTime?
  loginCount    Int       @default(0)
  isActive      Boolean   @default(true)
  
  // Relaciones
  posts         Post[]
  comments      Comment[]
  tickets       Ticket[]
  assignedTickets Ticket[] @relation("AssignedTickets")
  notifications Notification[]
  sessions      Session[]
  auditLogs     AuditLog[] @relation("UserAuditLogs")
  
  // Índices compuestos para optimización
  @@index([email, isActive])
  @@index([role, isActive])
  @@index([createdAt, isActive])
  @@map("users")
}

// Modelo de Auditoría
model AuditLog {
  id          String   @id @default(cuid())
  action      String   // CREATE, UPDATE, DELETE
  tableName   String
  recordId    String
  oldValues   Json?    // Valores anteriores
  newValues   Json?    // Valores nuevos
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  // Relaciones
  userId      String?
  user        User?    @relation("UserAuditLogs", fields: [userId], references: [id])
  
  @@index([tableName, recordId])
  @@index([action, createdAt])
  @@index([userId, createdAt])
  @@map("audit_logs")
}

// Modelo de Post con versionado
model Post extends BaseModel {
  title         String     @db.VarChar(255)
  slug          String     @unique
  excerpt       String?    @db.VarChar(500)
  content       String     @db.Text
  featuredImage String?
  status        PostStatus @default(DRAFT)
  publishedAt   DateTime?
  viewCount     Int        @default(0)
  likeCount     Int        @default(0)
  commentCount  Int        @default(0)
  version       Int        @default(1)
  
  // Relaciones
  authorId      String
  author        User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId    String?
  category      Category?  @relation(fields: [categoryId], references: [id])
  tags          Tag[]
  comments      Comment[]
  likes         Like[]
  versions      PostVersion[]
  
  // Índices para búsqueda y filtrado
  @@index([slug, status])
  @@index([status, publishedAt])
  @@index([authorId, status])
  @@index([categoryId, status])
  @@index([viewCount, publishedAt])
  @@map("posts")
}

// Modelo de Versión de Post para historial
model PostVersion {
  id          String   @id @default(cuid())
  postId      String
  version     Int
  title       String
  content     String
  excerpt     String?
  createdAt   DateTime @default(now())
  
  // Relaciones
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@unique([postId, version])
  @@index([postId, version])
  @@map("post_versions")
}

// Modelo de Ticket con workflow avanzado
model Ticket extends BaseModel {
  title         String         @db.VarChar(255)
  description   String         @db.Text
  priority      TicketPriority @default(MEDIUM)
  status        TicketStatus   @default(OPEN)
  resolvedAt    DateTime?
  dueDate       DateTime?
  estimatedHours Float?
  actualHours   Float?
  slaBreached   Boolean        @default(false)
  
  // Relaciones
  authorId      String
  author        User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  assigneeId    String?
  assignee      User?          @relation("AssignedTickets", fields: [assigneeId], references: [id])
  categoryId    String?
  category      TicketCategory? @relation(fields: [categoryId], references: [id])
  comments      TicketComment[]
  attachments   Attachment[]
  timeEntries   TimeEntry[]
  
  // Índices para reporting y búsqueda
  @@index([status, priority])
  @@index([assigneeId, status])
  @@index([categoryId, status])
  @@index([dueDate, status])
  @@index([createdAt, status])
  @@map("tickets")
}

// Modelo de Adjunto para tickets
model Attachment {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  mimeType    String
  size        Int
  path        String
  createdAt   DateTime @default(now())
  
  // Relaciones
  ticketId    String
  ticket      Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  uploadedById String
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  
  @@index([ticketId])
  @@map("attachments")
}

// Modelo de Entrada de Tiempo
model TimeEntry {
  id          String   @id @default(cuid())
  description String
  hours       Float
  date        DateTime
  createdAt   DateTime @default(now())
  
  // Relaciones
  ticketId    String
  ticket      Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([ticketId, date])
  @@index([userId, date])
  @@map("time_entries")
}
```

---

## ⚡ **CAPÍTULO 10: SERVER ACTIONS Y FORMULARIOS**

### 🟢 **NIVEL BÁSICO: Server Actions Simples**

#### **Server Action Básico:**
```tsx
// src/app/actions/userActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Esquema de validación
const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function createUser(formData: FormData) {
  // Validar datos del formulario
  const validatedFields = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Aquí iría la lógica para crear el usuario en la base de datos
    // const user = await db.user.create({ data: { name, email, password } });
    
    console.log('Usuario creado:', { name, email, password });
    
    // Revalidar la página para mostrar el nuevo usuario
    revalidatePath('/users');
    
    // Redirigir a la lista de usuarios
    redirect('/users');
  } catch (error) {
    return {
      message: 'Error al crear el usuario',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

#### **Formulario con Server Action:**
```tsx
// src/app/users/create/page.tsx
import { createUser } from '@/app/actions/userActions';

export default function CreateUserPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Usuario</h1>
      
      <form action={createUser} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa el nombre"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa el email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingresa la contraseña"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
```

---

### 🟡 **NIVEL INTERMEDIO: Server Actions con Estado y Validación Avanzada**

#### **Server Action con Estado y Optimistic Updates:**
```tsx
// src/app/actions/ticketActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Esquemas de validación
const createTicketSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  categoryId: z.string().optional(),
});

const updateTicketSchema = z.object({
  id: z.string(),
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assigneeId: z.string().optional(),
});

export async function createTicket(formData: FormData) {
  const validatedFields = createTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos',
    };
  }

  try {
    // Simular creación en base de datos
    const ticket = {
      id: `ticket_${Date.now()}`,
      ...validatedFields.data,
      status: 'OPEN',
      createdAt: new Date(),
    };
    
    console.log('Ticket creado:', ticket);
    
    revalidatePath('/tickets');
    revalidatePath('/dashboard');
    
    return { success: true, ticket };
  } catch (error) {
    return {
      message: 'Error al crear el ticket',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function updateTicket(formData: FormData) {
  const validatedFields = updateTicketSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    status: formData.get('status'),
    assigneeId: formData.get('assigneeId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos',
    };
  }

  try {
    const { id, ...updateData } = validatedFields.data;
    
    // Simular actualización en base de datos
    console.log('Actualizando ticket:', id, updateData);
    
    revalidatePath('/tickets');
    revalidatePath(`/tickets/${id}`);
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return {
      message: 'Error al actualizar el ticket',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function deleteTicket(ticketId: string) {
  try {
    // Simular eliminación en base de datos
    console.log('Eliminando ticket:', ticketId);
    
    revalidatePath('/tickets');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return {
      message: 'Error al eliminar el ticket',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

#### **Formulario Avanzado con Server Actions:**
```tsx
// src/app/tickets/create/page.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createTicket } from '@/app/actions/ticketActions';
import { useState } from 'react';

// Estado inicial del formulario
const initialState = {
  errors: {},
  message: '',
};

// Componente de botón de envío con estado de carga
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Creando...' : 'Crear Ticket'}
    </button>
  );
}

export default function CreateTicketPage() {
  const [state, formAction] = useFormState(createTicket, initialState);
  const [selectedPriority, setSelectedPriority] = useState('MEDIUM');
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Ticket</h1>
      
      {state.message && (
        <div className={`p-4 rounded-md mb-4 ${
          state.message.includes('Error') 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {state.message}
        </div>
      )}
      
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título del Ticket
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              state.errors?.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe brevemente el problema"
          />
          {state.errors?.title && (
            <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción Detallada
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              state.errors?.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Proporciona todos los detalles necesarios para resolver el problema"
          />
          {state.errors?.description && (
            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría (Opcional)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar categoría</option>
            <option value="bug">Bug</option>
            <option value="feature">Nueva Funcionalidad</option>
            <option value="improvement">Mejora</option>
            <option value="support">Soporte</option>
          </select>
        </div>
        
        <SubmitButton />
      </form>
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Server Actions con Transacciones y Optimizaciones**

#### **Server Actions con Transacciones de Base de Datos:**
```tsx
// src/app/actions/advancedTicketActions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Esquemas de validación avanzados
const bulkUpdateTicketsSchema = z.object({
  ticketIds: z.array(z.string()).min(1, 'Debe seleccionar al menos un ticket'),
  updates: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assigneeId: z.string().optional(),
  }),
});

const createTicketWithAttachmentsSchema = z.object({
  ticket: z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    categoryId: z.string().optional(),
  }),
  attachments: z.array(z.object({
    filename: z.string(),
    originalName: z.string(),
    mimeType: z.string(),
    size: z.number(),
    path: z.string(),
  })).optional(),
});

export async function bulkUpdateTickets(formData: FormData) {
  const validatedFields = bulkUpdateTicketsSchema.safeParse({
    ticketIds: JSON.parse(formData.get('ticketIds') as string),
    updates: JSON.parse(formData.get('updates') as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos',
    };
  }

  const { ticketIds, updates } = validatedFields.data;

  try {
    // Usar transacción para actualizar múltiples tickets
    const result = await prisma.$transaction(async (tx) => {
      const updatedTickets = await tx.ticket.updateMany({
        where: {
          id: { in: ticketIds },
        },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      // Crear logs de auditoría para cada ticket actualizado
      const auditLogs = ticketIds.map(ticketId => ({
        action: 'UPDATE',
        tableName: 'tickets',
        recordId: ticketId,
        newValues: updates,
        createdAt: new Date(),
      }));

      await tx.auditLog.createMany({
        data: auditLogs,
      });

      return updatedTickets;
    });

    // Revalidar todas las rutas afectadas
    revalidatePath('/tickets');
    revalidatePath('/dashboard');
    ticketIds.forEach(id => revalidatePath(`/tickets/${id}`));

    return {
      success: true,
      message: `${result.count} tickets actualizados exitosamente`,
      count: result.count,
    };
  } catch (error) {
    console.error('Error en bulk update:', error);
    return {
      message: 'Error al actualizar los tickets',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function createTicketWithAttachments(formData: FormData) {
  const validatedFields = createTicketWithAttachmentsSchema.safeParse({
    ticket: JSON.parse(formData.get('ticket') as string),
    attachments: JSON.parse(formData.get('attachments') as string || '[]'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos',
    };
  }

  const { ticket, attachments } = validatedFields.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crear el ticket
      const createdTicket = await tx.ticket.create({
        data: {
          ...ticket,
          status: 'OPEN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Crear adjuntos si existen
      if (attachments && attachments.length > 0) {
        const ticketAttachments = attachments.map(attachment => ({
          ...attachment,
          ticketId: createdTicket.id,
          createdAt: new Date(),
        }));

        await tx.attachment.createMany({
          data: ticketAttachments,
        });
      }

      // Crear log de auditoría
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          tableName: 'tickets',
          recordId: createdTicket.id,
          newValues: createdTicket,
          createdAt: new Date(),
        },
      });

      return createdTicket;
    });

    revalidatePath('/tickets');
    revalidatePath('/dashboard');

    return {
      success: true,
      ticket: result,
      message: 'Ticket creado exitosamente',
    };
  } catch (error) {
    console.error('Error al crear ticket:', error);
    return {
      message: 'Error al crear el ticket',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// Server Action para búsqueda avanzada con paginación
export async function searchTickets(searchParams: {
  query?: string;
  status?: string;
  priority?: string;
  categoryId?: string;
  assigneeId?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const {
      query = '',
      status,
      priority,
      categoryId,
      assigneeId,
      page = 1,
      limit = 10,
    } = searchParams;

    const skip = (page - 1) * limit;

    // Construir filtros dinámicos
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (assigneeId) where.assigneeId = assigneeId;

    // Ejecutar consulta con conteo total
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { comments: true, attachments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error en búsqueda de tickets:', error);
    return {
      message: 'Error al buscar tickets',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Crea un formulario simple de contacto usando Server Actions con validación básica.

### **Ejercicio Intermedio:**
Implementa un sistema de tickets con CRUD completo usando Server Actions y Prisma.

### **Ejercicio Avanzado:**
Crea un sistema de auditoría completo con transacciones de base de datos y logs automáticos.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta cuarta parte hemos cubierto:
- ✅ Configuración inicial de Prisma y base de datos
- ✅ Esquemas avanzados con relaciones complejas
- ✅ Server Actions básicos y avanzados
- ✅ Validación de formularios con Zod
- ✅ Transacciones de base de datos
- ✅ Sistema de auditoría y logs

En el siguiente capítulo aprenderemos sobre caching y optimización.
