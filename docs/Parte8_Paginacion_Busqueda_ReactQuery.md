# PARTE VIII: PAGINACIÓN, BÚSQUEDA AVANZADA Y REACT QUERY

## 📄 **CAPÍTULO 15: PAGINACIÓN Y BÚSQUEDA**

### 🟢 **NIVEL BÁSICO: Paginación Offset-Based**

#### **Componente de Paginación Básica:**
```tsx
// src/components/pagination/BasicPagination.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BasicPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function BasicPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: BasicPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => updatePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            {/* Números de página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Mostrar solo algunas páginas para evitar demasiados botones
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => updatePage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      page === currentPage
                        ? 'bg-blue-600 text-white focus:ring-blue-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span
                    key={page}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => updatePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
```

#### **Hook de Paginación:**
```tsx
// src/hooks/usePagination.ts
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface UsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100,
  } = options;

  // Obtener estado actual de la paginación
  const pagination = useMemo<PaginationState>(() => {
    const page = Number(searchParams.get('page')) || defaultPage;
    const limit = Math.min(
      Number(searchParams.get('limit')) || defaultLimit,
      maxLimit
    );
    const totalItems = Number(searchParams.get('totalItems')) || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page: Math.max(1, Math.min(page, totalPages || 1)),
      limit,
      totalItems,
      totalPages: Math.max(1, totalPages),
    };
  }, [searchParams, defaultPage, defaultLimit, maxLimit]);

  // Actualizar página
  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', Math.max(1, page).toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Actualizar límite de elementos por página
  const setLimit = useCallback((limit: number) => {
    const params = new URLSearchParams(searchParams);
    const newLimit = Math.min(Math.max(1, limit), maxLimit);
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Resetear a la primera página
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, maxLimit]);

  // Actualizar total de elementos
  const setTotalItems = useCallback((totalItems: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('totalItems', totalItems.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Navegar a la página anterior
  const goToPreviousPage = useCallback(() => {
    if (pagination.page > 1) {
      setPage(pagination.page - 1);
    }
  }, [pagination.page, setPage]);

  // Navegar a la página siguiente
  const goToNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      setPage(pagination.page + 1);
    }
  }, [pagination.page, pagination.totalPages, setPage]);

  // Ir a la primera página
  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  // Ir a la última página
  const goToLastPage = useCallback(() => {
    setPage(pagination.totalPages);
  }, [pagination.totalPages, setPage]);

  // Calcular información de la página actual
  const pageInfo = useMemo(() => {
    const startItem = (pagination.page - 1) * pagination.limit + 1;
    const endItem = Math.min(pagination.page * pagination.limit, pagination.totalItems);
    
    return {
      startItem,
      endItem,
      hasPreviousPage: pagination.page > 1,
      hasNextPage: pagination.page < pagination.totalPages,
      isFirstPage: pagination.page === 1,
      isLastPage: pagination.page === pagination.totalPages,
    };
  }, [pagination]);

  return {
    ...pagination,
    ...pageInfo,
    setPage,
    setLimit,
    setTotalItems,
    goToPreviousPage,
    goToNextPage,
    goToFirstPage,
    goToLastPage,
  };
}
```

---

### 🟡 **NIVEL INTERMEDIO: Búsqueda y Filtros Avanzados**

