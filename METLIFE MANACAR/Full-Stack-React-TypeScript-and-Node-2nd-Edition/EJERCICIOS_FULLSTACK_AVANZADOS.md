# 🎯 EJERCICIOS PRÁCTICOS AVANZADOS FULL STACK
## Desafíos y Proyectos para Dominar React, TypeScript y Node.js

---

## 📋 **INTRODUCCIÓN A LOS EJERCICIOS**

Estos ejercicios están diseñados para complementar el curso "Full Stack React TypeScript and Node" y aplicar todos los conceptos avanzados aprendidos en aplicaciones reales.

### **🎯 Niveles de Dificultad:**
- **🟢 Básico** - Conceptos fundamentales
- **🟡 Intermedio** - Patrones y arquitectura
- **🔴 Avanzado** - Conceptos expertos
- **🟣 Experto** - Proyectos completos

---

## 🟢 **EJERCICIOS BÁSICOS**

### **Ejercicio 1: API REST Básica con TypeScript**

```typescript
// 🎯 Objetivo: Crear una API REST básica con Express y TypeScript

// 1. Define las interfaces para un sistema de blog
interface Post {
  // Completa la interfaz
}

interface User {
  // Completa la interfaz
}

// 2. Crea un controlador para posts
class PostController {
  // Implementa los métodos CRUD
}

// 3. Crea las rutas para la API
const postRoutes = {
  // Implementa las rutas
};

// 4. Configura el servidor Express
const app = express();
// Implementa la configuración
```

**Solución:**
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

class PostController {
  private posts: Post[] = [];

