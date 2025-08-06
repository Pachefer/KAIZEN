# 🚀 GUÍA COMPLETA SCALABLE APPLICATION DEVELOPMENT WITH NESTJS
## Integración de Conceptos Avanzados y Desarrollo Escalable

---

## 📋 **INTRODUCCIÓN A LA GUÍA COMPLETA**

Esta guía integra todos los conceptos avanzados desarrollados para complementar el curso "Scalable Application Development with NestJS" de 18 capítulos, incluyendo patrones de diseño, arquitectura escalable, microservicios y mejores prácticas para aplicaciones empresariales.

### **🎯 Contenido Integrado:**
- **Arquitectura Escalable** - NestJS, Microservicios, GraphQL
- **Patrones de Diseño** - SOLID, Clean Architecture, Event-Driven
- **Despliegue Empresarial** - Docker, Kubernetes, CI/CD
- **Mejores Prácticas** - Testing, Performance, Security
- **Tecnologías Modernas** - Apollo Federation, gRPC, Redis
- **DevOps Completo** - CI/CD, Monitoreo, Logging

---

## 🏗️ **ARQUITECTURA ESCALABLE CON NESTJS**

### **1. Estructura de Proyecto Empresarial**

```typescript
// Estructura recomendada para aplicaciones escalables
/*
scalable-nestjs-app/
├── src/
│   ├── modules/           # Módulos de la aplicación
│   │   ├── users/         # Módulo de usuarios
│   │   ├── products/      # Módulo de productos
│   │   ├── orders/        # Módulo de pedidos
│   │   └── auth/          # Módulo de autenticación
│   ├── common/            # Código compartido
│   │   ├── decorators/    # Decoradores personalizados
│   │   ├── filters/       # Filtros de excepción
│   │   ├── guards/        # Guards de autenticación
│   │   ├── interceptors/  # Interceptores
│   │   ├── pipes/         # Pipes de validación
│   │   └── interfaces/    # Interfaces compartidas
│   ├── config/            # Configuración
│   │   ├── database.ts    # Configuración de base de datos
│   │   ├── redis.ts       # Configuración de Redis
│   │   └── app.config.ts  # Configuración general
│   ├── microservices/     # Microservicios
│   │   ├── users-service/ # Servicio de usuarios
│   │   ├── products-service/ # Servicio de productos
│   │   └── orders-service/ # Servicio de pedidos
│   └── graphql/           # GraphQL
│       ├── schema/        # Schemas GraphQL
│       ├── resolvers/     # Resolvers
│       └── directives/    # Directivas personalizadas
├── test/                  # Tests
├── docker/                # Configuración Docker
├── k8s/                   # Configuración Kubernetes
└── docs/                  # Documentación
*/
```

### **2. Configuración de Tipos Compartidos**

```typescript
// src/common/interfaces/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Tipos para GraphQL
export interface GraphQLContext {
  user?: User;
  isAuthenticated: boolean;
  permissions: string[];
}

// Tipos para Microservicios
export interface MicroserviceMessage<T = any> {
  pattern: string;
  data: T;
  id?: string;
}

export interface MicroserviceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
```

---

## 🎯 **PRINCIPIOS SOLID EN NESTJS**

### **1. Single Responsibility Principle (SRP)**

```typescript
// ✅ Separación de responsabilidades en NestJS

// Service para gestión de usuarios (Responsabilidad: Lógica de negocio de usuarios)
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Validar datos
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash de contraseña
    const hashedPassword = await this.passwordService.hash(createUserDto.password);

    // Crear usuario
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    // Enviar email de bienvenida
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    // Emitir evento
    this.eventEmitter.emit('user.created', { userId: user.id, email: user.email });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    
    // Emitir evento
    this.eventEmitter.emit('user.updated', { userId: id, updates: updateUserDto });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);
    
    // Emitir evento
    this.eventEmitter.emit('user.deleted', { userId: id });
  }
}

// Service para gestión de productos (Responsabilidad: Lógica de negocio de productos)
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly imageService: ImageService,
    private readonly cacheService: CacheService
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    // Procesar imágenes
    const processedImages = await this.imageService.processImages(createProductDto.images);

    // Crear producto
    const product = await this.productsRepository.create({
      ...createProductDto,
      images: processedImages
    });

    // Invalidar caché
    await this.cacheService.invalidate('products');

    return product;
  }

  async getProducts(filters: ProductFiltersDto): Promise<Product[]> {
    // Intentar obtener del caché
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cachedProducts = await this.cacheService.get(cacheKey);
    
    if (cachedProducts) {
      return cachedProducts;
    }

    // Obtener de la base de datos
    const products = await this.productsRepository.find(filters);
    
    // Guardar en caché
    await this.cacheService.set(cacheKey, products, 300); // 5 minutos

    return products;
  }
}

// Service para gestión de pedidos (Responsabilidad: Lógica de negocio de pedidos)
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Verificar usuario
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar productos y calcular total
    const orderItems = await this.validateOrderItems(createOrderDto.items);
    const total = this.calculateTotal(orderItems);

    // Crear pedido
    const order = await this.ordersRepository.create({
      userId,
      items: orderItems,
      total,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress
    });

    // Procesar pago
    await this.paymentService.processPayment(order.id, total);

    // Enviar notificación
    await this.notificationService.sendOrderConfirmation(user.email, order);

    return order;
  }
}
```

