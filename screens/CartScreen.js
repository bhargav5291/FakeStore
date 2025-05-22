import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import store from '../redux/store';
import { increaseQuantity, decreaseQuantity, clearCart } from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../utils/api';
import { fetchOrders } from '../redux/ordersSlice';

export default function CartScreen() {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    if (!token || !userId) {
      Alert.alert('Not logged in');
      return;
    }

    try {
      const payload = {
        items: items.map(item => ({
          prodID: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post(`${BASE_URL}/orders/neworder`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === 'OK') {
        Alert.alert('🛒 Order placed successfully!', `Order ID: ${res.data.id}`);

        
        const cartState = store.getState().cart;
        await AsyncStorage.setItem(`cart-${userId}`, JSON.stringify(cartState));

        dispatch(clearCart());
        dispatch(fetchOrders());
      } else {
        Alert.alert('Failed to place order', res.data.message || 'Try again');
      }
    } catch (err) {
      console.error('❌ Order Error:', err.message);
      Alert.alert('Order Failed', 'Something went wrong');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.product.title}</Text>
        <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(decreaseQuantity(item.product.id))}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(increaseQuantity(item.product.id))}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <Text style={styles.empty}>🛒 Your shopping cart is empty</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Items: {totalQuantity}</Text>
            <Text style={styles.summaryText}>Total Price: ${totalPrice.toFixed(2)}</Text>
          </View>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.product.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <View style={styles.checkoutBar}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f7fa',
  },
  empty: {
    marginTop: 50,
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  summary: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 12,
    backgroundColor: '#eef1f7',
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  checkoutBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
