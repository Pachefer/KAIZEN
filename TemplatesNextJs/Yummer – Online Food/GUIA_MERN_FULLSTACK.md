# 🚀 Guía Completa Arquitectura MERN Full-Stack - Yummer

## 📋 Descripción General
Esta guía implementa una arquitectura MERN (MongoDB + Express + React + Node.js) completa con TypeScript para el proyecto Yummer Online Food.

## 🔍 Comentarios de Funcionalidad y Predicción de Resultados

### 📝 Explicación de Comentarios
- **// FUNCIONALIDAD**: Describe qué hace la línea de código
- **// RESULTADO ESPERADO**: Predice el resultado de la ejecución
- **// IMPACTO**: Explica el efecto en el sistema
- **// VALIDACIÓN**: Cómo verificar que funciona correctamente

## 🏗️ Arquitectura Full-Stack

### Estructura del Proyecto
```
yummer-fullstack/
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
npm install mongoose dotenv express cors helmet morgan bcryptjs jsonwebtoken
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yummer';

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
// server/src/models/Restaurant.ts
// FUNCIONALIDAD: Importar tipos y clases necesarias de Mongoose
// RESULTADO ESPERADO: Acceso a Document, Schema y funcionalidades de Mongoose
// IMPACTO: Permite crear esquemas y modelos de MongoDB con TypeScript
// VALIDACIÓN: Verificar que las importaciones no generen errores de compilación
import mongoose, { Document, Schema } from 'mongoose';

// FUNCIONALIDAD: Definir interfaz TypeScript para el modelo Restaurant
// RESULTADO ESPERADO: Tipado estricto para objetos de restaurante con autocompletado
// IMPACTO: Previene errores de tipo y mejora la experiencia de desarrollo
// VALIDACIÓN: Verificar que el autocompletado funcione en el IDE
export interface IRestaurant extends Document {
  // FUNCIONALIDAD: Nombre del restaurante (campo requerido)
  // RESULTADO ESPERADO: String con el nombre del restaurante
  // IMPACTO: Identificación única del restaurante en el sistema
  // VALIDACIÓN: Verificar que no esté vacío y tenga formato válido
  name: string;
  
  // FUNCIONALIDAD: Descripción detallada del restaurante
  // RESULTADO ESPERADO: String con descripción del restaurante
  // IMPACTO: Información para que los clientes conozcan el restaurante
  // VALIDACIÓN: Verificar que contenga información útil y descriptiva
  description: string;
  
  // FUNCIONALIDAD: Tipo de cocina del restaurante
  // RESULTADO ESPERADO: String con el tipo de cocina (italiana, mexicana, etc.)
  // IMPACTO: Permite filtrar restaurantes por preferencias culinarias
  // VALIDACIÓN: Verificar que sea uno de los valores del enum
  cuisine: string;
  
  // FUNCIONALIDAD: Calificación promedio del restaurante
  // RESULTADO ESPERADO: Número decimal entre 0 y 5
  // IMPACTO: Ayuda a los clientes a elegir restaurantes de calidad
  // VALIDACIÓN: Verificar que esté en el rango 0-5
  rating: number;
  
  // FUNCIONALIDAD: Tiempo estimado de entrega en minutos
  // RESULTADO ESPERADO: Número entero positivo
  // IMPACTO: Informa a los clientes cuándo esperar su pedido
  // VALIDACIÓN: Verificar que sea un número positivo realista
  deliveryTime: number;
  
  // FUNCIONALIDAD: Pedido mínimo requerido para entrega
  // RESULTADO ESPERADO: Número decimal positivo
  // IMPACTO: Establece el umbral mínimo para pedidos
  // VALIDACIÓN: Verificar que sea un número positivo
  minimumOrder: number;
  
  // FUNCIONALIDAD: Tarifa de entrega del restaurante
  // RESULTADO ESPERADO: Número decimal positivo o cero
  // IMPACTO: Costo adicional para el cliente
  // VALIDACIÓN: Verificar que sea un número no negativo
  deliveryFee: number;
  
  // FUNCIONALIDAD: Dirección física del restaurante
  // RESULTADO ESPERADO: Objeto con información de ubicación
  // IMPACTO: Permite calcular distancias y mostrar ubicación en mapas
  // VALIDACIÓN: Verificar que todos los campos estén completos
  address: {
    street: { type: String, required: true }, // FUNCIONALIDAD: Calle y número
    // RESULTADO ESPERADO: String con dirección específica
    // IMPACTO: Ubicación precisa del restaurante
    // VALIDACIÓN: Verificar que no esté vacío
    city: { type: String, required: true }, // FUNCIONALIDAD: Ciudad
    // RESULTADO ESPERADO: String con nombre de la ciudad
    // IMPACTO: Organización geográfica de restaurantes
    // VALIDACIÓN: Verificar que no esté vacío
    zipCode: { type: String, required: true }, // FUNCIONALIDAD: Código postal
    // RESULTADO ESPERADO: String con código postal
    // IMPACTO: Precisión en la ubicación
    // VALIDACIÓN: Verificar formato válido de código postal
    coordinates: { // FUNCIONALIDAD: Coordenadas geográficas
      lat: { type: Number, required: true, min: -90, max: 90 }, // FUNCIONALIDAD: Latitud
      // RESULTADO ESPERADO: Número entre -90 y 90
      // IMPACTO: Permite cálculos de distancia precisos
      // VALIDACIÓN: Verificar que esté en rango válido
      lng: { type: Number, required: true, min: -180, max: 180 } // FUNCIONALIDAD: Longitud
      // RESULTADO ESPERADO: Número entre -180 y 180
      // IMPACTO: Permite cálculos de distancia precisos
      // VALIDACIÓN: Verificar que esté en rango válido
    }
  };
  
  // FUNCIONALIDAD: Estado de apertura del restaurante
  // RESULTADO ESPERADO: Boolean indicando si está abierto
  // IMPACTO: Controla si el restaurante puede recibir pedidos
  // VALIDACIÓN: Verificar que el estado se actualice correctamente
  isOpen: boolean;
  
  // FUNCIONALIDAD: Horarios de operación del restaurante
  // RESULTADO ESPERADO: Array con horarios por día de la semana
  // IMPACTO: Informa a los clientes cuándo pueden ordenar
  // VALIDACIÓN: Verificar que cubra todos los días necesarios
  operatingHours: {
    day: { type: String, required: true, enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] }, // FUNCIONALIDAD: Día de la semana
    // RESULTADO ESPERADO: String con nombre del día
    // IMPACTO: Organiza horarios por día
    // VALIDACIÓN: Verificar que sea un día válido del enum
    open: { type: String, required: true }, // FUNCIONALIDAD: Hora de apertura
    // RESULTADO ESPERADO: String con hora de apertura
    // IMPACTO: Indica cuándo empieza a operar
    // VALIDACIÓN: Verificar formato de hora válido
    close: { type: String, required: true } // FUNCIONALIDAD: Hora de cierre
    // RESULTADO ESPERADO: String con hora de cierre
    // IMPACTO: Indica cuándo deja de operar
    // VALIDACIÓN: Verificar formato de hora válido
  }[];
  
  // FUNCIONALIDAD: Imágenes del restaurante
  // RESULTADO ESPERADO: Array de URLs de imágenes
  // IMPACTO: Permite a los clientes ver el restaurante
  // VALIDACIÓN: Verificar que las URLs sean accesibles
  images: string[];
  
  // FUNCIONALIDAD: Timestamp de creación del registro
  // RESULTADO ESPERADO: Fecha y hora automática de creación
  // IMPACTO: Auditoría y seguimiento de cuándo se agregó el restaurante
  // VALIDACIÓN: Verificar que se genere automáticamente al crear
  createdAt: Date;
  
  // FUNCIONALIDAD: Timestamp de última actualización
  // RESULTADO ESPERADO: Fecha y hora automática de última modificación
  // IMPACTO: Auditoría y seguimiento de cambios en el restaurante
  // VALIDACIÓN: Verificar que se actualice automáticamente al modificar
  updatedAt: Date;
}

// FUNCIONALIDAD: Crear esquema de Mongoose para el modelo Restaurant
// RESULTADO ESPERADO: Esquema con validaciones y configuraciones para el modelo
// IMPACTO: Define la estructura y reglas de validación de los datos
// VALIDACIÓN: Verificar que el esquema se compile sin errores
const RestaurantSchema = new Schema<IRestaurant>({
  // FUNCIONALIDAD: Definir campo nombre con validaciones
  // RESULTADO ESPERADO: Campo requerido, recortado y con límite de caracteres
  // IMPACTO: Asegura que el nombre sea válido y no excesivamente largo
  // VALIDACIÓN: Probar con nombres vacíos, muy largos y válidos
  name: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    // RESULTADO ESPERADO: Campo obligatorio con mensaje de error personalizado
    // IMPACTO: Previene restaurantes sin nombre
    // VALIDACIÓN: Intentar guardar sin nombre y verificar mensaje de error
    required: [true, 'El nombre del restaurante es requerido'],
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
    // IMPACTO: Asegura que los clientes tengan información del restaurante
    // VALIDACIÓN: Intentar guardar sin descripción
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres'] // FUNCIONALIDAD: Límite de caracteres
    // RESULTADO ESPERADO: Error si excede 500 caracteres
    // IMPACTO: Mantiene descripciones concisas
    // VALIDACIÓN: Probar con descripciones muy largas
  },
  
  // FUNCIONALIDAD: Definir campo tipo de cocina con valores predefinidos
  // RESULTADO ESPERADO: Campo requerido con valores del enum
  // IMPACTO: Organiza los restaurantes en categorías consistentes
  // VALIDACIÓN: Probar con tipos válidos e inválidos
  cuisine: {
    type: String, // FUNCIONALIDAD: Tipo de dato string
    required: [true, 'El tipo de cocina es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona tipo de cocina
    // IMPACTO: Asegura clasificación de todos los restaurantes
    // VALIDACIÓN: Intentar guardar sin tipo de cocina
    enum: ['Italiana', 'Mexicana', 'China', 'Japonesa', 'India', 'Americana', 'Mediterránea'] // FUNCIONALIDAD: Valores permitidos
    // RESULTADO ESPERADO: Solo se aceptan valores del enum
    // IMPACTO: Mantiene consistencia en las categorías culinarias
    // VALIDACIÓN: Probar con tipos no incluidos en el enum
  },
  
  // FUNCIONALIDAD: Definir campo calificación con validaciones
  // RESULTADO ESPERADO: Campo con valor por defecto 0 y rango 0-5
  // IMPACTO: Permite calificación de restaurantes por los clientes
  // VALIDACIÓN: Probar con calificaciones válidas e inválidas
  rating: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    default: 0, // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos restaurantes tienen calificación 0
    // IMPACTO: Simplifica la creación de restaurantes
    // VALIDACIÓN: Crear restaurante sin especificar calificación
    min: [0, 'La calificación no puede ser menor a 0'], // FUNCIONALIDAD: Valor mínimo permitido
    // RESULTADO ESPERADO: Error si la calificación es menor a 0
    // IMPACTO: Previene calificaciones negativas
    // VALIDACIÓN: Probar con calificaciones negativas
    max: [5, 'La calificación no puede ser mayor a 5'] // FUNCIONALIDAD: Valor máximo permitido
    // RESULTADO ESPERADO: Error si la calificación es mayor a 5
    // IMPACTO: Mantiene calificaciones en escala estándar
    // VALIDACIÓN: Probar con calificaciones mayores a 5
  },
  
  // FUNCIONALIDAD: Definir campo tiempo de entrega con validaciones
  // RESULTADO ESPERADO: Campo requerido con valor mínimo de 15 minutos
  // IMPACTO: Informa a los clientes cuándo esperar su pedido
  // VALIDACIÓN: Probar con tiempos válidos e inválidos
  deliveryTime: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    required: [true, 'El tiempo de entrega es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona tiempo de entrega
    // IMPACTO: Asegura que todos los restaurantes especifiquen tiempo
    // VALIDACIÓN: Intentar guardar sin tiempo de entrega
    min: [15, 'El tiempo mínimo de entrega es 15 minutos'] // FUNCIONALIDAD: Valor mínimo permitido
    // RESULTADO ESPERADO: Error si el tiempo es menor a 15 minutos
    // IMPACTO: Previene tiempos de entrega irrealistas
    // VALIDACIÓN: Probar con tiempos menores a 15 minutos
  },
  
  // FUNCIONALIDAD: Definir campo pedido mínimo con validaciones
  // RESULTADO ESPERADO: Campo requerido con valor mínimo de 0
  // IMPACTO: Establece el umbral mínimo para pedidos
  // VALIDACIÓN: Probar con valores válidos e inválidos
  minimumOrder: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    required: [true, 'El pedido mínimo es requerido'], // FUNCIONALIDAD: Campo obligatorio
    // RESULTADO ESPERADO: Error si no se proporciona pedido mínimo
    // IMPACTO: Asegura que todos los restaurantes especifiquen umbral
    // VALIDACIÓN: Intentar guardar sin pedido mínimo
    min: [0, 'El pedido mínimo no puede ser negativo'] // FUNCIONALIDAD: Valor mínimo permitido
    // RESULTADO ESPERADO: Error si el pedido mínimo es negativo
    // IMPACTO: Previene umbrales negativos
    // VALIDACIÓN: Probar con valores negativos
  },
  
  // FUNCIONALIDAD: Definir campo tarifa de entrega con validaciones
  // RESULTADO ESPERADO: Campo con valor por defecto 0 y valor mínimo 0
  // IMPACTO: Establece costo adicional para el cliente
  // VALIDACIÓN: Probar con valores válidos e inválidos
  deliveryFee: {
    type: Number, // FUNCIONALIDAD: Tipo de dato numérico
    default: 0, // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos restaurantes tienen tarifa 0 por defecto
    // IMPACTO: Simplifica la creación de restaurantes
    // VALIDACIÓN: Crear restaurante sin especificar tarifa
    min: [0, 'La tarifa de entrega no puede ser negativa'] // FUNCIONALIDAD: Valor mínimo permitido
    // RESULTADO ESPERADO: Error si la tarifa es negativa
    // IMPACTO: Previene tarifas negativas
    // VALIDACIÓN: Probar con tarifas negativas
  },
  
  // FUNCIONALIDAD: Definir objeto de dirección con validaciones
  // RESULTADO ESPERADO: Objeto con campos requeridos y coordenadas validadas
  // IMPACTO: Permite ubicación precisa del restaurante
  // VALIDACIÓN: Probar con direcciones completas e incompletas
  address: {
    street: { type: String, required: true }, // FUNCIONALIDAD: Calle y número
    // RESULTADO ESPERADO: Campo obligatorio para la dirección
    // IMPACTO: Ubicación específica del restaurante
    // VALIDACIÓN: Verificar que sea requerido
    city: { type: String, required: true }, // FUNCIONALIDAD: Ciudad
    // RESULTADO ESPERADO: Campo obligatorio para la ciudad
    // IMPACTO: Organización geográfica
    // VALIDACIÓN: Verificar que sea requerido
    zipCode: { type: String, required: true }, // FUNCIONALIDAD: Código postal
    // RESULTADO ESPERADO: Campo obligatorio para el código postal
    // IMPACTO: Precisión en la ubicación
    // VALIDACIÓN: Verificar que sea requerido
    coordinates: { // FUNCIONALIDAD: Coordenadas geográficas
      lat: { type: Number, required: true, min: -90, max: 90 }, // FUNCIONALIDAD: Latitud
      // RESULTADO ESPERADO: Campo obligatorio con rango -90 a 90
      // IMPACTO: Permite cálculos de distancia precisos
      // VALIDACIÓN: Probar con latitudes válidas e inválidas
      lng: { type: Number, required: true, min: -180, max: 180 } // FUNCIONALIDAD: Longitud
      // RESULTADO ESPERADO: Campo obligatorio con rango -180 a 180
      // IMPACTO: Permite cálculos de distancia precisos
      // VALIDACIÓN: Probar con longitudes válidas e inválidas
    }
  },
  
  // FUNCIONALIDAD: Definir campo de apertura
  // RESULTADO ESPERADO: Campo booleano con valor por defecto true
  // IMPACTO: Controla si el restaurante puede recibir pedidos
  // VALIDACIÓN: Verificar que el valor por defecto sea true
  isOpen: {
    type: Boolean, // FUNCIONALIDAD: Tipo de dato booleano
    default: true // FUNCIONALIDAD: Valor por defecto
    // RESULTADO ESPERADO: Nuevos restaurantes están abiertos por defecto
    // IMPACTO: Simplifica la creación de restaurantes
    // VALIDACIÓN: Crear restaurante sin especificar estado de apertura
  },
  
  // FUNCIONALIDAD: Definir array de horarios de operación
  // RESULTADO ESPERADO: Array con horarios por día de la semana
  // IMPACTO: Informa a los clientes cuándo pueden ordenar
  // VALIDACIÓN: Probar con horarios válidos e inválidos
  operatingHours: [{
    day: { type: String, required: true, enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] }, // FUNCIONALIDAD: Día de la semana
    // RESULTADO ESPERADO: Campo obligatorio con valores del enum
    // IMPACTO: Organiza horarios por día
    // VALIDACIÓN: Probar con días válidos e inválidos
    open: { type: String, required: true }, // FUNCIONALIDAD: Hora de apertura
    // RESULTADO ESPERADO: Campo obligatorio para la hora de apertura
    // IMPACTO: Indica cuándo empieza a operar
    // VALIDACIÓN: Verificar que sea requerido
    close: { type: String, required: true } // FUNCIONALIDAD: Hora de cierre
    // RESULTADO ESPERADO: Campo obligatorio para la hora de cierre
    // IMPACTO: Indica cuándo deja de operar
    // VALIDACIÓN: Verificar que sea requerido
  }],
  
  // FUNCIONALIDAD: Definir array de imágenes
  // RESULTADO ESPERADO: Array de strings con URLs de imágenes
  // IMPACTO: Permite a los clientes ver el restaurante
  // VALIDACIÓN: Probar con arrays vacíos y con URLs
  images: [String] // FUNCIONALIDAD: Array de strings
  // RESULTADO ESPERADO: Array que puede estar vacío o contener URLs
  // IMPACTO: Flexibilidad en la cantidad de imágenes
  // VALIDACIÓN: Probar con diferentes cantidades de imágenes
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

// Índices para optimizar consultas
RestaurantSchema.index({ name: 'text', description: 'text' });
RestaurantSchema.index({ cuisine: 1, isOpen: 1 });
RestaurantSchema.index({ 'address.coordinates': '2dsphere' });
RestaurantSchema.index({ rating: -1 });

// Métodos de instancia
RestaurantSchema.methods.isExpensive = function(): boolean {
  return this.minimumOrder > 25;
};

// Métodos estáticos
RestaurantSchema.statics.findByCuisine = function(cuisine: string) {
  return this.find({ cuisine, isOpen: true });
};

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
```

