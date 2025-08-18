# 🚀 Guía Completa Arquitectura MERN Full-Stack - Mesio

## 📋 Descripción General
Esta guía implementa una arquitectura MERN (MongoDB + Express + React + Node.js) completa con TypeScript para el proyecto Mesio Food Delivery.

## 🔍 Comentarios de Funcionalidad y Predicción de Resultados

### 📝 Explicación de Comentarios
- **// FUNCIONALIDAD**: Describe qué hace la línea de código
- **// RESULTADO ESPERADO**: Predice el resultado de la ejecución
- **// IMPACTO**: Explica el efecto en el sistema
- **// VALIDACIÓN**: Cómo verificar que funciona correctamente

## 🏗️ Arquitectura Full-Stack

### Estructura del Proyecto
```
mesio-fullstack/
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
npm install mongoose dotenv express cors helmet morgan
npm install -D @types/mongoose @types/express @types/cors @types/morgan typescript ts-node nodemon
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mesio';

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
    // FUNCIONALIDAD: Capturar y mostrar errores de conexión
    // RESULTADO ESPERADO: Error detallado en consola y terminación del proceso
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
// server/src/models/Dish.ts
// FUNCIONALIDAD: Importar tipos y clases necesarias de Mongoose
// RESULTADO ESPERADO: Acceso a Document, Schema y funcionalidades de Mongoose
// IMPACTO: Permite crear esquemas y modelos de MongoDB con TypeScript
// VALIDACIÓN: Verificar que las importaciones no generen errores de compilación
import mongoose, { Document, Schema } from 'mongoose';

// FUNCIONALIDAD: Definir interfaz TypeScript para el modelo Dish
// RESULTADO ESPERADO: Tipado estricto para objetos de plato con autocompletado
// IMPACTO: Previene errores de tipo y mejora la experiencia de desarrollo
// VALIDACIÓN: Verificar que el autocompletado funcione en el IDE
export interface IDish extends Document {
  // FUNCIONALIDAD: Nombre del plato (campo requerido)
  // RESULTADO ESPERADO: String con el nombre del plato
  // IMPACTO: Identificación única del plato en el sistema
  // VALIDACIÓN: Verificar que no esté vacío y tenga formato válido
  name: string;
  
  // FUNCIONALIDAD: Descripción detallada del plato
  // RESULTADO ESPERADO: String con descripción del plato
  // IMPACTO: Información para que los clientes conozcan el plato
  // VALIDACIÓN: Verificar que contenga información útil y descriptiva
  description: string;
  
  // FUNCIONALIDAD: Precio del plato en la moneda local
  // RESULTADO ESPERADO: Número decimal positivo
  // IMPACTO: Determina el costo para el cliente y cálculo de totales
  // VALIDACIÓN: Verificar que sea un número positivo y válido
  price: number;
  
  // FUNCIONALIDAD: Categoría del plato (Pizza, Hamburguesa, etc.)
  // RESULTADO ESPERADO: String con una de las categorías predefinidas
  // IMPACTO: Organización y filtrado de platos por tipo
  // VALIDACIÓN: Verificar que sea una categoría válida del enum
  category: string;
  
  // FUNCIONALIDAD: URL de la imagen del plato
  // RESULTADO ESPERADO: String con URL válida de imagen
  // IMPACTO: Visualización del plato en la interfaz de usuario
  // VALIDACIÓN: Verificar que la URL sea accesible y muestre una imagen
  imageUrl: string;
  
  // FUNCIONALIDAD: Estado de disponibilidad del plato
  // RESULTADO ESPERADO: Boolean indicando si el plato está disponible
  // IMPACTO: Controla si el plato puede ser ordenado
  // VALIDACIÓN: Verificar que el estado se actualice correctamente
  isAvailable: boolean;
  
  // FUNCIONALIDAD: Lista de ingredientes del plato
  // RESULTADO ESPERADO: Array de strings con nombres de ingredientes
  // IMPACTO: Información nutricional y para clientes con alergias
  // VALIDACIÓN: Verificar que la lista no esté vacía y contenga ingredientes válidos
  ingredients: string[];
  
  // FUNCIONALIDAD: Lista de alérgenos presentes en el plato
  // RESULTADO ESPERADO: Array de strings con tipos de alérgenos
  // IMPACTO: Seguridad alimentaria para clientes con alergias
  // VALIDACIÓN: Verificar que se identifiquen correctamente todos los alérgenos
  allergens: string[];
  
  // FUNCIONALIDAD: Información nutricional del plato
  // RESULTADO ESPERADO: Objeto con valores nutricionales
  // IMPACTO: Información para clientes conscientes de su salud
  // VALIDACIÓN: Verificar que los valores sean realistas y precisos
  nutritionalInfo: {
    // FUNCIONALIDAD: Calorías totales del plato
    // RESULTADO ESPERADO: Número entero positivo
    // IMPACTO: Cálculo de ingesta calórica diaria
    // VALIDACIÓN: Verificar que esté en rango realista (50-2000 calorías)
    calories: number;
    
    // FUNCIONALIDAD: Gramos de proteína en el plato
    // RESULTADO ESPERADO: Número decimal positivo
    // IMPACTO: Información para dietas altas en proteína
    // VALIDACIÓN: Verificar que esté en rango realista (0-100g)
    protein: number;
    
    // FUNCIONALIDAD: Gramos de carbohidratos en el plato
    // RESULTADO ESPERADO: Número decimal positivo
    // IMPACTO: Información para dietas bajas en carbos
    // VALIDACIÓN: Verificar que esté en rango realista (0-200g)
    carbs: number;
    
    // FUNCIONALIDAD: Gramos de grasa en el plato
    // RESULTADO ESPERADO: Número decimal positivo
    // IMPACTO: Información para dietas bajas en grasa
    // VALIDACIÓN: Verificar que esté en rango realista (0-100g)
    fat: number;
  };
  
  // FUNCIONALIDAD: Timestamp de creación del registro
  // RESULTADO ESPERADO: Fecha y hora automática de creación
  // IMPACTO: Auditoría y seguimiento de cuándo se agregó el plato
  // VALIDACIÓN: Verificar que se genere automáticamente al crear
  createdAt: Date;
  
  // FUNCIONALIDAD: Timestamp de última actualización
  // RESULTADO ESPERADO: Fecha y hora automática de última modificación
  // IMPACTO: Auditoría y seguimiento de cambios en el plato
  // VALIDACIÓN: Verificar que se actualice automáticamente al modificar
  updatedAt: Date;
}

// FUNCIONALIDAD: Crear esquema de Mongoose para el modelo Dish
// RESULTADO ESPERADO: Esquema con validaciones y configuraciones para el modelo
// IMPACTO: Define la estructura y reglas de validación de los datos
// VALIDACIÓN: Verificar que el esquema se compile sin errores
const DishSchema = new Schema<IDish>({
  // FUNCIONALIDAD: Definir campo nombre con validaciones
  // RESULTADO ESPERADO: Campo requerido, recortado y con límite de caracteres
  // IMPACTO: Asegura que el nombre sea válido y no excesivamente largo
  // VALIDACIÓN: Probar con nombres vacíos, muy largos y válidos
  name: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    // RESULTADO ESPERADO: Campo obligatorio con mensaje de error personalizado
    // IMPACTO: Previene platos sin nombre
    // VALIDACIÓN: Intentar guardar sin nombre y verificar mensaje de error
    required: [true, 'El nombre del plato es requerido'],
    trim: true, // FUNCIONALIDAD: Eliminar espacios en blanco al inicio y final
    // RESULTADO ESPERADO: Nombres sin espacios innecesarios
    // IMPACTO: Mejora la consistencia de los datos
    // VALIDACIÓN: Probar con nombres con espacios extra
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres'] // FUNCIONALIDAD: Límite máximo de caracteres
    // RESULTADO ESPERADO: Error si el nombre excede 100 caracteres
    // IMPACTO: Previene nombres excesivamente largos
    // VALIDACIÓN: Probar con nombres de más de 100 caracteres
  },
  
  // FUNCIONALIDAD: Definir campo descripción con validaciones
  // RESULTADO ESPERADO: Campo requerido con límite de 500 caracteres
  // IMPACTO: Asegura descripciones informativas pero no excesivas
  // VALIDACIÓN: Probar con descripciones vacías, muy largas y válidas
  description: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'La descripción es requerida'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona descripción
    // IMPACTO: Asegura que los clientes tengan información del plato
    // VALIDACIÓN: Intentar guardar sin descripción
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres'] // FUNCIONALIDAD: Límite de caracteres
    // RESULTADO ESPERADO: Error si excede 500 caracteres
    // IMPACTO: Mantiene descripciones concisas
    // VALIDACIÓN: Probar con descripciones muy largas
  },
  
  // FUNCIONALIDAD: Definir campo precio con validaciones
  // RESULTADO ESPERADO: Campo requerido con valor mínimo de 0
  // IMPACTO: Previene precios negativos o inválidos
  // VALIDACIÓN: Probar con precios negativos, cero y positivos
  price: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    required: [true, 'El precio es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona precio
    // IMPACTO: Asegura que todos los platos tengan precio
    // VALIDACIÓN: Intentar guardar sin precio
    min: [0, 'El precio no puede ser negativo'] // FUNCIONALIDAD: Valor mínimo permitido
    // RESULTADO ESPERADO: Error si el precio es menor a 0
    // IMPACTO: Previene precios negativos
    // VALIDACIÓN: Probar con precios negativos
  },
  
  // FUNCIONALIDAD: Definir campo categoría con valores predefinidos
  // RESULTADO ESPERADO: Campo requerido con valores del enum
  // IMPACTO: Organiza los platos en categorías consistentes
  // VALIDACIÓN: Probar con categorías válidas e inválidas
  category: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'La categoría es requerida'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona categoría
    // IMPACTO: Asegura clasificación de todos los platos
    // VALIDACIÓN: Intentar guardar sin categoría
    enum: ['Pizza', 'Hamburguesa', 'Pasta', 'Ensalada', 'Bebida', 'Postre'] // FUNCIONALIDAD: Valores permitidos
    // RESULTADO ESPERADO: Solo se aceptan valores del enum
    // IMPACTO: Mantiene consistencia en las categorías
    // VALIDACIÓN: Probar con categorías no incluidas en el enum
  },
  
  // FUNCIONALIDAD: Definir campo URL de imagen
  // RESULTADO ESPERADO: Campo requerido para la imagen del plato
  // IMPACTO: Permite visualización del plato en la interfaz
  // VALIDACIÓN: Probar con URLs válidas e inválidas
  imageUrl: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'La URL de la imagen es requerida'] // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona URL de imagen
    // IMPACTO: Asegura que todos los platos tengan imagen
    // VALIDACIÓN: Intentar guardar sin URL de imagen
  },
  
  // FUNCIONALIDAD: Definir campo de disponibilidad
  // RESULTADO ESPERADO: Campo booleano con valor por defecto true
  // IMPACTO: Controla si el plato puede ser ordenado
  // VALIDACIÓN: Verificar que el valor por defecto sea true
  isAvailable: {
    type: Boolean, // FUNCIONALIDAD: Tipo de dato booleano
    default: true // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos platos están disponibles por defecto
    // IMPACTO: Simplifica la creación de platos
    // VALIDACIÓN: Crear plato sin especificar disponibilidad
  },
  
  // FUNCIONALIDAD: Definir array de ingredientes
  // RESULTADO ESPERADO: Array de strings con ingredientes requeridos
  // IMPACTO: Información nutricional y para clientes con alergias
  // VALIDACIÓN: Probar con arrays vacíos y con ingredientes
  ingredients: [{
    type: String, // FUNCIONALIDAD: Tipo de dato string para cada ingrediente
    required: true // FUNCIONALIDAD: Cada ingrediente es obligatorio
    // RESULTADO ESPERADO: Error si algún ingrediente está vacío
    // IMPACTO: Asegura información completa de ingredientes
    // VALIDACIÓN: Probar con ingredientes vacíos
  }],
  
  // FUNCIONALIDAD: Definir array de alérgenos
  // RESULTADO ESPERADO: Array de strings con alérgenos del enum
  // IMPACTO: Seguridad alimentaria para clientes con alergias
  // VALIDACIÓN: Probar con alérgenos válidos e inválidos
  allergens: [{
    type: String, // FUNCIONALIDAD: Tipo de dato string para cada alérgeno
    enum: ['Gluten', 'Lactosa', 'Frutos secos', 'Huevos', 'Pescado', 'Mariscos'] // FUNCIONALIDAD: Valores permitidos
    // RESULTADO ESPERADO: Solo se aceptan alérgenos del enum
    // IMPACTO: Mantiene consistencia en la identificación de alérgenos
    // VALIDACIÓN: Probar con alérgenos no incluidos en el enum
  }],
  
  // FUNCIONALIDAD: Definir objeto de información nutricional
  // RESULTADO ESPERADO: Objeto con valores nutricionales opcionales
  // IMPACTO: Información para clientes conscientes de su salud
  // VALIDACIÓN: Probar con valores nutricionales válidos e inválidos
  nutritionalInfo: {
    calories: { type: Number, min: 0 }, // FUNCIONALIDAD: Calorías con valor mínimo 0
    // RESULTADO ESPERADO: Error si las calorías son negativas
    // IMPACTO: Previene valores nutricionales imposibles
    // VALIDACIÓN: Probar con calorías negativas
    protein: { type: Number, min: 0 }, // FUNCIONALIDAD: Proteína con valor mínimo 0
    // RESULTADO ESPERADO: Error si la proteína es negativa
    // IMPACTO: Previene valores nutricionales imposibles
    // VALIDACIÓN: Probar con proteína negativa
    carbs: { type: Number, min: 0 }, // FUNCIONALIDAD: Carbohidratos con valor mínimo 0
    // RESULTADO ESPERADO: Error si los carbohidratos son negativos
    // IMPACTO: Previene valores nutricionales imposibles
    // VALIDACIÓN: Probar con carbohidratos negativos
    fat: { type: Number, min: 0 } // FUNCIONALIDAD: Grasa con valor mínimo 0
    // RESULTADO ESPERADO: Error si la grasa es negativa
    // IMPACTO: Previene valores nutricionales imposibles
    // VALIDACIÓN: Probar con grasa negativa
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

// FUNCIONALIDAD: Índice de texto para búsquedas por nombre y descripción
// RESULTADO ESPERADO: Búsquedas de texto más eficientes
// IMPACTO: Permite búsquedas semánticas rápidas
// VALIDACIÓN: Probar búsquedas de texto y verificar velocidad
DishSchema.index({ name: 'text', description: 'text' });

// FUNCIONALIDAD: Índice compuesto para filtrar por categoría y disponibilidad
// RESULTADO ESPERADO: Filtros rápidos por tipo de comida y estado
// IMPACTO: Optimiza consultas de menú por categoría
// VALIDACIÓN: Probar filtros por categoría y verificar rendimiento
DishSchema.index({ category: 1, isAvailable: 1 });

// FUNCIONALIDAD: Índice simple para ordenamiento por precio
// RESULTADO ESPERADO: Ordenamiento rápido por precio
// IMPACTO: Optimiza listados ordenados por precio
// VALIDACIÓN: Probar ordenamiento por precio y verificar velocidad
DishSchema.index({ price: 1 });

// FUNCIONALIDAD: Métodos de instancia para lógica de negocio
// RESULTADO ESPERADO: Funcionalidades específicas por instancia de plato
// IMPACTO: Encapsula lógica de negocio en el modelo
// VALIDACIÓN: Verificar que los métodos funcionen en instancias

// FUNCIONALIDAD: Método para determinar si un plato es caro
// RESULTADO ESPERADO: Boolean true si el precio > $20, false en caso contrario
// IMPACTO: Permite clasificación automática de platos por precio
// VALIDACIÓN: Probar con platos de diferentes precios
DishSchema.methods.isExpensive = function(): boolean {
  return this.price > 20; // FUNCIONALIDAD: Comparar precio con umbral de $20
  // RESULTADO ESPERADO: true para platos caros, false para económicos
  // IMPACTO: Clasificación automática de platos
  // VALIDACIÓN: Verificar con precios $19, $20, $21
};

// FUNCIONALIDAD: Métodos estáticos para consultas comunes
// RESULTADO ESPERADO: Funcionalidades disponibles en el modelo sin instancia
// IMPACTO: Proporciona utilidades de consulta reutilizables
// VALIDACIÓN: Verificar que los métodos estáticos funcionen

// FUNCIONALIDAD: Método para encontrar platos por categoría
// RESULTADO ESPERADO: Array de platos disponibles de una categoría específica
// IMPACTO: Simplifica consultas comunes por tipo de comida
// VALIDACIÓN: Probar con diferentes categorías y verificar resultados
DishSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, isAvailable: true }); // FUNCIONALIDAD: Buscar por categoría y disponibilidad
  // RESULTADO ESPERADO: Platos de la categoría especificada que estén disponibles
  // IMPACTO: Consulta optimizada para menús por categoría
  // VALIDACIÓN: Verificar que solo retorne platos disponibles de la categoría
};

// FUNCIONALIDAD: Crear y exportar el modelo Mongoose
// RESULTADO ESPERADO: Modelo Dish disponible para operaciones de base de datos
// IMPACTO: Permite crear, leer, actualizar y eliminar platos
// VALIDACIÓN: Verificar que el modelo se compile y exporte correctamente
export const Dish = mongoose.model<IDish>('Dish', DishSchema);
```

