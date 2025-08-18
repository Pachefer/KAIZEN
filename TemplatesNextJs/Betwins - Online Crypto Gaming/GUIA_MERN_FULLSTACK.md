# 🚀 Guía Completa Arquitectura MERN Full-Stack - Betwins

## 📋 Descripción General
Esta guía implementa una arquitectura MERN (MongoDB + Express + React + Node.js) completa con TypeScript para el proyecto Betwins Online Crypto Gaming, enfocada en blockchain, criptomonedas y gaming.

## 🏗️ Arquitectura Full-Stack

### Estructura del Proyecto
```
betwins-fullstack/
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
npm install mongoose dotenv express cors helmet morgan bcryptjs jsonwebtoken web3 ethers
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/betwins';

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
  // FUNCIONALIDAD: Nombre de usuario único para gaming (campo requerido)
  // RESULTADO ESPERADO: String con nombre de usuario único
  // IMPACTO: Identificación del jugador en el sistema de gaming
  // VALIDACIÓN: Verificar que no esté vacío y sea único
  username: string;
  
  // FUNCIONALIDAD: Correo electrónico del usuario (campo requerido)
  // RESULTADO ESPERADO: String con email válido y único
  // IMPACTO: Identificador principal para autenticación y comunicación
  // VALIDACIÓN: Verificar formato de email y unicidad en la base de datos
  email: string;
  
  // FUNCIONALIDAD: Contraseña encriptada del usuario (campo requerido)
  // RESULTADO ESPERADO: String con hash bcrypt de la contraseña
  // IMPACTO: Seguridad de autenticación del usuario
  // VALIDACIÓN: Verificar que se encripte correctamente con bcrypt
  password: string;
  
  // FUNCIONALIDAD: Dirección de wallet de criptomonedas (campo requerido)
  // RESULTADO ESPERADO: String con dirección de wallet válida
  // IMPACTO: Permite transacciones de criptomonedas en el gaming
  // VALIDACIÓN: Verificar formato de dirección de wallet
  walletAddress: string;
  
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
  
  // FUNCIONALIDAD: Perfil personal del usuario
  // RESULTADO ESPERADO: Objeto con información personal del jugador
  // IMPACTO: Personalización y socialización en el gaming
  // VALIDACIÓN: Verificar que los campos opcionales se manejen correctamente
  profile: {
    avatar: { type: String, default: '' }, // FUNCIONALIDAD: URL de imagen de perfil
    // RESULTADO ESPERADO: String con URL de avatar o vacío por defecto
    // IMPACTO: Personalización visual del perfil
    // VALIDACIÓN: Verificar que se establezca correctamente
    bio: { type: String, default: '', maxlength: [200, 'La bio no puede tener más de 200 caracteres'] }, // FUNCIONALIDAD: Biografía del usuario
    // RESULTADO ESPERADO: String con descripción personal limitada a 200 caracteres
    // IMPACTO: Información personal del jugador
    // VALIDACIÓN: Probar con bios de diferentes longitudes
    country: { type: String, default: '' }, // FUNCIONALIDAD: País del usuario
    // RESULTADO ESPERADO: String con país o vacío por defecto
    // IMPACTO: Organización geográfica y cumplimiento regulatorio
    // VALIDACIÓN: Verificar que se establezca correctamente
    dateOfBirth: { type: Date, default: null } // FUNCIONALIDAD: Fecha de nacimiento
    // RESULTADO ESPERADO: Date con fecha de nacimiento o null por defecto
    // IMPACTO: Verificación de edad para gaming
    // VALIDACIÓN: Verificar que se establezca correctamente
  };
  
  // FUNCIONALIDAD: Estadísticas de gaming del usuario
  // RESULTADO ESPERADO: Objeto con métricas de rendimiento en juegos
  // IMPACTO: Sistema de ranking y progreso del jugador
  // VALIDACIÓN: Verificar que las estadísticas se calculen correctamente
  gamingStats: {
    totalGames: { type: Number, default: 0 }, // FUNCIONALIDAD: Total de juegos jugados
    // RESULTADO ESPERADO: Número entero de juegos totales
    // IMPACTO: Métrica de experiencia del jugador
    // VALIDACIÓN: Verificar que se incremente correctamente
    wins: { type: Number, default: 0 }, // FUNCIONALIDAD: Total de victorias
    // RESULTADO ESPERADO: Número entero de victorias
    // IMPACTO: Métrica de éxito del jugador
    // VALIDACIÓN: Verificar que se incremente correctamente
    losses: { type: Number, default: 0 }, // FUNCIONALIDAD: Total de derrotas
    // RESULTADO ESPERADO: Número entero de derrotas
    // IMPACTO: Métrica de rendimiento del jugador
    // VALIDACIÓN: Verificar que se incremente correctamente
    totalWinnings: { type: Number, default: 0 }, // FUNCIONALIDAD: Total de ganancias en cripto
    // RESULTADO ESPERADO: Número decimal de ganancias totales
    // IMPACTO: Métrica financiera del jugador
    // VALIDACIÓN: Verificar que se calcule correctamente
    totalLosses: { type: Number, default: 0 }, // FUNCIONALIDAD: Total de pérdidas en cripto
    // RESULTADO ESPERADO: Número decimal de pérdidas totales
    // IMPACTO: Métrica financiera del jugador
    // VALIDACIÓN: Verificar que se calcule correctamente
    winRate: { type: Number, default: 0, min: 0, max: 100 } // FUNCIONALIDAD: Porcentaje de victorias
    // RESULTADO ESPERADO: Número decimal entre 0 y 100
    // IMPACTO: Métrica de rendimiento normalizada
    // VALIDACIÓN: Verificar que esté en el rango correcto
  };
  
  // FUNCIONALIDAD: Balance de criptomonedas del usuario
  // RESULTADO ESPERADO: Objeto con balances de diferentes criptomonedas
  // IMPACTO: Gestión de activos digitales para gaming
  // VALIDACIÓN: Verificar que los balances se actualicen correctamente
  cryptoBalance: {
    BTC: { type: Number, default: 0, min: 0 }, // FUNCIONALIDAD: Balance de Bitcoin
    // RESULTADO ESPERADO: Número decimal de BTC con valor mínimo 0
    // IMPACTO: Activo digital principal para transacciones
    // VALIDACIÓN: Verificar que no sea negativo
    ETH: { type: Number, default: 0, min: 0 }, // FUNCIONALIDAD: Balance de Ethereum
    // RESULTADO ESPERADO: Número decimal de ETH con valor mínimo 0
    // IMPACTO: Activo digital para smart contracts y gaming
    // VALIDACIÓN: Verificar que no sea negativo
    USDT: { type: Number, default: 0, min: 0 }, // FUNCIONALIDAD: Balance de Tether
    // RESULTADO ESPERADO: Número decimal de USDT con valor mínimo 0
    // IMPACTO: Stablecoin para estabilidad en transacciones
    // VALIDACIÓN: Verificar que no sea negativo
    BNB: { type: Number, default: 0, min: 0 } // FUNCIONALIDAD: Balance de Binance Coin
    // RESULTADO ESPERADO: Número decimal de BNB con valor mínimo 0
    // IMPACTO: Token nativo de Binance Smart Chain
    // VALIDACIÓN: Verificar que no sea negativo
  };
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateGamingStats(gameResult: 'win' | 'loss', amount: number): void;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [20, 'El nombre de usuario no puede tener más de 20 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  walletAddress: {
    type: String,
    required: [true, 'La dirección de wallet es requerida'],
    unique: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Dirección de wallet inválida']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: [200, 'La biografía no puede tener más de 200 caracteres'] },
    country: { type: String, required: true },
    dateOfBirth: { type: Date, required: true }
  },
  gamingStats: {
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 },
    totalLosses: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 }
  },
  cryptoBalance: {
    BTC: { type: Number, default: 0, min: 0 },
    ETH: { type: Number, default: 0, min: 0 },
    USDT: { type: Number, default: 0, min: 0 },
    BNB: { type: Number, default: 0, min: 0 }
  },
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ 'gamingStats.winRate': -1 });

// Middleware para encriptar contraseña
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para actualizar estadísticas de gaming
UserSchema.methods.updateGamingStats = function(gameResult: 'win' | 'loss', amount: number): void {
  this.gamingStats.totalGames += 1;
  
  if (gameResult === 'win') {
    this.gamingStats.wins += 1;
    this.gamingStats.totalWinnings += amount;
  } else {
    this.gamingStats.losses += 1;
    this.gamingStats.totalLosses += amount;
  }
  
  this.gamingStats.winRate = (this.gamingStats.wins / this.gamingStats.totalGames) * 100;
};

export const User = mongoose.model<IUser>('User', UserSchema);
```

