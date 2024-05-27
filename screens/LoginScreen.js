import React, { useEffect, useRef, useState } from 'react';
import bcrypt from 'react-native-bcrypt';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase, db } from '../config'; // Adjust the import if config.js is in the same directory
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPhoneNumber } from './global';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setPhoneNumber(parsedUserData.phone);
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Error reading user data from AsyncStorage:', error);
      }
    };

    checkLoggedIn();
  }, []);

  const comparePasswords = (plainPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (e) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter your phone number and password');
      return;
    }
  
    setLoading(true);
  
    try {
      const userDoc = await db.collection('users').doc(phone).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const isPasswordValid = await comparePasswords(password, userData.password);
        if (isPasswordValid) {
          await storeUserData(userData);
          setPhoneNumber(phone);
          
          // Check if the phone number is for AdminDashboard
          if (phone === '+923163002350') {
            navigation.replace('AdminDashboard');
          } else {
            navigation.replace('Home');
          }
        } else {
          Alert.alert('Error', 'Incorrect password. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Account not found. Please sign up.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety App</Text>
      <Image
        style={styles.logo}
        source={{ uri: 'https://play-lh.googleusercontent.com/sgeJOxuq9bVpQLCPRlB_TZvvjj4Q_9TVnNUGmopWVq2d-jWKeZNF_NWBbap_F0aFdic' }}
      />
      <Text style={styles.loginPrompt}>Login to Your Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone No"
          placeholderTextColor="#800080"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          color="#800080"
        />
        <Icon name="mobile" size={24} color="#800080" style={styles.iconInsideInput} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#800080"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          color="#800080"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={24} color="#800080" />
        </TouchableOpacity>
        <Icon name="lock" size={24} color="#800080" style={styles.iconInsideInput} />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signupText}>New here? Sign up</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#800080" style={styles.loadingIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    backgroundColor: 'pink',
    color: 'white',
    borderColor: 'pink',
    borderWidth: 1,
    padding: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loginPrompt: {
    fontSize: 18,
    marginBottom: 10,
    color: '#800080',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  iconInsideInput: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'pink',
    padding: 10,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 5,
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'pink',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    color: '#800080',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default LoginScreen;
