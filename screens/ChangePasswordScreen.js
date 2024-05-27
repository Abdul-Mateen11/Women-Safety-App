import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../config'; // Assuming you have imported db from global
import bcrypt from 'react-native-bcrypt';
import { phoneNumber } from './global';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //console.log(oldPassword)

  const comparePasswords = (plainPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all the fields');
    } else if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      // Check old password against hashed password from the database
      const userRef = db.collection('users').doc(phoneNumber); // Assuming phoneNumber is the user's phone number
      const snapshot = await userRef.get();
      
      if (!snapshot.exists) {
        Alert.alert('Error', 'User not found');
        return;
      }
      
      const userData = snapshot.data();
      const hashedPasswordFromDatabase = userData.password;
      const isOldPasswordCorrect = await comparePasswords(oldPassword, hashedPasswordFromDatabase);

      if (isOldPasswordCorrect) {
        try {
          const hashedNewPassword = await bcrypt.hashSync(newPassword, 10); // Hash the new password
          await userRef.update({ password: hashedNewPassword });
          Alert.alert('Success', 'Password changed successfully');
          navigation.goBack();
        } catch (error) {
          console.error('Error updating password:', error);
          Alert.alert('Error', 'Failed to change password. Please try again later.');
        }
      } else {
        Alert.alert('Error', 'Old password is incorrect');
      }
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Old Password"
          placeholderTextColor="#800080"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPassword}
          autoCapitalize="none"
          color="#800080"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleOldPasswordVisibility}
        >
          <Icon name={showOldPassword ? 'eye' : 'eye-slash'} size={24} color="#800080" />
        </TouchableOpacity>
        <Icon name="lock" size={24} color="#800080" style={styles.iconInsideInput} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          placeholderTextColor="#800080"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          autoCapitalize="none"
          color="#800080"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleNewPasswordVisibility}
        >
          <Icon name={showNewPassword ? 'eye' : 'eye-slash'} size={24} color="#800080" />
        </TouchableOpacity>
        <Icon name="lock" size={24} color="#800080" style={styles.iconInsideInput} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#800080"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          color="#800080"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={toggleConfirmPasswordVisibility}
        >
          <Icon name={showConfirmPassword ? 'eye' : 'eye-slash'} size={24} color="#800080" />
        </TouchableOpacity>
        <Icon name="lock" size={24} color="#800080" style={styles.iconInsideInput} />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
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
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ChangePasswordScreen;
