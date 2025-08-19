# PARTE V: TESTING Y DESPLIEGUE

## 🧪 **CAPÍTULO 17: PRUEBAS UNITARIAS Y DE INTEGRACIÓN**

### 🟢 **NIVEL BÁSICO: Configuración de Testing con Jest y React Testing Library**

#### **Instalación de Dependencias:**
```bash
# Instalar dependencias de testing
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Instalar tipos para TypeScript
npm install --save-dev @types/jest

# Instalar Jest para Next.js
npm install --save-dev @next/jest
```

#### **Configuración de Jest:**
```javascript
// jest.config.js
const nextJest = require('@next/jest');

const createJestConfig = nextJest({
  // Proporcionar la ruta a tu aplicación Next.js para cargar next.config.js y .env
  dir: './',
});

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

#### **Configuración de Jest Setup:**
```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock de Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock de Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock de console.error para evitar ruido en tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

---

### 🟡 **NIVEL INTERMEDIO: Pruebas de Componentes y Hooks**

#### **Pruebas de Componentes Básicos:**
```tsx
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renderiza correctamente con texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('aplica variantes de estilo correctamente', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });

  it('aplica tamaños correctamente', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5 text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3 text-lg');
  });

  it('maneja clicks correctamente', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('puede ser deshabilitado', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aplica clases personalizadas', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

#### **Pruebas de Hooks Personalizados:**
```tsx
// src/hooks/useTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useTheme Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('inicializa con tema del sistema por defecto', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('cambia el tema correctamente', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('guarda el tema en localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('carga el tema guardado en localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
  });

  it('responde a cambios en preferencias del sistema', () => {
    const mockMatchMedia = window.matchMedia as jest.MockedFunction<typeof window.matchMedia>;
    const mockMediaQuery = {
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
    
    mockMatchMedia.mockReturnValue(mockMediaQuery);
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.resolvedTheme).toBe('dark');
  });
});
```

#### **Pruebas de Componentes con Context:**
```tsx
// src/components/ThemeProvider.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from '@/hooks/useTheme';

// Componente de prueba que usa el hook
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('proporciona contexto de tema a los componentes hijos', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
  });

  it('permite cambiar el tema desde componentes hijos', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    fireEvent.click(screen.getByText('Set Light'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });
});
```

---

### 🔴 **NIVEL AVANZADO: Pruebas de Integración y E2E**

#### **Pruebas de Server Actions:**
```tsx
// src/app/actions/__tests__/ticketActions.test.ts
import { createTicket, updateTicket, deleteTicket } from '../ticketActions';

// Mock de revalidatePath
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Ticket Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTicket', () => {
    it('crea un ticket exitosamente con datos válidos', async () => {
      const formData = new FormData();
      formData.append('title', 'Test Ticket');
      formData.append('description', 'This is a test ticket description');
      formData.append('priority', 'HIGH');
      
      const result = await createTicket(formData);
      
      expect(result.success).toBe(true);
      expect(result.ticket).toBeDefined();
      expect(result.ticket.title).toBe('Test Ticket');
    });

    it('valida campos requeridos', async () => {
      const formData = new FormData();
      formData.append('title', '');
      formData.append('description', 'Short');
      formData.append('priority', 'MEDIUM');
      
      const result = await createTicket(formData);
      
      expect(result.success).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
    });

    it('valida prioridad válida', async () => {
      const formData = new FormData();
      formData.append('title', 'Test Ticket');
      formData.append('description', 'This is a test ticket description');
      formData.append('priority', 'INVALID_PRIORITY');
      
      const result = await createTicket(formData);
      
      expect(result.success).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors.priority).toBeDefined();
    });
  });

  describe('updateTicket', () => {
    it('actualiza un ticket exitosamente', async () => {
      const formData = new FormData();
      formData.append('id', 'ticket-123');
      formData.append('title', 'Updated Title');
      formData.append('status', 'IN_PROGRESS');
      
      const result = await updateTicket(formData);
      
      expect(result.success).toBe(true);
    });

    it('valida ID requerido', async () => {
      const formData = new FormData();
      formData.append('title', 'Updated Title');
      
      const result = await updateTicket(formData);
      
      expect(result.success).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors.id).toBeDefined();
    });
  });

  describe('deleteTicket', () => {
    it('elimina un ticket exitosamente', async () => {
      const result = await deleteTicket('ticket-123');
      
      expect(result.success).toBe(true);
    });
  });
});
```

#### **Pruebas de API Routes:**
```tsx
// src/app/api/tickets/__tests__/route.test.ts
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    ticket: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

