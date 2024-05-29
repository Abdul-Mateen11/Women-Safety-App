import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, Linking, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', 
      },
      headerTintColor: '#fff', 
    });
  }, [navigation]);

  const sendEmail = () => {
    const recipientEmail = 'abdmj908@gmail.com';
    const subject = 'Feedback from Women Safety App';

    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;

    Linking.canOpenURL(mailtoLink).then(supported => {
      if (!supported) {
        console.error("Can't handle url: " + mailtoLink);
        Alert.alert("Error", "Unable to open email app.");
      } else {
        return Linking.openURL(mailtoLink);
      }
    }).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Contact Us</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          onChangeText={text => setName(text)}
          value={name}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Message"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
          onChangeText={text => setMessage(text)}
          value={message}
        />
        <TouchableOpacity style={styles.button} onPress={sendEmail}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  titleBar: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink', 
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#fff',
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderColor: '#800080',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#800080',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#800080',
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ContactUs;
