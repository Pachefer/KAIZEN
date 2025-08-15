import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import {cartSlice} from '@/lib/cartSlice';
import {modalSlice} from '@/lib/modalSlice';
import {wishlistSlice} from '@/lib/wishlistSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice.reducer,
      modalSlice: modalSlice.reducer,
      wishlist: wishlistSlice.reducer,
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
