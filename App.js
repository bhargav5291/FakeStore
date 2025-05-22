import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import MainNavigator from './navigation/MainNavigator';
import CartSaver from './screens/CartSaver';
import { fetchProducts } from './redux/productsSlice'; 


const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts()); 
  }, []);

  return (
    <NavigationContainer>
      <CartSaver />
      <MainNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}
