# Ejemplos Prácticos de Mesio - Casos de Uso Reales

## 1. Ejemplos de Componentes Reutilizables

### 1.1 Botón Personalizado con Estados

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  disabled = false,
  onClick,
  children
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const variantStyles = {
    primary: {
      backgroundColor: constants.colors.redColor,
      color: constants.colors.whiteColor,
      '&:hover': { backgroundColor: '#e65a3d' }
    },
    secondary: {
      backgroundColor: constants.colors.seaGreenColor,
      color: constants.colors.whiteColor,
      '&:hover': { backgroundColor: '#45a049' }
    },
    outline: {
      backgroundColor: 'transparent',
      color: constants.colors.mainDarkColor,
      border: `2px solid ${constants.colors.mainDarkColor}`,
      '&:hover': { backgroundColor: constants.colors.mainDarkColor, color: 'white' }
    }
  };

  const sizeStyles = {
    small: { padding: '8px 16px', fontSize: 14 },
    medium: { padding: '12px 24px', fontSize: 16 },
    large: { padding: '16px 32px', fontSize: 18 }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: disabled ? 0.6 : 1,
      }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <components.Spinner size="small" />}
      {children}
    </button>
  );
};

// Uso en diferentes contextos
const AddToCartButton = ({ dish, inCart }) => (
  <Button
    variant={inCart ? 'secondary' : 'primary'}
    size="medium"
    onClick={() => dispatch(cartActions.addToCart(dish))}
  >
    {inCart ? 'En Carrito' : 'Agregar al Carrito'}
  </Button>
);

const CheckoutButton = ({ total, onCheckout }) => (
  <Button
    variant="primary"
    size="large"
    onClick={onCheckout}
    disabled={total === 0}
  >
    Proceder al Pago - ${total}
  </Button>
);
```

### 1.2 Modal Reutilizable

```typescript
// src/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium'
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    small: { maxWidth: 400 },
    medium: { maxWidth: 600 },
    large: { maxWidth: 800 }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={sizeStyles[size]}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button onClick={onClose} className="close-button">
              <svg.CloseSvg />
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Uso para diferentes tipos de modales
const CartModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Carrito de Compras" size="medium">
    <CartItems />
    <CartSummary />
  </Modal>
);

const DishDetailModal = ({ isOpen, onClose, dish }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="large">
    <DishDetail dish={dish} />
    <DishActions dish={dish} />
  </Modal>
);
```

## 2. Hooks Personalizados Avanzados

### 2.1 Hook para Gestión de Carrito

```typescript
// src/hooks/useCart.ts
export const useCart = () => {
  const dispatch = useAppDispatch();
  const { list, total, subtotal, discount, delivery } = useAppSelector(state => state.cart);

  const addToCart = useCallback((dish: DishType) => {
    dispatch(cartActions.addToCart(dish));
  }, [dispatch]);

  const removeFromCart = useCallback((dish: DishType) => {
    dispatch(cartActions.removeFromCart(dish));
  }, [dispatch]);

  const updateQuantity = useCallback((dishId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart({ id: dishId } as DishType);
    } else {
      // Lógica para actualizar cantidad
      const item = list.find(item => item.id === dishId);
      if (item) {
        const newItem = { ...item, quantity };
        dispatch(cartActions.updateQuantity({ dishId, quantity }));
      }
    }
  }, [dispatch, list, removeFromCart]);

  const clearCart = useCallback(() => {
    dispatch(cartActions.resetCart());
  }, [dispatch]);

  const applyPromoCode = useCallback((code: string) => {
    // Lógica para aplicar código promocional
    dispatch(cartActions.setPromoCode(code));
  }, [dispatch]);

  const calculateSavings = useMemo(() => {
    return subtotal - total;
  }, [subtotal, total]);

  const isCartEmpty = useMemo(() => list.length === 0, [list.length]);
  
  const itemCount = useMemo(() => {
    return list.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [list]);

  return {
    // Estado
    items: list,
    total,
    subtotal,
    discount,
    delivery,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    
    // Computados
    isCartEmpty,
    itemCount,
    savings: calculateSavings,
    
    // Utilidades
    hasItems: !isCartEmpty,
    canCheckout: !isCartEmpty && total > 0,
  };
};

