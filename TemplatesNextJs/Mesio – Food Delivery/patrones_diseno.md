# Patrones de Diseño Implementados en Mesio

## Resumen Ejecutivo

La aplicación Mesio implementa una arquitectura robusta basada en patrones de diseño modernos que promueven la **mantenibilidad**, **escalabilidad** y **reutilización** del código. Esta documentación detalla los patrones utilizados y su implementación específica.

## 1. Patrón Container/Presentational (Smart/Dumb Components)

### Descripción
Separación clara entre componentes que manejan lógica de negocio (containers) y componentes que solo se encargan de la presentación (presentational).

### Implementación en Mesio

#### Container Component - Home.tsx
```typescript
export const Home: React.FC = () => {
  const {data, isLoading} = hooks.useGetDishes();
  
  // Lógica de negocio
  const categories = data
    ? Array.from(new Set(data.map((dish: DishType) => dish.category)))
    : [];

  // Renderizado de componentes presentacionales
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

#### Presentational Component - PopularItem.tsx
```typescript
export const PopularItem: React.FC<Props> = ({dish}) => {
  // Solo recibe props y renderiza UI
  return (
    <Link href={`${constants.routes.dish}/${dish.id}`}>
      <img src={dish.image} alt={dish.name} />
      <h2>{dish.name}</h2>
      <span>${dish.price?.toFixed(2)}</span>
    </Link>
  );
};
```

### Beneficios
- **Separación de responsabilidades**: Lógica y presentación claramente separadas
- **Reutilización**: Componentes presentacionales pueden reutilizarse en diferentes contextos
- **Testabilidad**: Fácil testing de lógica y presentación por separado
- **Mantenibilidad**: Cambios en lógica no afectan la presentación

## 2. Patrón Custom Hooks

### Descripción
Encapsulación de lógica reutilizable en hooks personalizados que pueden ser compartidos entre componentes.

### Implementación en Mesio

#### useGetDishes Hook
```typescript
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

#### useFormField Hook
```typescript
export const useFormField = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (error) setError(null);
  };

  const validate = (validator: (value: string) => boolean, errorMessage: string) => {
    if (!validator(value)) {
      setError(errorMessage);
      return false;
    }
    return true;
  };

  return {value, error, handleChange, validate, setError};
};
```

### Beneficios
- **Reutilización**: Lógica compartida entre múltiples componentes
- **Separación de responsabilidades**: Lógica de estado separada de la UI
- **Testabilidad**: Hooks pueden probarse independientemente
- **Mantenibilidad**: Cambios centralizados en un solo lugar

## 3. Patrón Redux Toolkit (State Management)

### Descripción
Gestión centralizada del estado de la aplicación usando Redux Toolkit con slices modulares para diferentes dominios.

### Implementación en Mesio

#### Store Configuration
```typescript
export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      modalSlice: modalSlice.reducer,
      wishlist: wishlistSlice.reducer,
    },
  });
};
```

#### Cart Slice
```typescript
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<DishType>) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);
      
      if (inCart) {
        // Incrementar cantidad
        state.list.map((item: DishType) => {
          if (item.id === action.payload.id && item.quantity) {
            item.quantity += 1;
          }
          return item;
        });
        state.subtotal += Number(action.payload.price);
      } else {
        // Agregar nuevo item
        state.list.push({
          ...action.payload,
          quantity: 1,
        });
        state.subtotal += Number(action.payload.price);
      }
      
      // Recalcular total con descuento
      state.total = state.subtotal * (1 - state.discount / 100);
    },
    
    removeFromCart: (state, action: PayloadAction<DishType>) => {
      // Lógica de remoción
    },
    
    setDiscount: (state, action: PayloadAction<number>) => {
      // Lógica de descuento
    },
  },
});
```

### Beneficios
- **Estado centralizado**: Un solo lugar para toda la información de la aplicación
- **Predictibilidad**: Flujo de datos unidireccional y predecible
- **Debugging**: Herramientas de Redux DevTools para debugging
- **Escalabilidad**: Fácil agregar nuevas funcionalidades

## 4. Patrón Component Composition

### Descripción
Construcción de interfaces complejas combinando componentes más pequeños y especializados.

### Implementación en Mesio

