# 🔒 Seguridad - JSNAD

## 🎯 Introducción a la Seguridad

La **Seguridad** es fundamental en el desarrollo de aplicaciones Node.js, especialmente en aplicaciones web y APIs. Aunque no representa un porcentaje específico del examen JSNAD, es una habilidad crítica que se evalúa a través de la implementación de patrones seguros y el manejo adecuado de datos sensibles.

### ¿Por qué es Importante?

- **Protección de Datos**: Evitar exposición de información sensible
- **Prevención de Ataques**: Proteger contra vulnerabilidades comunes
- **Cumplimiento**: Cumplir con regulaciones de seguridad
- **Confianza del Usuario**: Mantener la confianza de los usuarios
- **Integridad**: Asegurar que los datos no sean manipulados

## 🛡️ Validación de Entrada

### Sanitización de Datos

```javascript
// validation.js
const crypto = require('crypto');

// Validación de entrada básica
function validateInput(input, rules) {
  const errors = [];
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = input[field];
    
    if (rule.required && !value) {
      errors.push(`${field} es requerido`);
      continue;
    }
    
    if (value) {
      // Validar tipo
      if (rule.type && typeof value !== rule.type) {
        errors.push(`${field} debe ser de tipo ${rule.type}`);
      }
      
      // Validar longitud
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} debe tener al menos ${rule.minLength} caracteres`);
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} debe tener máximo ${rule.maxLength} caracteres`);
      }
      
      // Validar patrón
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} no cumple con el formato requerido`);
      }
      
      // Validar rango
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${field} debe ser mayor o igual a ${rule.min}`);
      }
      
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${field} debe ser menor o igual a ${rule.max}`);
      }
      
      // Validar valores permitidos
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} debe ser uno de: ${rule.enum.join(', ')}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Reglas de validación predefinidas
const validationRules = {
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254
  },
  
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  
  username: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  
  age: {
    required: false,
    type: 'number',
    min: 0,
    max: 150
  },
  
  role: {
    required: true,
    type: 'string',
    enum: ['user', 'admin', 'moderator']
  }
};

// Sanitización de datos
function sanitizeInput(input) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      // Eliminar espacios en blanco
      sanitized[key] = value.trim();
      
      // Escapar caracteres HTML
      sanitized[key] = escapeHtml(sanitized[key]);
      
      // Limitar longitud
      if (sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000);
      }
    } else if (typeof value === 'number') {
      // Validar que sea un número finito
      if (isFinite(value)) {
        sanitized[key] = value;
      }
    } else if (Array.isArray(value)) {
      // Sanitizar arrays
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? escapeHtml(item.trim()) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      // Sanitizar objetos anidados
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Escapar caracteres HTML
function escapeHtml(text) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
}

