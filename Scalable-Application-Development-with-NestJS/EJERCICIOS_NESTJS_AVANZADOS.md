# 🎯 EJERCICIOS PRÁCTICOS AVANZADOS NESTJS
## Desafíos y Proyectos para Dominar NestJS y Desarrollo Escalable

---

## 📋 **INTRODUCCIÓN A LOS EJERCICIOS**

Estos ejercicios están diseñados para complementar el curso "Scalable Application Development with NestJS" y aplicar todos los conceptos avanzados aprendidos en aplicaciones reales y escalables.

### **🎯 Niveles de Dificultad:**
- **🟢 Básico** - Conceptos fundamentales de NestJS
- **🟡 Intermedio** - Patrones y arquitectura
- **🔴 Avanzado** - Conceptos expertos
- **🟣 Experto** - Proyectos completos

---

## 🟢 **EJERCICIOS BÁSICOS**

### **Ejercicio 1: Configuración de NestJS con TypeScript**

```typescript
// 🎯 Objetivo: Configurar un proyecto NestJS básico

// 1. Crea la configuración de NestJS
// nest-cli.json
{
  // Completa la configuración
}

// 2. Configura el entorno de desarrollo
// .env.development
DATABASE_URL=postgresql://admin:password@localhost:5432/nestjs_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-dev-secret-key

// 3. Crea un módulo básico
// src/users/users.module.ts
@Module({
  // Completa el módulo
})
export class UsersModule {}
```

**Solución:**
```typescript
// nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true,
    "tsConfigPath": "tsconfig.build.json"
  },
  "projects": {
    "users": {
      "type": "library",
      "root": "libs/users",
      "entryFile": "index",
      "sourceRoot": "libs/users/src",
      "compilerOptions": {
        "tsConfigPath": "libs/users/tsconfig.lib.json"
      }
    }
  }
}

// .env.development
DATABASE_URL=postgresql://admin:password@localhost:5432/nestjs_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-dev-secret-key
NODE_ENV=development
PORT=3000

// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository]
})
export class UsersModule {}
```

### **Ejercicio 2: Crear un Service con Repository Pattern**

```typescript
// 🎯 Objetivo: Crear un service usando el patrón repository

// 1. Crea la interfaz del repository
interface IUsersRepository {
  // Completa la interfaz
}

// 2. Crea el service
@Injectable()
export class UsersService {
  // Implementa el service
}

// 3. Crea el repository
@Injectable()
export class UsersRepository implements IUsersRepository {
  // Implementa el repository
}
```

**Solución:**
```typescript
// src/users/interfaces/users-repository.interface.ts
export interface IUsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, updates: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  findWithOrders(id: string): Promise<User | null>;
}

// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PasswordService } from '../common/services/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await this.passwordService.hash(createUserDto.password);

    // Crear usuario
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Verificar si el usuario existe
    await this.findById(id);

    // Actualizar usuario
    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    // Verificar si el usuario existe
    await this.findById(id);

    // Eliminar usuario
    await this.usersRepository.delete(id);
  }

  async findWithOrders(id: string): Promise<User> {
    const user = await this.usersRepository.findWithOrders(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

// src/users/repositories/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUsersRepository } from '../interfaces/users-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findWithOrders(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['orders']
    });
  }
}
```

---

## 🟡 **EJERCICIOS INTERMEDIOS**

### **Ejercicio 3: GraphQL con Apollo Server**

```typescript
// 🎯 Objetivo: Implementar GraphQL en NestJS

// 1. Configura Apollo Server
// src/app.module.ts
@Module({
  imports: [
    // Completa la configuración
  ],
})
export class AppModule {}

// 2. Define el schema GraphQL
// src/users/users.graphql
type User {
  # Completa el schema
}

// 3. Crea los resolvers
// src/users/users.resolver.ts
@Resolver(() => User)
export class UsersResolver {
  // Implementa los resolvers
}
```

**Solución:**
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}

// src/users/users.graphql
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  avatar: String
  createdAt: DateTime!
  updatedAt: DateTime!
  orders: [Order!]
}

enum UserRole {
  USER
  ADMIN
  MODERATOR
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
  role: UserRole = USER
}

