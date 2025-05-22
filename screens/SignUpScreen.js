import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../utils/api';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users/signup`, {
        name,
        email,
        password,
      });

      console.log('SIGNUP RESPONSE:', res.data);

      if (res.data.status === 'OK') {
        Alert.alert('Success', 'Account created!');
        navigation.replace('SignIn');
      } else {
        Alert.alert('Signup Failed', res.data.message || 'Unexpected response from server.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      console.log('SIGNUP ERROR:', message);
      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.header}>📝 Sign Up</Text>
        <Text style={styles.subHeader}>Create your new account</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
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

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
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
  signupBtn: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupText: {
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
});