#### **Componente de Búsqueda con Filtros:**
```tsx
// src/components/search/AdvancedSearch.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

interface SearchFilters {
  query: string;
  status: string;
  priority: string;
  category: string;
  assignee: string;
  dateFrom: string;
  dateTo: string;
  tags: string[];
}

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export default function AdvancedSearch({
  onSearch,
  placeholder = 'Buscar tickets...',
  showFilters = true,
}: AdvancedSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: searchParams.get('category') || '',
    assignee: searchParams.get('assignee') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    tags: searchParams.get('tags')?.split(',') || [],
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Función debounced para actualizar la búsqueda
  const debouncedSearch = useCallback(
    debounce((newFilters: SearchFilters) => {
      updateURL(newFilters);
      onSearch?.(newFilters);
    }, 300),
    [onSearch]
  );

  // Actualizar URL con los filtros
  const updateURL = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams(searchParams);
    
    // Limpiar parámetros existentes
    ['q', 'status', 'priority', 'category', 'assignee', 'dateFrom', 'dateTo', 'tags'].forEach(key => {
      params.delete(key);
    });

    // Agregar nuevos filtros
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.priority) params.set('priority', newFilters.priority);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.assignee) params.set('assignee', newFilters.assignee);
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo);
    if (newFilters.tags.length > 0) params.set('tags', newFilters.tags.join(','));

    // Resetear página a 1
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Manejar cambios en los filtros
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'query') {
      debouncedSearch(newFilters);
    }
  }, [filters, debouncedSearch]);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    setIsSearching(true);
    updateURL(filters);
    onSearch?.(filters);
    
    setTimeout(() => setIsSearching(false), 500);
  }, [filters, updateURL, onSearch]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: '',
      status: '',
      priority: '',
      category: '',
      assignee: '',
      dateFrom: '',
      dateTo: '',
      tags: [],
    };
    
    setFilters(clearedFilters);
    updateURL(clearedFilters);
    onSearch?.(clearedFilters);
  }, [updateURL, onSearch]);

  // Sincronizar con URL al cargar
  useEffect(() => {
    const urlFilters: SearchFilters = {
      query: searchParams.get('q') || '',
      status: searchParams.get('status') || '',
      priority: searchParams.get('priority') || '',
      category: searchParams.get('category') || '',
      assignee: searchParams.get('assignee') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      tags: searchParams.get('tags')?.split(',') || [],
    };
    
    setFilters(urlFilters);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
        {filters.query && (
          <button
            onClick={() => handleFilterChange('query', '')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Botón para mostrar/ocultar filtros avanzados */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </button>

          {(filters.status || filters.priority || filters.category || filters.assignee || filters.dateFrom || filters.dateTo || filters.tags.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Filtros avanzados */}
      {showFilters && showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>

            {/* Filtro de prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Filtro de categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Todas las categorías</option>
                <option value="bug">Bug</option>
                <option value="feature">Nueva Funcionalidad</option>
                <option value="improvement">Mejora</option>
                <option value="support">Soporte</option>
              </select>
            </div>

            {/* Filtro de asignado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asignado a
              </label>
              <input
                type="text"
                value={filters.assignee}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nombre del usuario"
              />
            </div>

            {/* Filtro de fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Filtro de fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Botón de aplicar filtros */}
          <div className="flex justify-end">
            <button
              onClick={applyFilters}
              disabled={isSearching}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 🔴 **NIVEL AVANZADO: Paginación Cursor-Based y Infinite Scroll**

#### **Hook de Paginación Cursor-Based:**
```tsx
// src/hooks/useCursorPagination.ts
'use client';

import { useState, useCallback, useRef } from 'react';

interface CursorPaginationState<T> {
  items: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseCursorPaginationOptions<T> {
  initialItems?: T[];
  getCursor: (item: T) => string;
  fetchItems: (cursor: string | null, direction: 'forward' | 'backward', limit: number) => Promise<{
    items: T[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  }>;
  limit?: number;
}

export function useCursorPagination<T>({
  initialItems = [],
  getCursor,
  fetchItems,
  limit = 10,
}: UseCursorPaginationOptions<T>) {
  const [state, setState] = useState<CursorPaginationState<T>>({
    items: initialItems,
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
    isLoading: false,
    error: null,
  });

  const cursorHistory = useRef<string[]>([]);
  const currentIndex = useRef<number>(-1);

  // Cargar siguiente página
  const loadNextPage = useCallback(async () => {
    if (state.isLoading || !state.hasNextPage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await fetchItems(state.endCursor, 'forward', limit);
      
      setState(prev => ({
        ...prev,
        items: [...prev.items, ...result.items],
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
        startCursor: result.startCursor,
        endCursor: result.endCursor,
        isLoading: false,
      }));

      // Actualizar historial de cursores
      if (state.endCursor) {
        cursorHistory.current.push(state.endCursor);
        currentIndex.current++;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al cargar la página',
      }));
    }
  }, [state.isLoading, state.hasNextPage, state.endCursor, fetchItems, limit]);

