import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import BASE_URL from '../utils/api';

export default function ProductListScreen({ route, navigation }) {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${BASE_URL}/products/category/${category}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardInfo}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => dispatch(addToCart(item))}
      >
        <Text style={styles.cartButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 6,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#eef1f7',
  },
  cardInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  cartButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
