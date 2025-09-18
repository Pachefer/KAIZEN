# 🎯 EJERCICIOS PRÁCTICOS AVANZADOS MODERN FULL STACK
## Desafíos y Proyectos para Dominar React, Node.js y Tecnologías Modernas

---

## 📋 **INTRODUCCIÓN A LOS EJERCICIOS**

Estos ejercicios están diseñados para complementar el curso "Modern Full Stack React Projects" y aplicar todos los conceptos avanzados aprendidos en aplicaciones reales y modernas.

### **🎯 Niveles de Dificultad:**
- **🟢 Básico** - Conceptos fundamentales
- **🟡 Intermedio** - Patrones y arquitectura
- **🔴 Avanzado** - Conceptos expertos
- **🟣 Experto** - Proyectos completos

---

## 🟢 **EJERCICIOS BÁSICOS**

### **Ejercicio 1: Configuración de Vite con React**

```typescript
// 🎯 Objetivo: Configurar un proyecto moderno con Vite y React

// 1. Crea la configuración de Vite
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Completa la configuración
})

// 2. Configura el entorno de desarrollo
// .env.development
VITE_API_URL=http://localhost:5000/api
VITE_GRAPHQL_URL=http://localhost:5000/graphql
VITE_SOCKET_URL=http://localhost:5000

// 3. Crea un componente básico con TypeScript
// src/components/Button.tsx
interface ButtonProps {
  // Completa la interfaz
}

const Button: React.FC<ButtonProps> = ({ /* props */ }) => {
  // Implementa el componente
}
```

**Solución:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/graphql': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
})

// .env.development
VITE_API_URL=http://localhost:5000/api
VITE_GRAPHQL_URL=http://localhost:5000/graphql
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_TITLE=Modern Full Stack App

// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
```

### **Ejercicio 2: Hook Personalizado para API**

```typescript
// 🎯 Objetivo: Crear un hook personalizado para manejar APIs

// 1. Crea un hook genérico para fetch
const useApi = <T>(url: string, options?: RequestInit) => {
  // Implementa el hook
};

// 2. Crea un hook específico para posts
const usePosts = () => {
  // Implementa el hook usando useApi
};

// 3. Crea un hook para mutaciones
const useMutation = <T, R>(url: string) => {
  // Implementa el hook para POST, PUT, DELETE
};
```

**Solución:**
```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: T;
  headers?: Record<string, string>;
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (options?: UseApiOptions<T>) => Promise<void>;
  refetch: () => Promise<void>;
}

const useApi = <T>(url: string, options?: UseApiOptions<T>): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (executeOptions?: UseApiOptions<T>) => {
    const finalOptions = { ...options, ...executeOptions };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: finalOptions.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...finalOptions.headers
        },
        body: finalOptions.body ? JSON.stringify(finalOptions.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      finalOptions.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      finalOptions.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const refetch = useCallback(() => execute(), [execute]);

  useEffect(() => {
    if (options?.immediate !== false) {
      execute();
    }
  }, [execute, options?.immediate]);

  return { data, loading, error, execute, refetch };
};

// src/hooks/usePosts.ts
import { useCallback } from 'react';
import { useApi } from './useApi';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePostData {
  title: string;
  content: string;
  authorId: string;
  published?: boolean;
}

interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

const usePosts = () => {
  const { data: posts, loading, error, refetch } = useApi<Post[]>('/api/posts');

  const createPost = useCallback(async (postData: CreatePostData) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    
    await refetch();
    return response.json();
  }, [refetch]);

  const updatePost = useCallback(async (id: string, postData: UpdatePostData) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    
    await refetch();
    return response.json();
  }, [refetch]);

  const deletePost = useCallback(async (id: string) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    
    await refetch();
  }, [refetch]);

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch
  };
};