input UpdateUserInput {
  name: String
  email: String
  role: UserRole
}

type Query {
  users: [User!]!
  user(id: ID!): User
  userByEmail(email: String!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

scalar DateTime
```

```typescript
// src/users/users.resolver.ts
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { OrdersService } from '../orders/orders.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService
  ) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async userByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => User)
  async createUser(@Args('input') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Args('id') id: string,
    @Args('input') updateUserInput: UpdateUserInput
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.usersService.deleteUser(id);
    return true;
  }

  @ResolveField(() => [Order])
  async orders(@Parent() user: User) {
    return this.ordersService.findByUserId(user.id);
  }
}
```

### **Ejercicio 4: Microservicios con gRPC**

```typescript
// 🎯 Objetivo: Implementar microservicios con gRPC

// 1. Configura el microservicio
// src/main.ts
async function bootstrap() {
  // Completa la configuración
}

// 2. Crea el servicio gRPC
// src/users/users.service.ts
@Injectable()
export class UsersService {
  // Implementa el servicio gRPC
}

// 3. Crea el controlador gRPC
// src/users/users.controller.ts
@Controller()
export class UsersController {
  // Implementa el controlador gRPC
}
```

**Solución:**
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: join(__dirname, 'proto/users.proto'),
        url: 'localhost:5000',
      },
    },
  );

  await app.listen();
  console.log('Users microservice is listening on port 5000');
}
bootstrap();

// proto/users.proto
syntax = "proto3";

package users;

service UsersService {
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc FindUser (FindUserRequest) returns (User);
  rpc FindAllUsers (FindAllUsersRequest) returns (FindAllUsersResponse);
  rpc UpdateUser (UpdateUserRequest) returns (User);
  rpc DeleteUser (DeleteUserRequest) returns (DeleteUserResponse);
}

message CreateUserRequest {
  string email = 1;
  string name = 2;
  string password = 3;
  string role = 4;
}

message FindUserRequest {
  string id = 1;
}

message FindAllUsersRequest {
  int32 page = 1;
  int32 limit = 2;
}

message UpdateUserRequest {
  string id = 1;
  string name = 2;
  string email = 3;
  string role = 4;
}

message DeleteUserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  string role = 4;
  string createdAt = 5;
  string updatedAt = 6;
}

message FindAllUsersResponse {
  repeated User users = 1;
  int32 total = 2;
  int32 page = 3;
  int32 limit = 4;
}

message DeleteUserResponse {
  bool success = 1;
}
```

```typescript
// src/users/users.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserRequest, FindUserRequest, FindAllUsersRequest, UpdateUserRequest, DeleteUserRequest, User, FindAllUsersResponse, DeleteUserResponse } from '../proto/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<User> {
    const user = await this.usersService.createUser({
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  @GrpcMethod('UsersService', 'FindUser')
  async findUser(data: FindUserRequest): Promise<User> {
    const user = await this.usersService.findById(data.id);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  @GrpcMethod('UsersService', 'FindAllUsers')
  async findAllUsers(data: FindAllUsersRequest): Promise<FindAllUsersResponse> {
    const { users, total, page, limit } = await this.usersService.findAllPaginated({
      page: data.page,
      limit: data.limit
    });

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      })),
      total,
      page,
      limit
    };
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const user = await this.usersService.updateUser(data.id, {
      name: data.name,
      email: data.email,
      role: data.role
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  @GrpcMethod('UsersService', 'DeleteUser')
  async deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    await this.usersService.deleteUser(data.id);
    return { success: true };
  }
}
```

---

## 🔴 **EJERCICIOS AVANZADOS**

### **Ejercicio 5: Event-Driven Architecture**

```typescript
// 🎯 Objetivo: Implementar arquitectura event-driven

// 1. Configura EventEmitter
// src/app.module.ts
@Module({
  imports: [
    // Completa la configuración
  ],
})
export class AppModule {}

// 2. Crea los eventos
// src/users/events/user.events.ts
export class UserCreatedEvent {
  // Implementa el evento
}

// 3. Crea los listeners
// src/users/listeners/user.events.listener.ts
@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler {
  // Implementa el handler
}
```

**Solución:**
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    UsersModule,
    NotificationsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}

