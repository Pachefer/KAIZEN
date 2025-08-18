# 🚀 Guía Completa Arquitectura MERN Full-Stack - Teofin

## 📋 Descripción General
Esta guía implementa una arquitectura MERN (MongoDB + Express + React + Node.js) completa con TypeScript para el proyecto Teofin Mobile Banking, enfocada en seguridad y transacciones financieras.

## 🏗️ Arquitectura Full-Stack

### Estructura del Proyecto
```
teofin-fullstack/
├── client/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # Componentes React
│   │   ├── lib/          # Lógica de negocio
│   │   ├── types/        # Tipos TypeScript
│   │   └── utils/        # Utilidades
│   └── package.json
├── server/                 # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/  # Controladores de API
│   │   ├── models/       # Modelos MongoDB
│   │   ├── routes/       # Rutas de API
│   │   ├── middleware/   # Middleware personalizado
│   │   ├── services/     # Servicios de negocio
│   │   ├── types/        # Tipos TypeScript
│   │   └── utils/        # Utilidades
│   └── package.json
├── shared/                 # Tipos compartidos
│   └── types/
└── docker-compose.yml      # Orquestación de servicios
```

## 🗄️ Configuración MongoDB con TypeScript

### 1. Instalación de Dependencias
```bash
# En el directorio server/
npm install mongoose dotenv express cors helmet morgan bcryptjs jsonwebtoken crypto-js
npm install -D @types/mongoose @types/express @types/cors @types/morgan @types/bcryptjs @types/jsonwebtoken typescript ts-node nodemon
```

### 2. Configuración de Base de Datos
```typescript
// server/src/config/database.ts
// FUNCIONALIDAD: Importar dependencias necesarias para MongoDB y variables de entorno
// RESULTADO ESPERADO: Acceso a mongoose para operaciones de base de datos y dotenv para configuración
// IMPACTO: Habilita la funcionalidad de base de datos y configuración del sistema
// VALIDACIÓN: Verificar que las importaciones no generen errores de compilación
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// FUNCIONALIDAD: Cargar variables de entorno desde archivo .env
// RESULTADO ESPERADO: Variables de entorno disponibles en process.env
// IMPACTO: Permite configuración flexible del sistema
// VALIDACIÓN: Verificar que las variables se carguen correctamente
dotenv.config();

// FUNCIONALIDAD: Definir URI de conexión a MongoDB con fallback a localhost
// RESULTADO ESPERADO: String con la URL de conexión a la base de datos
// IMPACTO: Determina dónde se conectará la aplicación
// VALIDACIÓN: Verificar que la URL sea válida y accesible
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teofin';

// FUNCIONALIDAD: Función asíncrona para conectar a MongoDB
// RESULTADO ESPERADO: Conexión exitosa a la base de datos o terminación del proceso
// IMPACTO: Establece la conexión necesaria para operaciones de base de datos
// VALIDACIÓN: Verificar conexión exitosa o manejo correcto de errores
export const connectDB = async (): Promise<void> => {
  try {
    // FUNCIONALIDAD: Intentar conectar a MongoDB usando la URI definida
    // RESULTADO ESPERADO: Conexión establecida o error lanzado
    // IMPACTO: Determina si la aplicación puede acceder a los datos
    // VALIDACIÓN: Verificar que la conexión se establezca en < 5 segundos
    await mongoose.connect(MONGODB_URI);
    
    // FUNCIONALIDAD: Mostrar mensaje de éxito en consola
    // RESULTADO ESPERADO: Mensaje "✅ MongoDB conectado exitosamente" en consola
    // IMPACTO: Confirma que la conexión fue exitosa
    // VALIDACIÓN: Verificar que el mensaje aparezca en la consola
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    // FUNCIONALIDAD: Capturar y manejar errores de conexión
    // RESULTADO ESPERADO: Error registrado en consola y terminación del proceso
    // IMPACTO: Previene que la aplicación funcione sin base de datos
    // VALIDACIÓN: Verificar que los errores se muestren correctamente
    console.error('❌ Error conectando a MongoDB:', error);
    
    // FUNCIONALIDAD: Terminar el proceso Node.js con código de error
    // RESULTADO ESPERADO: Aplicación se cierra con código de salida 1
    // IMPACTO: Evita que la aplicación funcione en estado inconsistente
    // VALIDACIÓN: Verificar que el proceso termine correctamente
    process.exit(1);
  }
};

// FUNCIONALIDAD: Configurar Mongoose para permitir consultas con campos no definidos en el esquema
// RESULTADO ESPERADO: Mongoose no lanzará errores por campos desconocidos
// IMPACTO: Mayor flexibilidad en consultas pero menor control de datos
// VALIDACIÓN: Verificar que las consultas con campos extra no fallen
mongoose.set('strictQuery', false);

// FUNCIONALIDAD: Habilitar modo debug de Mongoose solo en desarrollo
// RESULTADO ESPERADO: Logs detallados de consultas en consola (solo en desarrollo)
// IMPACTO: Mejor debugging en desarrollo, sin overhead en producción
// VALIDACIÓN: Verificar que los logs aparezcan en desarrollo y no en producción
mongoose.set('debug', process.env.NODE_ENV === 'development');
```