// Validación de archivos
function validateFile(file, options = {}) {
  const errors = [];
  
  // Validar tamaño
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB por defecto
  if (file.size > maxSize) {
    errors.push(`El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Validar tipo MIME
  if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
    errors.push(`Tipo de archivo no permitido: ${file.mimetype}`);
  }
  
  // Validar extensión
  if (options.allowedExtensions) {
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (!options.allowedExtensions.includes(extension)) {
      errors.push(`Extensión de archivo no permitida: ${extension}`);
    }
  }
  
  // Validar nombre del archivo
  if (file.originalname.length > 255) {
    errors.push('El nombre del archivo es demasiado largo');
  }
  
  // Validar caracteres peligrosos en el nombre
  const dangerousChars = /[<>:"/\\|?*]/;
  if (dangerousChars.test(file.originalname)) {
    errors.push('El nombre del archivo contiene caracteres no permitidos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Ejemplo de uso
function demonstrateInputValidation() {
  const userInput = {
    username: '  john_doe123  ',
    email: 'john@example.com',
    password: 'MyP@ssw0rd',
    age: 25,
    role: 'user',
    bio: '<script>alert("xss")</script>Hello World!'
  };
  
  // Validar entrada
  const validation = validateInput(userInput, validationRules);
  
  if (!validation.isValid) {
    console.error('Errores de validación:', validation.errors);
    return;
  }
  
  // Sanitizar entrada
  const sanitized = sanitizeInput(userInput);
  
  console.log('Entrada original:', userInput);
  console.log('Entrada sanitizada:', sanitized);
  console.log('Validación exitosa');
}
```

## 🔐 Autenticación y Autorización

### Sistema de Autenticación

```javascript
// auth.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Configuración de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Clase para manejo de contraseñas
class PasswordManager {
  // Generar hash de contraseña
  static async hashPassword(password) {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }
  
  // Verificar contraseña
  static async verifyPassword(password, hash) {
    const passwordHash = await this.hashPassword(password);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(passwordHash, 'hex')
    );
  }
  
  // Generar contraseña aleatoria
  static generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }
}

// Clase para manejo de tokens
class TokenManager {
  // Generar token JWT
  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'your-app',
      audience: 'your-users'
    });
  }
  
  // Verificar token JWT
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'your-app',
        audience: 'your-users'
      });
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
  
  // Decodificar token sin verificar
  static decodeToken(token) {
    return jwt.decode(token);
  }
  
  // Generar token de refresco
  static generateRefreshToken(userId) {
    const refreshToken = crypto.randomBytes(32).toString('hex');
    
    // En producción, guardar en base de datos
    return refreshToken;
  }
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  
  try {
    const decoded = TokenManager.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// Middleware de autorización
function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    next();
  };
}

// Middleware de rate limiting
function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    max = 100, // máximo 100 requests por ventana
    message = 'Demasiadas solicitudes, intente más tarde'
  } = options;
  
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    
    // Limpiar requests antiguos
    const validRequests = userRequests.filter(time => now - time < windowMs);
    requests.set(ip, validRequests);
    
    if (validRequests.length >= max) {
      return res.status(429).json({ error: message });
    }
    
    validRequests.push(now);
    next();
  };
}

// Clase de autenticación
class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  // Registrar usuario
  async register(userData) {
    // Validar datos de entrada
    const validation = validateInput(userData, validationRules);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    // Hash de contraseña
    const hashedPassword = await PasswordManager.hashPassword(userData.password);
    
    // Crear usuario
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date()
    });
    
    // Generar token
    const token = TokenManager.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }
  
  // Iniciar sesión
  async login(email, password) {
    // Buscar usuario
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    // Verificar contraseña
    const isValidPassword = await PasswordManager.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }
    
    // Generar token
    const token = TokenManager.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }
  
  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar contraseña actual
    const isValidPassword = await PasswordManager.verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Contraseña actual incorrecta');
    }
    
    // Validar nueva contraseña
    const validation = validateInput({ password: newPassword }, { password: validationRules.password });
    if (!validation.isValid) {
      throw new Error(`Nueva contraseña inválida: ${validation.errors.join(', ')}`);
    }
    
    // Hash de nueva contraseña
    const hashedNewPassword = await PasswordManager.hashPassword(newPassword);
    
    // Actualizar contraseña
    await this.userRepository.update(userId, { password: hashedNewPassword });
    
    return { message: 'Contraseña actualizada exitosamente' };
  }
  
  // Recuperar contraseña
  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // No revelar si el email existe o no
      return { message: 'Si el email existe, se enviará un enlace de recuperación' };
    }
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    // Guardar token en base de datos
    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry
    });
    
    // En producción, enviar email
    console.log(`Token de recuperación para ${email}: ${resetToken}`);
    
    return { message: 'Si el email existe, se enviará un enlace de recuperación' };
  }
  
  // Resetear contraseña
  async resetPassword(resetToken, newPassword) {
    const user = await this.userRepository.findByResetToken(resetToken);
    if (!user) {
      throw new Error('Token de recuperación inválido');
    }
    
    if (user.resetTokenExpiry < new Date()) {
      throw new Error('Token de recuperación expirado');
    }
    
    // Validar nueva contraseña
    const validation = validateInput({ password: newPassword }, { password: validationRules.password });
    if (!validation.isValid) {
      throw new Error(`Nueva contraseña inválida: ${validation.errors.join(', ')}`);
    }
    
    // Hash de nueva contraseña
    const hashedNewPassword = await PasswordManager.hashPassword(newPassword);
    
    // Actualizar contraseña y limpiar token
    await this.userRepository.update(user.id, {
      password: hashedNewPassword,
      resetToken: null,
      resetTokenExpiry: null
    });
    
    return { message: 'Contraseña reseteada exitosamente' };
  }
}
```

## 🔒 Criptografía y Hashing

### Operaciones Criptográficas

```javascript
// crypto.js
const crypto = require('crypto');

// Configuración de algoritmos
const ALGORITHMS = {
  HASH: 'sha256',
  CIPHER: 'aes-256-gcm',
  KEY_LENGTH: 32,
  IV_LENGTH: 16,
  TAG_LENGTH: 16
};

// Clase para operaciones criptográficas
class CryptoService {
  constructor(secretKey) {
    this.secretKey = this.deriveKey(secretKey);
  }
  
  // Derivar clave de una contraseña
  deriveKey(password, salt = 'default-salt') {
    return crypto.pbkdf2Sync(password, salt, 100000, ALGORITHMS.KEY_LENGTH, 'sha512');
  }
  
  // Generar hash seguro
  hash(data, algorithm = ALGORITHMS.HASH) {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }
  
  // Generar hash con salt
  hashWithSalt(data, salt) {
    return crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512').toString('hex');
  }
  
  // Verificar hash con salt
  verifyHash(data, hash, salt) {
    const computedHash = this.hashWithSalt(data, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(computedHash, 'hex')
    );
  }
  
  // Encriptar datos
  encrypt(data) {
    const iv = crypto.randomBytes(ALGORITHMS.IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHMS.CIPHER, this.secretKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }
  
  // Desencriptar datos
  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(ALGORITHMS.CIPHER, this.secretKey);
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    decipher.setAAD(Buffer.from(''));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  // Generar token seguro
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  // Generar UUID
  generateUUID() {
    return crypto.randomUUID();
  }
  
  // Generar clave SSH
  generateSSHKey() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    
    return { publicKey, privateKey };
  }
  
  // Firmar datos
  sign(data, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'base64');
  }
  
  // Verificar firma
  verify(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'base64');
  }
  
  // Generar certificado autofirmado
  generateSelfSignedCertificate(options = {}) {
    const {
      commonName = 'localhost',
      organization = 'Test Organization',
      country = 'US',
      state = 'Test State',
      locality = 'Test City',
      days = 365
    } = options;
    
    const { publicKey, privateKey } = this.generateSSHKey();
    
    // En producción, usar biblioteca como 'node-forge' para certificados X.509
    return {
      publicKey,
      privateKey,
      certificate: 'Self-signed certificate placeholder'
    };
  }
}

// Clase para manejo de sesiones
class SessionManager {
  constructor() {
    this.sessions = new Map();
  }
  
  // Crear sesión
  createSession(userId, data = {}) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const session = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      data,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }
  
  // Obtener sesión
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }
    
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    // Actualizar última actividad
    session.lastActivity = new Date();
    return session;
  }
  
  // Actualizar sesión
  updateSession(sessionId, data) {
    const session = this.getSession(sessionId);
    if (session) {
      Object.assign(session.data, data);
      session.lastActivity = new Date();
      return true;
    }
    return false;
  }
  
  // Eliminar sesión
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }
  
  // Limpiar sesiones expiradas
  cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
  
  // Obtener estadísticas de sesiones
  getSessionStats() {
    const now = new Date();
    let activeSessions = 0;
    let expiredSessions = 0;
    
    for (const session of this.sessions.values()) {
      if (session.expiresAt < now) {
        expiredSessions++;
      } else {
        activeSessions++;
      }
    }
    
    return {
      total: this.sessions.size,
      active: activeSessions,
      expired: expiredSessions
    };
  }
}

// Ejemplo de uso
function demonstrateCryptography() {
  const cryptoService = new CryptoService('my-secret-key');
  const sessionManager = new SessionManager();
  
  // Hashing
  const password = 'myPassword123';
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = cryptoService.hashWithSalt(password, salt);
  
  console.log('Password hasheado:', hashedPassword);
  console.log('Verificación:', cryptoService.verifyHash(password, hashedPassword, salt));
  
  // Encriptación
  const sensitiveData = 'Información confidencial';
  const encrypted = cryptoService.encrypt(sensitiveData);
  const decrypted = cryptoService.decrypt(encrypted);
  
  console.log('Datos encriptados:', encrypted);
  console.log('Datos desencriptados:', decrypted);
  
  // Sesiones
  const sessionId = sessionManager.createSession(123, { role: 'admin' });
  const session = sessionManager.getSession(sessionId);
  
  console.log('Sesión creada:', session);
  console.log('Estadísticas:', sessionManager.getSessionStats());
}
```

## 🧪 Pruebas Unitarias - Seguridad

```javascript
// tests/security.test.js
const { 
  validateInput,
  sanitizeInput,
  escapeHtml,
  validateFile,
  PasswordManager,
  TokenManager,
  authenticateToken,
  authorizeRole,
  rateLimit,
  AuthService,
  CryptoService,
  SessionManager
} = require('../src/security');

describe('Seguridad', () => {
  describe('Validación de Entrada', () => {
    test('debe validar entrada correcta', () => {
      const input = {
        email: 'test@example.com',
        password: 'MyP@ssw0rd',
        username: 'testuser',
        age: 25,
        role: 'user'
      };
      
      const rules = {
        email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, type: 'string', minLength: 8 },
        username: { required: true, type: 'string', minLength: 3 },
        age: { required: false, type: 'number', min: 0, max: 150 },
        role: { required: true, type: 'string', enum: ['user', 'admin'] }
      };
      
      const result = validateInput(input, rules);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('debe detectar entrada inválida', () => {
      const input = {
        email: 'invalid-email',
        password: '123',
        username: 'ab',
        age: -5,
        role: 'invalid-role'
      };
      
      const rules = {
        email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, type: 'string', minLength: 8 },
        username: { required: true, type: 'string', minLength: 3 },
        age: { required: false, type: 'number', min: 0, max: 150 },
        role: { required: true, type: 'string', enum: ['user', 'admin'] }
      };
      
      const result = validateInput(input, rules);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('Sanitización de Entrada', () => {
    test('debe sanitizar strings', () => {
      const input = {
        name: '  John Doe  ',
        bio: '<script>alert("xss")</script>Hello World!',
        email: 'john@example.com'
      };
      
      const sanitized = sanitizeInput(input);
      
      expect(sanitized.name).toBe('John Doe');
      expect(sanitized.bio).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;Hello World!');
      expect(sanitized.email).toBe('john@example.com');
    });
    
    test('debe sanitizar arrays y objetos', () => {
      const input = {
        tags: ['  tag1  ', '<script>alert("xss")</script>tag2'],
        metadata: {
          description: '  Description with <script>alert("xss")</script>  '
        }
      };
      
      const sanitized = sanitizeInput(input);
      
      expect(sanitized.tags[0]).toBe('tag1');
      expect(sanitized.tags[1]).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;tag2');
      expect(sanitized.metadata.description).toBe('Description with &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });
  });
  
  describe('Escape HTML', () => {
    test('debe escapar caracteres HTML peligrosos', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
      expect(escapeHtml('Normal text')).toBe('Normal text');
    });
  });
  
  describe('Validación de Archivos', () => {
    test('debe validar archivo correcto', () => {
      const file = {
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1024 * 1024 // 1MB
      };
      
      const options = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['application/pdf', 'text/plain'],
        allowedExtensions: ['pdf', 'txt']
      };
      
      const result = validateFile(file, options);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('debe detectar archivo inválido', () => {
      const file = {
        originalname: 'script.js',
        mimetype: 'application/javascript',
        size: 10 * 1024 * 1024 // 10MB
      };
      
      const options = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['application/pdf', 'text/plain'],
        allowedExtensions: ['pdf', 'txt']
      };
      
      const result = validateFile(file, options);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('Password Manager', () => {
    test('debe generar hash de contraseña', async () => {
      const password = 'testPassword123';
      const hash = await PasswordManager.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
    
    test('debe verificar contraseña correctamente', async () => {
      const password = 'testPassword123';
      const hash = await PasswordManager.hashPassword(password);
      
      const isValid = await PasswordManager.verifyPassword(password, hash);
      expect(isValid).toBe(true);
      
      const isInvalid = await PasswordManager.verifyPassword('wrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
    
    test('debe generar contraseña aleatoria', () => {
      const password1 = PasswordManager.generateRandomPassword(12);
      const password2 = PasswordManager.generateRandomPassword(12);
      
      expect(password1).toHaveLength(12);
      expect(password2).toHaveLength(12);
      expect(password1).not.toBe(password2);
    });
  });
  
  describe('Token Manager', () => {
    test('debe generar y verificar token JWT', () => {
      const payload = { userId: 123, role: 'user' };
      const token = TokenManager.generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = TokenManager.verifyToken(token);
      expect(decoded.userId).toBe(123);
      expect(decoded.role).toBe('user');
    });
    
    test('debe rechazar token inválido', () => {
      expect(() => {
        TokenManager.verifyToken('invalid-token');
      }).toThrow('Token inválido');
    });
  });
  
  describe('Rate Limiting', () => {
    test('debe limitar requests excesivos', () => {
      const rateLimiter = rateLimit({ max: 2, windowMs: 1000 });
      const req = { ip: '127.0.0.1' };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
      // Primer request
      rateLimiter(req, res, () => {});
      expect(res.status).not.toHaveBeenCalled();
      
      // Segundo request
      rateLimiter(req, res, () => {});
      expect(res.status).not.toHaveBeenCalled();
      
      // Tercer request (debe ser bloqueado)
      rateLimiter(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(429);
    });
  });
  
  describe('Crypto Service', () => {
    let cryptoService;
    
    beforeEach(() => {
      cryptoService = new CryptoService('test-secret');
    });
    
    test('debe generar hash seguro', () => {
      const data = 'test data';
      const hash = cryptoService.hash(data);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
    
    test('debe encriptar y desencriptar datos', () => {
      const data = 'sensitive information';
      const encrypted = cryptoService.encrypt(data);
      const decrypted = cryptoService.decrypt(encrypted);
      
      expect(encrypted).toHaveProperty('encrypted');
      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('tag');
      expect(decrypted).toBe(data);
    });
    
    test('debe generar token seguro', () => {
      const token1 = cryptoService.generateSecureToken(16);
      const token2 = cryptoService.generateSecureToken(16);
      
      expect(token1).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(token2).toHaveLength(32);
      expect(token1).not.toBe(token2);
    });
  });
  
  describe('Session Manager', () => {
    let sessionManager;
    
    beforeEach(() => {
      sessionManager = new SessionManager();
    });
    
    test('debe crear y obtener sesión', () => {
      const sessionId = sessionManager.createSession(123, { role: 'user' });
      const session = sessionManager.getSession(sessionId);
      
      expect(session).toBeDefined();
      expect(session.userId).toBe(123);
      expect(session.data.role).toBe('user');
      expect(session).toHaveProperty('createdAt');
      expect(session).toHaveProperty('expiresAt');
    });
    
    test('debe actualizar sesión', () => {
      const sessionId = sessionManager.createSession(123);
      const updated = sessionManager.updateSession(sessionId, { theme: 'dark' });
      
      expect(updated).toBe(true);
      
      const session = sessionManager.getSession(sessionId);
      expect(session.data.theme).toBe('dark');
    });
    
    test('debe eliminar sesión', () => {
      const sessionId = sessionManager.createSession(123);
      const deleted = sessionManager.deleteSession(sessionId);
      
      expect(deleted).toBe(true);
      
      const session = sessionManager.getSession(sessionId);
      expect(session).toBeNull();
    });
  });
});
```

## 📝 Puntos Clave - Seguridad

### ✅ Conceptos Esenciales

1. **Validación de Entrada**: Sanitización y validación de datos
2. **Autenticación**: Verificación de identidad del usuario
3. **Autorización**: Control de acceso a recursos
4. **Criptografía**: Encriptación, hashing y firmas digitales
5. **Rate Limiting**: Prevención de ataques de fuerza bruta
6. **Sanitización**: Eliminación de código malicioso

### ⚠️ Errores Comunes

1. **No validar entrada** del usuario
2. **Almacenar contraseñas** en texto plano
3. **No usar HTTPS** en producción
4. **Exponer información sensible** en logs
5. **No implementar rate limiting**
6. **Confiar en datos del cliente**

### 🎯 Preguntas de Práctica

1. ¿Cuál es la diferencia entre autenticación y autorización?
2. ¿Cómo se previene un ataque XSS?
3. ¿Qué es el rate limiting y por qué es importante?
4. ¿Cómo se debe almacenar una contraseña en la base de datos?
5. ¿Qué medidas de seguridad se deben implementar en una API?

---

**¡Continuemos con la siguiente sección: Performance y Optimización!**