  // Cargar página anterior
  const loadPreviousPage = useCallback(async () => {
    if (state.isLoading || !state.hasPreviousPage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await fetchItems(state.startCursor, 'backward', limit);
      
      setState(prev => ({
        ...prev,
        items: [...result.items, ...prev.items],
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
        startCursor: result.startCursor,
        endCursor: result.endCursor,
        isLoading: false,
      }));

      // Actualizar historial de cursores
      if (state.startCursor) {
        cursorHistory.current.unshift(state.startCursor);
        currentIndex.current++;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al cargar la página',
      }));
    }
  }, [state.isLoading, state.hasPreviousPage, state.startCursor, fetchItems, limit]);

  // Ir a una página específica usando el historial
  const goToPage = useCallback(async (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= cursorHistory.current.length) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const cursor = cursorHistory.current[pageIndex];
      const result = await fetchItems(cursor, 'forward', limit);
      
      setState(prev => ({
        ...prev,
        items: result.items,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
        startCursor: result.startCursor,
        endCursor: result.endCursor,
        isLoading: false,
      }));

      currentIndex.current = pageIndex;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al cargar la página',
      }));
    }
  }, [fetchItems, limit]);

  // Refrescar datos
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await fetchItems(null, 'forward', limit);
      
      setState(prev => ({
        ...prev,
        items: result.items,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
        startCursor: result.startCursor,
        endCursor: result.endCursor,
        isLoading: false,
      }));

      // Limpiar historial
      cursorHistory.current = [];
      currentIndex.current = -1;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al refrescar',
      }));
    }
  }, [fetchItems, limit]);

  // Agregar item al inicio (útil para listas en tiempo real)
  const prependItem = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      items: [item, ...prev.items],
    }));
  }, []);

  // Agregar item al final
  const appendItem = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  // Actualizar item existente
  const updateItem = useCallback((predicate: (item: T) => boolean, updater: (item: T) => T) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => predicate(item) ? updater(item) : item),
    }));
  }, []);

  // Eliminar item
  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => !predicate(item)),
    }));
  }, []);

  return {
    ...state,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    refresh,
    prependItem,
    appendItem,
    updateItem,
    removeItem,
    currentPageIndex: currentIndex.current,
    totalPages: cursorHistory.current.length,
  };
}
```

---

## 🔄 **CAPÍTULO 16: REACT QUERY (TANSTACK QUERY)**

### 🟢 **NIVEL BÁSICO: Configuración y Hooks Básicos**

#### **Configuración del QueryClient:**
```tsx
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') {
  queryClient.setDefaultOptions({
    queries: {
      staleTime: 0, // Siempre considerar datos como stale en desarrollo
      gcTime: 5 * 60 * 1000, // 5 minutos
    },
  });
}
```

#### **Provider de React Query:**
```tsx
// src/app/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

#### **Hook Básico para Tickets:**
```tsx
// src/hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prisma } from '@/lib/prisma';

// Tipos
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTicketData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assigneeId?: string;
}

interface UpdateTicketData extends Partial<CreateTicketData> {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
}

// API functions
async function fetchTickets(page: number = 1, limit: number = 10) {
  const response = await fetch(`/api/tickets?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Error al cargar tickets');
  }
  return response.json();
}

async function fetchTicket(id: string) {
  const response = await fetch(`/api/tickets/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar el ticket');
  }
  return response.json();
}

async function createTicket(data: CreateTicketData) {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear el ticket');
  }
  
  return response.json();
}

async function updateTicket(id: string, data: UpdateTicketData) {
  const response = await fetch(`/api/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar el ticket');
  }
  
  return response.json();
}

