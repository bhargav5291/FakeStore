import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  hasLoaded: false, 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      state.totalQuantity += 1;
      state.totalPrice += product.price;
    },
    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.product.id === id);
      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.totalPrice += item.product.price;
      }
    },
    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find(item => item.product.id === id);
      if (item) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= item.product.price;
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.product.id !== id);
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.hasLoaded = false; 
    },
    loadCart(state, action) {
      const data = action.payload;
      state.items = data.items || [];
      state.totalQuantity = data.totalQuantity || 0;
      state.totalPrice = data.totalPrice || 0;
      state.hasLoaded = true; 
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