```typescript
// server/src/models/MenuItem.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  preparationTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del plato es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['Entrada', 'Plato Principal', 'Postre', 'Bebida', 'Acompañamiento']
  },
  imageUrl: {
    type: String,
    required: [true, 'La URL de la imagen es requerida']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  allergens: [{
    type: String,
    enum: ['Gluten', 'Lactosa', 'Frutos secos', 'Huevos', 'Pescado', 'Mariscos', 'Soja']
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  preparationTime: {
    type: Number,
    required: true,
    min: [5, 'El tiempo de preparación mínimo es 5 minutos']
  }
}, {
  timestamps: true
});

// Índices
MenuItemSchema.index({ restaurantId: 1, category: 1 });
MenuItemSchema.index({ name: 'text', description: 'text' });
MenuItemSchema.index({ isAvailable: 1, isVegetarian: 1, isSpicy: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
```

## 🔌 API REST CRUD Completa

### 1. Controladores
```typescript
// server/src/controllers/restaurantController.ts
import { Request, Response } from 'express';
import { Restaurant, IRestaurant } from '../models/Restaurant';
import { ApiResponse } from '../types/api';

export class RestaurantController {
  // CREATE - Crear nuevo restaurante
  static async createRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
      const restaurantData: Partial<IRestaurant> = req.body;
      
      // Validar datos requeridos
      if (!restaurantData.name || !restaurantData.cuisine || !restaurantData.address) {
        res.status(400).json({
          success: false,
          message: 'Nombre, cocina y dirección son requeridos'
        } as ApiResponse);
        return;
      }

      const restaurant = new Restaurant(restaurantData);
      const savedRestaurant = await restaurant.save();

      res.status(201).json({
        success: true,
        data: savedRestaurant,
        message: 'Restaurante creado exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error creando restaurante:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener todos los restaurantes
  static async getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        cuisine, 
        search, 
        sortBy = 'rating', 
        order = 'desc',
        lat,
        lng,
        radius = 10
      } = req.query;
      
      // Construir filtros
      const filters: any = { isOpen: true };
      if (cuisine) filters.cuisine = cuisine;
      if (search) {
        filters.$text = { $search: search as string };
      }

      // Filtro de ubicación si se proporcionan coordenadas
      if (lat && lng) {
        filters['address.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
            },
            $maxDistance: parseFloat(radius as string) * 1000 // Convertir km a metros
          }
        };
      }

      // Construir opciones de paginación
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Construir ordenamiento
      const sort: any = {};
      sort[sortBy as string] = order === 'desc' ? -1 : 1;

      const restaurants = await Restaurant.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-__v');

      const total = await Restaurant.countDocuments(filters);

      res.status(200).json({
        success: true,
        data: restaurants,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo restaurantes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener restaurante por ID
  static async getRestaurantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const restaurant = await Restaurant.findById(id)
        .select('-__v')
        .populate('menuItems', 'name price category imageUrl');
      
      if (!restaurant) {
        res.status(404).json({
          success: false,
          message: 'Restaurante no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: restaurant
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo restaurante:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // UPDATE - Actualizar restaurante
  static async updateRestaurant = async (req: Request, res: Response): Promise<void> => {
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

      const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!restaurant) {
        res.status(404).json({
          success: false,
          message: 'Restaurante no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: restaurant,
        message: 'Restaurante actualizado exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error actualizando restaurante:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // DELETE - Eliminar restaurante (soft delete)
  static async deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        { isOpen: false },
        { new: true }
      ).select('-__v');

      if (!restaurant) {
        res.status(404).json({
          success: false,
          message: 'Restaurante no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: restaurant,
        message: 'Restaurante eliminado exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error eliminando restaurante:', error);
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
// server/src/routes/restaurantRoutes.ts
import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurantController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { restaurantValidationSchema } from '../validation/restaurantValidation';

const router = Router();

// Rutas públicas
router.get('/', RestaurantController.getAllRestaurants);
router.get('/:id', RestaurantController.getRestaurantById);

// Rutas protegidas (requieren autenticación)
router.post('/', 
  authMiddleware, 
  validationMiddleware(restaurantValidationSchema.create),
  RestaurantController.createRestaurant
);

router.put('/:id', 
  authMiddleware, 
  validationMiddleware(restaurantValidationSchema.update),
  RestaurantController.updateRestaurant
);

router.delete('/:id', 
  authMiddleware, 
  RestaurantController.deleteRestaurant
);

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
import { connectDB } from './config/database';
import restaurantRoutes from './routes/restaurantRoutes';
import menuItemRoutes from './routes/menuItemRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { metricsMiddleware } from './middleware/metrics';

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

// Middleware de métricas
app.use(metricsMiddleware);

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
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

// Métricas Prometheus
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', 'text/plain');
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
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

### 2. Servicios de Restaurante
```typescript
// client/src/services/restaurantService.ts
import api from './api';
import { Restaurant, CreateRestaurantData, UpdateRestaurantData } from '@/types/restaurant';

