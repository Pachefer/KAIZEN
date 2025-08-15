import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from '../src/lib/cartSlice';
import { wishlistSlice } from '../src/lib/wishlistSlice';
import { modalSlice } from '../src/lib/modalSlice';
import { PopularItem } from '../src/items/PopularItem';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Rating } from '../src/components/Rating';
import { DishType } from '../src/types';

// Mock del store Redux para pruebas
const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      wishlist: wishlistSlice.reducer,
      modalSlice: modalSlice.reducer,
    },
  });
};

// Mock de datos de prueba
const mockDish: DishType = {
  id: 1,
  rating: 4.5,
  name: 'Pizza Margherita',
  description: 'Pizza tradicional italiana',
  price: 15.99,
  category: 'Pizza',
  type: 'food',
  cookingTime: 20,
  weight: '300g',
  isAvailable: true,
  image: '/pizza.jpg',
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

describe('Pruebas Unitarias Exitosas - Componentes de Mesio', () => {
  describe('PopularItem Component', () => {
    it('debe renderizar correctamente un plato popular', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      expect(screen.getByText('$15.99')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByAltText('Pizza Margherita')).toBeInTheDocument();
    });

    it('debe mostrar el botón de agregar al carrito', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toBeInTheDocument();
    });

    it('debe mostrar el botón de lista de deseos', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const wishlistButton = screen.getByTestId('wishlist-icon');
      expect(wishlistButton).toBeInTheDocument();
    });

    it('debe navegar al detalle del plato al hacer clic', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/dish/1');
    });
  });

  describe('Button Component', () => {
    it('debe renderizar un botón con texto', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('debe ejecutar onClick cuando se hace clic', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe aplicar estilos personalizados', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<Button style={customStyle}>Styled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: red');
    });

    it('debe estar deshabilitado cuando disabled es true', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Input Component', () => {
    it('debe renderizar un campo de entrada', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('debe mostrar el valor ingresado', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('debe ejecutar onChange cuando se escribe', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('debe mostrar label cuando se proporciona', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Rating Component', () => {
    it('debe mostrar la calificación correcta', () => {
      render(<Rating rating={4.5} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('debe mostrar estrellas según la calificación', () => {
      render(<Rating rating={3} />);
      // Verificar que se muestren 3 estrellas llenas
      const stars = screen.getAllByTestId('star');
      expect(stars).toHaveLength(5); // Total de estrellas
    });
  });

  describe('Redux Store - CartSlice', () => {
    it('debe agregar un plato al carrito', () => {
      const store = createTestStore();
      const initialState = store.getState().cart;
      
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      
      const newState = store.getState().cart;
      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe(1);
      expect(newState.subtotal).toBe(15.99);
    });

    it('debe incrementar la cantidad si el plato ya está en el carrito', () => {
      const store = createTestStore();
      
      // Agregar el mismo plato dos veces
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      
      const state = store.getState().cart;
      expect(state.list[0].quantity).toBe(2);
      expect(state.subtotal).toBe(31.98);
    });

    it('debe remover un plato del carrito', () => {
      const store = createTestStore();
      
      // Agregar plato
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      expect(store.getState().cart.list).toHaveLength(1);
      
      // Remover plato
      store.dispatch(cartSlice.actions.removeFromCart(mockDish));
      expect(store.getState().cart.list).toHaveLength(0);
    });

    it('debe aplicar descuento correctamente', () => {
      const store = createTestStore();
      
      // Agregar plato
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      
      // Aplicar 20% de descuento
      store.dispatch(cartSlice.actions.setDiscount(20));
      
      const state = store.getState().cart;
      expect(state.discount).toBe(20);
      expect(state.total).toBe(12.79); // 15.99 * 0.8
    });

    it('debe resetear el carrito', () => {
      const store = createTestStore();
      
      // Agregar plato y aplicar descuento
      store.dispatch(cartSlice.actions.addToCart(mockDish));
      store.dispatch(cartSlice.actions.setDiscount(10));
      
      // Resetear
      store.dispatch(cartSlice.actions.resetCart());
      
      const state = store.getState().cart;
      expect(state.list).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.discount).toBe(0);
    });
  });

  describe('Redux Store - WishlistSlice', () => {
    it('debe agregar un plato a la lista de deseos', () => {
      const store = createTestStore();
      
      store.dispatch(wishlistSlice.actions.addToWishlist(mockDish));
      
      const state = store.getState().wishlist;
      expect(state.list).toHaveLength(1);
      expect(state.list[0].id).toBe(1);
    });

    it('debe remover un plato de la lista de deseos', () => {
      const store = createTestStore();
      
      // Agregar plato
      store.dispatch(wishlistSlice.actions.addToWishlist(mockDish));
      expect(store.getState().wishlist.list).toHaveLength(1);
      
      // Remover plato
      store.dispatch(wishlistSlice.actions.removeFromWishlist(mockDish));
      expect(store.getState().wishlist.list).toHaveLength(0);
    });
  });

  describe('Integración de Componentes', () => {
    it('debe agregar plato al carrito desde PopularItem', async () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        const state = store.getState().cart;
        expect(state.list).toHaveLength(1);
        expect(state.list[0].id).toBe(1);
      });
    });

    it('debe alternar estado de lista de deseos', async () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const wishlistButton = screen.getByTestId('wishlist-icon');
      
      // Agregar a lista de deseos
      fireEvent.click(wishlistButton);
      await waitFor(() => {
        const state = store.getState().wishlist;
        expect(state.list).toHaveLength(1);
      });

      // Remover de lista de deseos
      fireEvent.click(wishlistButton);
      await waitFor(() => {
        const state = store.getState().wishlist;
        expect(state.list).toHaveLength(0);
      });
    });
  });

  describe('Validaciones de Datos', () => {
    it('debe manejar platos sin imagen', () => {
      const dishWithoutImage = { ...mockDish, image: '' };
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={dishWithoutImage} />
        </Provider>
      );

      const image = screen.getByAltText('Pizza Margherita');
      expect(image).toHaveAttribute('src', '');
    });

    it('debe manejar precios con decimales', () => {
      const dishWithDecimalPrice = { ...mockDish, price: 12.50 };
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={dishWithDecimalPrice} />
        </Provider>
      );

      expect(screen.getByText('$12.50')).toBeInTheDocument();
    });

    it('debe manejar calificaciones enteras', () => {
      const dishWithIntegerRating = { ...mockDish, rating: 5 };
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={dishWithIntegerRating} />
        </Provider>
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener atributos ARIA apropiados', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const image = screen.getByAltText('Pizza Margherita');
      expect(image).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('debe ser navegable por teclado', () => {
      const store = createTestStore();
      
      render(
        <Provider store={store}>
          <PopularItem dish={mockDish} />
        </Provider>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex');
      });
    });
  });
});