### **2. Open/Closed Principle (OCP)**

```typescript
// ✅ Extensible sin modificación

// Interfaz para estrategias de autenticación
interface IAuthStrategy {
  authenticate(credentials: any): Promise<User>;
  validate(token: string): Promise<boolean>;
}

// Estrategia de autenticación local
@Injectable()
export class LocalAuthStrategy implements IAuthStrategy {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService
  ) {}

  async authenticate(credentials: { email: string; password: string }): Promise<User> {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.passwordService.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validate(token: string): Promise<boolean> {
    // Validación de token local
    return true;
  }
}

// Estrategia de autenticación JWT
@Injectable()
export class JwtAuthStrategy implements IAuthStrategy {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async authenticate(credentials: { token: string }): Promise<User> {
    const payload = this.jwtService.verify(credentials.token);
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async validate(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }
}

// Estrategia de autenticación OAuth
@Injectable()
export class OAuthAuthStrategy implements IAuthStrategy {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly usersService: UsersService
  ) {}

  async authenticate(credentials: { provider: string; code: string }): Promise<User> {
    const oauthUser = await this.oauthService.authenticate(credentials.provider, credentials.code);
    
    let user = await this.usersService.findByEmail(oauthUser.email);
    
    if (!user) {
      user = await this.usersService.createUser({
        email: oauthUser.email,
        name: oauthUser.name,
        password: this.generateRandomPassword()
      });
    }

    return user;
  }

  async validate(token: string): Promise<boolean> {
    return this.oauthService.validateToken(token);
  }
}

// Service que usa estrategias de autenticación
@Injectable()
export class AuthService {
  private strategies: Map<string, IAuthStrategy> = new Map();

  constructor(
    private readonly localStrategy: LocalAuthStrategy,
    private readonly jwtStrategy: JwtAuthStrategy,
    private readonly oauthStrategy: OAuthAuthStrategy
  ) {
    this.strategies.set('local', localStrategy);
    this.strategies.set('jwt', jwtStrategy);
    this.strategies.set('oauth', oauthStrategy);
  }

  async authenticate(strategy: string, credentials: any): Promise<User> {
    const authStrategy = this.strategies.get(strategy);
    if (!authStrategy) {
      throw new BadRequestException(`Unknown authentication strategy: ${strategy}`);
    }

    return authStrategy.authenticate(credentials);
  }

  async validate(strategy: string, token: string): Promise<boolean> {
    const authStrategy = this.strategies.get(strategy);
    if (!authStrategy) {
      throw new BadRequestException(`Unknown authentication strategy: ${strategy}`);
    }

    return authStrategy.validate(token);
  }
}
```

---

## 🏗️ **ARQUITECTURA CLEAN ARCHITECTURE EN NESTJS**

### **1. Estructura de Capas**

```typescript
// Domain Layer (Entidades y reglas de negocio)
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    private readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  canPerformAction(action: string): boolean {
    const permissions = {
      [UserRole.USER]: ['read:own', 'write:own'],
      [UserRole.ADMIN]: ['read:all', 'write:all', 'delete:all'],
      [UserRole.MODERATOR]: ['read:all', 'write:own', 'moderate:all']
    };

    return permissions[this.role]?.includes(action) || false;
  }

  updateProfile(updates: Partial<Pick<User, 'name' | 'email'>>): User {
    return new User(
      this.id,
      updates.email || this.email,
      updates.name || this.name,
      this.role,
      this.password,
      this.createdAt,
      new Date()
    );
  }
}

// Repository Layer (Interfaces de acceso a datos)
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findWithOrders(id: string): Promise<User | null>;
}

// Use Case Layer (Casos de uso de la aplicación)
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly emailValidator: IEmailValidator,
    private readonly eventBus: IEventBus
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Validar email
    if (!this.emailValidator.isValid(request.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new BusinessError('User already exists');
    }

    // Hash de contraseña
    const hashedPassword = await this.passwordService.hash(request.password);

    // Crear usuario
    const user = new User(
      generateId(),
      request.email,
      request.name,
      UserRole.USER,
      hashedPassword,
      new Date(),
      new Date()
    );

    const savedUser = await this.userRepository.create(user);
    
    // Publicar evento
    await this.eventBus.publish('user.created', {
      userId: savedUser.id,
      email: savedUser.email,
      timestamp: new Date()
    });
    
    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    };
  }
}

// Infrastructure Layer (Implementaciones concretas)
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? this.mapToUser(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    return userEntity ? this.mapToUser(userEntity) : null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const userEntity = this.userRepository.create({
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapToUser(savedEntity);
  }

  private mapToUser(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.name,
      entity.role,
      entity.password,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
```

---

## 🐳 **DOCKER Y KUBERNETES PARA NESTJS**