// Uso en componentes
const CartSummary = () => {
  const { 
    total, 
    subtotal, 
    savings, 
    delivery, 
    canCheckout 
  } = useCart();

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {savings > 0 && (
        <div className="summary-row savings">
          <span>Ahorro:</span>
          <span>-${savings.toFixed(2)}</span>
        </div>
      )}
      <div className="summary-row">
        <span>Entrega:</span>
        <span>${delivery.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <Button
        variant="primary"
        size="large"
        disabled={!canCheckout}
        onClick={() => router.push('/checkout')}
      >
        Proceder al Pago
      </Button>
    </div>
  );
};
```

### 2.2 Hook para Gestión de Wishlist

```typescript
// src/hooks/useWishlist.ts
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector(state => state.wishlist);

  const addToWishlist = useCallback((dish: DishType) => {
    dispatch(wishlistActions.addToWishlist(dish));
  }, [dispatch]);

  const removeFromWishlist = useCallback((dish: DishType) => {
    dispatch(wishlistActions.removeFromWishlist(dish));
  }, [dispatch]);

  const isInWishlist = useCallback((dishId: number) => {
    return list.some(item => item.id === dishId);
  }, [list]);

  const toggleWishlist = useCallback((dish: DishType) => {
    if (isInWishlist(dish.id)) {
      removeFromWishlist(dish);
    } else {
      addToWishlist(dish);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    dispatch(wishlistActions.clearWishlist());
  }, [dispatch]);

  const wishlistCount = useMemo(() => list.length, [list.length]);
  const isEmpty = useMemo(() => list.length === 0, [list.length]);

  return {
    items: list,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    count: wishlistCount,
    isEmpty,
  };
};