// src/hooks/useMutation.ts
import { useState, useCallback } from 'react';

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseMutationReturn<T, R> {
  data: R | null;
  loading: boolean;
  error: Error | null;
  mutate: (data: T) => Promise<void>;
  reset: () => void;
}

const useMutation = <T, R>(
  url: string, 
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<R>
): UseMutationReturn<T, R> => {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (mutationData: T) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [url, method, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
};

export { useApi, usePosts, useMutation };
```

---

## 🟡 **EJERCICIOS INTERMEDIOS**

### **Ejercicio 3: GraphQL con Apollo Client**

```typescript
// 🎯 Objetivo: Implementar GraphQL en el frontend

// 1. Configura Apollo Client
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // Completa la configuración
});

const client = new ApolloClient({
  // Completa la configuración
});

// 2. Define queries GraphQL
const GET_POSTS = gql`
  # Completa la query
`;

const CREATE_POST = gql`
  # Completa la mutation
`;

// 3. Crea hooks para GraphQL
const usePostsQuery = () => {
  // Implementa el hook
};

const useCreatePostMutation = () => {
  // Implementa el hook
};
```

**Solución:**
```typescript
// src/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5000/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

export default client;

// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $offset: Int) {
    posts(limit: $limit, offset: $offset) {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      content
      published
      author {
        id
        name
        email
      }
      comments {
        id
        content
        author {
          id
          name
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      published
      author {
        id
        name
      }
      createdAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      published
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

// src/hooks/useGraphQL.ts
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_POSTS, GET_POST_BY_ID, CREATE_POST, UPDATE_POST, DELETE_POST } from '../graphql/queries';

export const usePostsQuery = (limit?: number, offset?: number) => {
  return useQuery(GET_POSTS, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network'
  });
};

export const usePostQuery = (id: string) => {
  return useQuery(GET_POST_BY_ID, {
    variables: { id },
    skip: !id
  });
};

export const useCreatePostMutation = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_POST);
  
  const createPost = async (input: {
    title: string;
    content: string;
    authorId: string;
    published?: boolean;
  }) => {
    try {
      const { data } = await mutate({
        variables: { input },
        update: (cache, { data }) => {
          const existingPosts = cache.readQuery({ query: GET_POSTS });
          if (existingPosts && data?.createPost) {
            cache.writeQuery({
              query: GET_POSTS,
              data: {
                posts: [data.createPost, ...existingPosts.posts]
              }
            });
          }
        }
      });
      return data?.createPost;
    } catch (err) {
      throw err;
    }
  };

  return { createPost, loading, error };
};

export const useUpdatePostMutation = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_POST);
  
  const updatePost = async (id: string, input: {
    title?: string;
    content?: string;
    published?: boolean;
  }) => {
    try {
      const { data } = await mutate({
        variables: { id, input },
        update: (cache, { data }) => {
          if (data?.updatePost) {
            cache.writeQuery({
              query: GET_POST_BY_ID,
              variables: { id },
              data: { post: data.updatePost }
            });
          }
        }
      });
      return data?.updatePost;
    } catch (err) {
      throw err;
    }
  };

  return { updatePost, loading, error };
};

export const useDeletePostMutation = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_POST);
  
  const deletePost = async (id: string) => {
    try {
      await mutate({
        variables: { id },
        update: (cache) => {
          cache.evict({ id: cache.identify({ __typename: 'Post', id }) });
          cache.gc();
        }
      });
    } catch (err) {
      throw err;
    }
  };

  return { deletePost, loading, error };
};
```

### **Ejercicio 4: Socket.IO para Chat en Tiempo Real**

```typescript
// 🎯 Objetivo: Implementar chat en tiempo real con Socket.IO

// 1. Configura Socket.IO en el cliente
import { io, Socket } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  // Completa la configuración
});

// 2. Crea un hook para el chat
const useChat = (roomId: string) => {
  // Implementa el hook
};