### **1. Docker Compose para Desarrollo**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de datos
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: nestjs_app
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  # Redis para caché
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # MongoDB para microservicios
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  # API Gateway
  api-gateway:
    build: 
      context: ./api-gateway
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://admin:password@postgres:5432/nestjs_app
      REDIS_URL: redis://redis:6379
      MONGODB_URI: mongodb://admin:password@mongodb:27017/nestjs_app?authSource=admin
      JWT_SECRET: your-dev-secret-key
    volumes:
      - ./api-gateway:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
      - mongodb
    networks:
      - app-network
    command: npm run start:dev

  # Microservicio de usuarios
  users-service:
    build:
      context: ./microservices/users-service
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://admin:password@postgres:5432/nestjs_app
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-dev-secret-key
    volumes:
      - ./microservices/users-service:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    command: npm run start:dev

  # Microservicio de productos
  products-service:
    build:
      context: ./microservices/products-service
      dockerfile: Dockerfile.dev
    ports:
      - "3002:3002"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://admin:password@mongodb:27017/nestjs_app?authSource=admin
      REDIS_URL: redis://redis:6379
    volumes:
      - ./microservices/products-service:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network
    command: npm run start:dev

  # Nginx para producción
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api-gateway
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### **2. Dockerfile para NestJS**

```dockerfile
# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar propiedad de archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["npm", "run", "start:prod"]
```

---

## 🧪 **TESTING AVANZADO PARA NESTJS**

### **1. Testing de Servicios**

```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const expectedUser = {
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      // Act
      const result = await service.createUser(createUserDto);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      const existingUser = {
        id: '1',
        email: createUserDto.email,
        name: 'Existing User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      // Arrange
      const userId = '1';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      const userId = '999';
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = {
        ...existingUser,
        name: updateUserDto.name,
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedUser);

      // Act
      const result = await service.updateUser(userId, updateUserDto);

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockRepository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });
});
```

### **2. Testing de Controladores**

```typescript
// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const expectedUser = {
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.createUser.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.createUser(createUserDto);

      // Assert
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });

    it('should handle service errors', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
      };

      mockUsersService.createUser.mockRejectedValue(
        new ConflictException('User already exists'),
      );

      // Act & Assert
      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const expectedUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(expectedUsers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      // Arrange
      const userId = '1';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.findById(userId);

      // Assert
      expect(service.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should handle user not found', async () => {
      // Arrange
      const userId = '999';
      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(controller.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
```

---

## 🚀 **DESPLIEGUE EN LA NUBE PARA NESTJS**

### **1. Kubernetes para Aplicación NestJS**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: nestjs-app
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: nestjs-app
data:
  NODE_ENV: "production"
  DATABASE_URL: "postgresql://admin:password@postgres-service:5432/nestjs_app"
  REDIS_URL: "redis://redis-service:6379"
  MONGODB_URI: "mongodb://admin:password@mongodb-service:27017/nestjs_app?authSource=admin"
  JWT_SECRET: "your-production-secret"
  GRAPHQL_PATH: "/graphql"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: nestjs-app
type: Opaque
data:
  JWT_SECRET: eW91ci1zZWNyZXQta2V5 # base64 encoded
  DATABASE_PASSWORD: cGFzc3dvcmQ= # base64 encoded
  MONGODB_PASSWORD: cGFzc3dvcmQ= # base64 encoded
```

```yaml
# k8s/api-gateway-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway-deployment
  namespace: nestjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: your-registry/nestjs-api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DATABASE_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### **2. CI/CD Pipeline para NestJS**

```yaml
# .github/workflows/nestjs-deploy.yml
name: NestJS Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Run e2e tests
      run: npm run test:e2e
    
    - name: Run linting
      run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push API Gateway
      uses: docker/build-push-action@v4
      with:
        context: ./api-gateway
        file: ./api-gateway/Dockerfile
        push: true
        tags: your-username/nestjs-api-gateway:latest
    
    - name: Build and push Users Service
      uses: docker/build-push-action@v4
      with:
        context: ./microservices/users-service
        file: ./microservices/users-service/Dockerfile
        push: true
        tags: your-username/nestjs-users-service:latest
    
    - name: Deploy to Kubernetes
      uses: steebchen/kubectl@v2
      with:
        config: ${{ secrets.KUBE_CONFIG_DATA }}
        command: apply -f k8s/
```

---

## 🎯 **MEJORES PRÁCTICAS PARA NESTJS**

### **1. Seguridad Avanzada**

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### **2. Performance Optimization**

```typescript
// src/common/interceptors/cache.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    // Intentar obtener del caché
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    // Si no está en caché, ejecutar y guardar
    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(cacheKey, data, 300); // 5 minutos
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { method, url, query, body } = request;
    return `${method}:${url}:${JSON.stringify(query)}:${JSON.stringify(body)}`;
  }
}

// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
        path,
      })),
    );
  }
}
```

---

*¡Esta guía completa integra todos los conceptos avanzados para crear aplicaciones NestJS escalables y profesionales!* 🚀✨ 