### 3. Modelos de Base de Datos
```typescript
// server/src/models/User.ts
// FUNCIONALIDAD: Importar tipos y clases necesarias de Mongoose y bcrypt
// RESULTADO ESPERADO: Acceso a Document, Schema y funcionalidades de encriptación
// IMPACTO: Permite crear esquemas de usuarios seguros con TypeScript
// VALIDACIÓN: Verificar que las importaciones no generen errores de compilación
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// FUNCIONALIDAD: Definir interfaz TypeScript para el modelo User
// RESULTADO ESPERADO: Tipado estricto para objetos de usuario con autocompletado
// IMPACTO: Previene errores de tipo y mejora la experiencia de desarrollo
// VALIDACIÓN: Verificar que el autocompletado funcione en el IDE
export interface IUser extends Document {
  // FUNCIONALIDAD: Nombre del usuario (campo requerido)
  // RESULTADO ESPERADO: String con el nombre del usuario
  // IMPACTO: Identificación personal del usuario en el sistema
  // VALIDACIÓN: Verificar que no esté vacío y tenga formato válido
  firstName: string;
  
  // FUNCIONALIDAD: Apellido del usuario (campo requerido)
  // RESULTADO ESPERADO: String con el apellido del usuario
  // IMPACTO: Identificación personal completa del usuario
  // VALIDACIÓN: Verificar que no esté vacío y tenga formato válido
  lastName: string;
  
  // FUNCIONALIDAD: Correo electrónico del usuario (campo requerido)
  // RESULTADO ESPERADO: String con email válido y único
  // IMPACTO: Identificador principal para autenticación y comunicación
  // VALIDACIÓN: Verificar formato de email y unicidad en la base de datos
  email: string;
  
  // FUNCIONALIDAD: Número de teléfono del usuario (campo requerido)
  // RESULTADO ESPERADO: String con número de teléfono válido
  // IMPACTO: Método alternativo de contacto y verificación
  // VALIDACIÓN: Verificar formato de teléfono y unicidad
  phone: string;
  
  // FUNCIONALIDAD: Contraseña encriptada del usuario (campo requerido)
  // RESULTADO ESPERADO: String con hash bcrypt de la contraseña
  // IMPACTO: Seguridad de autenticación del usuario
  // VALIDACIÓN: Verificar que se encripte correctamente con bcrypt
  password: string;
  
  // FUNCIONALIDAD: Fecha de nacimiento del usuario (campo requerido)
  // RESULTADO ESPERADO: Date con fecha de nacimiento válida
  // IMPACTO: Verificación de edad y cumplimiento de requisitos legales
  // VALIDACIÓN: Verificar que sea una fecha válida y que el usuario sea mayor de edad
  dateOfBirth: Date;
  
  // FUNCIONALIDAD: Número de identificación nacional (campo requerido)
  // RESULTADO ESPERADO: String con ID nacional único
  // IMPACTO: Verificación de identidad y cumplimiento regulatorio
  // VALIDACIÓN: Verificar formato válido y unicidad en la base de datos
  nationalId: string;
  
  // FUNCIONALIDAD: Dirección física del usuario (campo requerido)
  // RESULTADO ESPERADO: Objeto con información completa de ubicación
  // IMPACTO: Verificación de residencia y cumplimiento KYC
  // VALIDACIÓN: Verificar que todos los campos estén completos
  address: {
    street: { type: String, required: true }, // FUNCIONALIDAD: Calle y número
    // RESULTADO ESPERADO: String con dirección específica
    // IMPACTO: Ubicación precisa del usuario
    // VALIDACIÓN: Verificar que no esté vacío
    city: { type: String, required: true }, // FUNCIONALIDAD: Ciudad
    // RESULTADO ESPERADO: String con nombre de la ciudad
    // IMPACTO: Organización geográfica del usuario
    // VALIDACIÓN: Verificar que no esté vacío
    state: { type: String, required: true }, // FUNCIONALIDAD: Estado/Provincia
    // RESULTADO ESPERADO: String con nombre del estado
    // IMPACTO: Precisión en la ubicación geográfica
    // VALIDACIÓN: Verificar que no esté vacío
    zipCode: { type: String, required: true }, // FUNCIONALIDAD: Código postal
    // RESULTADO ESPERADO: String con código postal
    // IMPACTO: Precisión en la ubicación
    // VALIDACIÓN: Verificar formato válido de código postal
    country: { type: String, required: true } // FUNCIONALIDAD: País
    // RESULTADO ESPERADO: String con nombre del país
    // IMPACTO: Identificación del país de residencia
    // VALIDACIÓN: Verificar que no esté vacío
  };
  
  // FUNCIONALIDAD: Estado de verificación del usuario
  // RESULTADO ESPERADO: Boolean indicando si el usuario está verificado
  // IMPACTO: Controla acceso a funcionalidades que requieren verificación
  // VALIDACIÓN: Verificar que el estado se actualice correctamente
  isVerified: boolean;
  
  // FUNCIONALIDAD: Estado de actividad del usuario
  // RESULTADO ESPERADO: Boolean indicando si la cuenta está activa
  // IMPACTO: Controla si el usuario puede acceder al sistema
  // VALIDACIÓN: Verificar que el estado se actualice correctamente
  isActive: boolean;
  
  // FUNCIONALIDAD: Timestamp del último inicio de sesión
  // RESULTADO ESPERADO: Date con fecha y hora del último login
  // IMPACTO: Auditoría de actividad y detección de uso no autorizado
  // VALIDACIÓN: Verificar que se actualice automáticamente en cada login
  lastLogin: Date;
  
  // FUNCIONALIDAD: Contador de intentos fallidos de inicio de sesión
  // RESULTADO ESPERADO: Número entero de intentos fallidos
  // IMPACTO: Implementa bloqueo de cuenta por seguridad
  // VALIDACIÓN: Verificar que se incremente en cada intento fallido
  loginAttempts: number;
  
  // FUNCIONALIDAD: Timestamp hasta cuándo la cuenta está bloqueada
  // RESULTADO ESPERADO: Date con fecha y hora de desbloqueo o null
  // IMPACTO: Implementa bloqueo temporal por múltiples intentos fallidos
  // VALIDACIÓN: Verificar que se establezca correctamente al bloquear
  lockUntil: Date;
  
  // FUNCIONALIDAD: Secreto para autenticación de dos factores
  // RESULTADO ESPERADO: String con secreto TOTP o vacío si no está habilitado
  // IMPACTO: Implementa capa adicional de seguridad
  // VALIDACIÓN: Verificar que se genere correctamente al habilitar 2FA
  twoFactorSecret: string;
  
  // FUNCIONALIDAD: Estado de habilitación de autenticación de dos factores
  // RESULTADO ESPERADO: Boolean indicando si 2FA está habilitado
  // IMPACTO: Controla si se requiere código adicional para login
  // VALIDACIÓN: Verificar que el estado se actualice correctamente
  twoFactorEnabled: boolean;
  
  // FUNCIONALIDAD: Timestamp de creación del registro
  // RESULTADO ESPERADO: Fecha y hora automática de creación
  // IMPACTO: Auditoría y seguimiento de cuándo se creó la cuenta
  // VALIDACIÓN: Verificar que se genere automáticamente al crear
  createdAt: Date;
  
  // FUNCIONALIDAD: Timestamp de última actualización
  // RESULTADO ESPERADO: Fecha y hora automática de última modificación
  // IMPACTO: Auditoría y seguimiento de cambios en la cuenta
  // VALIDACIÓN: Verificar que se actualice automáticamente al modificar
  updatedAt: Date;
  
  // FUNCIONALIDAD: Método para comparar contraseña candidata con hash almacenado
  // RESULTADO ESPERADO: Promise<boolean> indicando si la contraseña coincide
  // IMPACTO: Permite autenticación segura sin almacenar contraseñas en texto plano
  // VALIDACIÓN: Probar con contraseñas correctas e incorrectas
  comparePassword(candidatePassword: string): Promise<boolean>;
  
  // FUNCIONALIDAD: Método para verificar si la cuenta está bloqueada
  // RESULTADO ESPERADO: Boolean indicando si la cuenta está bloqueada
  // IMPACTO: Implementa lógica de bloqueo por seguridad
  // VALIDACIÓN: Probar con cuentas bloqueadas y desbloqueadas
  isLocked(): boolean;
}

// FUNCIONALIDAD: Crear esquema de Mongoose para el modelo User
// RESULTADO ESPERADO: Esquema con validaciones y configuraciones para el modelo
// IMPACTO: Define la estructura y reglas de validación de los datos
// VALIDACIÓN: Verificar que el esquema se compile sin errores
const UserSchema = new Schema<IUser>({
  // FUNCIONALIDAD: Definir campo nombre con validaciones
  // RESULTADO ESPERADO: Campo requerido, recortado y con límite de caracteres
  // IMPACTO: Asegura que el nombre sea válido y no excesivamente largo
  // VALIDACIÓN: Probar con nombres vacíos, muy largos y válidos
  firstName: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    // RESULTADO ESPERADO: Campo obligatorio con mensaje de error personalizado
    // IMPACTO: Previene usuarios sin nombre
    // VALIDACIÓN: Intentar guardar sin nombre y verificar mensaje de error
    required: [true, 'El nombre es requerido'],
    trim: true, // FUNCIONALIDAD: Eliminar espacios en blanco al inicio y final
    // RESULTADO ESPERADO: Nombres sin espacios innecesarios
    // IMPACTO: Mejora la consistencia de los datos
    // VALIDACIÓN: Probar con nombres con espacios extra
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres'] // FUNCIONALIDAD: Límite máximo de caracteres
    // RESULTADO ESPERADO: Error si el nombre excede 50 caracteres
    // IMPACTO: Previene nombres excesivamente largos
    // VALIDACIÓN: Probar con nombres de más de 50 caracteres
  },
  
  // FUNCIONALIDAD: Definir campo apellido con validaciones
  // RESULTADO ESPERADO: Campo requerido, recortado y con límite de caracteres
  // IMPACTO: Asegura que el apellido sea válido y no excesivamente largo
  // VALIDACIÓN: Probar con apellidos vacíos, muy largos y válidos
  lastName: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'El apellido es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona apellido
    // IMPACTO: Asegura identificación completa del usuario
    // VALIDACIÓN: Intentar guardar sin apellido
    trim: true, // FUNCIONALIDAD: Eliminar espacios en blanco al inicio y final
    // RESULTADO ESPERADO: Apellidos sin espacios innecesarios
    // IMPACTO: Mejora la consistencia de los datos
    // VALIDACIÓN: Probar con apellidos con espacios extra
    maxlength: [50, 'El apellido no puede tener más de 50 caracteres'] // FUNCIONALIDAD: Límite máximo de caracteres
    // RESULTADO ESPERADO: Error si el apellido excede 50 caracteres
    // IMPACTO: Previene apellidos excesivamente largos
    // VALIDACIÓN: Probar con apellidos de más de 50 caracteres
  },
  
  // FUNCIONALIDAD: Definir campo email con validaciones avanzadas
  // RESULTADO ESPERADO: Campo requerido, único y con formato validado
  // IMPACTO: Identificador principal para autenticación y comunicación
  // VALIDACIÓN: Probar con emails válidos, inválidos y duplicados
  email: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'El email es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona email
    // IMPACTO: Asegura que todos los usuarios tengan email
    // VALIDACIÓN: Intentar guardar sin email
    unique: true, // FUNCIONALIDAD: Garantizar unicidad en la base de datos
    // RESULTADO ESPERADO: Error si el email ya existe
    // IMPACTO: Previene duplicados de usuarios
    // VALIDACIÓN: Probar con email duplicado
    lowercase: true, // FUNCIONALIDAD: Convertir a minúsculas automáticamente
    // RESULTADO ESPERADO: Email siempre en minúsculas
    // IMPACTO: Normaliza el formato del email
    // VALIDACIÓN: Probar con email en mayúsculas
    trim: true, // FUNCIONALIDAD: Eliminar espacios en blanco
    // RESULTADO ESPERADO: Email sin espacios innecesarios
    // IMPACTO: Mejora la consistencia de los datos
    // VALIDACIÓN: Probar con email con espacios
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'] // FUNCIONALIDAD: Validar formato con regex
    // RESULTADO ESPERADO: Error si el formato del email es inválido
    // IMPACTO: Asegura formato correcto de email
    // VALIDACIÓN: Probar con formatos de email inválidos
  },
  
  // FUNCIONALIDAD: Definir campo teléfono con validación de formato
  // RESULTADO ESPERADO: Campo requerido con formato de teléfono válido
  // IMPACTO: Método alternativo de contacto y verificación
  // VALIDACIÓN: Probar con números válidos e inválidos
  phone: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'El teléfono es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona teléfono
    // IMPACTO: Asegura que todos los usuarios tengan teléfono
    // VALIDACIÓN: Intentar guardar sin teléfono
    match: [/^\+?[\d\s-()]+$/, 'Número de teléfono inválido'] // FUNCIONALIDAD: Validar formato con regex
    // RESULTADO ESPERADO: Error si el formato del teléfono es inválido
    // IMPACTO: Asegura formato correcto de teléfono
    // VALIDACIÓN: Probar con formatos de teléfono inválidos
  },
  
  // FUNCIONALIDAD: Definir campo contraseña con validaciones de seguridad
  // RESULTADO ESPERADO: Campo requerido con longitud mínima
  // IMPACTO: Seguridad de autenticación del usuario
  // VALIDACIÓN: Probar con contraseñas válidas e inválidas
  password: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'La contraseña es requerida'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona contraseña
    // IMPACTO: Asegura que todos los usuarios tengan contraseña
    // VALIDACIÓN: Intentar guardar sin contraseña
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'] // FUNCIONALIDAD: Longitud mínima requerida
    // RESULTADO ESPERADO: Error si la contraseña es muy corta
    // IMPACTO: Mejora la seguridad de las contraseñas
    // VALIDACIÓN: Probar con contraseñas de menos de 8 caracteres
  },
  
  // FUNCIONALIDAD: Definir campo fecha de nacimiento
  // RESULTADO ESPERADO: Campo requerido con fecha válida
  // IMPACTO: Verificación de edad y cumplimiento de requisitos legales
  // VALIDACIÓN: Probar con fechas válidas e inválidas
  dateOfBirth: {
    type: Date, // FUNCIONALIDAD: Tipo de dato Date
    required: [true, 'La fecha de nacimiento es requerida'] // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona fecha de nacimiento
    // IMPACTO: Asegura que todos los usuarios tengan fecha de nacimiento
    // VALIDACIÓN: Intentar guardar sin fecha de nacimiento
  },
  
  // FUNCIONALIDAD: Definir campo documento de identidad
  // RESULTADO ESPERADO: Campo requerido y único
  // IMPACTO: Verificación de identidad y cumplimiento regulatorio
  // VALIDACIÓN: Probar con documentos válidos y duplicados
  nationalId: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'El documento de identidad es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona documento
    // IMPACTO: Asegura que todos los usuarios tengan documento
    // VALIDACIÓN: Intentar guardar sin documento
    unique: true // FUNCIONALIDAD: Garantizar unicidad en la base de datos
    // RESULTADO ESPERADO: Error si el documento ya existe
    // IMPACTO: Previene duplicados de identidad
    // VALIDACIÓN: Probar con documento duplicado
  },
  
  // FUNCIONALIDAD: Definir objeto de dirección con campos requeridos
  // RESULTADO ESPERADO: Objeto con todos los campos obligatorios
  // IMPACTO: Verificación de residencia y cumplimiento KYC
  // VALIDACIÓN: Probar con direcciones completas e incompletas
  address: {
    street: { type: String, required: true }, // FUNCIONALIDAD: Calle y número
    // RESULTADO ESPERADO: Campo obligatorio para la dirección
    // IMPACTO: Ubicación específica del usuario
    // VALIDACIÓN: Verificar que sea requerido
    city: { type: String, required: true }, // FUNCIONALIDAD: Ciudad
    // RESULTADO ESPERADO: Campo obligatorio para la ciudad
    // IMPACTO: Organización geográfica del usuario
    // VALIDACIÓN: Verificar que sea requerido
    state: { type: String, required: true }, // FUNCIONALIDAD: Estado/Provincia
    // RESULTADO ESPERADO: Campo obligatorio para el estado
    // IMPACTO: Precisión en la ubicación geográfica
    // VALIDACIÓN: Verificar que sea requerido
    zipCode: { type: String, required: true }, // FUNCIONALIDAD: Código postal
    // RESULTADO ESPERADO: Campo obligatorio para el código postal
    // IMPACTO: Precisión en la ubicación
    // VALIDACIÓN: Verificar que sea requerido
    country: { type: String, required: true } // FUNCIONALIDAD: País
    // RESULTADO ESPERADO: Campo obligatorio para el país
    // IMPACTO: Identificación del país de residencia
    // VALIDACIÓN: Verificar que sea requerido
  },
  
  // FUNCIONALIDAD: Definir campo de verificación
  // RESULTADO ESPERADO: Campo booleano con valor por defecto false
  // IMPACTO: Controla acceso a funcionalidades que requieren verificación
  // VALIDACIÓN: Verificar que el valor por defecto sea false
  isVerified: {
    type: Boolean, // FUNCIONALIDAD: Tipo de dato booleano
    default: false // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos usuarios no están verificados por defecto
    // IMPACTO: Requiere verificación manual para funcionalidades críticas
    // VALIDACIÓN: Crear usuario sin especificar verificación
  },
  
  // FUNCIONALIDAD: Definir campo de actividad
  // RESULTADO ESPERADO: Campo booleano con valor por defecto true
  // IMPACTO: Controla si el usuario puede acceder al sistema
  // VALIDACIÓN: Verificar que el valor por defecto sea true
  isActive: {
    type: Boolean, // FUNCIONALIDAD: Tipo de dato booleano
    default: true // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos usuarios están activos por defecto
    // IMPACTO: Permite acceso inmediato al sistema
    // VALIDACIÓN: Crear usuario sin especificar actividad
  },
  
  // FUNCIONALIDAD: Definir campo de último login
  // RESULTADO ESPERADO: Campo Date opcional
  // IMPACTO: Auditoría de actividad y detección de uso no autorizado
  // VALIDACIÓN: Verificar que se actualice automáticamente en cada login
  lastLogin: Date,
  
  // FUNCIONALIDAD: Definir campo de intentos de login
  // RESULTADO ESPERADO: Campo numérico con valor por defecto 0
  // IMPACTO: Implementa bloqueo de cuenta por seguridad
  // VALIDACIÓN: Verificar que el valor por defecto sea 0
  loginAttempts: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    default: 0 // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos usuarios tienen 0 intentos fallidos
    // IMPACTO: Inicia el contador de intentos en cero
    // VALIDACIÓN: Crear usuario sin especificar intentos
  },
  
  // FUNCIONALIDAD: Definir campo de bloqueo temporal
  // RESULTADO ESPERADO: Campo Date opcional
  // IMPACTO: Implementa bloqueo temporal por múltiples intentos fallidos
  // VALIDACIÓN: Verificar que se establezca correctamente al bloquear
  lockUntil: Date,
  
  // FUNCIONALIDAD: Definir campo de secreto 2FA
  // RESULTADO ESPERADO: Campo String opcional
  // IMPACTO: Implementa capa adicional de seguridad
  // VALIDACIÓN: Verificar que se genere correctamente al habilitar 2FA
  twoFactorSecret: String,
  
  // FUNCIONALIDAD: Definir campo de habilitación 2FA
  // RESULTADO ESPERADO: Campo booleano con valor por defecto false
  // IMPACTO: Controla si se requiere código adicional para login
  // VALIDACIÓN: Verificar que el valor por defecto sea false
  twoFactorEnabled: {
    type: Boolean, // FUNCIONALIDAD: Tipo de dato booleano
    default: false // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos usuarios no tienen 2FA habilitado por defecto
    // IMPACTO: Requiere habilitación manual de 2FA
    // VALIDACIÓN: Crear usuario sin especificar 2FA
  }
}, {
  timestamps: true, // FUNCIONALIDAD: Agregar campos createdAt y updatedAt automáticamente
  // RESULTADO ESPERADO: Campos de timestamp se generan automáticamente
  // IMPACTO: Auditoría y seguimiento de cambios
  // VALIDACIÓN: Verificar que los timestamps se generen al crear/actualizar
  toJSON: { virtuals: true }, // FUNCIONALIDAD: Incluir campos virtuales en JSON
  // RESULTADO ESPERADO: Campos calculados aparecen en respuestas JSON
  // IMPACTO: Mejora la funcionalidad de la API
  // VALIDACIÓN: Verificar que los campos virtuales aparezcan en respuestas
  toObject: { virtuals: true } // FUNCIONALIDAD: Incluir campos virtuales en objetos
  // RESULTADO ESPERADO: Campos calculados disponibles en objetos
  // IMPACTO: Mejora la funcionalidad del modelo
  // VALIDACIÓN: Verificar que los campos virtuales estén disponibles
});

// FUNCIONALIDAD: Crear índices para optimizar consultas frecuentes
// RESULTADO ESPERADO: Consultas más rápidas en campos indexados
// IMPACTO: Mejora significativa en el rendimiento de búsquedas
// VALIDACIÓN: Verificar que las consultas sean más rápidas con índices

// FUNCIONALIDAD: Índice simple para búsquedas por email
// RESULTADO ESPERADO: Búsquedas rápidas por email (login, verificación)
// IMPACTO: Optimiza autenticación y búsquedas de usuario
// VALIDACIÓN: Probar búsquedas por email y verificar velocidad
UserSchema.index({ email: 1 });

// FUNCIONALIDAD: Índice simple para búsquedas por documento de identidad
// RESULTADO ESPERADO: Búsquedas rápidas por ID nacional
// IMPACTO: Optimiza verificaciones de identidad
// VALIDACIÓN: Probar búsquedas por documento y verificar velocidad
UserSchema.index({ nationalId: 1 });

// FUNCIONALIDAD: Índice simple para búsquedas por teléfono
// RESULTADO ESPERADO: Búsquedas rápidas por número de teléfono
// IMPACTO: Optimiza verificaciones por teléfono
// VALIDACIÓN: Probar búsquedas por teléfono y verificar velocidad
UserSchema.index({ phone: 1 });

// FUNCIONALIDAD: Middleware para encriptar contraseña automáticamente
// RESULTADO ESPERADO: Contraseña encriptada antes de guardar en base de datos
// IMPACTO: Implementa seguridad automática sin intervención manual
// VALIDACIÓN: Verificar que la contraseña se encripte al crear/actualizar
UserSchema.pre('save', async function(next) {
  // FUNCIONALIDAD: Verificar si la contraseña ha sido modificada
  // RESULTADO ESPERADO: Solo encriptar si la contraseña cambió
  // IMPACTO: Evita re-encriptación innecesaria
  // VALIDACIÓN: Probar actualización sin cambiar contraseña
  if (!this.isModified('password')) return next();
  
  try {
    // FUNCIONALIDAD: Generar salt único para la contraseña
    // RESULTADO ESPERADO: Salt de 12 rondas para máxima seguridad
    // IMPACTO: Previene ataques de rainbow table
    // VALIDACIÓN: Verificar que se genere salt único cada vez
    const salt = await bcrypt.genSalt(12);
    
    // FUNCIONALIDAD: Encriptar contraseña con salt generado
    // RESULTADO ESPERADO: Hash bcrypt de la contraseña
    // IMPACTO: Almacena contraseña de forma segura
    // VALIDACIÓN: Verificar que el hash sea diferente al texto plano
    this.password = await bcrypt.hash(this.password, salt);
    
    // FUNCIONALIDAD: Continuar con el proceso de guardado
    // RESULTADO ESPERADO: Middleware continúa sin errores
    // IMPACTO: Permite que el guardado se complete
    // VALIDACIÓN: Verificar que el usuario se guarde correctamente
    next();
  } catch (error) {
    // FUNCIONALIDAD: Manejar errores de encriptación
    // RESULTADO ESPERADO: Error pasado al siguiente middleware
    // IMPACTO: Previene guardado de contraseñas no encriptadas
    // VALIDACIÓN: Probar con errores de bcrypt
    next(error as Error);
  }
});

// FUNCIONALIDAD: Método para comparar contraseña candidata con hash almacenado
// RESULTADO ESPERADO: Promise<boolean> indicando si la contraseña coincide
// IMPACTO: Permite autenticación segura sin almacenar contraseñas en texto plano
// VALIDACIÓN: Probar con contraseñas correctas e incorrectas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // FUNCIONALIDAD: Comparar contraseña candidata con hash bcrypt
  // RESULTADO ESPERADO: true si coinciden, false si no
  // IMPACTO: Implementa verificación segura de contraseñas
  // VALIDACIÓN: Verificar que funcione con contraseñas válidas e inválidas
  return bcrypt.compare(candidatePassword, this.password);
};

// FUNCIONALIDAD: Método para verificar si la cuenta está bloqueada
// RESULTADO ESPERADO: Boolean indicando si la cuenta está bloqueada
// IMPACTO: Implementa lógica de bloqueo por seguridad
// VALIDACIÓN: Probar con cuentas bloqueadas y desbloqueadas
UserSchema.methods.isLocked = function(): boolean {
  // FUNCIONALIDAD: Verificar si existe fecha de bloqueo y si no ha expirado
  // RESULTADO ESPERADO: true si la cuenta está bloqueada, false si no
  // IMPACTO: Controla acceso basado en intentos fallidos
  // VALIDACIÓN: Verificar con diferentes estados de bloqueo
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// FUNCIONALIDAD: Crear y exportar el modelo Mongoose
// RESULTADO ESPERADO: Modelo User disponible para operaciones de base de datos
// IMPACTO: Permite crear, leer, actualizar y eliminar usuarios
// VALIDACIÓN: Verificar que el modelo se compile y exporte correctamente
export const User = mongoose.model<IUser>('User', UserSchema);
```

