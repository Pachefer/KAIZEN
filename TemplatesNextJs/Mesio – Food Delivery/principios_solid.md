# Principios SOLID Implementados en Mesio

## Resumen Ejecutivo

La aplicación Mesio implementa los **Principios SOLID** como base fundamental de su arquitectura, promoviendo código **mantenible**, **escalable** y **reutilizable**. Este documento analiza cómo cada principio se aplica en la implementación actual y propone mejoras para optimizar la adherencia a estos principios.

## 1. Single Responsibility Principle (SRP)

### Descripción
Una clase o componente debe tener una sola razón para cambiar, es decir, una sola responsabilidad.

### Implementación Actual en Mesio

#### ✅ Ejemplo Correcto - Button Component
```typescript
// Button.tsx - Responsabilidad única: renderizar un botón
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  style,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: 'none',
        borderRadius: 8,
        padding: '12px 24px',
        fontSize: 16,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Análisis**: El componente `Button` tiene una sola responsabilidad: renderizar un botón con estilos y comportamiento básico.

#### ✅ Ejemplo Correcto - useGetDishes Hook
```typescript
// useGetDishes.tsx - Responsabilidad única: obtener datos de platos
export const useGetDishes = () => {
  const [data, setData] = useState<DishType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDishes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URLS.GET_DISHES);
      const dishes = response.data.dishes || response.data || [];
      setData(dishes);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return {data, isLoading};
};
```

**Análisis**: El hook `useGetDishes` tiene una sola responsabilidad: gestionar el estado y la lógica para obtener platos de la API.

#### ❌ Ejemplo Problemático - Home Component
```typescript
// Home.tsx - Múltiples responsabilidades
export const Home: React.FC = () => {
  const {data, isLoading} = hooks.useGetDishes();
  
  // Responsabilidad 1: Obtener datos
  const categories = data
    ? Array.from(new Set(data.map((dish: DishType) => dish.category)))
    : [];

  // Responsabilidad 2: Renderizar header
  const renderHeader = () => {
    return (
      <components.Header
        showBurger={true}
        title="mesio"
        titleStyle={{textTransform: 'uppercase', fontWeight: 'bold'}}
        showBasket={true}
      />
    );
  };

  // Responsabilidad 3: Renderizar categorías
  const renderCategories = () => {
    return (
      <div style={{marginBottom: 30}}>
        <Swiper spaceBetween={10} slidesPerView={'auto'}>
          {categories?.map((category: any) => (
            <SwiperSlide key={category.id} style={{width: 'auto'}}>
              <Link href={`${constants.routes.shopCategory}/${category.toLowerCase()}`}>
                <span>{category}</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  // Responsabilidad 4: Renderizar contenido principal
  const renderContent = () => {
    return (
      <main>
        {renderCategories()}
        {renderPopular()}
        {renderRecomended()}
      </main>
    );
  };

  // Responsabilidad 5: Renderizar barra inferior
  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderBottomBar()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
```

**Problema**: El componente `Home` tiene múltiples responsabilidades:
1. Gestión de datos
2. Renderizado de header
3. Renderizado de categorías
4. Renderizado de contenido principal
5. Renderizado de barra inferior

### Mejoras Propuestas para SRP

#### Refactorización del Home Component
```typescript
// hooks/useHomeData.ts - Responsabilidad: gestión de datos
export const useHomeData = () => {
  const {data, isLoading} = hooks.useGetDishes();
  
  const categories = useMemo(() => {
    return data
      ? Array.from(new Set(data.map((dish: DishType) => dish.category)))
      : [];
  }, [data]);

  const popularDishes = useMemo(() => {
    return data?.filter((dish: DishType) => dish.isPopular) || [];
  }, [data]);

  const recommendedDishes = useMemo(() => {
    return data?.filter((dish: DishType) => dish.isRecommended) || [];
  }, [data]);

  return {
    categories,
    popularDishes,
    recommendedDishes,
    isLoading,
  };
};

// components/HomeHeader.tsx - Responsabilidad: renderizar header
export const HomeHeader: React.FC = () => {
  return (
    <components.Header
      showBurger={true}
      title="mesio"
      titleStyle={{textTransform: 'uppercase', fontWeight: 'bold'}}
      showBasket={true}
    />
  );
};

// components/CategorySlider.tsx - Responsabilidad: renderizar categorías
export const CategorySlider: React.FC<{categories: string[]}> = ({categories}) => {
  return (
    <div style={{marginBottom: 30}}>
      <Swiper spaceBetween={10} slidesPerView={'auto'}>
        {categories?.map((category: string) => (
          <SwiperSlide key={category} style={{width: 'auto'}}>
            <Link href={`${constants.routes.shopCategory}/${category.toLowerCase()}`}>
              <span>{category}</span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Home.tsx - Responsabilidad: orquestar componentes
export const Home: React.FC = () => {
  const {categories, popularDishes, recommendedDishes, isLoading} = useHomeData();

  if (isLoading) return <components.Loader />;

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        <HomeHeader />
        <main>
          <CategorySlider categories={categories} />
          <PopularDishes dishes={popularDishes} />
          <RecommendedDishes dishes={recommendedDishes} />
        </main>
        <components.BottomTabBar />
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
```

## 2. Open/Closed Principle (OCP)

### Descripción
Las entidades de software deben estar abiertas para extensión pero cerradas para modificación.

### Implementación Actual en Mesio

#### ✅ Ejemplo Correcto - CartSlice
```typescript
// cartSlice.tsx - Abierto para extensión, cerrado para modificación
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<DishType>) => {
      // Lógica existente
    },
    removeFromCart: (state, action: PayloadAction<DishType>) => {
      // Lógica existente
    },
    // Nuevas acciones pueden agregarse sin modificar las existentes
    updateQuantity: (state, action: PayloadAction<{id: number; quantity: number}>) => {
      const {id, quantity} = action.payload;
      const item = state.list.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        // Recalcular totales
      }
    },
  },
});
```

**Análisis**: El slice está abierto para extensión (nuevas acciones) pero cerrado para modificación (lógica existente no se modifica).

#### ❌ Ejemplo Problemático - PopularItem Component
```typescript
// PopularItem.tsx - No está abierto para extensión
export const PopularItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  
  const isInWishlist = wishlist.some((item) => item.id === dish.id);
  const inCart = cart.find((item) => item.id === dish?.id);

  return (
    <Link href={`${constants.routes.dish}/${dish.id}`}>
      <img src={dish.image} alt={dish.name} />
      <h2>{dish.name}</h2>
      <span>${dish.price?.toFixed(2)}</span>
      
      {/* Lógica hardcodeada - difícil de extender */}
      <button onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(cartActions.addToCart(dish));
      }}>
        <components.AddToCartIcon inCart={inCart ? true : false} />
      </button>
      
      <button onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isInWishlist) {
          dispatch(wishlistActions.removeFromWishlist(dish));
        } else {
          dispatch(wishlistActions.addToWishlist(dish));
        }
      }}>
        <svg.WishlistAddSvg color={isInWishlist ? constants.colors.redColor : '#BDBDBD'} />
      </button>
    </Link>
  );
};
```

**Problema**: El componente tiene lógica hardcodeada que es difícil de extender sin modificar el código existente.

### Mejoras Propuestas para OCP

#### Implementación de Action Handlers Configurables
```typescript
// types/ActionHandler.ts
export interface ActionHandler {
  type: 'cart' | 'wishlist' | 'custom';
  action: (dish: DishType) => void;
  icon: React.ComponentType<{inState: boolean}>;
  getState: (dish: DishType) => boolean;
}

// components/ActionButton.tsx - Componente genérico para acciones
export const ActionButton: React.FC<{
  dish: DishType;
  handler: ActionHandler;
  className?: string;
}> = ({dish, handler, className}) => {
  const inState = handler.getState(dish);
  
  return (
    <button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handler.action(dish);
      }}
    >
      <handler.icon inState={inState} />
    </button>
  );
};

