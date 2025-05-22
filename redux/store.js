import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import authReducer from './authSlice';
import productsReducer from './productsSlice';

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: ordersReducer,
  products: productsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout' || action.type === 'CLEAR_APP_STATE') {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
