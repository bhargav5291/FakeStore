import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Product Details</Text>

      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Rate: {product.rating?.rate || 'N/A'}</Text>
        <Text style={styles.meta}>Sold: {product.rating?.count || 'N/A'}</Text>
        <Text style={styles.meta}>Price: ${product.price.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>◀ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheading}>Description:</Text>
      <View style={styles.descBox}>
        <Text style={styles.descText}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#2196f3',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '90%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  meta: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  descBox: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginTop: 8,
  },
  descText: {
    fontSize: 14,
    color: '#333',
  },
});