```typescript
// server/src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  items: Array<{
    dishId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    name: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  paymentMethod: 'cash' | 'card' | 'crypto';
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    dishId: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    name: {
      type: String,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 }
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'crypto'],
    required: true
  },
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: Date
}, {
  timestamps: true
});

// Índices
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
```

## 🔌 API REST CRUD Completa

### 1. Controladores
```typescript
// server/src/controllers/dishController.ts
import { Request, Response } from 'express';
import { Dish, IDish } from '../models/Dish';
import { ApiResponse } from '../types/api';

export class DishController {
  // FUNCIONALIDAD: CREATE - Crear nuevo plato en la base de datos
  // RESULTADO ESPERADO: Plato creado exitosamente o error de validación
  // IMPACTO: Permite agregar nuevos platos al menú del restaurante
  // VALIDACIÓN: Probar con datos válidos e inválidos
  static async createDish = async (req: Request, res: Response): Promise<void> => {
    try {
      // FUNCIONALIDAD: Extraer datos del cuerpo de la petición HTTP
      // RESULTADO ESPERADO: Objeto con datos del plato a crear
      // IMPACTO: Obtiene la información necesaria para crear el plato
      // VALIDACIÓN: Verificar que req.body contenga los datos esperados
      const dishData: Partial<IDish> = req.body;
      
      // FUNCIONALIDAD: Validar que los campos obligatorios estén presentes
      // RESULTADO ESPERADO: Error 400 si faltan campos requeridos
      // IMPACTO: Previene la creación de platos incompletos
      // VALIDACIÓN: Probar con campos faltantes y verificar respuesta de error
      if (!dishData.name || !dishData.price || !dishData.category) {
        // FUNCIONALIDAD: Responder con error de validación
        // RESULTADO ESPERADO: Respuesta HTTP 400 con mensaje de error
        // IMPACTO: Informa al cliente qué campos son obligatorios
        // VALIDACIÓN: Verificar código de estado y mensaje de error
        res.status(400).json({
          success: false, // FUNCIONALIDAD: Indicar que la operación falló
          // RESULTADO ESPERADO: Campo success = false
          // IMPACTO: Permite al cliente identificar el error
          // VALIDACIÓN: Verificar que success sea false
          message: 'Nombre, precio y categoría son requeridos' // FUNCIONALIDAD: Mensaje descriptivo del error
          // RESULTADO ESPERADO: String con descripción clara del problema
          // IMPACTO: Ayuda al desarrollador a corregir el error
          // VALIDACIÓN: Verificar que el mensaje sea claro y útil
        } as ApiResponse);
        return; // FUNCIONALIDAD: Terminar la ejecución de la función
        // RESULTADO ESPERADO: Función se detiene aquí
        // IMPACTO: Evita procesamiento adicional innecesario
        // VALIDACIÓN: Verificar que no se ejecute código posterior
      }

      // FUNCIONALIDAD: Crear nueva instancia del modelo Dish
      // RESULTADO ESPERADO: Objeto Dish con datos validados
      // IMPACTO: Prepara el plato para ser guardado en la base de datos
      // VALIDACIÓN: Verificar que se cree la instancia correctamente
      const dish = new Dish(dishData);
      
      // FUNCIONALIDAD: Guardar el plato en la base de datos MongoDB
      // RESULTADO ESPERADO: Plato persistido con ID único y timestamps
      // IMPACTO: Almacena permanentemente el plato en el sistema
      // VALIDACIÓN: Verificar que se genere ID y timestamps automáticamente
      const savedDish = await dish.save();

      // FUNCIONALIDAD: Responder con éxito y datos del plato creado
      // RESULTADO ESPERADO: Respuesta HTTP 201 con datos del plato
      // IMPACTO: Confirma la creación exitosa al cliente
      // VALIDACIÓN: Verificar código de estado 201 y datos completos
      res.status(201).json({
        success: true, // FUNCIONALIDAD: Indicar que la operación fue exitosa
        // RESULTADO ESPERADO: Campo success = true
        // IMPACTO: Permite al cliente identificar el éxito
        // VALIDACIÓN: Verificar que success sea true
        data: savedDish, // FUNCIONALIDAD: Incluir el plato creado en la respuesta
        // RESULTADO ESPERADO: Objeto completo del plato con ID y timestamps
        // IMPACTO: Proporciona confirmación de los datos guardados
        // VALIDACIÓN: Verificar que todos los campos estén presentes
        message: 'Plato creado exitosamente' // FUNCIONALIDAD: Mensaje de confirmación
        // RESULTADO ESPERADO: String confirmando la creación
        // IMPACTO: Informa al usuario del resultado exitoso
        // VALIDACIÓN: Verificar que el mensaje sea claro y positivo
      } as ApiResponse);
    } catch (error) {
      // FUNCIONALIDAD: Capturar y manejar errores inesperados
      // RESULTADO ESPERADO: Error registrado en consola y respuesta de error
      // IMPACTO: Previene que la aplicación falle silenciosamente
      // VALIDACIÓN: Probar con errores de base de datos y verificar manejo
      console.error('Error creando plato:', error); // FUNCIONALIDAD: Registrar error en consola
      // RESULTADO ESPERADO: Error detallado en logs del servidor
      // IMPACTO: Facilita debugging y monitoreo de errores
      // VALIDACIÓN: Verificar que el error aparezca en la consola
      
      // FUNCIONALIDAD: Responder con error interno del servidor
      // RESULTADO ESPERADO: Respuesta HTTP 500 con mensaje genérico
      // IMPACTO: Informa al cliente que hubo un problema del servidor
      // VALIDACIÓN: Verificar código de estado 500 y mensaje apropiado
      res.status(500).json({
        success: false, // FUNCIONALIDAD: Indicar que la operación falló
        // RESULTADO ESPERADO: Campo success = false
        // IMPACTO: Permite al cliente identificar el error
        // VALIDACIÓN: Verificar que success sea false
        message: 'Error interno del servidor' // FUNCIONALIDAD: Mensaje genérico de error
        // RESULTADO ESPERADO: String con mensaje de error apropiado
        // IMPACTO: No expone detalles internos del error al cliente
        // VALIDACIÓN: Verificar que el mensaje sea genérico y seguro
      } as ApiResponse);
    }
  };

  // FUNCIONALIDAD: READ - Obtener todos los platos con paginación y filtros
  // RESULTADO ESPERADO: Lista paginada de platos disponibles o error del servidor
  // IMPACTO: Permite a los clientes explorar el menú de manera eficiente
  // VALIDACIÓN: Probar con diferentes parámetros de paginación y filtros
  static async getAllDishes = async (req: Request, res: Response): Promise<void> => {
    try {
      // FUNCIONALIDAD: Extraer parámetros de consulta con valores por defecto
      // RESULTADO ESPERADO: Objeto con parámetros de paginación, filtros y ordenamiento
      // IMPACTO: Permite personalizar la consulta según las necesidades del cliente
      // VALIDACIÓN: Verificar que los valores por defecto se apliquen correctamente
      const { page = 1, limit = 10, category, search, sortBy = 'name', order = 'asc' } = req.query;
      
      // FUNCIONALIDAD: Construir objeto de filtros para la consulta MongoDB
      // RESULTADO ESPERADO: Objeto filters con condiciones de búsqueda
      // IMPACTO: Determina qué platos se incluirán en los resultados
      // VALIDACIÓN: Verificar que los filtros se construyan correctamente
      const filters: any = { isAvailable: true }; // FUNCIONALIDAD: Filtro base - solo platos disponibles
      // RESULTADO ESPERADO: Filtro que excluye platos no disponibles
      // IMPACTO: Asegura que solo se muestren platos que se pueden ordenar
      // VALIDACIÓN: Verificar que no aparezcan platos con isAvailable = false
      
      if (category) filters.category = category; // FUNCIONALIDAD: Agregar filtro por categoría si se especifica
      // RESULTADO ESPERADO: Filtro adicional por tipo de comida
      // IMPACTO: Permite filtrar por tipo específico (pizza, hamburguesa, etc.)
      // VALIDACIÓN: Probar con diferentes categorías y verificar resultados
      
      if (search) { // FUNCIONALIDAD: Agregar búsqueda de texto si se proporciona término
        // RESULTADO ESPERADO: Filtro de búsqueda semántica en nombre y descripción
        // IMPACTO: Permite encontrar platos por palabras clave
        // VALIDACIÓN: Probar búsquedas con diferentes términos
        filters.$text = { $search: search as string }; // FUNCIONALIDAD: Usar índice de texto de MongoDB
        // RESULTADO ESPERADO: Búsqueda optimizada usando índices de texto
        // IMPACTO: Búsquedas más rápidas y eficientes
        // VALIDACIÓN: Verificar que las búsquedas sean rápidas
      }

      // FUNCIONALIDAD: Construir opciones de paginación para resultados grandes
      // RESULTADO ESPERADO: Parámetros calculados para paginación
      // IMPACTO: Permite manejar grandes cantidades de platos de manera eficiente
      // VALIDACIÓN: Probar con diferentes tamaños de página
      const pageNum = parseInt(page as string); // FUNCIONALIDAD: Convertir página a número
      // RESULTADO ESPERADO: Número entero de la página solicitada
      // IMPACTO: Determina qué conjunto de resultados mostrar
      // VALIDACIÓN: Verificar conversión correcta de string a número
      
      const limitNum = parseInt(limit as string); // FUNCIONALIDAD: Convertir límite a número
      // RESULTADO ESPERADO: Número entero de resultados por página
      // IMPACTO: Controla cuántos platos se muestran por página
      // VALIDACIÓN: Verificar conversión correcta y límites razonables
      
      const skip = (pageNum - 1) * limitNum; // FUNCIONALIDAD: Calcular cuántos resultados saltar
      // RESULTADO ESPERADO: Número de platos a omitir para llegar a la página solicitada
      // IMPACTO: Permite navegar entre páginas de resultados
      // VALIDACIÓN: Verificar cálculo correcto para diferentes páginas

      // FUNCIONALIDAD: Construir objeto de ordenamiento para resultados consistentes
      // RESULTADO ESPERADO: Objeto sort con campo y dirección de ordenamiento
      // IMPACTO: Determina el orden en que se muestran los platos
      // VALIDACIÓN: Probar con diferentes campos y direcciones de ordenamiento
      const sort: any = {};
      sort[sortBy as string] = order === 'desc' ? -1 : 1; // FUNCIONALIDAD: Establecer dirección de ordenamiento
      // RESULTADO ESPERADO: 1 para ascendente, -1 para descendente
      // IMPACTO: Controla si los resultados van de menor a mayor o viceversa
      // VALIDACIÓN: Verificar que el ordenamiento funcione en ambas direcciones

      // FUNCIONALIDAD: Ejecutar consulta a MongoDB con filtros, ordenamiento y paginación
      // RESULTADO ESPERADO: Array de platos que cumplen con los criterios
      // IMPACTO: Obtiene los datos solicitados de la base de datos
      // VALIDACIÓN: Verificar que la consulta retorne resultados correctos
      const dishes = await Dish.find(filters) // FUNCIONALIDAD: Buscar platos con filtros aplicados
        .sort(sort) // FUNCIONALIDAD: Aplicar ordenamiento especificado
        .skip(skip) // FUNCIONALIDAD: Omitir resultados para paginación
        .limit(limitNum) // FUNCIONALIDAD: Limitar número de resultados por página
        .select('-__v'); // FUNCIONALIDAD: Excluir campo __v de Mongoose
        // RESULTADO ESPERADO: Platos ordenados y paginados sin campo interno
        // IMPACTO: Optimiza la respuesta excluyendo datos innecesarios
        // VALIDACIÓN: Verificar que no aparezca el campo __v en los resultados

      // FUNCIONALIDAD: Contar total de platos que cumplen con los filtros
      // RESULTADO ESPERADO: Número total de platos disponibles
      // IMPACTO: Permite calcular el número total de páginas
      // VALIDACIÓN: Verificar que el conteo sea preciso
      const total = await Dish.countDocuments(filters);

      // FUNCIONALIDAD: Responder con éxito y datos paginados
      // RESULTADO ESPERADO: Respuesta HTTP 200 con platos y metadatos de paginación
      // IMPACTO: Proporciona información completa para navegación
      // VALIDACIÓN: Verificar código de estado 200 y estructura de respuesta
      res.status(200).json({
        success: true, // FUNCIONALIDAD: Indicar que la operación fue exitosa
        // RESULTADO ESPERADO: Campo success = true
        // IMPACTO: Permite al cliente identificar el éxito
        // VALIDACIÓN: Verificar que success sea true
        data: dishes, // FUNCIONALIDAD: Incluir array de platos encontrados
        // RESULTADO ESPERADO: Array con platos de la página solicitada
        // IMPACTO: Proporciona los datos solicitados al cliente
        // VALIDACIÓN: Verificar que el array contenga los platos esperados
        pagination: { // FUNCIONALIDAD: Incluir metadatos de paginación
          // RESULTADO ESPERADO: Objeto con información de paginación
          // IMPACTO: Permite al cliente navegar entre páginas
          // VALIDACIÓN: Verificar que todos los campos de paginación estén presentes
          page: pageNum, // FUNCIONALIDAD: Página actual
          // RESULTADO ESPERADO: Número de la página mostrada
          // IMPACTO: Identifica la página actual en la respuesta
          // VALIDACIÓN: Verificar que coincida con la página solicitada
          limit: limitNum, // FUNCIONALIDAD: Límite de resultados por página
          // RESULTADO ESPERADO: Número máximo de resultados por página
          // IMPACTO: Informa al cliente cuántos resultados puede esperar
          // VALIDACIÓN: Verificar que coincida con el límite solicitado
          total, // FUNCIONALIDAD: Total de platos disponibles
          // RESULTADO ESPERADO: Número total de platos que cumplen filtros
          // IMPACTO: Permite calcular el número total de páginas
          // VALIDACIÓN: Verificar que sea igual al conteo real
          pages: Math.ceil(total / limitNum) // FUNCIONALIDAD: Calcular total de páginas
          // RESULTADO ESPERADO: Número total de páginas disponibles
          // IMPACTO: Permite al cliente saber cuántas páginas hay
          // VALIDACIÓN: Verificar cálculo correcto con diferentes límites
        }
      } as ApiResponse);
    } catch (error) {
      // FUNCIONALIDAD: Capturar y manejar errores inesperados
      // RESULTADO ESPERADO: Error registrado en consola y respuesta de error
      // IMPACTO: Previene que la aplicación falle silenciosamente
      // VALIDACIÓN: Probar con errores de base de datos y verificar manejo
      console.error('Error obteniendo platos:', error); // FUNCIONALIDAD: Registrar error en consola
      // RESULTADO ESPERADO: Error detallado en logs del servidor
      // IMPACTO: Facilita debugging y monitoreo de errores
      // VALIDACIÓN: Verificar que el error aparezca en la consola
      
      // FUNCIONALIDAD: Responder con error interno del servidor
      // RESULTADO ESPERADO: Respuesta HTTP 500 con mensaje genérico
      // IMPACTO: Informa al cliente que hubo un problema del servidor
      // VALIDACIÓN: Verificar código de estado 500 y mensaje apropiado
      res.status(500).json({
        success: false, // FUNCIONALIDAD: Indicar que la operación falló
        // RESULTADO ESPERADO: Campo success = false
        // IMPACTO: Permite al cliente identificar el error
        // VALIDACIÓN: Verificar que success sea false
        message: 'Error interno del servidor' // FUNCIONALIDAD: Mensaje genérico de error
        // RESULTADO ESPERADO: String con mensaje de error apropiado
        // IMPACTO: No expone detalles internos del error al cliente
        // VALIDACIÓN: Verificar que el mensaje sea genérico y seguro
      } as ApiResponse);
    }
  };

  // READ - Obtener plato por ID
  static async getDishById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const dish = await Dish.findById(id).select('-__v');
      
      if (!dish) {
        res.status(404).json({
          success: false,
          message: 'Plato no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: dish
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo plato:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // UPDATE - Actualizar plato
  static async updateDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const dish = await Dish.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!dish) {
        res.status(404).json({
          success: false,
          message: 'Plato no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: dish,
        message: 'Plato actualizado exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error actualizando plato:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // DELETE - Eliminar plato (soft delete)
  static async deleteDish = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const dish = await Dish.findByIdAndUpdate(
        id,
        { isAvailable: false },
        { new: true }
      ).select('-__v');

      if (!dish) {
        res.status(404).json({
          success: false,
          message: 'Plato no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: dish,
        message: 'Plato eliminado exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error eliminando plato:', error);
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
// server/src/routes/dishRoutes.ts
import { Router } from 'express';
import { DishController } from '../controllers/dishController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { dishValidationSchema } from '../validation/dishValidation';

const router = Router();

// Rutas públicas
router.get('/', DishController.getAllDishes);
router.get('/:id', DishController.getDishById);

// Rutas protegidas (requieren autenticación)
router.post('/', 
  authMiddleware, 
  validationMiddleware(dishValidationSchema.create),
  DishController.createDish
);

router.put('/:id', 
  authMiddleware, 
  validationMiddleware(dishValidationSchema.update),
  DishController.updateDish
);

router.delete('/:id', 
  authMiddleware, 
  DishController.deleteDish
);

export default router;
```