```typescript
// server/src/models/Account.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountNumber: string;
  accountType: 'savings' | 'checking' | 'credit';
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  interestRate: number;
  monthlyFee: number;
  overdraftLimit: number;
  lastTransactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Número de cuenta debe tener 10 dígitos']
  },
  accountType: {
    type: String,
    required: true,
    enum: ['savings', 'checking', 'credit']
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'El balance no puede ser negativo']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
  },
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'suspended', 'closed']
  },
  interestRate: {
    type: Number,
    default: 0,
    min: [0, 'La tasa de interés no puede ser negativa'],
    max: [100, 'La tasa de interés no puede ser mayor al 100%']
  },
  monthlyFee: {
    type: Number,
    default: 0,
    min: [0, 'La tarifa mensual no puede ser negativa']
  },
  overdraftLimit: {
    type: Number,
    default: 0,
    min: [0, 'El límite de sobregiro no puede ser negativo']
  },
  lastTransactionDate: Date
}, {
  timestamps: true
});

// Índices
AccountSchema.index({ userId: 1, accountType: 1 });
AccountSchema.index({ accountNumber: 1 });
AccountSchema.index({ status: 1 });

export const Account = mongoose.model<IAccount>('Account', AccountSchema);
```

```typescript
// server/src/models/Transaction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  fromAccount: mongoose.Types.ObjectId;
  toAccount?: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  category: string;
  reference: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    match: [/^TXN\d{16}$/, 'ID de transacción inválido']
  },
  fromAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'transfer', 'payment', 'fee']
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'El monto debe ser mayor a 0']
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, 'La descripción no puede tener más de 200 caracteres']
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'cancelled']
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other']
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Índices
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ fromAccount: 1, createdAt: -1 });
TransactionSchema.index({ toAccount: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ category: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
```