// PopularItem.tsx - Abierto para extensión
export const PopularItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  
  // Handlers configurables
  const actionHandlers: ActionHandler[] = [
    {
      type: 'cart',
      action: (dish) => dispatch(cartActions.addToCart(dish)),
      icon: AddToCartIcon,
      getState: (dish) => cart.some(item => item.id === dish.id),
    },
    {
      type: 'wishlist',
      action: (dish) => {
        const inWishlist = wishlist.some(item => item.id === dish.id);
        if (inWishlist) {
          dispatch(wishlistActions.removeFromWishlist(dish));
        } else {
          dispatch(wishlistActions.addToWishlist(dish));
        }
      },
      icon: WishlistIcon,
      getState: (dish) => wishlist.some(item => item.id === dish.id),
    },
    // Nuevos handlers pueden agregarse fácilmente
  ];

  return (
    <Link href={`${constants.routes.dish}/${dish.id}`}>
      <img src={dish.image} alt={dish.name} />
      <h2>{dish.name}</h2>
      <span>${dish.price?.toFixed(2)}</span>
      
      {/* Renderizado dinámico de botones de acción */}
      {actionHandlers.map((handler, index) => (
        <ActionButton
          key={handler.type}
          dish={dish}
          handler={handler}
          className={`action-button action-button--${handler.type}`}
        />
      ))}
    </Link>
  );
};
```

## 3. Liskov Substitution Principle (LSP)

### Descripción
Los objetos de una clase derivada deben poder sustituir objetos de la clase base sin afectar la funcionalidad del programa.

### Implementación Actual en Mesio

#### ✅ Ejemplo Correcto - DishType Interface
```typescript
// types/DishType.tsx - Interface base bien definida
export type DishType = {
  id: number;
  rating: number;
  name: string;
  description: string;
  price: number;
  category: any;
  type: 'food' | 'drink';
  cookingTime: number;
  weight: string;
  isAvailable: boolean;
  image: string;
  quantity?: number;
  ingredients?: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
};

