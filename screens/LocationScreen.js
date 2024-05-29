import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button, Dimensions, StyleSheet, View, Alert, ActivityIndicator ,Text } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { firebase, db } from '../config';
import { collection, addDoc, query, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { phoneNumber } from './global';

const LocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uncontactedEmergencies, setUncontactedEmergencies] = useState([]);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff', 
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Failed to retrieve location');
        console.error('Error retrieving location:', error);
      }
    })();
  }, []);

  const generateMapUrl = (latitude, longitude) => {
    const baseUrl = 'https://www.google.com/maps';
    const url = `${baseUrl}?q=${latitude},${longitude}`;
    return url;
  };

  const checkForUncontactedEmergency = async () => {
    try {
      // Fetch all emergency contacts for the current user
      const emergencyContactsSnapshot = await getDocs(
        query(collection(db, 'emergencyContacts'), where('userPhone', '==', phoneNumber))
      );
      
      const emergencyContacts = emergencyContactsSnapshot.docs.map(doc => doc.data().phone);
      console.log('Emergency Contacts:', emergencyContacts);
  
      // Fetch all conversation document IDs
      const conversationsSnapshot = await getDocs(collection(db, 'conversations'));
      const conversationIDs = conversationsSnapshot.docs.map(doc => doc.id);
      console.log('Conversation IDs:', conversationIDs);
  
      // Function to check if a phone number is in any conversation ID
      const isPhoneInConversation = (phone, conversationIDs) => {
        return conversationIDs.some(id => {
          const participants = id.split('_');
          return participants.includes(phone) && participants.includes(phoneNumber);
        });
      };
  
      // Find all emergency contacts with no chat
      const uncontactedEmergencies = emergencyContacts.filter(contact => {
        console.log(`Checking if contact ${contact} is in any conversation...`);
        return !isPhoneInConversation(contact, conversationIDs);
      });
  
      if (uncontactedEmergencies.length > 0) {
        console.log('There are emergency contacts with whom no chat has taken place:', uncontactedEmergencies);
        setUncontactedEmergencies(uncontactedEmergencies); // Save to state for later use
      } else {
        console.log('All emergency contacts have been contacted.');
      }
    } catch (error) {
      console.error('Error checking for uncontacted emergency:', error);
    }
  };
  
  // Call the function to check
  useEffect(() => {
    checkForUncontactedEmergency();
  }, []);

  const handleShareLocation = async () => {
    if (location) {
      setLoading(true);
      const { latitude, longitude } = location.coords;
      const locationUrl = generateMapUrl(latitude, longitude);

      try {
        // Fetch user's name from the Profile collection
        const profileDoc = await getDoc(doc(db, 'Profile', phoneNumber));
        const userName = profileDoc.exists() ? profileDoc.data().name : 'Unknown';

        const querySnapshot = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', phoneNumber)));

        const updatePromises = querySnapshot.docs.map(async (cdoc) => {
          const conversationId = cdoc.id;

          console.log('Adding location message to conversation:', conversationId);

          await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            _id: new Date().getTime().toString(),
            createdAt: new Date(),
            text: locationUrl,
            user: { _id: phoneNumber, name: userName } // Include the user's name
          });

          console.log('Updating last message in conversation:', conversationId);

          await setDoc(doc(db, 'conversations', conversationId), {
            participants: conversationId.split('_'),
            lastMessage: locationUrl,
            lastMessageDate: new Date(),
          }, { merge: true });
        });

        // Send location to uncontacted emergency contacts
        const uncontactedPromises = uncontactedEmergencies.map(async (contact) => {
          const conversationId = `${phoneNumber}_${contact}`;
          console.log('Creating new conversation and adding location message for:', conversationId);

          await setDoc(doc(db, 'conversations', conversationId), {
            participants: [contact, phoneNumber],
            lastMessage: locationUrl,
            lastMessageDate: new Date(),
          }, { merge: true });

          await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            _id: new Date().getTime().toString(),
            createdAt: new Date(),
            text: locationUrl,
            user: { _id: phoneNumber, name: userName } // Include the user's name
          });
        });

        await Promise.all([...updatePromises, ...uncontactedPromises]);
        Alert.alert('Success', 'Location shared successfully');
      } catch (error) {
        console.error('Error sharing location:', error);
        Alert.alert('Error', 'Failed to share location');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Location is not available.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#800080" />
      ) : (
        <>
          <MapView
            showsMyLocationButton={true}
            showsUserLocation={true}
            style={styles.map}
          />
          <Text></Text>
          <Button
            title="Share Location"
            onPress={handleShareLocation}
            color="#A94064"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 150,
  },
});

export default LocationScreen;