// src/users/events/user.events.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly timestamp: Date
  ) {}
}

export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly updates: any,
    public readonly timestamp: Date
  ) {}
}

export class UserDeletedEvent {
  constructor(
    public readonly userId: string,
    public readonly timestamp: Date
  ) {}
}

export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly timestamp: Date
  ) {}
}
```

```typescript
// src/users/listeners/user.events.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent, UserLoggedInEvent } from '../events/user.events';
import { NotificationsService } from '../../notifications/notifications.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class UserEventsListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
    private readonly emailService: EmailService
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    console.log(`User created: ${event.userId}`);

    // Enviar email de bienvenida
    await this.emailService.sendWelcomeEmail(event.email, event.name);

    // Crear notificación de bienvenida
    await this.notificationsService.createNotification({
      userId: event.userId,
      type: 'WELCOME',
      title: '¡Bienvenido!',
      message: `Hola ${event.name}, gracias por registrarte.`,
      data: { email: event.email }
    });

    // Registrar evento en analytics
    await this.analyticsService.trackEvent('user_registered', {
      userId: event.userId,
      email: event.email,
      timestamp: event.timestamp
    });
  }

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent) {
    console.log(`User updated: ${event.userId}`);

    // Registrar evento en analytics
    await this.analyticsService.trackEvent('user_updated', {
      userId: event.userId,
      updates: event.updates,
      timestamp: event.timestamp
    });
  }

  @OnEvent('user.deleted')
  async handleUserDeleted(event: UserDeletedEvent) {
    console.log(`User deleted: ${event.userId}`);

    // Limpiar datos relacionados
    await this.notificationsService.deleteUserNotifications(event.userId);
    await this.analyticsService.deleteUserData(event.userId);

    // Registrar evento en analytics
    await this.analyticsService.trackEvent('user_deleted', {
      userId: event.userId,
      timestamp: event.timestamp
    });
  }

  @OnEvent('user.logged_in')
  async handleUserLoggedIn(event: UserLoggedInEvent) {
    console.log(`User logged in: ${event.userId}`);

    // Registrar evento en analytics
    await this.analyticsService.trackEvent('user_logged_in', {
      userId: event.userId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      timestamp: event.timestamp
    });
  }
}
```

### **Ejercicio 6: CQRS Pattern**

```typescript
// 🎯 Objetivo: Implementar CQRS (Command Query Responsibility Segregation)

// 1. Configura CQRS
// src/app.module.ts
@Module({
  imports: [
    // Completa la configuración
  ],
})
export class AppModule {}

// 2. Crea los commands
// src/users/commands/create-user.command.ts
export class CreateUserCommand {
  // Implementa el command
}

// 3. Crea los queries
// src/users/queries/get-users.query.ts
export class GetUsersQuery {
  // Implementa el query
}

// 4. Crea los handlers
// src/users/handlers/create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  // Implementa el handler
}
```

**Solución:**
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
  ],
})
export class AppModule {}

// src/users/commands/create-user.command.ts
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly role: string = 'user'
  ) {}
}

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updates: {
      name?: string;
      email?: string;
      role?: string;
    }
  ) {}
}

export class DeleteUserCommand {
  constructor(
    public readonly id: string
  ) {}
}

// src/users/queries/get-users.query.ts
export class GetUsersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly filters?: {
      role?: string;
      search?: string;
    }
  ) {}
}

export class GetUserByIdQuery {
  constructor(
    public readonly id: string
  ) {}
}

export class GetUserByEmailQuery {
  constructor(
    public readonly email: string
  ) {}
}

// src/users/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from '../../common/services/password.service';
import { UserCreatedEvent } from '../events/user.events';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const { email, name, password, role } = command;

    // Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await this.passwordService.hash(password);

    // Crear usuario
    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
      role
    });

    // Emitir evento
    this.eventBus.publish(new UserCreatedEvent(
      user.id,
      user.email,
      user.name,
      new Date()
    ));

    return user;
  }
}

// src/users/handlers/get-users.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../queries/get-users.query';
import { UsersRepository } from '../repositories/users.repository';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(query: GetUsersQuery): Promise<any> {
    const { page, limit, filters } = query;

    const offset = (page - 1) * limit;
    
    const [users, total] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit,
      where: filters,
      order: { createdAt: 'DESC' }
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from './commands';
import { GetUsersQuery, GetUserByIdQuery, GetUserByEmailQuery } from './queries';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @Roles('admin')
  async createUser(@Body() createUserDto: any) {
    const command = new CreateUserCommand(
      createUserDto.email,
      createUserDto.name,
      createUserDto.password,
      createUserDto.role
    );
    return this.commandBus.execute(command);
  }

  @Get()
  @Roles('admin')
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string,
    @Query('search') search?: string
  ) {
    const query = new GetUsersQuery(page, limit, { role, search });
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const query = new GetUserByIdQuery(id);
    return this.queryBus.execute(query);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const query = new GetUserByEmailQuery(email);
    return this.queryBus.execute(query);
  }

  @Put(':id')
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    const command = new UpdateUserCommand(id, updateUserDto);
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    return this.commandBus.execute(command);
  }
}
```

