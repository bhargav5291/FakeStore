import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signIn } from '../api/auth';
import { loginSuccess } from '../redux/authSlice';
import { loadCart } from '../redux/cartSlice';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError('');
    try {
      const res = await signIn(email, password);
      if (res.success) {
        const { user, token } = res;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', user.id.toString());
        const cartData = await AsyncStorage.getItem(`cart-${user.id}`);
        if (cartData) {
          dispatch(loadCart(JSON.parse(cartData)));
        }
        dispatch(loginSuccess({ user, token }));
        navigation.replace('MainTabs', { screen: 'Profile' });
      } else {
        setError(res.message || '❌ Login failed. Please try again.');
      }
    } catch (err) {
      console.error('LOGIN ERROR:', err.message || err);
      setError('❌ Login error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.header}>🛍️ Fake Store</Text>
        <Text style={styles.subHeader}>Log in to continue</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#2e7d32',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  linkBold: {
    color: '#007bff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
  },
});