## 🔌 API REST CRUD Completa

### 1. Controladores
```typescript
// server/src/controllers/accountController.ts
import { Request, Response } from 'express';
import { Account, IAccount } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { ApiResponse } from '../types/api';
import { generateAccountNumber } from '../utils/accountUtils';

export class AccountController {
  // CREATE - Crear nueva cuenta
  static async createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountData: Partial<IAccount> = req.body;
      const userId = (req as any).user.id;
      
      // Validar datos requeridos
      if (!accountData.accountType) {
        res.status(400).json({
          success: false,
          message: 'El tipo de cuenta es requerido'
        } as ApiResponse);
        return;
      }

      // Generar número de cuenta único
      const accountNumber = await generateAccountNumber();

      const account = new Account({
        ...accountData,
        userId,
        accountNumber
      });

      const savedAccount = await account.save();

      res.status(201).json({
        success: true,
        data: savedAccount,
        message: 'Cuenta creada exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error creando cuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener todas las cuentas del usuario
  static async getUserAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      
      const accounts = await Account.find({ userId, status: 'active' })
        .select('-__v')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: accounts
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo cuentas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener cuenta por ID
  static async getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const account = await Account.findOne({ _id: id, userId })
        .select('-__v');
      
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        } as ApiResponse);
        return;
      }

      // Obtener transacciones recientes
      const recentTransactions = await Transaction.find({
        $or: [{ fromAccount: id }, { toAccount: id }]
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('transactionId type amount description status createdAt');

      res.status(200).json({
        success: true,
        data: {
          account,
          recentTransactions
        }
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo cuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // UPDATE - Actualizar cuenta
  static async updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user.id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      // Solo permitir actualizar ciertos campos
      const allowedUpdates = ['status', 'overdraftLimit'];
      const filteredUpdates: any = {};
      
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updateData[key];
        }
      });

      const account = await Account.findOneAndUpdate(
        { _id: id, userId },
        filteredUpdates,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: account,
        message: 'Cuenta actualizada exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error actualizando cuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // DELETE - Cerrar cuenta (soft delete)
  static async closeAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const account = await Account.findOne({ _id: id, userId });
      
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Cuenta no encontrada'
        } as ApiResponse);
        return;
      }

      if (account.balance > 0) {
        res.status(400).json({
          success: false,
          message: 'No se puede cerrar una cuenta con saldo positivo'
        } as ApiResponse);
        return;
      }

      account.status = 'closed';
      await account.save();

      res.status(200).json({
        success: true,
        data: account,
        message: 'Cuenta cerrada exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error cerrando cuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };
}
```

