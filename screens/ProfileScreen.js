import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { getProfile, updateProfile } from '../api/auth';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setName(data.name);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('SignIn');
  };

  const handleUpdate = async () => {
    if (!name || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    const res = await updateProfile(name, password);
    if (res.success) {
      Alert.alert('✅ Profile updated!');
      setProfile({ ...profile, name });
      setEditMode(false);
    } else {
      Alert.alert('❌ Failed', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>👋 Welcome, {profile.name}!</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={styles.value}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        {editMode && (
          <View style={styles.section}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          {editMode ? (
            <>
              <TouchableOpacity style={styles.btnGreen} onPress={handleUpdate}>
                <Text style={styles.btnText}>✅ Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGray} onPress={() => setEditMode(false)}>
                <Text style={styles.btnText}>❌ Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.btnBlue} onPress={() => setEditMode(true)}>
                <Text style={styles.btnText}>🔧 Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnRed} onPress={handleLogout}>
                <Text style={styles.btnText}>🚪 Sign Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0f6',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f7f9fc',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#111',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  btnBlue: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnGreen: {
    backgroundColor: '#388e3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnRed: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnGray: {
    backgroundColor: '#888',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
