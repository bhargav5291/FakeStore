import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartSaver() {
  const { items, totalQuantity, totalPrice, hasLoaded } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id && hasLoaded) {
      const key = `cart-${user.id}`;
      const cartData = { items, totalQuantity, totalPrice };
      AsyncStorage.setItem(key, JSON.stringify(cartData));
    }
  }, [items, totalQuantity, totalPrice, user, hasLoaded]);

  return null;
}