### 2. Rutas de API
```typescript
// server/src/routes/accountRoutes.ts
import { Router } from 'express';
import { AccountController } from '../controllers/accountController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { accountValidationSchema } from '../validation/accountValidation';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', 
  validationMiddleware(accountValidationSchema.create),
  AccountController.createAccount
);

router.get('/', AccountController.getUserAccounts);
router.get('/:id', AccountController.getAccountById);
router.put('/:id', 
  validationMiddleware(accountValidationSchema.update),
  AccountController.updateAccount
);
router.delete('/:id', AccountController.closeAccount);

export default router;
```

## 🌐 Servidor Express con TypeScript

### 1. Configuración del Servidor
```typescript
// server/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { securityMiddleware } from './middleware/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Rate limiting para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intente más tarde'
  }
});

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Aplicar rate limiting
app.use('/api/', limiter);

// Middleware de seguridad personalizado
app.use(securityMiddleware);

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware de parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});
```

### 2. Middleware de Seguridad
```typescript
// server/src/middleware/security.ts
import { Request, Response, NextFunction } from 'express';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Validar Content-Type para requests POST/PUT
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
    res.status(400).json({
      success: false,
      message: 'Content-Type debe ser application/json'
    });
    return;
  }

  next();
};
```

## 🔗 Integración Frontend-Backend