describe('Tickets API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tickets', () => {
    it('retorna lista de tickets con paginación', async () => {
      const mockTickets = [
        { id: '1', title: 'Ticket 1', status: 'OPEN' },
        { id: '2', title: 'Ticket 2', status: 'IN_PROGRESS' },
      ];

      (prisma.ticket.findMany as jest.Mock).mockResolvedValue(mockTickets);
      (prisma.ticket.count as jest.Mock).mockResolvedValue(2);

      const request = new NextRequest('http://localhost:3000/api/tickets?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tickets).toEqual(mockTickets);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
    });

    it('aplica filtros correctamente', async () => {
      const mockTickets = [{ id: '1', title: 'Bug Report', status: 'OPEN' }];

      (prisma.ticket.findMany as jest.Mock).mockResolvedValue(mockTickets);
      (prisma.ticket.count as jest.Mock).mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/tickets?status=OPEN&priority=HIGH');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'OPEN',
            priority: 'HIGH',
          }),
        })
      );
    });
  });

  describe('POST /api/tickets', () => {
    it('crea un nuevo ticket exitosamente', async () => {
      const mockTicket = {
        id: 'new-ticket-123',
        title: 'New Ticket',
        description: 'Description',
        priority: 'MEDIUM',
        status: 'OPEN',
      };

      (prisma.ticket.create as jest.Mock).mockResolvedValue(mockTicket);

      const request = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Ticket',
          description: 'Description',
          priority: 'MEDIUM',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.ticket).toEqual(mockTicket);
    });

    it('valida datos requeridos', async () => {
      const request = new NextRequest('http://localhost:3000/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          title: '',
          description: 'Short',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
    });
  });
});
```

---

## 🚀 **CAPÍTULO 18: DESPLIEGUE EN LA NUBE**

### 🟢 **NIVEL BÁSICO: Despliegue en Vercel**

#### **Configuración de Vercel:**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### **Variables de Entorno en Vercel:**
```bash
# Comandos para configurar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Desplegar
vercel --prod
```

#### **Scripts de Despliegue:**
```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    "deploy:staging": "vercel --env staging"
  }
}
```

---

### 🟡 **NIVEL INTERMEDIO: Despliegue en AWS con Docker**

#### **Dockerfile para Producción:**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos estáticos
COPY --from=builder /app/public ./public

# Establecer el directorio correcto para el usuario nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar archivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### **Docker Compose para Desarrollo:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### **Scripts de Despliegue en AWS:**
```bash
#!/bin/bash
# deploy-aws.sh

# Variables de configuración
ECR_REPOSITORY="myapp"
ECR_TAG="latest"
ECR_REGION="us-east-1"
CLUSTER_NAME="myapp-cluster"
SERVICE_NAME="myapp-service"

echo "🚀 Iniciando despliegue en AWS..."

# 1. Autenticarse con ECR
echo "📝 Autenticando con ECR..."
aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$ECR_REGION.amazonaws.com

# 2. Construir imagen Docker
echo "🔨 Construyendo imagen Docker..."
docker build -t $ECR_REPOSITORY:$ECR_TAG .

# 3. Etiquetar imagen para ECR
echo "🏷️ Etiquetando imagen..."
docker tag $ECR_REPOSITORY:$ECR_TAG $AWS_ACCOUNT_ID.dkr.ecr.$ECR_REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_TAG

# 4. Subir imagen a ECR
echo "⬆️ Subiendo imagen a ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$ECR_REGION.amazonaws.com/$ECR_REPOSITORY:$ECR_TAG

# 5. Actualizar servicio ECS
echo "🔄 Actualizando servicio ECS..."
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $ECR_REGION

# 6. Esperar a que el despliegue se complete
echo "⏳ Esperando a que el despliegue se complete..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $ECR_REGION