// Uso consistente en toda la aplicación
const renderDish = (dish: DishType) => {
  return (
    <div>
      <h3>{dish.name}</h3>
      <p>{dish.description}</p>
      <span>${dish.price}</span>
    </div>
  );
};
```

**Análisis**: La interface `DishType` es consistente y cualquier implementación puede sustituir a otra sin problemas.

#### ❌ Ejemplo Problemático - Category Handling
```typescript
// PopularItem.tsx - Uso inconsistente de categorías
export const PopularItem: React.FC<Props> = ({dish}) => {
  // Problema: category puede ser string o objeto
  const categoryName = typeof dish.category === 'string' 
    ? dish.category 
    : dish.category?.name || 'Unknown';
    
  return (
    <div>
      <span>Category: {categoryName}</span>
    </div>
  );
};
```

**Problema**: El manejo de categorías no es consistente, lo que puede causar errores en tiempo de ejecución.

### Mejoras Propuestas para LSP

#### Implementación de Tipos Consistentes
```typescript
// types/Category.tsx - Tipo consistente para categorías
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// types/DishType.tsx - Interface mejorada
export interface DishType {
  id: number;
  rating: number;
  name: string;
  description: string;
  price: number;
  category: Category; // Siempre es un objeto Category
  type: 'food' | 'drink';
  cookingTime: number;
  weight: string;
  isAvailable: boolean;
  image: string;
  quantity?: number;
  ingredients?: Ingredient[];
  isPopular?: boolean;
  isRecommended?: boolean;
}

// PopularItem.tsx - Uso consistente
export const PopularItem: React.FC<Props> = ({dish}) => {
  return (
    <div>
      <span>Category: {dish.category.name}</span>
    </div>
  );
};
```

## 4. Interface Segregation Principle (ISP)

### Descripción
Los clientes no deben verse forzados a depender de interfaces que no utilizan.

### Implementación Actual en Mesio

#### ❌ Ejemplo Problemático - Props Interface
```typescript
// PopularItem.tsx - Interface que fuerza dependencias innecesarias
interface Props {
  dish: DishType;
  showRating?: boolean;
  showPrice?: boolean;
  showCategory?: boolean;
  showIngredients?: boolean;
  showCookingTime?: boolean;
  showWeight?: boolean;
  onAddToCart?: (dish: DishType) => void;
  onAddToWishlist?: (dish: DishType) => void;
  onRemoveFromWishlist?: (dish: DishType) => void;
  onViewDetails?: (dish: DishType) => void;
  className?: string;
  style?: CSSProperties;
}
```

**Problema**: La interface `Props` incluye muchas propiedades opcionales que no siempre se utilizan.

### Mejoras Propuestas para ISP

#### Interfaces Específicas y Composición
```typescript
// types/ComponentProps.ts - Interfaces específicas
export interface BaseDishProps {
  dish: DishType;
  className?: string;
  style?: CSSProperties;
}

export interface DisplayProps {
  showRating?: boolean;
  showPrice?: boolean;
  showCategory?: boolean;
}