```typescript
// server/src/models/Game.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  gameId: string;
  name: string;
  type: 'slot' | 'poker' | 'blackjack' | 'roulette' | 'dice' | 'crash';
  description: string;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  isActive: boolean;
  thumbnail: string;
  gameData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del juego es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  type: {
    type: String,
    required: [true, 'El tipo de juego es requerido'],
    enum: ['slot', 'poker', 'blackjack', 'roulette', 'dice', 'crash']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  minBet: {
    type: Number,
    required: [true, 'La apuesta mínima es requerida'],
    min: [0.0001, 'La apuesta mínima debe ser mayor a 0.0001']
  },
  maxBet: {
    type: Number,
    required: [true, 'La apuesta máxima es requerida'],
    min: [0.0001, 'La apuesta máxima debe ser mayor a 0.0001']
  },
  houseEdge: {
    type: Number,
    required: [true, 'La ventaja de la casa es requerida'],
    min: [0, 'La ventaja de la casa no puede ser negativa'],
    max: [100, 'La ventaja de la casa no puede ser mayor al 100%']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  thumbnail: {
    type: String,
    required: [true, 'La imagen del juego es requerida']
  },
  gameData: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Índices
GameSchema.index({ gameId: 1 });
GameSchema.index({ type: 1, isActive: 1 });
GameSchema.index({ name: 'text', description: 'text' });

export const Game = mongoose.model<IGame>('Game', GameSchema);
```

