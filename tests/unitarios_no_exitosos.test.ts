import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from '../src/lib/cartSlice';
import { wishlistSlice } from '../src/lib/wishlistSlice';
import { PopularItem } from '../src/items/PopularItem';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { DishType } from '../src/types';

// Mock del store Redux para pruebas
const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      wishlist: wishlistSlice.reducer,
    },
  });
};

// Mock de datos de prueba con valores problemáticos
const mockDishWithIssues: DishType = {
  id: 0, // ID inválido
  rating: -1, // Rating negativo
  name: '', // Nombre vacío
  description: null as any, // Descripción null
  price: -5.99, // Precio negativo
  category: undefined, // Categoría undefined
  type: 'invalid' as any, // Tipo inválido
  cookingTime: 0, // Tiempo de cocción 0
  weight: '', // Peso vacío
  isAvailable: false, // No disponible
  image: 'invalid-url', // URL inválida
  isPopular: true,
  isRecommended: false,
};

// Mock de Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock de SVG components
jest.mock('@/assets/svg', () => ({
  WishlistAddSvg: ({ color }: { color: string }) => (
    <div data-testid="wishlist-icon" style={{ color }}>❤️</div>
  ),
}));

describe('Pruebas Unitarias No Exitosas - Casos Edge y Errores', () => {
  describe('PopularItem Component - Casos Problemáticos', () => {
    it('debe fallar al renderizar plato con datos inválidos', () => {
      const store = createTestStore();
      
      // Esta prueba fallará porque el componente no maneja datos inválidos
      expect(() => {
        render(
          <Provider store={store}>
            <PopularItem dish={mockDishWithIssues} />
          </Provider>
        );
      }).toThrow();
    });

    it('debe fallar al mostrar precio negativo', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      // Esta prueba fallará porque el precio es negativo
      expect(screen.getByText('$-5.99')).toBeInTheDocument();
    });

    it('debe fallar al mostrar rating negativo', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      // Esta prueba fallará porque el rating es negativo
      expect(screen.getByText('-1')).toBeInTheDocument();
    });

    it('debe fallar al navegar con ID inválido', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      const link = screen.getByRole('link');
      // Esta prueba fallará porque el ID es 0
      expect(link).toHaveAttribute('href', '/dish/0');
    });
  });

  describe('Button Component - Casos Problemáticos', () => {
    it('debe fallar al hacer clic en botón deshabilitado', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Esta prueba fallará porque el botón está deshabilitado
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe fallar al aplicar estilos inválidos', () => {
      const invalidStyle = { invalidProperty: 'invalidValue' };
      render(<Button style={invalidStyle}>Invalid Style Button</Button>);
      
      const button = screen.getByRole('button');
      // Esta prueba fallará porque la propiedad CSS es inválida
      expect(button).toHaveStyle('invalid-property: invalidValue');
    });

    it('debe fallar al renderizar sin children', () => {
      // Esta prueba fallará porque el botón no tiene contenido
      expect(() => {
        render(<Button />);
      }).toThrow();
    });
  });

  describe('Input Component - Casos Problemáticos', () => {
    it('debe fallar al manejar valor undefined', () => {
      render(<Input value={undefined as any} onChange={() => {}} />);
      
      // Esta prueba fallará porque el valor es undefined
      expect(screen.getByDisplayValue('undefined')).toBeInTheDocument();
    });

    it('debe fallar al manejar onChange null', () => {
      render(<Input onChange={null as any} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      // Esta prueba fallará porque onChange es null
      expect(input).toHaveValue('test');
    });

    it('debe fallar al validar input vacío', () => {
      render(<Input required />);
      
      const input = screen.getByRole('textbox');
      // Esta prueba fallará porque el input está vacío pero es requerido
      expect(input).toBeValid();
    });
  });

  describe('Redux Store - CartSlice - Casos Problemáticos', () => {
    it('debe fallar al agregar plato con precio negativo', () => {
      const store = createTestStore();
      
      store.dispatch(cartSlice.actions.addToCart(mockDishWithIssues));
      
      const state = store.getState().cart;
      // Esta prueba fallará porque el precio es negativo
      expect(state.subtotal).toBeGreaterThan(0);
    });

    it('debe fallar al aplicar descuento mayor al 100%', () => {
      const store = createTestStore();
      
      // Agregar plato normal
      const normalDish: DishType = {
        ...mockDishWithIssues,
        price: 10,
        id: 1,
      };
      
      store.dispatch(cartSlice.actions.addToCart(normalDish));
      
      // Aplicar descuento del 150%
      store.dispatch(cartSlice.actions.setDiscount(150));
      
      const state = store.getState().cart;
      // Esta prueba fallará porque el descuento excede el 100%
      expect(state.total).toBeGreaterThan(0);
    });

    it('debe fallar al remover plato que no existe en el carrito', () => {
      const store = createTestStore();
      
      // Intentar remover plato sin haberlo agregado
      store.dispatch(cartSlice.actions.removeFromCart(mockDishWithIssues));
      
      const state = store.getState().cart;
      // Esta prueba fallará porque no hay platos para remover
      expect(state.subtotal).toBeLessThan(0);
    });

    it('debe fallar al aplicar código promocional inválido', () => {
      const store = createTestStore();
      
      // Aplicar código promocional vacío
      store.dispatch(cartSlice.actions.setPromoCode(''));
      
      const state = store.getState().cart;
      // Esta prueba fallará porque el código está vacío
      expect(state.promoCode).toBeTruthy();
    });
  });

  describe('Redux Store - WishlistSlice - Casos Problemáticos', () => {
    it('debe fallar al agregar plato duplicado', () => {
      const store = createTestStore();
      
      // Agregar el mismo plato dos veces
      store.dispatch(wishlistSlice.actions.addToWishlist(mockDishWithIssues));
      store.dispatch(wishlistSlice.actions.addToWishlist(mockDishWithIssues));
      
      const state = store.getState().wishlist;
      // Esta prueba fallará porque se permite duplicados
      expect(state.list).toHaveLength(1);
    });

    it('debe fallar al remover plato inexistente', () => {
      const store = createTestStore();
      
      // Remover plato sin haberlo agregado
      store.dispatch(wishlistSlice.actions.removeFromWishlist(mockDishWithIssues));
      
      const state = store.getState().wishlist;
      // Esta prueba fallará porque no hay platos para remover
      expect(state.list).toHaveLength(0);
    });
  });

  describe('Integración de Componentes - Casos Problemáticos', () => {
    it('debe fallar al agregar plato inválido al carrito', async () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        const state = store.getState().cart;
        // Esta prueba fallará porque el plato tiene datos inválidos
        expect(state.list[0].price).toBeGreaterThan(0);
      });
    });

    it('debe fallar al alternar lista de deseos con plato inválido', async () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      const wishlistButton = screen.getByTestId('wishlist-icon');
      
      // Agregar a lista de deseos
      fireEvent.click(wishlistButton);
      await waitFor(() => {
        const state = store.getState().wishlist;
        // Esta prueba fallará porque el plato tiene datos inválidos
        expect(state.list[0].name).toBeTruthy();
      });
    });
  });

  describe('Manejo de Errores - Casos Problemáticos', () => {
    it('debe fallar al manejar error de API', async () => {
      // Mock de axios que siempre falla
      jest.mock('axios', () => ({
        get: jest.fn().mockRejectedValue(new Error('API Error')),
      }));

      // Esta prueba fallará porque no se maneja el error de la API
      expect(async () => {
        // Simular llamada a API que falla
        throw new Error('API Error');
      }).rejects.toThrow('API Error');
    });

    it('debe fallar al validar datos corruptos', () => {
      const corruptedData = {
        ...mockDishWithIssues,
        price: 'invalid-price' as any,
        rating: 'invalid-rating' as any,
      };

      // Esta prueba fallará porque los tipos son incorrectos
      expect(corruptedData.price).toBeTypeOf('number');
      expect(corruptedData.rating).toBeTypeOf('number');
    });

    it('debe fallar al manejar estado undefined', () => {
      const store = createTestStore();
      
      // Simular estado undefined
      const undefinedState = undefined as any;
      
      // Esta prueba fallará porque el estado es undefined
      expect(undefinedState.cart).toBeDefined();
    });
  });

  describe('Validaciones de Datos - Casos Problemáticos', () => {
    it('debe fallar al validar imagen con URL malformada', () => {
      const invalidImageUrl = 'not-a-valid-url';
      
      // Esta prueba fallará porque la URL no es válida
      expect(invalidImageUrl).toMatch(/^https?:\/\/.+/);
    });

    it('debe fallar al validar precio con formato incorrecto', () => {
      const invalidPrice = 'price-without-dollar';
      
      // Esta prueba fallará porque el precio no tiene formato de moneda
      expect(invalidPrice).toMatch(/^\$\d+\.\d{2}$/);
    });

    it('debe fallar al validar rating fuera de rango', () => {
      const invalidRating = 6; // Rating mayor a 5
      
      // Esta prueba fallará porque el rating está fuera del rango válido
      expect(invalidRating).toBeGreaterThanOrEqual(0);
      expect(invalidRating).toBeLessThanOrEqual(5);
    });
  });

  describe('Accesibilidad - Casos Problemáticos', () => {
    it('debe fallar al verificar atributos ARIA faltantes', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      const image = screen.getByAltText('Pizza Margherita');
      // Esta prueba fallará porque el alt text está vacío
      expect(image).toHaveAttribute('alt', 'Pizza Margherita');
    });

    it('debe fallar al verificar navegación por teclado', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDishWithIssues} />
        </Provider>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Esta prueba fallará porque algunos botones no tienen tabIndex
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Performance - Casos Problemáticos', () => {
    it('debe fallar al renderizar lista muy larga', () => {
      const longList = Array.from({ length: 10000 }, (_, i) => ({
        ...mockDishWithIssues,
        id: i,
        name: `Dish ${i}`,
      }));

      // Esta prueba fallará porque la lista es muy larga
      expect(longList).toHaveLength(100);
    });

    it('debe fallar al manejar estado muy grande', () => {
      const largeState = {
        cart: {
          list: Array.from({ length: 1000 }, (_, i) => ({
            ...mockDishWithIssues,
            id: i,
          })),
        },
      };

      // Esta prueba fallará porque el estado es muy grande
      expect(largeState.cart.list).toHaveLength(100);
    });
  });
});