  async getAllPosts(): Promise<Post[]> {
    return this.posts;
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.posts.find(post => post.id === id) || null;
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.posts.push(newPost);
    return newPost;
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    this.posts[index] = {
      ...this.posts[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.posts[index];
  }

  async deletePost(id: string): Promise<boolean> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return false;

    this.posts.splice(index, 1);
    return true;
  }
}

const postController = new PostController();

const postRoutes = {
  'GET /api/posts': async (req: Request, res: Response) => {
    try {
      const posts = await postController.getAllPosts();
      res.json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  },

  'GET /api/posts/:id': async (req: Request, res: Response) => {
    try {
      const post = await postController.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post no encontrado' });
      }
      res.json({ success: true, data: post });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  },

  'POST /api/posts': async (req: Request, res: Response) => {
    try {
      const post = await postController.createPost(req.body);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Datos inválidos' });
    }
  },

  'PUT /api/posts/:id': async (req: Request, res: Response) => {
    try {
      const post = await postController.updatePost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post no encontrado' });
      }
      res.json({ success: true, data: post });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  },

  'DELETE /api/posts/:id': async (req: Request, res: Response) => {
    try {
      const deleted = await postController.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Post no encontrado' });
      }
      res.json({ success: true, message: 'Post eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }
};

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.get('/api/posts', postRoutes['GET /api/posts']);
app.get('/api/posts/:id', postRoutes['GET /api/posts/:id']);
app.post('/api/posts', postRoutes['POST /api/posts']);
app.put('/api/posts/:id', postRoutes['PUT /api/posts/:id']);
app.delete('/api/posts/:id', postRoutes['DELETE /api/posts/:id']);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### **Ejercicio 2: Componente React con TypeScript**

```typescript
// 🎯 Objetivo: Crear componentes React con TypeScript para consumir la API

// 1. Crea un hook para manejar posts
const usePosts = () => {
  // Implementa el hook
};

// 2. Crea un componente PostList
const PostList: React.FC = () => {
  // Implementa el componente
};

// 3. Crea un componente PostForm
const PostForm: React.FC<{ onSubmit: (post: any) => void }> = ({ onSubmit }) => {
  // Implementa el componente
};
```

**Solución:**
```typescript
const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al cargar posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => [...prev, data.data]);
        return data.data;
      } else {
        setError(data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al crear post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: string, updates: Partial<Post>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.map(post => 
          post.id === id ? data.data : post
        ));
        return data.data;
      } else {
        setError(data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al actualizar post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(prev => prev.filter(post => post.id !== id));
      } else {
        setError(data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al eliminar post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost
  };
};

const PostList: React.FC = () => {
  const { posts, loading, error, deletePost } = usePosts();

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      await deletePost(id);
    }
  };

  if (loading) return <div>Cargando posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div className="post-meta">
            <span>Autor: {post.authorId}</span>
            <span>Publicado: {post.published ? 'Sí' : 'No'}</span>
            <span>Creado: {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <button onClick={() => handleDelete(post.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

const PostForm: React.FC<{ onSubmit: (post: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorId: '',
    published: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', content: '', authorId: '', published: false });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div>
        <label htmlFor="title">Título:</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label htmlFor="content">Contenido:</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label htmlFor="authorId">ID del Autor:</label>
        <input
          id="authorId"
          type="text"
          value={formData.authorId}
          onChange={e => setFormData(prev => ({ ...prev, authorId: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
          />
          Publicado
        </label>
      </div>
      
      <button type="submit">Crear Post</button>
    </form>
  );
};
```

---

## 🟡 **EJERCICIOS INTERMEDIOS**

### **Ejercicio 3: Autenticación JWT**

```typescript
// 🎯 Objetivo: Implementar autenticación JWT completa

// 1. Crea un middleware de autenticación
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Implementa el middleware
};

// 2. Crea un servicio de autenticación
class AuthService {
  // Implementa el servicio
}

// 3. Crea rutas protegidas
const protectedRoutes = {
  // Implementa las rutas
};
```

**Solución:**
```typescript
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de autenticación requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido' 
    });
  }
};

class AuthService {
  private users: User[] = [];

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ user: User; token: string }> {
    // Verificar si el usuario ya existe
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Usuario ya existe');
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Buscar usuario
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = this.users.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

const authService = new AuthService();

const protectedRoutes = {
  'POST /api/auth/register': async (req: Request, res: Response) => {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error de registro'
      });
    }
  },

  'POST /api/auth/login': async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      
      res.json({
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error de login'
      });
    }
  },

  'GET /api/auth/me': [authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await authService.verifyToken(req.headers.authorization!.replace('Bearer ', ''));
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error de autenticación'
      });
    }
  }]
};
```

### **Ejercicio 4: Base de Datos con MongoDB**

```typescript
// 🎯 Objetivo: Integrar MongoDB con TypeScript

// 1. Define los esquemas de MongoDB
const UserSchema = new Schema({
  // Completa el esquema
});

const PostSchema = new Schema({
  // Completa el esquema
});

// 2. Crea un repositorio para usuarios
class UserRepository {
  // Implementa el repositorio
}

// 3. Crea un servicio que use el repositorio
class UserService {
  // Implementa el servicio
}
```

**Solución:**
```typescript
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

class UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      return await User.findById(id).select('-password');
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      return null;
    }
  }

  async create(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = new User(userData);
    return await user.save();
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await User.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).select('-password');
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      return false;
    }
  }

  async findAll(): Promise<User[]> {
    return await User.find().select('-password');
  }

  async findWithPosts(id: string): Promise<User | null> {
    try {
      return await User.findById(id)
        .select('-password')
        .populate('posts');
    } catch (error) {
      return null;
    }
  }
}

class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Validaciones de negocio
    if (await this.userRepository.findByEmail(userData.email)) {
      throw new Error('Usuario ya existe');
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear usuario
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return user;
  }

  async authenticateUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, updates);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error('Usuario no encontrado');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserWithPosts(id: string): Promise<User> {
    const user = await this.userRepository.findWithPosts(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }
}
```

---

## 🔴 **EJERCICIOS AVANZADOS**

### **Ejercicio 5: Sistema de Notificaciones en Tiempo Real**

```typescript
// 🎯 Objetivo: Implementar WebSockets con Socket.io

// 1. Configura Socket.io en el servidor
const setupWebSockets = (server: Server) => {
  // Implementa la configuración
};

// 2. Crea un servicio de notificaciones
class NotificationService {
  // Implementa el servicio
}

// 3. Crea un hook para el cliente
const useNotifications = () => {
  // Implementa el hook
};
```

**Solución:**
```typescript
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

const setupWebSockets = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Middleware de autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Autenticación requerida'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.userId}`);

    // Unir al usuario a su sala personal
    socket.join(`user:${socket.userId}`);

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.userId}`);
    });

    // Manejar mensajes privados
    socket.on('private-message', (data) => {
      io.to(`user:${data.toUserId}`).emit('new-message', {
        from: socket.userId,
        message: data.message,
        timestamp: new Date()
      });
    });

    // Manejar notificaciones
    socket.on('mark-notification-read', (notificationId) => {
      // Marcar notificación como leída en la base de datos
      notificationService.markAsRead(notificationId, socket.userId);
    });
  });

  return io;
};

class NotificationService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    // Guardar en base de datos
    await this.saveNotification(newNotification);

    // Enviar por WebSocket
    this.io.to(`user:${userId}`).emit('new-notification', newNotification);
  }

  async sendBroadcastNotification(notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>): Promise<void> {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      userId: 'broadcast',
      createdAt: new Date()
    };

    // Guardar en base de datos
    await this.saveNotification(newNotification);

    // Enviar a todos los usuarios conectados
    this.io.emit('broadcast-notification', newNotification);
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Actualizar en base de datos
    await this.updateNotificationReadStatus(notificationId, userId, true);
  }

  private async saveNotification(notification: Notification): Promise<void> {
    // Implementar guardado en base de datos
    console.log('Guardando notificación:', notification);
  }

  private async updateNotificationReadStatus(notificationId: string, userId: string, read: boolean): Promise<void> {
    // Implementar actualización en base de datos
    console.log('Actualizando estado de notificación:', { notificationId, userId, read });
  }
}

// Hook para el cliente
const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de notificaciones');
    });

    newSocket.on('new-notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    newSocket.on('broadcast-notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor de notificaciones');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    if (socket) {
      socket.emit('mark-notification-read', notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    }
  }, [socket]);

  const sendPrivateMessage = useCallback((toUserId: string, message: string) => {
    if (socket) {
      socket.emit('private-message', { toUserId, message });
    }
  }, [socket]);

  return {
    notifications,
    markAsRead,
    sendPrivateMessage,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
```

---

## 🟣 **PROYECTOS COMPLETOS**

### **Proyecto 1: Blog Completo con Autenticación**

```typescript
// 🎯 Objetivo: Crear un blog completo con todas las funcionalidades

// Características requeridas:
// - Autenticación JWT
// - CRUD de posts
// - Sistema de comentarios
// - Likes y dislikes
// - Búsqueda y filtros
// - Paginación
// - Subida de imágenes
// - Dashboard de administración
// - Notificaciones en tiempo real
// - Testing completo
// - Despliegue en la nube
```

### **Proyecto 2: E-commerce Full Stack**

```typescript
// 🎯 Objetivo: Crear una tienda online completa

// Características requeridas:
// - Catálogo de productos
// - Carrito de compras
// - Sistema de pagos
// - Gestión de inventario
// - Sistema de reviews
// - Panel de administración
// - Notificaciones por email
// - Analytics y reportes
// - Testing E2E
// - CI/CD pipeline
```

---

## 🎯 **DESAFÍOS EXTRA**

### **Desafío 1: Microservicios**

```typescript
// Implementa una arquitectura de microservicios con:
// - API Gateway
// - Service Discovery
// - Load Balancing
// - Circuit Breaker
// - Distributed Tracing
// - Event Sourcing
// - CQRS Pattern
```

### **Desafío 2: Real-time Collaboration**

```typescript
// Crea un editor colaborativo en tiempo real con:
// - Operational Transformation
// - Conflict Resolution
// - Presence Indicators
// - Version Control
// - Comments and Suggestions
// - Real-time Cursors
```

### **Desafío 3: Progressive Web App**

```typescript
// Desarrolla una PWA completa con:
// - Service Workers
// - Offline Support
// - Push Notifications
// - Background Sync
// - App Shell Architecture
// - Performance Optimization
```

---

## 📊 **EVALUACIÓN Y MÉTRICAS**

### **Criterios de Evaluación:**

1. **Arquitectura Limpia** - Separación de responsabilidades
2. **TypeScript Usage** - Uso apropiado de tipos
3. **Testing Coverage** - Cobertura de pruebas
4. **Performance** - Optimización y rendimiento
5. **Security** - Implementación de seguridad
6. **Documentation** - Código bien documentado
7. **Deployment** - Despliegue automatizado

### **Herramientas de Evaluación:**

```bash
# Backend
npm run test
npm run test:coverage
npm run lint
npm run type-check

# Frontend
npm run test
npm run test:coverage
npm run lint
npm run build

# Full Stack
npm run test:e2e
npm run test:integration
npm run security:audit
npm run performance:test
```

---

*¡Estos ejercicios te ayudarán a dominar el desarrollo full stack con React, TypeScript y Node.js!* 🚀✨ 