```typescript
// server/src/models/GameSession.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IGameSession extends Document {
  sessionId: string;
  userId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  betAmount: number;
  betCurrency: string;
  gameResult: 'win' | 'loss' | 'draw';
  winAmount: number;
  gameData: Record<string, any>;
  blockchainTxHash?: string;
  status: 'active' | 'completed' | 'cancelled';
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GameSessionSchema = new Schema<IGameSession>({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  betAmount: {
    type: Number,
    required: [true, 'El monto de la apuesta es requerido'],
    min: [0.0001, 'El monto de la apuesta debe ser mayor a 0.0001']
  },
  betCurrency: {
    type: String,
    required: [true, 'La moneda de la apuesta es requerida'],
    enum: ['BTC', 'ETH', 'USDT', 'BNB']
  },
  gameResult: {
    type: String,
    required: [true, 'El resultado del juego es requerido'],
    enum: ['win', 'loss', 'draw']
  },
  winAmount: {
    type: Number,
    default: 0,
    min: [0, 'El monto ganado no puede ser negativo']
  },
  gameData: {
    type: Schema.Types.Mixed,
    default: {}
  },
  blockchainTxHash: String,
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'completed', 'cancelled']
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  endedAt: Date
}, {
  timestamps: true
});

// Índices
GameSessionSchema.index({ sessionId: 1 });
GameSessionSchema.index({ userId: 1, createdAt: -1 });
GameSessionSchema.index({ gameId: 1, createdAt: -1 });
GameSessionSchema.index({ status: 1, createdAt: -1 });
GameSessionSchema.index({ blockchainTxHash: 1 });

export const GameSession = mongoose.model<IGameSession>('GameSession', GameSessionSchema);
```

## 🔌 API REST CRUD Completa