### 3. Middleware de Autenticación
```typescript
// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};
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
import { connectDB } from './config/database';
import dishRoutes from './routes/dishRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
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

### 2. Manejo de Errores
```typescript
// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('Error:', err);

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { ...error, message } as any;
  }

  // Error de Mongoose - Validación
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = { ...error, message } as any;
  }

  // Error de Mongoose - Duplicado
  if ((err as any).code === 11000) {
    const message = 'Valor duplicado';
    error = { ...error, message } as any;
  }

  res.status((error as any).statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 🚀 Despliegue en la Nube

### 1. Docker Configuration
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

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
    container_name: mesio-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: mesio
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - mesio-network

  server:
    build: ./server
    container_name: mesio-server
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/mesio?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - mesio-network

  client:
    build: ./client
    container_name: mesio-client
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - server
    networks:
      - mesio-network

volumes:
  mongodb_data:

networks:
  mesio-network:
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
        scp -r server/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/mesio-server/
        scp -r client/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/mesio-client/
        
        # Reiniciar servicios
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/mesio-server && npm install && pm2 restart mesio-server"
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/mesio-client && npm install && pm2 restart mesio-client"
```

### 3. Despliegue en Vercel (Frontend)
```json
// client/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-api-domain.com/api"
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-api-domain.com/api/$1"
    }
  ]
}
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