### 1. Servicios de API
```typescript
// client/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Servicios de Cuenta
```typescript
// client/src/services/accountService.ts
import api from './api';
import { Account, CreateAccountData, UpdateAccountData } from '@/types/account';

export class AccountService {
  static async getUserAccounts(): Promise<Account[]> {
    const response = await api.get('/accounts');
    return response.data.data;
  }

  static async getAccountById(id: string): Promise<{
    account: Account;
    recentTransactions: any[];
  }> {
    const response = await api.get(`/accounts/${id}`);
    return response.data.data;
  }

  static async createAccount(accountData: CreateAccountData): Promise<Account> {
    const response = await api.post('/accounts', accountData);
    return response.data.data;
  }

  static async updateAccount(id: string, accountData: UpdateAccountData): Promise<Account> {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data.data;
  }

  static async closeAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  }
}
```

## 🚀 Despliegue en la Nube

### 1. Docker Configuration
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de seguridad
RUN apk add --no-cache openssl

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar permisos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: teofin-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: teofin
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - teofin-network

  server:
    build: ./server
    container_name: teofin-server
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/teofin?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - teofin-network

  client:
    build: ./client
    container_name: teofin-client
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - server
    networks:
      - teofin-network

volumes:
  mongodb_data:

networks:
  teofin-network:
    driver: bridge
```