### 1. Controladores
```typescript
// server/src/controllers/gameController.ts
import { Request, Response } from 'express';
import { Game, IGame } from '../models/Game';
import { GameSession } from '../models/GameSession';
import { ApiResponse } from '../types/api';
import { generateGameResult } from '../utils/gameUtils';

export class GameController {
  // CREATE - Crear nueva sesión de juego
  static async createGameSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId, betAmount, betCurrency } = req.body;
      const userId = (req as any).user.id;
      
      // Validar datos requeridos
      if (!gameId || !betAmount || !betCurrency) {
        res.status(400).json({
          success: false,
          message: 'Game ID, monto de apuesta y moneda son requeridos'
        } as ApiResponse);
        return;
      }

      // Verificar que el juego existe y está activo
      const game = await Game.findById(gameId);
      if (!game || !game.isActive) {
        res.status(404).json({
          success: false,
          message: 'Juego no encontrado o inactivo'
        } as ApiResponse);
        return;
      }

      // Verificar límites de apuesta
      if (betAmount < game.minBet || betAmount > game.maxBet) {
        res.status(400).json({
          success: false,
          message: `La apuesta debe estar entre ${game.minBet} y ${game.maxBet} ${betCurrency}`
        } as ApiResponse);
        return;
      }

      // Generar resultado del juego
      const gameResult = generateGameResult(game.type, game.houseEdge);
      const winAmount = gameResult === 'win' ? betAmount * 2 : 0;

      // Crear sesión de juego
      const sessionId = `SESS${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      const gameSession = new GameSession({
        sessionId,
        userId,
        gameId,
        betAmount,
        betCurrency,
        gameResult,
        winAmount,
        gameData: {
          gameType: game.type,
          houseEdge: game.houseEdge,
          randomSeed: Math.random().toString(36)
        }
      });

      const savedSession = await gameSession.save();

      res.status(201).json({
        success: true,
        data: savedSession,
        message: 'Sesión de juego creada exitosamente'
      } as ApiResponse);
    } catch (error) {
      console.error('Error creando sesión de juego:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener todos los juegos disponibles
  static async getAllGames = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, search, sortBy = 'name', order = 'asc' } = req.query;
      
      // Construir filtros
      const filters: any = { isActive: true };
      if (type) filters.type = type;
      if (search) {
        filters.$text = { $search: search as string };
      }

      // Construir ordenamiento
      const sort: any = {};
      sort[sortBy as string] = order === 'desc' ? -1 : 1;

      const games = await Game.find(filters)
        .sort(sort)
        .select('-__v');

      res.status(200).json({
        success: true,
        data: games
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo juegos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener juego por ID
  static async getGameById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        } as ApiResponse);
        return;
      }

      const game = await Game.findById(id).select('-__v');
      
      if (!game || !game.isActive) {
        res.status(404).json({
          success: false,
          message: 'Juego no encontrado'
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: game
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo juego:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      } as ApiResponse);
    }
  };

  // READ - Obtener historial de juegos del usuario
  static async getUserGameHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { page = 1, limit = 10, gameType, status } = req.query;
      
      // Construir filtros
      const filters: any = { userId };
      if (gameType) filters['gameData.gameType'] = gameType;
      if (status) filters.status = status;

      // Construir opciones de paginación
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const gameSessions = await GameSession.find(filters)
        .populate('gameId', 'name type thumbnail')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v');

      const total = await GameSession.countDocuments(filters);

      res.status(200).json({
        success: true,
        data: gameSessions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      } as ApiResponse);
    } catch (error) {
      console.error('Error obteniendo historial de juegos:', error);
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
// server/src/routes/gameRoutes.ts
import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authMiddleware } from '../middleware/auth';
import { validationMiddleware } from '../middleware/validation';
import { gameValidationSchema } from '../validation/gameValidation';

const router = Router();

// Rutas públicas
router.get('/', GameController.getAllGames);
router.get('/:id', GameController.getGameById);

// Rutas protegidas (requieren autenticación)
router.post('/session', 
  authMiddleware, 
  validationMiddleware(gameValidationSchema.createSession),
  GameController.createGameSession
);