---

## 🟣 **PROYECTOS COMPLETOS**

### **Proyecto 1: E-commerce API con NestJS**

```typescript
// 🎯 Objetivo: Crear una API completa de e-commerce con NestJS

// Características requeridas:
// - Módulos: Users, Products, Orders, Payments, Notifications
// - GraphQL API con Apollo Server
// - Microservicios con gRPC
// - Event-driven architecture
// - CQRS pattern
// - Testing completo
// - Docker y Kubernetes
// - CI/CD pipeline
// - Monitoring y logging
```

### **Proyecto 2: Sistema de Gestión Empresarial**

```typescript
// 🎯 Objetivo: Crear un sistema completo de gestión empresarial

// Características requeridas:
// - Módulos: Employees, Departments, Projects, Tasks, Reports
// - REST API y GraphQL
// - Autenticación y autorización avanzada
// - Auditoría y logging
// - Reportes y analytics
// - Notificaciones en tiempo real
// - Integración con servicios externos
// - Despliegue en la nube
```

---

## 🎯 **DESAFÍOS EXTRA**

### **Desafío 1: Sistema de Microservicios Distribuido**

```typescript
// Implementa un sistema completo de microservicios con:
// - API Gateway con Kong
// - Service Discovery con Consul
// - Message Queue con RabbitMQ
// - Distributed Tracing con Jaeger
// - Circuit Breaker con Hystrix
// - Load Balancing
// - Health Checks
// - Metrics con Prometheus
```

### **Desafío 2: Aplicación Serverless con NestJS**

```typescript
// Desarrolla una aplicación serverless con:
// - AWS Lambda con NestJS
// - API Gateway
// - DynamoDB
// - S3 para archivos
// - SQS para mensajes
// - CloudWatch para logging
// - Serverless Framework
// - CI/CD con GitHub Actions
```

### **Desafío 3: Sistema de Real-time con WebSockets**

```typescript
// Crea un sistema de comunicación en tiempo real con:
// - WebSockets con Socket.io
// - Chat en tiempo real
// - Notificaciones push
// - Presence indicators
// - Room management
// - Message persistence
// - File sharing
// - Video/audio calls
```

---

## 📊 **EVALUACIÓN Y MÉTRICAS**

### **Criterios de Evaluación:**

1. **Arquitectura Escalable** - Uso de patrones de diseño
2. **Performance** - Optimización y rendimiento
3. **Testing Coverage** - Cobertura de pruebas
4. **Security** - Implementación de seguridad
5. **Documentation** - Código bien documentado
6. **Deployment** - Despliegue automatizado
7. **Monitoring** - Observabilidad y logging

### **Herramientas de Evaluación:**

```bash
# NestJS
npm run test
npm run test:e2e
npm run test:cov
npm run lint
npm run build

# Microservicios
npm run test:microservices
npm run test:integration
npm run test:performance

# GraphQL
npm run test:graphql
npm run codegen

# Docker
docker build -t nestjs-app .
docker-compose up -d
docker-compose down

# Kubernetes
kubectl apply -f k8s/
kubectl get pods
kubectl logs -f deployment/nestjs-app
```

---

*¡Estos ejercicios te ayudarán a dominar el desarrollo escalable con NestJS y las mejores prácticas empresariales!* 🚀✨ 