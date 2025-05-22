import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../utils/api';

// 🔐 Login
export const signIn = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/signin`, { email, password });
    console.log('LOGIN API RESPONSE:', res.data);

    const { token, name, email: userEmail, id } = res.data;

    if (!token) {
      return { success: false, message: 'Token not found' };
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify({ name, email: userEmail }));

  
    return {
      success: true,
      token,
      user: { id, name, email: userEmail },
    };
  } catch (err) {
    console.log('LOGIN ERROR:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.error || 'Login failed',
    };
  }
};



//  Sign Up
export const signUp = async (name, email, password) => {
  try {
    await axios.post(`${BASE_URL}/users/signup`, { name, email, password });
    return await signIn(email, password);
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.error || 'Signup failed',
    };
  }
};

// Update Profile
export const updateProfile = async (name, password) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const res = await axios.post(
      `${BASE_URL}/users/update`,
      { name, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.status === 'OK') {
      await AsyncStorage.setItem('user', JSON.stringify({ name, email: res.data.email }));
      return { success: true, message: res.data.message };
    }

    return { success: false, message: res.data.message || 'Update failed' };
  } catch (err) {
    console.log('🔴 UPDATE ERROR:', err.response?.data || err.message);
    return { success: false, message: err.response?.data?.message || 'Update error' };
  }
};

// Get current user
export const getProfile = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};


//  Logout
export const logout = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const cart = await AsyncStorage.getItem('cart');

    if (userId && cart) {
      // ✅ Save cart before removing general cart
      await AsyncStorage.setItem(`cart-${userId}`, cart);
    }

    // ❗ Only remove 'cart' key, not 'cart-${userId}'
    await AsyncStorage.multiRemove(['token', 'user', 'userId', 'cart']);
  } catch (err) {
    console.error('🔴 Logout error:', err);
  }
};



