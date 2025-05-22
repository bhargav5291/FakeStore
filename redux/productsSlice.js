import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../utils/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;