export interface ActionProps {
  onAddToCart?: (dish: DishType) => void;
  onAddToWishlist?: (dish: DishType) => void;
  onRemoveFromWishlist?: (dish: DishType) => void;
}

export interface NavigationProps {
  onViewDetails?: (dish: DishType) => void;
  href?: string;
}

// PopularItem.tsx - Composición de interfaces
export const PopularItem: React.FC<
  BaseDishProps & 
  DisplayProps & 
  ActionProps & 
  NavigationProps
> = ({
  dish,
  showRating = true,
  showPrice = true,
  showCategory = false,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onViewDetails,
  className,
  style,
}) => {
  return (
    <div className={className} style={style}>
      {showCategory && <span>Category: {dish.category.name}</span>}
      {showRating && <Rating rating={dish.rating} />}
      {showPrice && <span>${dish.price}</span>}
      
      {onAddToCart && (
        <button onClick={() => onAddToCart(dish)}>
          Add to Cart
        </button>
      )}
      
      {onViewDetails && (
        <button onClick={() => onViewDetails(dish)}>
          View Details
        </button>
      )}
    </div>
  );
};

// Uso específico según necesidades
const SimpleDishCard: React.FC<BaseDishProps> = ({dish}) => (
  <PopularItem dish={dish} />
);

const InteractiveDishCard: React.FC<BaseDishProps & ActionProps> = ({dish, onAddToCart}) => (
  <PopularItem 
    dish={dish} 
    onAddToCart={onAddToCart}
    showRating={true}
    showPrice={true}
  />
);
```

## 5. Dependency Inversion Principle (DIP)

### Descripción
Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.

### Implementación Actual en Mesio

#### ❌ Ejemplo Problemático - Dependencia Directa
```typescript
// PopularItem.tsx - Dependencia directa de implementaciones
export const PopularItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch(); // Dependencia directa de Redux
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  
  // Lógica hardcodeada de Redux
  const handleAddToCart = () => {
    dispatch(cartActions.addToCart(dish));
  };
  
  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(wishlistActions.removeFromWishlist(dish));
    } else {
      dispatch(wishlistActions.addToWishlist(dish));
    }
  };
};
```

**Problema**: El componente depende directamente de implementaciones específicas (Redux) en lugar de abstracciones.

### Mejoras Propuestas para DIP

#### Implementación de Abstracciones
```typescript
// interfaces/CartService.ts - Abstracción para carrito
export interface CartService {
  addItem(dish: DishType): void;
  removeItem(dish: DishType): void;
  getItems(): DishType[];
  isInCart(dish: DishType): boolean;
}

// interfaces/WishlistService.ts - Abstracción para lista de deseos
export interface WishlistService {
  addItem(dish: DishType): void;
  removeItem(dish: DishType): void;
  getItems(): DishType[];
  isInWishlist(dish: DishType): boolean;
}

// services/ReduxCartService.ts - Implementación concreta
export class ReduxCartService implements CartService {
  constructor(private dispatch: AppDispatch) {}
  
  addItem(dish: DishType): void {
    this.dispatch(cartActions.addToCart(dish));
  }
  
  removeItem(dish: DishType): void {
    this.dispatch(cartActions.removeFromCart(dish));
  }
  
  getItems(): DishType[] {
    // Implementación con Redux
  }
  
  isInCart(dish: DishType): boolean {
    // Implementación con Redux
  }
}