#### Composición de Componentes
```typescript
// Home.tsx - Composición de múltiples componentes
const renderContent = () => {
  return (
    <main style={{
      overflowY: 'auto',
      marginTop: constants.sizes.headerHeight,
      marginBottom: constants.sizes.tabBarHeight,
      paddingBottom: 20,
    }}>
      {renderCategories()}
      {renderPopular()}
      {renderRecomended()}
    </main>
  );
};

// Composición de componentes específicos
const renderPopular = () => {
  return (
    <section style={{marginBottom: 30}}>
      <components.BlockHeading
        title="Popular Dishes"
        href={`${constants.routes.shop}/popular`}
      />
      <Swiper spaceBetween={14} slidesPerView={'auto'}>
        {data?.filter((dish: DishType) => dish.isPopular)
          .map((dish: DishType) => (
            <SwiperSlide key={dish.id} style={{width: 'auto'}}>
              <items.PopularItem dish={dish} key={dish.id} />
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};
```

### Beneficios
- **Reutilización**: Componentes pequeños pueden reutilizarse en diferentes contextos
- **Mantenibilidad**: Cambios en un componente no afectan otros
- **Testabilidad**: Componentes individuales más fáciles de probar
- **Flexibilidad**: Fácil reordenar y reorganizar la interfaz

## 5. Patrón Factory (Creación de Componentes)

### Descripción
Creación de componentes basados en datos o configuración, permitiendo renderizado dinámico.

### Implementación en Mesio

#### Factory de Items
```typescript
// Renderizado dinámico basado en datos
const renderCategories = () => {
  return (
    <div style={{marginBottom: 30}}>
      <Swiper spaceBetween={10} slidesPerView={'auto'}>
        {categories?.map((category: any) => (
          <SwiperSlide key={category.id} style={{width: 'auto'}}>
            <Link href={`${constants.routes.shopCategory}/${category.toLowerCase()}`}>
              <span style={{
                fontSize: 14,
                color: constants.colors.textColor,
              }}>
                {category}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Factory de componentes de items
const renderPopularItems = () => {
  return data?.filter((dish: DishType) => dish.isPopular)
    .map((dish: DishType) => (
      <SwiperSlide key={dish.id} style={{width: 'auto'}}>
        <items.PopularItem dish={dish} key={dish.id} />
      </SwiperSlide>
    ));
};
```

### Beneficios
- **Flexibilidad**: Renderizado dinámico basado en datos
- **Escalabilidad**: Fácil agregar nuevos tipos de items
- **Mantenibilidad**: Lógica de creación centralizada
- **Reutilización**: Patrones de creación consistentes

## 6. Patrón Observer (Event Handling)

### Descripción
Sistema de eventos donde componentes se suscriben a cambios de estado y reaccionan automáticamente.

### Implementación en Mesio

#### Redux como Observer
```typescript
// Componente que observa cambios en el carrito
export const PopularItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  
  // Observa cambios en el estado
  const isInWishlist = wishlist.some((item) => item.id === dish.id);
  const inCart = cart.find((item) => item.id === dish?.id);

  // Reacciona a cambios automáticamente
  return (
    <Link href={`${constants.routes.dish}/${dish.id}`}>
      {/* UI que se actualiza automáticamente */}
      <components.AddToCart dish={dish} />
      <button onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(cartActions.addToCart(dish));
      }}>
        <components.AddToCartIcon inCart={inCart ? true : false} />
      </button>
    </Link>
  );
};
```

### Beneficios
- **Desacoplamiento**: Componentes no necesitan conocer implementaciones específicas
- **Reactividad**: UI se actualiza automáticamente con cambios de estado
- **Escalabilidad**: Fácil agregar nuevos observadores
- **Mantenibilidad**: Cambios de estado propagados automáticamente

## 7. Patrón Strategy (Algoritmos Intercambiables)

### Descripción
Definición de familias de algoritmos encapsulados, permitiendo intercambiarlos en tiempo de ejecución.

### Implementación en Mesio

#### Estrategias de Validación
```typescript
// Hook que permite diferentes estrategias de validación
export const useFormField = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = (validator: (value: string) => boolean, errorMessage: string) => {
    if (!validator(value)) {
      setError(errorMessage);
      return false;
    }
    return true;
  };

  // Diferentes estrategias de validación
  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateRequired = (value: string) => {
    return value.trim().length > 0;
  };

  const validateMinLength = (minLength: number) => (value: string) => {
    return value.length >= minLength;
  };

  return {value, error, validate, validateEmail, validateRequired, validateMinLength};
};
```

### Beneficios
- **Flexibilidad**: Fácil cambiar algoritmos sin modificar el código cliente
- **Extensibilidad**: Nuevas estrategias pueden agregarse fácilmente
- **Testabilidad**: Cada estrategia puede probarse independientemente
- **Mantenibilidad**: Lógica de validación centralizada y reutilizable

