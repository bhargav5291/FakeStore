import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/ordersSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../utils/api';

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.userOrders);
  const products = useSelector((state) => state.products.products); 
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const toggleSection = (status) => {
    setExpanded((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const getStatus = (order) => {
    if (!order.is_paid) return 'new';
    if (!order.is_delivered) return 'paid';
    return 'delivered';
  };

  const getOrdersByStatus = (status) =>
    orders.filter((order) => getStatus(order) === status);

  const renderOrderItem = (item, idx) => {
    const product = products.find(p => p.id === Number(item.prodID));
    return (
      <View key={idx} style={styles.itemCard}>
        <Image
          source={{ uri: product?.image || 'https://via.placeholder.com/60' }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text numberOfLines={2} style={styles.itemTitle}>
            {product?.title || `Product ID: ${item.prodID}`}
          </Text>
          <Text style={styles.itemMeta}>Price: ${item.price}</Text>
          <Text style={styles.itemMeta}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );
  };

  const renderOrder = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderTop}>
        <Text style={styles.orderText}>🧾 Order ID: {order.id}</Text>
        <Text style={styles.orderText}>Items: {order.item_numbers}</Text>
        <Text style={styles.orderText}>Total: ${(order.total_price / 100).toFixed(2)}</Text>
      </View>

      {expanded[order.id] && (
        <View>
          {order.order_items && (() => {
            try {
              const items = JSON.parse(order.order_items); 
              return items.map((item, idx) => renderOrderItem(item, idx));
            } catch (e) {
              console.warn('Failed to parse order_items:', order.order_items);
              return <Text style={{ color: 'red' }}>Failed to load items</Text>;
            }
          })()}

          {getStatus(order) === 'new' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.payBtn]}
              onPress={async () => {
                const token = await AsyncStorage.getItem('token');
                await axios.post(`${BASE_URL}/orders/updateorder`, {
                  orderID: order.id,
                  isPaid: 1,
                  isDelivered: 0,
                }, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                alert(`💳 Order ${order.id} paid!`);
                dispatch(fetchOrders());
              }}
            >
              <Text style={styles.actionText}>💳 Pay</Text>
            </TouchableOpacity>
          )}

          {getStatus(order) === 'paid' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.receiveBtn]}
              onPress={async () => {
                const token = await AsyncStorage.getItem('token');
                await axios.post(`${BASE_URL}/orders/updateorder`, {
                  orderID: order.id,
                  isPaid: 1,
                  isDelivered: 1,
                }, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                alert(`📦 Order ${order.id} received`);
                dispatch(fetchOrders());
              }}
            >
              <Text style={styles.actionText}>📦 Receive</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() =>
          setExpanded((prev) => ({
            ...prev,
            [order.id]: !prev[order.id],
          }))
        }
      >
        <Text style={styles.toggleText}>
          {expanded[order.id] ? '▲ Hide' : '▼ Expand'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const sectionLabel = {
    new: '🆕 New Orders',
    paid: '💰 Paid Orders',
    delivered: '📦 Delivered Orders',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>📋 My Orders</Text>
      {['new', 'paid', 'delivered'].map((status) => (
        <View key={status}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(status)}
          >
            <Text style={styles.sectionText}>
              {sectionLabel[status]}: {getOrdersByStatus(status).length}
            </Text>
            <Text style={styles.arrow}>{expanded[status] ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {expanded[status] &&
            getOrdersByStatus(status).map((order) => renderOrder(order))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#f2f6fc',
    flex: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  sectionHeader: {
    backgroundColor: '#d0e3ff',
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0d47a1',
  },
  arrow: {
    fontSize: 16,
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  orderTop: {
    marginBottom: 8,
  },
  orderText: {
    fontSize: 14,
    color: '#333',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f9fbfc',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#555',
  },
  toggleText: {
    marginTop: 10,
    textAlign: 'right',
    color: '#007bff',
    fontWeight: '600',
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 14,
    alignItems: 'center',
  },
  payBtn: {
    backgroundColor: '#2e7d32',
  },
  receiveBtn: {
    backgroundColor: '#0277bd',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
