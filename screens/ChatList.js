import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet , ActivityIndicator} from 'react-native';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firebase, db } from '../config'; // Ensure the path to your Firebase configuration is correct
import { phoneNumber } from './global';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const navigation = useNavigation();
  const userPhone = phoneNumber;
  const [loading, setLoading] = useState(true); // Loading state

  const predefinedContacts = [
    { id: '1', phone: '+923163002350', name: 'Emergency Chat' },
    // Add more predefined contacts here with unique ids
  ];

  useEffect(() => {
    setLoading(true);
    const fetchConversations = () => {
      const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userPhone));
      return onSnapshot(q, querySnapshot => {
        const convos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConversations(convos);
      });
    };

    const fetchEmergencyContacts = async () => {
      const q = query(collection(db, 'emergencyContacts'), where('userPhone', '==', userPhone));
      const querySnapshot = await getDocs(q);
      const contacts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmergencyContacts(contacts);
    };

    const unsubscribeConversations = fetchConversations();
    fetchEmergencyContacts().then(() => setLoading(false));

    
    return () => {
      unsubscribeConversations();
    };
  }, [userPhone]);

  const handleChatSelect = (recipientPhone) => {
    //const conversationId = `${userPhone}_${recipientPhone}`;
    navigation.navigate('LiveChat', { recipientPhone });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatSelect(item.phone)} style={styles.conversationItem}>
      <View style={styles.conversationTextContainer}>
        <Text style={styles.conversationName}>
          {item.name}
        </Text>
        {item.lastMessage && (
          <Text style={styles.conversationMessage}>
            {item.lastMessage}
          </Text>
        )}
      </View>
      {item.lastMessage && item.lastMessageDate && (
        <Text style={styles.conversationDate}>
          {new Date(item.lastMessageDate.seconds * 1000).toLocaleDateString()} {new Date(item.lastMessageDate.seconds * 1000).toLocaleTimeString()}
        </Text>
      )}
    </TouchableOpacity>
  );

// Filter out predefined emergency contacts if the user is already an emergency contact
const filteredPredefinedContacts = predefinedContacts.filter(contact => contact.phone !== userPhone);

// Combine predefined contacts, fetched emergency contacts, and conversations without duplicating
const combinedData = filteredPredefinedContacts.concat(emergencyContacts).map(contact => {
  const conversation = conversations.find(convo => convo.participants.includes(contact.phone));
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    lastMessage: conversation ? conversation.lastMessage : null,
    lastMessageDate: conversation ? conversation.lastMessageDate : null,
  };
}).concat(conversations.filter(convo => ![...filteredPredefinedContacts, ...emergencyContacts].some(contact => contact.phone === convo.participants.find(p => p !== userPhone)))
  .map(convo => ({
    id: convo.id,
    name: convo.participants.find(p => p !== userPhone),
    phone: convo.participants.find(p => p !== userPhone),
    lastMessage: convo.lastMessage,
    lastMessageDate: convo.lastMessageDate,
  })));
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={combinedData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  conversationTextContainer: {
    flex: 1
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  conversationMessage: {
    fontSize: 14,
    color: '#888'
  },
  conversationDate: {
    fontSize: 12,
    color: '#888'
  }
});

export default ChatList;