### 2. Servicios de Plato
```typescript
// client/src/services/dishService.ts
import api from './api';
import { Dish, CreateDishData, UpdateDishData } from '@/types/dish';

export class DishService {
  static async getAllDishes(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<{
    data: Dish[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await api.get('/dishes', { params });
    return response.data;
  }

  static async getDishById(id: string): Promise<Dish> {
    const response = await api.get(`/dishes/${id}`);
    return response.data.data;
  }

  static async createDish(dishData: CreateDishData): Promise<Dish> {
    const response = await api.post('/dishes', dishData);
    return response.data.data;
  }

  static async updateDish(id: string, dishData: UpdateDishData): Promise<Dish> {
    const response = await api.put(`/dishes/${id}`, dishData);
    return response.data.data;
  }

  static async deleteDish(id: string): Promise<void> {
    await api.delete(`/dishes/${id}`);
  }
}
```

## 📊 Monitoreo y Logging

### 1. Winston Logger
```typescript
// server/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mesio-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### 2. Métricas con Prometheus
```typescript
// server/src/middleware/metrics.ts
import prometheus from 'prom-client';

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

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

export const getMetrics = async () => {
  return await prometheus.register.metrics();
};
```

## 🧪 Testing Completo

### 1. Testing del Backend
```typescript
// server/src/__tests__/dish.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { Dish } from '../models/Dish';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils';

