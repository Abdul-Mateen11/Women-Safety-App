import bcrypt from 'react-native-bcrypt';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebase, db } from '../config'; // Adjust the import if config.js is in the same directory

const SignupScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff', 
    });
  }, [navigation]);
  
  const sendVerification = () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!phone.startsWith('+')) {
      Alert.alert('Error', 'Please include the country code in your phone number (e.g., +123456789)');
      return;
    }

    setLoading(true);

    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current)
      .then(setVerificationId)
      .then(() => {
        Alert.alert('Verification code sent to your phone');
      })
      .catch((error) => {
        console.error('Error verifying phone number:', error);
        if (error.code === 'auth/invalid-phone-number') {
          Alert.alert('Invalid Phone Number', 'The phone number you entered is not valid.');
        } else if (error.code === 'auth/quota-exceeded') {
          Alert.alert('Quota Exceeded', 'SMS quota for verification has been exceeded. Please try again later.');
        } else if (error.code === 'auth/user-disabled') {
          Alert.alert('User Disabled', 'This user account has been disabled.');
        } else {
          Alert.alert('Verification Error', 'An error occurred while sending the verification code. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const confirmCode = () => {
    if (!verificationId || !code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    setLoading(true);
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
    firebase.auth().signInWithCredential(credential)
      .then(async () => {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const userData = { phone, password: hashedPassword };
        await db.collection('users').doc(phone).set(userData);
        setCode('');
        Alert.alert('Signup Successful. Please Login');
        navigation.replace('LoginScreen');
      })
      .catch((error) => {
        Alert.alert(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleSignup = () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!phone.startsWith('+')) {
      Alert.alert('Error', 'Please include the country code in your phone number (e.g., +123456789)');
      return;
    }

    if (!password || password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    confirmCode();
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />
      <Text style={styles.title}>Women Safety App</Text>
      <Image
        style={styles.logo}
        source={{ uri: 'https://play-lh.googleusercontent.com/sgeJOxuq9bVpQLCPRlB_TZvvjj4Q_9TVnNUGmopWVq2d-jWKeZNF_NWBbap_F0aFdic' }}
      />
      <Text style={styles.loginPrompt}>Signup to New Account</Text>
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
      <TouchableOpacity style={styles.buttonContainer} onPress={sendVerification}>
        <Text style={styles.buttonText}>Send Verification</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.codeInput}
        placeholder="Enter Verification Code"
        placeholderTextColor="#800080"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        color="#800080"
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
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
  codeInput: {
    width: '60%',
    height: 40,
    borderWidth: 1,
    borderColor: 'pink',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
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
  loadingIndicator: {
    marginTop: 20,
  },
});

export default SignupScreen;
