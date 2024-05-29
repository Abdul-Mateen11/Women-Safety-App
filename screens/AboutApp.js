import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutApp = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Change the navigation bar color here
      },
      headerTintColor: '#fff', // Change the text color of the navigation bar if needed
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.titleBar}>
        <Text style={styles.titleBarText}>Women’s Safety Android App</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>About App</Text>
        <Text style={styles.text}>
          The Women’s Safety Android App is a dedicated solution designed to enhance the safety and security of women. By leveraging technology, this application provides essential features to help women in challenging situations. The app's core functionalities include location sharing, emergency chat, access to resources, and maintaining emergency contacts.
        </Text>
        <Text style={styles.header}>Introduction</Text>
        <Text style={styles.text}>
          In today’s world, it’s really important to make sure that women are safe. As we use more and more technology in our daily lives, it’s becoming really necessary to create an app for Android phones that focuses specifically on keeping women safe. This article is going to talk about how that app is built, what it can do, and how it all works behind the scenes.
        </Text>
        <Text style={styles.header}>System Requirements</Text>
        <Text style={styles.text}>
          Our women’s safety Android application is designed to provide solutions to women in difficult situations. To meet the needs of potential customers, the design process needs to be fast and efficient. Considering the nature of the application, it is important to ensure data security and privacy.
        </Text>
        <Text style={styles.header}>Third-Party Components</Text>
        <Text style={styles.text}>
          To enhance the functionality and performance of the app, it leverages the following third-party components:
        </Text>
        <Text style={styles.subHeader}>1. Google Maps API</Text>
        <Text style={styles.text}>
          The GPS tracking module utilizes Google Maps API for accurate location tracking and mapping.
        </Text>
        <Text style={styles.subHeader}>2. SMS Gateway Service</Text>
        <Text style={styles.text}>
          Integration with an SMS gateway service enables easy transmission of emergency alerts via SMS.
        </Text>
        <Text style={styles.subHeader}>3. Chat SDK</Text>
        <Text style={styles.text}>
          Utilizing a chat SDK facilitates secure communication within the app, allowing users to connect with lawyers, therapists, or Emergency contacts.
        </Text>
        <Text style={styles.header}>Infrastructure and Database</Text>
        <Text style={styles.subHeader}>1. Database</Text>
        <Text style={styles.text}>
          For our app, a relational database is well-suited to handle the data associated with users, contacts, resources, and communication logs. MySQL, for instance, offers the necessary features for efficient data management and retrieval. Its support for transactions ensures data integrity, essential for sensitive information like emergency alerts and communication logs.
        </Text>
        <Text style={styles.subHeader}>2. Storing Images</Text>
        <Text style={styles.text}>
          Utilizing a content delivery network (CDN) can accelerate the delivery of images within the app. The URLs of images can be stored in the database, ensuring efficient retrieval and rendering within the app.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleBar: {
    backgroundColor: 'pink',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#701C78',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#800080',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: '#800080',
    textAlign: 'justify',
    marginVertical: 5,
  },
});

export default AboutApp;