describe('Dish API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/dishes', () => {
    it('should return all dishes', async () => {
      const dish = await Dish.create({
        name: 'Pizza Margherita',
        description: 'Pizza clásica italiana',
        price: 15.99,
        category: 'Pizza'
      });

      const response = await request(app)
        .get('/api/dishes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Pizza Margherita');
    });
  });

  describe('POST /api/dishes', () => {
    it('should create a new dish', async () => {
      const dishData = {
        name: 'Hamburguesa Clásica',
        description: 'Hamburguesa con carne y vegetales',
        price: 12.99,
        category: 'Hamburguesa'
      };

      const response = await request(app)
        .post('/api/dishes')
        .send(dishData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(dishData.name);
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
    "docker:build": "docker build -t mesio-server .",
    "docker:run": "docker run -p 5000:5000 mesio-server",
    "deploy:aws": "npm run build && aws s3 sync dist/ s3://your-bucket/",
    "deploy:heroku": "npm run build && git push heroku main"
  }
}
```

### 2. Scripts de Base de Datos
```bash
#!/bin/bash
# scripts/setup-db.sh

echo "🚀 Configurando base de datos Mesio..."

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
docker exec mesio-mongodb mongosh --eval "
  use mesio;
  db.dishes.createIndex({ name: 'text', description: 'text' });
  db.dishes.createIndex({ category: 1, isAvailable: 1 });
  db.orders.createIndex({ userId: 1, createdAt: -1 });
  db.orders.createIndex({ status: 1, createdAt: -1 });
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