### 2. Despliegue en AWS
```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS

on:
  push:
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
      run: |
        cd server && npm ci
        cd ../client && npm ci
    
    - name: Build applications
      run: |
        cd server && npm run build
        cd ../client && npm run build
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to EC2
      run: |
        # Copiar archivos al servidor EC2
        scp -r server/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/teofin-server/
        scp -r client/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/teofin-client/
        
        # Reiniciar servicios
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/teofin-server && npm install && pm2 restart teofin-server"
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/teofin-client && npm install && pm2 restart teofin-client"
```

## 🧪 Testing Completo

### 1. Testing del Backend
```typescript
// server/src/__tests__/account.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { Account } from '../models/Account';
import { User } from '../models/User';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils';

describe('Account API', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    await connectTestDB();
    
    // Crear usuario de prueba
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      password: 'password123',
      dateOfBirth: new Date('1990-01-01'),
      nationalId: '123456789',
      address: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      }
    });

    // Generar token de autenticación
    authToken = testUser.generateAuthToken();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/accounts', () => {
    it('should create a new account', async () => {
      const accountData = {
        accountType: 'savings'
      };

      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accountData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accountType).toBe(accountData.accountType);
      expect(response.body.data.userId).toBe(testUser._id.toString());
    });
  });

  describe('GET /api/accounts', () => {
    it('should return user accounts', async () => {
      await Account.create({
        userId: testUser._id,
        accountNumber: '1234567890',
        accountType: 'savings',
        balance: 1000
      });

      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });
});
```

