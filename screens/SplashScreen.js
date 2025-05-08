import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 1500); // Navigate after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/splash.jpg')} // 🔁 Your full image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>🛍️ Fake Store</Text>
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
    backgroundColor: 'rgba(255,255,255,0.6)', // optional semi-transparent background
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default SplashScreen;
