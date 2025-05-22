import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../utils/api';


export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.orders;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});


export const placeOrder = createAsyncThunk('orders/placeOrder', async (items, thunkAPI) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const payload = {
      items: items.map((item) => ({
        prodID: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    const res = await axios.post(`${BASE_URL}/orders/neworder`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    
    thunkAPI.dispatch(fetchOrders());

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to place order');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    userOrders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