export class RestaurantService {
  static async getAllRestaurants(params?: {
    page?: number;
    limit?: number;
    cuisine?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<{
    data: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await api.get('/restaurants', { params });
    return response.data;
  }

  static async getRestaurantById(id: string): Promise<Restaurant> {
    const response = await api.get(`/restaurants/${id}`);
    return response.data.data;
  }

  static async createRestaurant(restaurantData: CreateRestaurantData): Promise<Restaurant> {
    const response = await api.post('/restaurants', restaurantData);
    return response.data.data;
  }

  static async updateRestaurant(id: string, restaurantData: UpdateRestaurantData): Promise<Restaurant> {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data.data;
  }

  static async deleteRestaurant(id: string): Promise<void> {
    await api.delete(`/restaurants/${id}`);
  }
}
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
    container_name: yummer-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: yummer
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - yummer-network

  server:
    build: ./server
    container_name: yummer-server
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/yummer?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - yummer-network

  client:
    build: ./client
    container_name: yummer-client
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - server
    networks:
      - yummer-network

volumes:
  mongodb_data:

networks:
  yummer-network:
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
        scp -r server/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/yummer-server/
        scp -r client/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/yummer-client/
        
        # Reiniciar servicios
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/yummer-server && npm install && pm2 restart yummer-server"
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/yummer-client && npm install && pm2 restart yummer-client"
```

## 🧪 Testing Completo

### 1. Testing del Backend
```typescript
// server/src/__tests__/restaurant.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { Restaurant } from '../models/Restaurant';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils';

describe('Restaurant API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/restaurants', () => {
    it('should return all restaurants', async () => {
      const restaurant = await Restaurant.create({
        name: 'Pizza Palace',
        description: 'Las mejores pizzas de la ciudad',
        cuisine: 'Italiana',
        address: {
          street: 'Calle Principal 123',
          city: 'Ciudad',
          zipCode: '12345',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }
      });

      const response = await request(app)
        .get('/api/restaurants')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Pizza Palace');
    });
  });

  describe('POST /api/restaurants', () => {
    it('should create a new restaurant', async () => {
      const restaurantData = {
        name: 'Taco House',
        description: 'Auténtica comida mexicana',
        cuisine: 'Mexicana',
        address: {
          street: 'Avenida México 456',
          city: 'Ciudad',
          zipCode: '12345',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }
      };

      const response = await request(app)
        .post('/api/restaurants')
        .send(restaurantData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(restaurantData.name);
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
    "docker:build": "docker build -t yummer-server .",
    "docker:run": "docker run -p 5000:5000 yummer-server",
    "deploy:aws": "npm run build && aws s3 sync dist/ s3://your-bucket/",
    "deploy:heroku": "npm run build && git push heroku main"
  }
}
```

### 2. Scripts de Base de Datos
```bash
#!/bin/bash
# scripts/setup-db.sh

echo "🚀 Configurando base de datos Yummer..."

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
docker exec yummer-mongodb mongosh --eval "
  use yummer;
  db.restaurants.createIndex({ name: 'text', description: 'text' });
  db.restaurants.createIndex({ cuisine: 1, isOpen: 1 });
  db.restaurants.createIndex({ 'address.coordinates': '2dsphere' });
  db.restaurants.createIndex({ rating: -1 });
  db.menuitems.createIndex({ restaurantId: 1, category: 1 });
  db.menuitems.createIndex({ name: 'text', description: 'text' });
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
