import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();

// 🛍 Product Stack
const ProductsNavigator = () => (
  <ProductStack.Navigator initialRouteName="Categories">
    <ProductStack.Screen name="Categories" component={CategoryScreen} />
    <ProductStack.Screen name="ProductList" component={ProductListScreen} />
    <ProductStack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </ProductStack.Navigator>
);

// 🔄 Bottom Tabs
const TabNavigator = () => {
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'storefront-outline';
          else if (route.name === 'Cart') iconName = 'cart-outline';
          else if (route.name === 'Orders') iconName = 'receipt-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductsNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarBadge: totalQuantity > 0 ? totalQuantity : null }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
};

//  Root Stack Navigation
const MainNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="Splash">
      <RootStack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default MainNavigator;