async function deleteTicket(id: string) {
  const response = await fetch(`/api/tickets/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar el ticket');
  }
  
  return response.json();
}

// Hooks
export function useTickets(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['tickets', page, limit],
    queryFn: () => fetchTickets(page, limit),
    keepPreviousData: true, // Mantener datos anteriores mientras se cargan los nuevos
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => fetchTicket(id),
    enabled: !!id, // Solo ejecutar si hay un ID
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      // Invalidar y refetch la lista de tickets
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      
      // Agregar el nuevo ticket a la caché
      queryClient.setQueryData(['tickets'], (oldData: any) => {
        if (oldData?.tickets) {
          return {
            ...oldData,
            tickets: [newTicket, ...oldData.tickets],
          };
        }
        return oldData;
      });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketData }) =>
      updateTicket(id, data),
    onSuccess: (updatedTicket, { id }) => {
      // Actualizar el ticket en la caché
      queryClient.setQueryData(['ticket', id], updatedTicket);
      
      // Invalidar listas de tickets
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: (_, id) => {
      // Remover el ticket de la caché
      queryClient.removeQueries({ queryKey: ['ticket', id] });
      
      // Invalidar listas de tickets
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
```

---

### 🟡 **NIVEL INTERMEDIO: Infinite Queries y Optimistic Updates**

#### **Infinite Query para Tickets:**
```tsx
// src/hooks/useInfiniteTickets.ts
import { useInfiniteQuery } from '@tanstack/react-query';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: Date;
}

interface TicketsResponse {
  tickets: Ticket[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

async function fetchTicketsPage({ pageParam = null }: { pageParam: string | null }) {
  const url = pageParam 
    ? `/api/tickets?cursor=${pageParam}&limit=10`
    : '/api/tickets?limit=10';
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al cargar tickets');
  }
  
  return response.json() as Promise<TicketsResponse>;
}

export function useInfiniteTickets() {
  return useInfiniteQuery({
    queryKey: ['tickets', 'infinite'],
    queryFn: fetchTicketsPage,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}
```

#### **Componente con Infinite Scroll:**
```tsx
// src/components/tickets/TicketsInfiniteList.tsx
'use client';

import { useInfiniteTickets } from '@/hooks/useInfiniteTickets';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import TicketCard from './TicketCard';

export default function TicketsInfiniteList() {
  const { ref, inView } = useInView();
  
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTickets();

  // Cargar siguiente página cuando el elemento esté visible
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar tickets: {error.message}</p>
      </div>
    );
  }

  const allTickets = data?.pages.flatMap(page => page.tickets) || [];

  return (
    <div className="space-y-4">
      {allTickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
      
      {/* Trigger para cargar más */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Cargar más
            </button>
          )}
        </div>
      )}
      
      {/* Indicador de fin de lista */}
      {!hasNextPage && allTickets.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No hay más tickets para mostrar
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 **EJERCICIOS PRÁCTICOS**

### **Ejercicio Básico:**
Implementa paginación básica con botones de anterior/siguiente.

### **Ejercicio Intermedio:**
Crea un sistema de búsqueda con filtros múltiples y debounce.

### **Ejercicio Avanzado:**
Implementa infinite scroll con React Query y paginación cursor-based.

---

## 📝 **RESUMEN DEL CAPÍTULO**

En esta octava parte hemos cubierto:
- ✅ Paginación offset-based y cursor-based
- ✅ Sistema de búsqueda avanzada con filtros
- ✅ Hooks de paginación personalizados
- ✅ React Query (TanStack Query) básico
- ✅ Infinite queries y infinite scroll
- ✅ Optimistic updates y cache management

En el siguiente capítulo aprenderemos sobre manejo de errores y testing avanzado.