## 🚀 Scripts de Despliegue

### 1. Package.json Scripts
```json
// server/package.json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "security:audit": "npm audit",
    "docker:build": "docker build -t teofin-server .",
    "docker:run": "docker run -p 5000:5000 teofin-server",
    "deploy:aws": "npm run build && aws s3 sync dist/ s3://your-bucket/",
    "deploy:heroku": "npm run build && git push heroku main"
  }
}
```

### 2. Scripts de Base de Datos
```bash
#!/bin/bash
# scripts/setup-db.sh

echo "🚀 Configurando base de datos Teofin..."

# Crear directorio de logs
mkdir -p logs

# Iniciar MongoDB
echo "📊 Iniciando MongoDB..."
docker-compose up -d mongodb

# Esperar a que MongoDB esté listo
echo "⏳ Esperando a que MongoDB esté listo..."
sleep 10

# Crear índices
echo "🔍 Creando índices..."
docker exec teofin-mongodb mongosh --eval "
  use teofin;
  db.users.createIndex({ email: 1 });
  db.users.createIndex({ nationalId: 1 });
  db.users.createIndex({ phone: 1 });
  db.accounts.createIndex({ userId: 1, accountType: 1 });
  db.accounts.createIndex({ accountNumber: 1 });
  db.accounts.createIndex({ status: 1 });
  db.transactions.createIndex({ transactionId: 1 });
  db.transactions.createIndex({ fromAccount: 1, createdAt: -1 });
  db.transactions.createIndex({ toAccount: 1, createdAt: -1 });
  db.transactions.createIndex({ type: 1, status: 1 });
  db.transactions.createIndex({ category: 1, createdAt: -1 });
"

echo "✅ Base de datos configurada exitosamente!"
```

## 📚 Recursos Adicionales

- [MongoDB Atlas](https://www.mongodb.com/atlas) - Base de datos en la nube
- [AWS EC2](https://aws.amazon.com/ec2/) - Servidores virtuales
- [Vercel](https://vercel.com/) - Despliegue de frontend
- [Docker Hub](https://hub.docker.com/) - Contenedores
- [PM2](https://pm2.keymetrics.io/) - Gestor de procesos Node.js
- [Jest](https://jestjs.io/) - Framework de testing
- [Supertest](https://github.com/visionmedia/supertest) - Testing de APIs
