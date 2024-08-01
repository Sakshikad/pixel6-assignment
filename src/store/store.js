import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slice/customerSlice';

export const store = configureStore({
    reducer: {
      customer: customerReducer,
    },
  });