// PopularItem.tsx - Dependencia de abstracciones
export const PopularItem: React.FC<{
  dish: DishType;
  cartService: CartService;
  wishlistService: WishlistService;
}> = ({dish, cartService, wishlistService}) => {
  const isInCart = cartService.isInCart(dish);
  const isInWishlist = wishlistService.isInWishlist(dish);
  
  const handleAddToCart = () => {
    cartService.addItem(dish);
  };
  
  const handleWishlist = () => {
    if (isInWishlist) {
      wishlistService.removeItem(dish);
    } else {
      wishlistService.addItem(dish);
    }
  };
  
  return (
    <div>
      <button onClick={handleAddToCart}>
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
      <button onClick={handleWishlist}>
        {isInWishlist ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

// Uso con inyección de dependencias
const PopularItemWithRedux: React.FC<{dish: DishType}> = ({dish}) => {
  const dispatch = useAppDispatch();
  const cartService = new ReduxCartService(dispatch);
  const wishlistService = new ReduxWishlistService(dispatch);
  
  return (
    <PopularItem
      dish={dish}
      cartService={cartService}
      wishlistService={wishlistService}
    />
  );
};
```

## 6. Implementación de Mejoras SOLID

### 6.1 Refactorización del Store

#### Store Modular con Abstracciones
```typescript
// lib/store/StoreProvider.tsx - Provider con inyección de dependencias
interface StoreContextValue {
  cartService: CartService;
  wishlistService: WishlistService;
  modalService: ModalService;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const store = useMemo(() => makeStore(), []);
  
  const cartService = useMemo(() => new ReduxCartService(store.dispatch), [store]);
  const wishlistService = useMemo(() => new ReduxWishlistService(store.dispatch), [store]);
  const modalService = useMemo(() => new ReduxModalService(store.dispatch), [store]);
  
  const value: StoreContextValue = {
    cartService,
    wishlistService,
    modalService,
  };
  
  return (
    <Provider store={store}>
      <StoreContext.Provider value={value}>
        {children}
      </StoreContext.Provider>
    </Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
```

### 6.2 Implementación de Factory Pattern

#### Factory para Creación de Componentes
```typescript
// factories/ComponentFactory.tsx - Factory para componentes
export class ComponentFactory {
  static createDishCard(
    dish: DishType,
    variant: 'simple' | 'interactive' | 'full',
    services: {
      cartService: CartService;
      wishlistService: WishlistService;
    }
  ) {
    switch (variant) {
      case 'simple':
        return <SimpleDishCard dish={dish} />;
      case 'interactive':
        return (
          <InteractiveDishCard
            dish={dish}
            cartService={services.cartService}
            wishlistService={services.wishlistService}
          />
        );
      case 'full':
        return (
          <FullDishCard
            dish={dish}
            cartService={services.cartService}
            wishlistService={services.wishlistService}
            showAllDetails={true}
          />
        );
      default:
        return <SimpleDishCard dish={dish} />;
    }
  }
}
```

## 7. Métricas de Calidad SOLID

### 7.1 Métricas de Acoplamiento
- **Acoplamiento entre módulos**: Objetivo < 0.3
- **Dependencias circulares**: Objetivo 0
- **Importaciones por archivo**: Objetivo < 10

### 7.2 Métricas de Cohesión
- **Responsabilidades por componente**: Objetivo 1-2
- **Métodos por clase**: Objetivo < 10
- **Líneas por función**: Objetivo < 20

### 7.3 Métricas de Estabilidad
- **Cambios que requieren modificación**: Objetivo < 20%
- **Extensiones sin modificación**: Objetivo > 80%
- **Reutilización de componentes**: Objetivo > 70%

## 8. Roadmap de Implementación SOLID

### Fase 1 (Semanas 1-2): Refactorización SRP
- [ ] Separar responsabilidades en componentes Home
- [ ] Crear hooks específicos para cada dominio
- [ ] Refactorizar componentes con múltiples responsabilidades

### Fase 2 (Semanas 3-4): Implementación OCP
- [ ] Crear interfaces para action handlers
- [ ] Implementar sistema de plugins para funcionalidades
- [ ] Refactorizar slices para extensibilidad

### Fase 3 (Semanas 5-6): Aplicación LSP
- [ ] Estandarizar tipos de datos
- [ ] Crear interfaces consistentes
- [ ] Implementar validaciones de tipos

### Fase 4 (Semanas 7-8): Implementación ISP
- [ ] Dividir interfaces grandes en específicas
- [ ] Implementar composición de props
- [ ] Crear componentes base reutilizables

### Fase 5 (Semanas 9-10): Aplicación DIP
- [ ] Crear abstracciones para servicios
- [ ] Implementar inyección de dependencias
- [ ] Refactorizar store para usar abstracciones

## Conclusión

La implementación de los principios SOLID en Mesio transformará la arquitectura de la aplicación, haciéndola más **mantenible**, **escalable** y **reutilizable**. 

Los beneficios incluyen:
- **Mantenibilidad**: Código más fácil de entender y modificar
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testabilidad**: Componentes más fáciles de probar
- **Reutilización**: Componentes que pueden usarse en diferentes contextos
- **Flexibilidad**: Fácil cambiar implementaciones sin afectar el código cliente

La implementación gradual de estos principios asegurará que Mesio mantenga su calidad de código a medida que crece y evoluciona, proporcionando una base sólida para el desarrollo futuro.
