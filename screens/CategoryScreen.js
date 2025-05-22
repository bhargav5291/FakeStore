import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/api';

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/products/categories`)
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      });
  }, []);

  const formatCategoryName = (name) => {
    switch (name.toLowerCase()) {
      case 'electronics':
        return "📱 Electronics";
      case 'jewelery':
        return "💍 Jewelry";
      case "men's clothing":
        return "👔 Men's Clothing";
      case "women's clothing":
        return "👗 Women's Clothing";
      default:
        return name;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductList', { category: item })}
    >
      <Text style={styles.cardText}>{formatCategoryName(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛍️ Shop by Category</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#e8f0fe',
    padding: 20,
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
