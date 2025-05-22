import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLogin = () => {
      navigation.replace('SignIn'); 
    };

    setTimeout(checkLogin, 3000);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/splash.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>🛍️ Fake Store</Text>
        <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default SplashScreen;