router.get('/user/history', 
  authMiddleware, 
  GameController.getUserGameHistory
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
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import gameRoutes from './routes/gameRoutes';
import userRoutes from './routes/userRoutes';
import blockchainRoutes from './routes/blockchainRoutes';
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
  max: 200, // máximo 200 requests por ventana
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
      connectSrc: ["'self'", "wss:", "https:"],
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blockchain', blockchainRoutes);

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

### 2. Servicios de Juego
```typescript
// client/src/services/gameService.ts
import api from './api';
import { Game, GameSession, CreateGameSessionData } from '@/types/game';

export class GameService {
  static async getAllGames(params?: {
    type?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<Game[]> {
    const response = await api.get('/games', { params });
    return response.data.data;
  }

  static async getGameById(id: string): Promise<Game> {
    const response = await api.get(`/games/${id}`);
    return response.data.data;
  }

  static async createGameSession(sessionData: CreateGameSessionData): Promise<GameSession> {
    const response = await api.post('/games/session', sessionData);
    return response.data.data;
  }

  static async getUserGameHistory(params?: {
    page?: number;
    limit?: number;
    gameType?: string;
    status?: string;
  }): Promise<{
    data: GameSession[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const response = await api.get('/games/user/history', { params });
    return response.data;
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
    container_name: betwins-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: betwins
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - betwins-network

  server:
    build: ./server
    container_name: betwins-server
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/betwins?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - betwins-network

  client:
    build: ./client
    container_name: betwins-client
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - server
    networks:
      - betwins-network

volumes:
  mongodb_data:

networks:
  betwins-network:
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
        scp -r server/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/betwins-server/
        scp -r client/* ec2-user@${{ secrets.EC2_HOST }}:/home/ec2-user/betwins-client/
        
        # Reiniciar servicios
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/betwins-server && npm install && pm2 restart betwins-server"
        ssh ec2-user@${{ secrets.EC2_HOST }} "cd /home/ec2-user/betwins-client && npm install && pm2 restart betwins-client"
```

## 🧪 Testing Completo

### 1. Testing del Backend
```typescript
// server/src/__tests__/game.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { connectTestDB, closeTestDB, clearTestDB } from './testUtils';

describe('Game API', () => {
  let authToken: string;
  let testUser: any;
  let testGame: any;

  beforeAll(async () => {
    await connectTestDB();
    
    // Crear usuario de prueba
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      profile: {
        country: 'Test Country',
        dateOfBirth: new Date('1990-01-01')
      }
    });

    // Crear juego de prueba
    testGame = await Game.create({
      gameId: 'test-slot',
      name: 'Test Slot Machine',
      type: 'slot',
      description: 'A test slot machine game',
      minBet: 0.001,
      maxBet: 1.0,
      houseEdge: 2.5,
      thumbnail: 'test-thumbnail.jpg'
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

  describe('GET /api/games', () => {
    it('should return all active games', async () => {
      const response = await request(app)
        .get('/api/games')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Slot Machine');
    });
  });

  describe('POST /api/games/session', () => {
    it('should create a new game session', async () => {
      const sessionData = {
        gameId: testGame._id,
        betAmount: 0.01,
        betCurrency: 'BTC'
      };

      const response = await request(app)
        .post('/api/games/session')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sessionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gameId).toBe(testGame._id.toString());
      expect(response.body.data.betAmount).toBe(sessionData.betAmount);
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
    "docker:build": "docker build -t betwins-server .",
    "docker:run": "docker run -p 5000:5000 betwins-server",
    "deploy:aws": "npm run build && aws s3 sync dist/ s3://your-bucket/",
    "deploy:heroku": "npm run build && git push heroku main"
  }
}
```

### 2. Scripts de Base de Datos
```bash
#!/bin/bash
# scripts/setup-db.sh

echo "🚀 Configurando base de datos Betwins..."

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
docker exec betwins-mongodb mongosh --eval "
  use betwins;
  db.users.createIndex({ username: 1 });
  db.users.createIndex({ email: 1 });
  db.users.createIndex({ walletAddress: 1 });
  db.users.createIndex({ 'gamingStats.winRate': -1 });
  db.games.createIndex({ gameId: 1 });
  db.games.createIndex({ type: 1, isActive: 1 });
  db.games.createIndex({ name: 'text', description: 'text' });
  db.gamesessions.createIndex({ sessionId: 1 });
  db.gamesessions.createIndex({ userId: 1, createdAt: -1 });
  db.gamesessions.createIndex({ gameId: 1, createdAt: -1 });
  db.gamesessions.createIndex({ status: 1, createdAt: -1 });
  db.gamesessions.createIndex({ blockchainTxHash: 1 });
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