// 3. Crea un componente de chat
const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  // Implementa el componente
};
```

**Solución:**
```typescript
// src/socket/client.ts
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  roomId: string;
  timestamp: Date;
}

interface SocketEvents {
  'message:send': (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  'message:received': (message: ChatMessage) => void;
  'user:join': (roomId: string) => void;
  'user:leave': (roomId: string) => void;
  'user:typing': (data: { roomId: string; userId: string; isTyping: boolean }) => void;
}

const socket: Socket<SocketEvents> = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;

// src/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import socket from '../socket/client';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  roomId: string;
  timestamp: Date;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  isConnected: boolean;
  typingUsers: string[];
}

const useChat = (roomId: string): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const handleMessageReceived = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    };

    const handleUserTyping = (data: { roomId: string; userId: string; isTyping: boolean }) => {
      if (data.roomId === roomId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.includes(data.userId) ? prev : [...prev, data.userId];
          } else {
            return prev.filter(id => id !== data.userId);
          }
        });
      }
    };

    socket.on('message:received', handleMessageReceived);
    socket.on('user:typing', handleUserTyping);

    return () => {
      socket.off('message:received', handleMessageReceived);
      socket.off('user:typing', handleUserTyping);
    };
  }, [roomId]);

  const sendMessage = useCallback((content: string) => {
    if (content.trim() && isConnected) {
      socket.emit('message:send', {
        content: content.trim(),
        roomId,
        senderId: 'current-user-id', // Esto vendría del contexto de autenticación
        senderName: 'Current User' // Esto vendría del contexto de autenticación
      });
    }
  }, [roomId, isConnected]);

  const joinRoom = useCallback((roomId: string) => {
    socket.emit('user:join', roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socket.emit('user:leave', roomId);
  }, []);

  const startTyping = useCallback(() => {
    socket.emit('user:typing', { roomId, userId: 'current-user-id', isTyping: true });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('user:typing', { roomId, userId: 'current-user-id', isTyping: false });
    }, 3000);
  }, [roomId]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('user:typing', { roomId, userId: 'current-user-id', isTyping: false });
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
      return () => leaveRoom(roomId);
    }
  }, [roomId, joinRoom, leaveRoom]);

  return {
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
    isConnected,
    typingUsers,
    startTyping,
    stopTyping
  };
};

// src/components/ChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isConnected, typingUsers, startTyping, stopTyping } = useChat(roomId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      stopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className="flex flex-col h-96 border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold">Chat Room: {roomId}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{msg.senderName}</span>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
```

---

## 🔴 **EJERCICIOS AVANZADOS**

### **Ejercicio 5: Server Components con Next.js**

```typescript
// 🎯 Objetivo: Implementar Server Components en Next.js

// 1. Crea un Server Component
// app/posts/page.tsx
async function PostsPage() {
  // Implementa el componente
}

// 2. Crea un Client Component
// components/PostForm.tsx
'use client';

const PostForm = () => {
  // Implementa el componente
};

// 3. Crea un componente híbrido
// components/PostList.tsx
const PostList = async () => {
  // Implementa el componente
};
```

**Solución:**
```typescript
// app/posts/page.tsx
import { Suspense } from 'react';
import PostList from '@/components/PostList';
import PostForm from '@/components/PostForm';
import { getPosts } from '@/lib/posts';

export default async function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Server Component - Lista de posts */}
        <div className="lg:col-span-2">
          <Suspense fallback={<PostsSkeleton />}>
            <PostList />
          </Suspense>
        </div>
        
        {/* Client Component - Formulario */}
        <div>
          <PostForm />
        </div>
      </div>
    </div>
  );
}

// app/posts/[id]/page.tsx
import { getPostById } from '@/lib/posts';
import { notFound } from 'next/navigation';
import PostDetail from '@/components/PostDetail';

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id);
  
  if (!post) {
    notFound();
  }
  
  return <PostDetail post={post} />;
}

