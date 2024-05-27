import React from 'react';
import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking , ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../ThemeContext';
import * as Location from 'expo-location';
import { phoneNumber } from './global';
import { collection, addDoc, query, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config';


const HomeScreen = ({ navigation }) => {
  const { darkMode } = useTheme();
  const themeStyles = darkMode ? darkTheme : lightTheme;
  const [loading, setLoading] = useState(false);

  
  const LoadingOverlay = () => (
    <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
      <ActivityIndicator size="large" color="#800080" />
    </View>
  );

  const makeCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const generateMapUrl = (latitude, longitude) => {
    const baseUrl = 'https://www.google.com/maps';
    return `${baseUrl}?q=${latitude},${longitude}`;
  };

  const handleAlert = async () => {
    Alert.alert(
      "Emergency Alert",
      "Are you sure you want to send an emergency alert?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Send",
          onPress: async () => {
            try {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
              }
              let location = await Location.getCurrentPositionAsync({});
              const locationUrl = generateMapUrl(location.coords.latitude, location.coords.longitude);
  
              if (locationUrl) {
                setLoading(true);
                const { latitude, longitude } = location.coords;
                const locationUrl = generateMapUrl(latitude, longitude);
  
                try {
                  const profileDoc = await getDoc(doc(db, 'Profile', phoneNumber));
                  const userName = profileDoc.exists() ? profileDoc.data().name : 'Unknown';
  
                  const querySnapshot = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', phoneNumber)));
  
                  // Send emergency message to existing conversations
                  const updatePromises = querySnapshot.docs.map(async (cdoc) => {
                    const conversationId = cdoc.id;
  
                    console.log('Adding emergency message to conversation:', conversationId);
  
                    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                      _id: new Date().getTime().toString(),
                      createdAt: new Date(),
                      text: 'Help Needed, I am in danger. Here is My Current Location',
                      user: { _id: phoneNumber, name: userName }
                    });
  
                    console.log('Updating last message in conversation:', conversationId);
  
                    await setDoc(doc(db, 'conversations', conversationId), {
                      participants: conversationId.split('_'),
                      lastMessage: 'Help Needed, I am in danger. Here is My Current Location',
                      lastMessageDate: new Date(),
                    }, { merge: true });
                  });
  
                  await Promise.all(updatePromises);
  
                  // Send location message to existing conversations
                  const locationPromises = querySnapshot.docs.map(async (cdoc) => {
                    const conversationId = cdoc.id;
  
                    console.log('Adding location message to conversation:', conversationId);
  
                    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                      _id: new Date().getTime().toString(),
                      createdAt: new Date(),
                      text: locationUrl,
                      user: { _id: phoneNumber, name: userName }
                    });
  
                    console.log('Updating last message in conversation:', conversationId);
  
                    await setDoc(doc(db, 'conversations', conversationId), {
                      participants: conversationId.split('_'),
                      lastMessage: locationUrl,
                      lastMessageDate: new Date(),
                    }, { merge: true });
                  });
  
                  await Promise.all(locationPromises);
  
                  // Check for uncontacted emergency contacts and send them the messages
                  const emergencyContactsSnapshot = await getDocs(collection(db, 'emergencyContacts'));
                  const emergencyContacts = emergencyContactsSnapshot.docs.map(doc => doc.data().phone);
                  console.log('Emergency Contacts:', emergencyContacts);
  
                  const conversationIDs = querySnapshot.docs.map(doc => doc.id);
                  console.log('Conversation IDs:', conversationIDs);
  
                  const isPhoneInConversation = (phone, conversationIDs) => {
                    return conversationIDs.some(id => {
                      const participants = id.split('_');
                      return participants.includes(phone) && participants.includes(phoneNumber);
                    });
                  };
  
                  const uncontactedEmergencies = emergencyContacts.filter(contact => {
                    console.log(`Checking if contact ${contact} is in any conversation...`);
                    return !isPhoneInConversation(contact, conversationIDs);
                  });
  
                  if (uncontactedEmergencies.length > 0) {
                    console.log('There are emergency contacts with whom no chat has taken place:', uncontactedEmergencies);
                    
                    const uncontactedPromises = uncontactedEmergencies.map(async (contact) => {
                      const conversationId = `${phoneNumber}_${contact}`;
  
                      console.log('Creating new conversation and adding emergency message:', conversationId);
  
                      await setDoc(doc(db, 'conversations', conversationId), {
                        participants: [phoneNumber, contact],
                        lastMessage: 'Help Needed, I am in danger. Here is My Current Location',
                        lastMessageDate: new Date(),
                      });
  
                      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                        _id: new Date().getTime().toString(),
                        createdAt: new Date(),
                        text: 'Help Needed, I am in danger. Here is My Current Location',
                        user: { _id: phoneNumber, name: userName }
                      });
  
                      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
                        _id: new Date().getTime().toString(),
                        createdAt: new Date(),
                        text: locationUrl,
                        user: { _id: phoneNumber, name: userName }
                      });
  
                      console.log('New conversation created and messages sent:', conversationId);
                    });
  
                    await Promise.all(uncontactedPromises);
                  } else {
                    console.log('All emergency contacts have been contacted.');
                  }
  
                  Alert.alert('Success', 'Emergency alert sent successfully');
                } catch (error) {
                  console.error('Error sharing location:', error);
                  Alert.alert('Error', 'Failed to share location');
                } finally {
                  setLoading(false);
                }
              } else {
                console.log('Location is not available.');
              }
            } catch (error) {
              console.error('Error sending location:', error);
              Alert.alert('Error', 'Failed to share location');
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={[styles.container, themeStyles.container]}>
        <View style={[styles.titleBar, themeStyles.titleBar]}>
          <Text style={[styles.titleText, themeStyles.titleText]}>"Welcome to Women's Safety App"</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => navigation.navigate('SafetyTips')}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Safety Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => navigation.navigate('ChatList')}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Live Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.circleButton, { backgroundColor: 'white', borderColor: '#800080' }]}
            onPress={() => {
              // Check if the phone number matches the specified condition
              if (phoneNumber === '+923163002350') {
                navigation.navigate('AddResouce');
              } else {
                navigation.navigate('Resources');
              }
            }}
          >
            <Text style={[styles.buttonText]}>Resources</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.inputContainer, themeStyles.inputContainer]} onPress={() => navigation.navigate('Location')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4662/4662384.png' }}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, themeStyles.inputText]}>GPS Tracking</Text>
          <Text style={[styles.arrowText, themeStyles.arrowText]}>{">"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.inputContainer, themeStyles.inputContainer]} onPress={() => navigation.navigate('EmergencyContact')}>
          <Image
            source={{ uri: 'https://i.pinimg.com/originals/37/34/8a/37348a499514a3d8e8414aeca055ea22.jpg' }}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, themeStyles.inputText]}>Emergency Contacts</Text>
          <Text style={[styles.arrowText, themeStyles.arrowText]}>{">"}</Text>
        </TouchableOpacity>

        {/* Call Buttons */}
        <View style={styles.callButtonRow}>
          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1124')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1124</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Punjab Highway Patrol</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1122')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1122</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Rescue Helpline</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.callButtonRow}>
          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('130')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>130</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Motorway Police</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.callButton, themeStyles.callButton]} onPress={() => makeCall('1991')}>
            <View style={[styles.innerBorder, themeStyles.innerBorder]}>
              <Icon name="phone" size={20} color={themeStyles.iconColor.color} style={styles.iconStyle} />
              <View style={styles.textContainer}>
                <Text style={[styles.callButtonNumber, themeStyles.callButtonNumber]}>1991</Text>
                <Text style={[styles.callButtonLabel, themeStyles.callButtonLabel]}>Call Cyber Crime Helpline</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* FooterBar */}
        <View style={[styles.footerBar, themeStyles.footerBar]}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="user" size={20} color="#800080" style={styles.footerIcon} />
            <Text style={[styles.footerButtonText, themeStyles.footerButtonText]}>Go to Profile</Text>
          </TouchableOpacity>

          {/* Alert Button */}
        <TouchableOpacity style={[styles.alertButton, { backgroundColor: '#DC143C', borderColor: '#DC143C' }]} onPress={handleAlert}>
          <Text style={[styles.buttonText, { color: 'white' }]}>Alert</Text>
        </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={20} color="#800080" style={styles.footerIcon} />
            <Text style={[styles.footerButtonText, themeStyles.footerButtonText]}>Settings</Text>
          </TouchableOpacity>
        </View>
        {/* Conditional rendering of the loading overlay */}
        {loading && <LoadingOverlay />}
      </View>
    </ScrollView>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  titleBar: {
    backgroundColor: 'pink',
  },
  titleText: {
    color: 'white',
  },
  buttonText: {
    color: '#800080',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderColor: '#800080',
  },
  inputText: {
    color: '#800080',
  },
  arrowText: {
    color: '#800080',
  },
  callButton: {
    backgroundColor: 'white',
    borderColor: '#800080',
  },
  innerBorder: {
    borderColor: '#800080',
  },
  callButtonNumber: {
    color: '#800080',
  },
  callButtonLabel: {
    color: '#800080',
  },
  footerBar: {
    backgroundColor: 'pink',
  },
  footerButtonText: {
    color: '#800080',
  },
  iconColor: {
    color: '#800080',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  titleBar: {
    backgroundColor: 'pink',
  },
  titleText: {
    color: '#ffffff',
  },
  buttonText: {
    color: '#800080',
  },
  inputContainer: {
    backgroundColor: '#1f1f1f',
    borderColor: '#800080',
  },
  inputText: {
    color: '#ffffff',
  },
  arrowText: {
    color: 'pink',
  },
  callButton: {
    backgroundColor: '#1f1f1f',
    borderColor: '#800080',
  },
  innerBorder: {
    borderColor: '#800080',
  },
  callButtonNumber: {
    color: '#ffffff',
  },
  callButtonLabel: {
    color: '#ffffff',
  },
  footerBar: {
    backgroundColor: 'pink',
  },
  footerButtonText: {
    color: '#800080',
  },
  iconColor: {
    color: 'pink',
  },
});

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 120,
  },
  titleBar: {
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 19,
    textAlign: 'center',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  circleButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 6,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 20,
    justifyContent: 'space-between', 
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  inputText: {
    fontSize: 16,
    flex: 1, 
    paddingLeft: 10,
  },
  arrowText: {
    fontSize: 16,
  },
  callButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '94%',
    marginTop: 10,
    marginBottom: 20,
  },
  callButton: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'flex-start', 
    width: '45%',
    margin: 5,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 10, 
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1, 
  },
  callButtonNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  callButtonLabel: {
    fontSize: 13,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  footerButton: {
    padding: 15,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerIcon: {
    marginBottom: 5,
  },
  alertButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderWidth: 6,
    padding: 10,
    position: 'relative', 
    top: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50,
    shadowRadius: 5.65,
    elevation: 8,
  },
});

export default HomeScreen;
