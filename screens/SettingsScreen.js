import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClearCache = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Cache has been cleared successfully.');
    }, 2000);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              // Delete the account data from Firestore
              await db.collection('users').doc(phoneNumber).delete();
              setLoading(false);
              Alert.alert('Deleted', 'Your account and associated data have been deleted.');
              // Navigate to the login screen
              navigation.navigate('LoginScreen');
            } catch (error) {
              console.error('Error deleting account:', error);
              setLoading(false);
              Alert.alert('Error', 'Failed to delete your account. Please try again later.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.clear();
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const themeStyles = darkMode ? darkTheme : lightTheme;

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={[themeStyles.sectionTitle, styles.sectionTitle]}>Profile</Text>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('Profile')}>
          <Text style={themeStyles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={themeStyles.itemText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[themeStyles.sectionTitle, styles.sectionTitle]}>Preferences</Text>
        <View style={[styles.item, themeStyles.item]}>
          <Text style={themeStyles.itemText}>Notifications</Text>
          <Switch 
            value={notificationsEnabled} 
            onValueChange={setNotificationsEnabled} 
            thumbColor={notificationsEnabled ? 'pink' : 'plum'}
            trackColor={{ false: 'plum', true: 'pink' }}
          />
        </View>
        <View style={[styles.item, themeStyles.item]}>
          <Text style={themeStyles.itemText}>Dark Mode</Text>
          <Switch 
            value={darkMode} 
            onValueChange={toggleTheme} 
            thumbColor={darkMode ? 'pink' : 'plum'}
            trackColor={{ false: 'plum', true: 'pink' }}
          />
        </View>
        <TouchableOpacity style={[styles.item, themeStyles.item]}>
          <Text style={themeStyles.itemText}>Language</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[themeStyles.sectionTitle, styles.sectionTitle]}>Data</Text>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={handleClearCache}>
          <Text style={themeStyles.itemText}>Clear Cache</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={handleDeleteAccount}>
          <Text style={themeStyles.itemText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={handleLogout}>
          <Text style={themeStyles.itemText}>Logout Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[themeStyles.sectionTitle, styles.sectionTitle]}>Support</Text>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('FAQ')}>
          <Text style={themeStyles.itemText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('CustomerSupport')}>
          <Text style={themeStyles.itemText}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('ContactUs')}>
          <Text style={themeStyles.itemText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('ContactUs')}>
          <Text style={themeStyles.itemText}>Report a Problem</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[themeStyles.sectionTitle, styles.sectionTitle]}>About</Text>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('TermsOfService')}>
          <Text style={themeStyles.itemText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={themeStyles.itemText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('AppVersion')}>
          <Text style={themeStyles.itemText}>App Version</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, themeStyles.item]} onPress={() => navigation.navigate('AboutApp')}>
          <Text style={themeStyles.itemText}>About the App</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Loading Indicator */}
      <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#800080" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    color: '#701C78',
  },
  item: {
    backgroundColor: 'white',
  },
  itemText: {
    color: '#800080',
    fontSize: 16, 
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  sectionTitle: {
    color: '#800080',
  },
  item: {
    backgroundColor: '#1f1f1f',
  },
  itemText: {
    color: 'pink',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  titleBar: {
    backgroundColor: 'pink',
    paddingVertical: 14,
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#800080',
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#ffffff',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