echo "✅ Despliegue completado exitosamente!"
```

---

### 🔴 **NIVEL AVANZADO: Despliegue Multi-Cloud con CI/CD**

#### **GitHub Actions para CI/CD:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup Prisma
        run: npx prisma generate
      
      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-vercel:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-aws:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster ${{ secrets.ECS_CLUSTER_NAME }} \
            --service ${{ secrets.ECS_SERVICE_NAME }} \
            --force-new-deployment
      
      - name: Wait for deployment to complete
        run: |
          aws ecs wait services-stable \
            --cluster ${{ secrets.ECS_CLUSTER_NAME }} \
            --services ${{ secrets.ECS_SERVICE_NAME }}

  deploy-azure:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Azure Container Instances
        uses: azure/aci-deploy@v1
        with:
          resource-group: ${{ secrets.AZURE_RESOURCE_GROUP }}
          dns-name-label: ${{ secrets.AZURE_DNS_NAME_LABEL }}
          image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          registry-login-server: ${{ env.REGISTRY }}
          registry-username: ${{ github.actor }}
          registry-password: ${{ secrets.GITHUB_TOKEN }}
          name: myapp-aci
          location: ${{ secrets.AZURE_LOCATION }}
          cpu: 1
          memory: 1.5
          ports: 3000
```

#### **Terraform para Infraestructura como Código:**
```hcl
# infrastructure/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "myapp-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr
  
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs
  
  enable_nat_gateway = true
  single_nat_gateway = true
  
  tags = var.common_tags
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = var.common_tags
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.app_cpu
  memory                   = var.app_memory
  
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn
  
  container_definitions = jsonencode([
    {
      name  = "${var.project_name}-container"
      image = "${var.ecr_repository_url}:latest"
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "DATABASE_URL"
          value = var.database_url
        }
      ]
      
      secrets = [
        {
          name      = "NEXTAUTH_SECRET"
          valueFrom = aws_secretsmanager_secret.nextauth_secret.arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.app.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
  
  tags = var.common_tags
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${var.project_name}-container"
    container_port   = 3000
  }
  
  depends_on = [aws_lb_listener.app]
  
  tags = var.common_tags
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
  
  tags = var.common_tags
}

# ALB Target Group
resource "aws_lb_target_group" "app" {
  name        = "${var.project_name}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 30
    interval            = 60
    path                = "/api/health"
    port                = "traffic-port"
  }
  
  tags = var.common_tags
}

# ALB Listener
resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "${var.project_name}-alb-"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = var.common_tags
}

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.project_name}-ecs-tasks-"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = var.common_tags
}

# RDS Database
resource "aws_db_instance" "app" {
  identifier = "${var.project_name}-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.app.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  deletion_protection = true
  
  tags = var.common_tags
}

# RDS Subnet Group
resource "aws_db_subnet_group" "app" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets
  
  tags = var.common_tags
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-rds-"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
  
  tags = var.common_tags
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 30
  
  tags = var.common_tags
}

# Secrets Manager
resource "aws_secretsmanager_secret" "nextauth_secret" {
  name = "${var.project_name}/nextauth-secret"
  
  tags = var.common_tags
}

resource "aws_secretsmanager_secret_version" "nextauth_secret" {
  secret_id     = aws_secretsmanager_secret.nextauth_secret.id
  secret_string = var.nextauth_secret
}

# IAM Roles
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.project_name}-ecs-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = var.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.project_name}-ecs-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = var.common_tags
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "myapp"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "app_cpu" {
  description = "App CPU units"
  type        = number
  default     = 256
}

variable "app_memory" {
  description = "App memory in MiB"
  type        = number
  default     = 512
}

variable "app_desired_count" {
  description = "App desired count"
  type        = number
  default     = 2
}

variable "ecr_repository_url" {
  description = "ECR repository URL"
  type        = string
}

variable "database_url" {
  description = "Database connection string"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max allocated storage in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "myapp"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth secret"
  type        = string
  sensitive   = true
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "myapp"
    ManagedBy   = "Terraform"
  }
}

# Outputs
output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.app.dns_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.app.name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.app.endpoint
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Configura Jest y escribe pruebas para un componente Button simple.

### **Ejercicio Intermedio:**
Implementa pruebas para un hook personalizado y un Server Action.

### **Ejercicio Avanzado:**
Configura un pipeline de CI/CD completo con despliegue automático en múltiples entornos.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta quinta parte hemos cubierto:
- ✅ Configuración de Jest y React Testing Library
- ✅ Pruebas de componentes, hooks y Server Actions
- ✅ Despliegue en Vercel, AWS y Azure
- ✅ Docker y contenedores
- ✅ CI/CD con GitHub Actions
- ✅ Infraestructura como código con Terraform

¡Has completado el libro completo sobre Next.js 15 y React.js 19! Ahora tienes todos los conocimientos necesarios para construir aplicaciones web full-stack modernas y escalables.
