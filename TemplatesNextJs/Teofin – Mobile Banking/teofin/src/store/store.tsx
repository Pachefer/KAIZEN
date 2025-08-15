import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import {cartSlice} from '@/store/cartSlice';
import {modalSlice} from '@/store/modalSlice';
import {wishlistSlice} from '@/store/wishlistSlice';
import {exchangeRatesSlice} from '@/store/exchangeRates';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      modalSlice: modalSlice.reducer,
      wishlist: wishlistSlice.reducer,
      exchangeRates: exchangeRatesSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