// Uso en componentes
const WishlistButton = ({ dish }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(dish.id);

  return (
    <button
      className={`wishlist-button ${inWishlist ? 'active' : ''}`}
      onClick={() => toggleWishlist(dish)}
      aria-label={inWishlist ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <svg.WishlistAddSvg 
        color={inWishlist ? constants.colors.redColor : '#BDBDBD'} 
      />
    </button>
  );
};
```

### 2.3 Hook para Gestión de Formularios

```typescript
// src/hooks/useForm.ts
interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

interface FormConfig<T> {
  initialValues: T;
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>(config: FormConfig<T>) => {
  const [values, setValues] = useState<T>(config.initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Marcar como tocado
    setTouched(prev => ({ ...prev, [field]: true }));
  }, [errors]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const validate = useCallback(() => {
    if (!config.validationSchema) return true;
    
    const validationErrors = config.validationSchema(values);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  }, [values, config.validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await config.onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, config.onSubmit]);

  const reset = useCallback(() => {
    setValues(config.initialValues);
    setErrors({});
    setTouched({});
  }, [config.initialValues]);

  const getFieldProps = useCallback((field: keyof T) => ({
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(field, e.target.value),
    onBlur: () => setTouched(prev => ({ ...prev, [field]: true })),
    error: touched[field] ? errors[field] : null,
    hasError: Boolean(touched[field] && errors[field]),
  }), [values, errors, touched, setValue]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldError,
    validate,
    handleSubmit,
    reset,
    getFieldProps,
  };
};

// Uso en formularios
const LoginForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: (values) => {
      const errors: any = {};
      
      if (!values.email) {
        errors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'El email no es válido';
      }
      
      if (!values.password) {
        errors.password = 'La contraseña es requerida';
      } else if (values.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      // Lógica de login
      await loginUser(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div className="form-field">
        <input
          type="email"
          placeholder="Email"
          {...form.getFieldProps('email')}
        />
        {form.getFieldProps('email').hasError && (
          <span className="error">{form.getFieldProps('email').error}</span>
        )}
      </div>
      
      <div className="form-field">
        <input
          type="password"
          placeholder="Contraseña"
          {...form.getFieldProps('password')}
        />
        {form.getFieldProps('password').hasError && (
          <span className="error">{form.getFieldProps('password').error}</span>
        )}
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={form.isSubmitting}
        disabled={form.isSubmitting}
      >
        {form.isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
```

## 3. Patrones de Renderizado Condicional

### 3.1 Renderizado de Listas con Estados Vacíos

```typescript
// src/components/ContentList.tsx
interface ContentListProps<T> {
  data: T[];
  isLoading: boolean;
  isEmpty: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty: () => React.ReactNode;
  renderLoading: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  error?: Error | null;
}

export const ContentList = <T,>({
  data,
  isLoading,
  isEmpty,
  renderItem,
  renderEmpty,
  renderLoading,
  renderError,
  error
}: ContentListProps<T>) => {
  if (error && renderError) {
    return renderError(error);
  }

  if (isLoading) {
    return renderLoading();
  }

  if (isEmpty) {
    return renderEmpty();
  }

  return (
    <div className="content-list">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
};

// Uso para diferentes tipos de listas
const PopularDishes = () => {
  const { data, isLoading } = useGetDishes();
  const popularDishes = data.filter(dish => dish.isPopular);

  return (
    <ContentList
      data={popularDishes}
      isLoading={isLoading}
      isEmpty={popularDishes.length === 0}
      renderItem={(dish) => <PopularItem key={dish.id} dish={dish} />}
      renderEmpty={() => (
        <div className="empty-state">
          <svg.EmptyDishesSvg />
          <h3>No hay platos populares</h3>
          <p>Pronto agregaremos nuevos platos populares</p>
        </div>
      )}
      renderLoading={() => (
        <div className="loading-state">
          <components.Spinner size="large" />
          <p>Cargando platos populares...</p>
        </div>
      )}
    />
  );
};

const WishlistPage = () => {
  const { items, isEmpty } = useWishlist();

  return (
    <ContentList
      data={items}
      isLoading={false}
      isEmpty={isEmpty}
      renderItem={(dish) => <WishlistItem key={dish.id} dish={dish} />}
      renderEmpty={() => (
        <div className="empty-wishlist">
          <svg.EmptyWishlistSvg />
          <h3>Tu wishlist está vacía</h3>
          <p>Agrega platos que te gusten para verlos aquí</p>
          <Button
            variant="primary"
            onClick={() => router.push('/shop')}
          >
            Explorar Platos
          </Button>
        </div>
      )}
      renderLoading={() => null}
    />
  );
};
```

### 3.2 Componente de Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Enviar error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <div className="error-boundary">
    <svg.ErrorSvg />
    <h2>Algo salió mal</h2>
    <p>Ha ocurrido un error inesperado. Por favor, intenta de nuevo.</p>
    <details>
      <summary>Detalles del error</summary>
      <pre>{error.message}</pre>
    </details>
    <div className="error-actions">
      <Button variant="primary" onClick={resetError}>
        Intentar de Nuevo
      </Button>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Recargar Página
      </Button>
    </div>
  </div>
);

// Uso en la aplicación
const App = () => (
  <ErrorBoundary>
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          {/* Más rutas */}
        </Routes>
      </Router>
    </StoreProvider>
  </ErrorBoundary>
);
```

## 4. Optimizaciones de Performance

### 4.1 Memoización de Componentes

```typescript
// src/components/DishGrid.tsx
interface DishGridProps {
  dishes: DishType[];
  onDishClick: (dish: DishType) => void;
}

export const DishGrid = React.memo<DishGridProps>(({ dishes, onDishClick }) => {
  const renderDish = useCallback((dish: DishType) => (
    <DishCard
      key={dish.id}
      dish={dish}
      onClick={() => onDishClick(dish)}
    />
  ), [onDishClick]);

  return (
    <div className="dish-grid">
      {dishes.map(renderDish)}
    </div>
  );
});

// Componente de tarjeta de plato optimizado
const DishCard = React.memo<{ dish: DishType; onClick: () => void }>(({ 
  dish, 
  onClick 
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(dish);
  }, [toggleWishlist, dish]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish);
  }, [addToCart, dish]);

  return (
    <div className="dish-card" onClick={onClick}>
      <img src={dish.image} alt={dish.name} loading="lazy" />
      <div className="dish-info">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="dish-price">${dish.price}</div>
      </div>
      <div className="dish-actions">
        <button onClick={handleWishlistToggle}>
          <svg.WishlistAddSvg 
            color={isInWishlist(dish.id) ? 'red' : 'gray'} 
          />
        </button>
        <button onClick={handleAddToCart}>
          <svg.AddToCartSvg />
        </button>
      </div>
    </div>
  );
});
```

### 4.2 Lazy Loading de Componentes

```typescript
// src/app/lazy.tsx
import { lazy, Suspense } from 'react';

// Lazy load de páginas
const Home = lazy(() => import('./home/Home').then(module => ({ default: module.Home })));
const Shop = lazy(() => import('./shop/Shop').then(module => ({ default: module.Shop })));
const Cart = lazy(() => import('./cart/Cart').then(module => ({ default: module.Cart })));
const Profile = lazy(() => import('./profile/Profile').then(module => ({ default: module.Profile })));

// Componente de loading
const PageLoader = () => (
  <div className="page-loader">
    <components.Spinner size="large" />
    <p>Cargando página...</p>
  </div>
);

// Uso en rutas
const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </Suspense>
);
```

## 5. Casos de Uso Específicos

### 5.1 Sistema de Búsqueda y Filtros

```typescript
// src/hooks/useSearchAndFilters.ts
interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  cookingTime?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export const useSearchAndFilters = (dishes: DishType[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'cookingTime'>('name');

  const filteredAndSortedDishes = useMemo(() => {
    let result = [...dishes];

    // Aplicar búsqueda por texto
    if (searchTerm) {
      result = result.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.category) {
      result = result.filter(dish => dish.category === filters.category);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(dish => dish.price >= min && dish.price <= max);
    }

    if (filters.rating) {
      result = result.filter(dish => dish.rating >= filters.rating!);
    }

    if (filters.cookingTime) {
      result = result.filter(dish => dish.cookingTime <= filters.cookingTime!);
    }

    if (filters.isVegetarian !== undefined) {
      result = result.filter(dish => dish.isVegetarian === filters.isVegetarian);
    }

    if (filters.isSpicy !== undefined) {
      result = result.filter(dish => dish.isSpicy === filters.isSpicy);
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'cookingTime':
          return a.cookingTime - b.cookingTime;
        default:
          return 0;
      }
    });

    return result;
  }, [dishes, searchTerm, filters, sortBy]);

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const getFilterStats = useMemo(() => {
    const total = dishes.length;
    const filtered = filteredAndSortedDishes.length;
    const appliedFilters = Object.keys(filters).filter(key => filters[key as keyof FilterOptions] !== undefined);

    return {
      total,
      filtered,
      appliedFilters: appliedFilters.length,
      hasActiveFilters: appliedFilters.length > 0 || searchTerm.length > 0,
    };
  }, [dishes, filteredAndSortedDishes, filters, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    filteredDishes: filteredAndSortedDishes,
    filterStats: getFilterStats,
  };
};

// Uso en componente de búsqueda
const SearchAndFilters = () => {
  const { data: dishes } = useGetDishes();
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    filteredDishes,
    filterStats
  } = useSearchAndFilters(dishes);

  return (
    <div className="search-and-filters">
      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar platos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg.SearchSvg />
      </div>

      {/* Filtros */}
      <div className="filters">
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || undefined)}
        >
          <option value="">Todas las categorías</option>
          <option value="pizza">Pizza</option>
          <option value="hamburguesas">Hamburguesas</option>
          <option value="sushi">Sushi</option>
        </select>

        <select
          value={filters.rating || ''}
          onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Cualquier rating</option>
          <option value="4">4+ estrellas</option>
          <option value="3">3+ estrellas</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="name">Ordenar por nombre</option>
          <option value="price">Ordenar por precio</option>
          <option value="rating">Ordenar por rating</option>
          <option value="cookingTime">Ordenar por tiempo de cocción</option>
        </select>
      </div>

      {/* Estadísticas */}
      <div className="filter-stats">
        <span>
          Mostrando {filterStats.filtered} de {filterStats.total} platos
        </span>
        {filterStats.hasActiveFilters && (
          <Button variant="outline" size="small" onClick={clearFilters}>
            Limpiar Filtros
          </Button>
        )}
      </div>

      {/* Lista de platos filtrados */}
      <DishGrid dishes={filteredDishes} />
    </div>
  );
};
```

### 5.2 Sistema de Notificaciones

```typescript
// src/hooks/useNotifications.ts
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remover notificación después del tiempo especificado
    if (notification.duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: Infinity, // Errores no se auto-remueven
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// Componente de notificaciones
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            {notification.type === 'success' && <svg.SuccessSvg />}
            {notification.type === 'error' && <svg.ErrorSvg />}
            {notification.type === 'warning' && <svg.WarningSvg />}
            {notification.type === 'info' && <svg.InfoSvg />}
          </div>
          
          <div className="notification-content">
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            {notification.action && (
              <button onClick={notification.action.onClick}>
                {notification.action.label}
              </button>
            )}
          </div>
          
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <svg.CloseSvg />
          </button>
        </div>
      ))}
    </div>
  );
};

// Uso en componentes
const AddToCartButton = ({ dish }) => {
  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotifications();

  const handleAddToCart = async () => {
    try {
      addToCart(dish);
      showSuccess(
        'Agregado al carrito',
        `${dish.name} se agregó correctamente al carrito`,
        {
          action: {
            label: 'Ver carrito',
            onClick: () => router.push('/cart')
          }
        }
      );
    } catch (error) {
      showError(
        'Error',
        'No se pudo agregar el plato al carrito. Intenta de nuevo.'
      );
    }
  };

  return (
    <Button onClick={handleAddToCart}>
      Agregar al Carrito
    </Button>
  );
};
```

## Conclusión

Estos ejemplos prácticos demuestran cómo la aplicación Mesio implementa patrones avanzados de React y Next.js para crear una experiencia de usuario excepcional:

- **Componentes reutilizables** con props tipadas y estados manejados
- **Hooks personalizados** que encapsulan lógica compleja
- **Optimizaciones de performance** con memoización y lazy loading
- **Manejo de errores** robusto con error boundaries
- **Sistemas de búsqueda y filtros** eficientes
- **Notificaciones** contextuales y accionables

Cada patrón está diseñado para ser mantenible, escalable y fácil de entender, siguiendo las mejores prácticas de desarrollo moderno en React.