// components/PostList.tsx
import { getPosts } from '@/lib/posts';
import PostCard from './PostCard';

export default async function PostList() {
  const posts = await getPosts();
  
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// components/PostCard.tsx
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
    };
    createdAt: Date;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {post.content}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By {post.author.name}</span>
        <time>{formatDate(post.createdAt)}</time>
      </div>
    </article>
  );
}

// components/PostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/actions';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createPost({ title, content });
      setTitle('');
      setContent('');
      router.refresh(); // Refresca la página para mostrar el nuevo post
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

// lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createPost as createPostDB } from '@/lib/posts';

export async function createPost(data: { title: string; content: string }) {
  try {
    await createPostDB(data);
    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create post' };
  }
}

// lib/posts.ts
import { db } from '@/lib/db';

export async function getPosts() {
  // Simulación de llamada a base de datos
  return [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content...',
      author: { name: 'John Doe' },
      createdAt: new Date()
    }
  ];
}

export async function getPostById(id: string) {
  // Simulación de llamada a base de datos
  return {
    id,
    title: 'Post Title',
    content: 'Post content...',
    author: { name: 'John Doe' },
    createdAt: new Date()
  };
}

export async function createPost(data: { title: string; content: string }) {
  // Simulación de creación en base de datos
  console.log('Creating post:', data);
}
```

---

## 🟣 **PROYECTOS COMPLETOS**

### **Proyecto 1: Blog Moderno con Next.js**

```typescript
// 🎯 Objetivo: Crear un blog completo con Next.js 14

// Características requeridas:
// - Server Components para renderizado del lado del servidor
// - Client Components para interactividad
// - GraphQL para consultas de datos
// - Autenticación con NextAuth.js
// - Editor de texto rico
// - Sistema de comentarios
// - SEO optimizado
// - PWA capabilities
// - Testing completo
// - Despliegue en Vercel
```

### **Proyecto 2: E-commerce con Microservicios**

```typescript
// 🎯 Objetivo: Crear una tienda online con arquitectura de microservicios

// Características requeridas:
// - Microservicios separados (usuarios, productos, pedidos, pagos)
// - API Gateway con Kong
// - Service Discovery con Consul
// - Message Queue con RabbitMQ
// - Base de datos distribuida
// - Frontend con React + Vite
// - GraphQL Federation
// - Docker y Kubernetes
// - CI/CD pipeline
// - Monitoring con Prometheus y Grafana
```

---

## 🎯 **DESAFÍOS EXTRA**

### **Desafío 1: Real-time Collaboration**

```typescript
// Implementa un editor colaborativo en tiempo real con:
// - Operational Transformation
// - Conflict Resolution
// - Presence Indicators
// - Version Control
// - Comments and Suggestions
// - Real-time Cursors
```

### **Desafío 2: Progressive Web App Avanzada**

```typescript
// Desarrolla una PWA completa con:
// - Service Workers avanzados
// - Offline Support completo
// - Push Notifications
// - Background Sync
// - App Shell Architecture
// - Performance Optimization
// - Install prompts
```

### **Desafío 3: Micro Frontends**

```typescript
// Crea una aplicación con micro frontends:
// - Module Federation
// - Shared dependencies
// - Independent deployments
// - Team autonomy
// - Technology diversity
// - Performance optimization
```

---

## 📊 **EVALUACIÓN Y MÉTRICAS**

### **Criterios de Evaluación:**

1. **Arquitectura Moderna** - Uso de tecnologías actuales
2. **Performance** - Optimización y rendimiento
3. **Testing Coverage** - Cobertura de pruebas
4. **Security** - Implementación de seguridad
5. **Documentation** - Código bien documentado
6. **Deployment** - Despliegue automatizado
7. **User Experience** - Experiencia de usuario

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
npm run lighthouse
```

---

*¡Estos ejercicios te ayudarán a dominar el desarrollo full stack moderno con las tecnologías más actuales!* 🚀✨ 