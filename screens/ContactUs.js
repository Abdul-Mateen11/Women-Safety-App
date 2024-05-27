import React, { useState } from 'react';
import { View, TextInput, Button, Linking, Alert, StyleSheet ,Text, TouchableOpacity } from 'react-native';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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
    backgroundColor:'pink',
    flex: 1,
    //backgroundColor: '#fff',
  },
  titleBar: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#800080',
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
    backgroundColor:'pink',
    borderBottomWidth: 2,
    //marginBottom: 10,
    borderColor: '#800080',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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

export default ContactUs;