## 8. Patrón Adapter (Integración de APIs)

### Descripción
Interfaz que permite que clases incompatibles trabajen juntas, adaptando una interfaz a otra.

### Implementación en Mesio

#### Adaptador de API
```typescript
// Configuración de URLs de API
const MAIN_URL = 'https://george-fx.github.io/mesio-api/';

export const URLS = {
  MAIN_URL,
  GET_DISHES: `${MAIN_URL}dishes.json`,
  GET_REVIEWS: `${MAIN_URL}reviews.json`,
  GET_PROMOCODES: `${MAIN_URL}promocodes.json`,
};

// Hook que adapta la respuesta de la API al formato interno
export const useGetDishes = () => {
  const [data, setData] = useState<DishType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDishes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URLS.GET_DISHES);
      // Adaptación de la respuesta de la API
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

### Beneficios
- **Integración**: Fácil integración con APIs externas
- **Flexibilidad**: Cambios en la API no afectan el código interno
- **Mantenibilidad**: Lógica de adaptación centralizada
- **Testabilidad**: Fácil mockear APIs para testing

## 9. Patrón Singleton (Configuración Global)

### Descripción
Garantiza que una clase tenga solo una instancia y proporciona un punto de acceso global a ella.

### Implementación en Mesio

#### Store de Redux
```typescript
// Store único para toda la aplicación
export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      modalSlice: modalSlice.reducer,
      wishlist: wishlistSlice.reducer,
    },
  });
};

// Tipos inferidos del store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Hooks tipados para usar el store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Beneficios
- **Estado único**: Un solo lugar para toda la información de la aplicación
- **Consistencia**: Datos consistentes en toda la aplicación
- **Control**: Control centralizado sobre el estado
- **Debugging**: Fácil debugging del estado de la aplicación

## 10. Patrón Template Method (Flujos de Usuario)

### Descripción
Define el esqueleto de un algoritmo en una clase base, permitiendo que las subclases sobrescriban pasos específicos.

### Implementación en Mesio

#### Flujo de Renderizado
```typescript
export const Home: React.FC = () => {
  // Template method para el flujo de renderizado
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

  const renderCategories = () => {
    // Implementación específica para categorías
  };

  const renderPopular = () => {
    // Implementación específica para platos populares
  };

  const renderRecomended = () => {
    // Implementación específica para platos recomendados
  };

  const renderContent = () => {
    // Orden fijo de renderizado (template)
    return (
      <main>
        {renderCategories()}
        {renderPopular()}
        {renderRecomended()}
      </main>
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  // Flujo principal que sigue el template
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

### Beneficios
- **Consistencia**: Flujo de renderizado consistente en toda la aplicación
- **Flexibilidad**: Fácil personalizar pasos específicos
- **Reutilización**: Template puede reutilizarse en diferentes páginas
- **Mantenibilidad**: Cambios en el flujo centralizados

## Análisis de Calidad de los Patrones

### Fortalezas
1. **Separación clara de responsabilidades**: Cada patrón tiene un propósito específico
2. **Alta cohesión**: Componentes relacionados están agrupados lógicamente
3. **Bajo acoplamiento**: Dependencias entre componentes están minimizadas
4. **Reutilización**: Patrones promueven la reutilización de código

### Áreas de Mejora
1. **Complejidad**: Algunos patrones pueden simplificarse
2. **Documentación**: Mejorar documentación de patrones implementados
3. **Consistencia**: Asegurar uso consistente de patrones en toda la aplicación

## Recomendaciones

### Implementación de Nuevos Patrones
1. **Patrón Repository**: Para abstraer acceso a datos
2. **Patrón Command**: Para operaciones de usuario
3. **Patrón Decorator**: Para funcionalidades adicionales

### Mejoras en Patrones Existentes
1. **Simplificar Container/Presentational**: Reducir complejidad innecesaria
2. **Optimizar Custom Hooks**: Mejorar performance y reutilización
3. **Estandarizar Factory**: Crear factory functions más consistentes

## Conclusión

La aplicación Mesio implementa una arquitectura sólida basada en patrones de diseño modernos que promueven la **mantenibilidad**, **escalabilidad** y **reutilización** del código. Los patrones implementados proporcionan una base sólida para el desarrollo futuro y facilitan el mantenimiento de la aplicación.

La combinación de estos patrones crea una arquitectura robusta que puede evolucionar con los requisitos cambiantes del negocio, manteniendo la calidad del código y la experiencia del desarrollador.
