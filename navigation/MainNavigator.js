// navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import SplashScreen from '../screens/SplashScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();

const ProductsNavigator = () => (
  <ProductStack.Navigator initialRouteName="Categories">
    <ProductStack.Screen name="Categories" component={CategoryScreen} options={{ headerShown: false }}/>
    <ProductStack.Screen name="ProductList" component={ProductListScreen} />
    <ProductStack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </ProductStack.Navigator>
);

const TabNavigator = () => {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'storefront-outline';
          else if (route.name === 'Cart') iconName = 'cart-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductsNavigator} options={{ headerShown: false }} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: totalQuantity > 0 ? totalQuantity : null,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Splash">
      <RootStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default MainNavigator;
