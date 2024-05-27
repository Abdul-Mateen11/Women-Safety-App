// FAQScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FAQScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions (FAQ)</Text>

      <Text style={styles.question}>1. How do I register?</Text>
      <Text style={styles.answer}>
        To register, download the Women Safety App from the App Store or Google Play Store, open the app, and follow the registration prompts. You will need to provide your phone number, name, and create a password.
      </Text>

      <Text style={styles.question}>2. How do I add emergency contacts?</Text>
      <Text style={styles.answer}>
        To add emergency contacts, go to the "Emergency Contacts" section in the app. Tap on "Add Contact" and enter the contact's name and phone number. You can add multiple emergency contacts who will be notified in case of an emergency.
      </Text>

      <Text style={styles.question}>3. How does location sharing work?</Text>
      <Text style={styles.answer}>
        Location sharing allows you to share your real-time location with your emergency contacts. You can enable location sharing from the main screen or during an emergency situation. Your location will be updated continuously until you turn off location sharing.
      </Text>

      <Text style={styles.question}>4. How do I access resources like lawyers and therapists?</Text>
      <Text style={styles.answer}>
        To access resources, navigate to the "Resources" section in the app. Here you will find a list of verified lawyers, psychiatrists, therapists, and other professionals who can provide assistance.
      </Text>

      <Text style={styles.question}>5. Is my data secure?</Text>
      <Text style={styles.answer}>
        Yes, we take data security very seriously. All personal information and data are encrypted and stored securely. We comply with relevant data protection regulations to ensure your information is safe.
      </Text>

      <Text style={styles.question}>6. How do I change my password?</Text>
      <Text style={styles.answer}>
        To change your password, go to the "Settings" section in the app, then select "Change Password." Enter your old password followed by your new password and confirm the change.
      </Text>

      <Text style={styles.question}>7. What should I do in an emergency?</Text>
      <Text style={styles.answer}>
        In an emergency, open the app and press the "Emergency" button. This will notify your emergency contacts and share your real-time location with them. You can also use the "Emergency Chat" feature to communicate quickly with your contacts.
      </Text>

      <Text style={styles.question}>8. How can I delete my account?</Text>
      <Text style={styles.answer}>
        To delete your account, go to the "Settings" section and select "Delete Account." Confirm the deletion by entering your password. Once confirmed, all your data will be permanently removed from our servers. If you encounter any issues, please contact us at abdmj908@gmail.com for assistance.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CustomerSupport')}>
        <Text style={styles.buttonText}>Contact Customer Support</Text>
      </TouchableOpacity>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  answer: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#800080',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FAQScreen;
