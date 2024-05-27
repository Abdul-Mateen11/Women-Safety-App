import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firebase, db } from '../config'; // Ensure the path to your Firebase configuration is correct
import { phoneNumber } from './global';

const Chat = ({ route }) => {
  const { recipientPhone } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation();
  const userPhone = phoneNumber; // Replace with dynamic fetching of user's phone number if available

  const constructConversationId = (participant1, participant2) => {
    // Sort the participants' phone numbers alphabetically
    const sortedParticipants = [participant1, participant2].sort();
    // Join the sorted phone numbers with an underscore
    return sortedParticipants.join('_');
  };

  const conversationId = constructConversationId(userPhone, recipientPhone);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDeleteConversation}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
      setLoading(false); // Set loading to false when messages are fetched
    });
    return unsubscribe;
  }, [conversationId]);

  const onSend = useCallback(async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      _id,
      createdAt,
      text,
      user
    });
    await setDoc(doc(db, 'conversations', conversationId), {
      participants: conversationId.split('_'),
      lastMessage: text,
      lastMessageDate: createdAt // Save the message timestamp
    }, { merge: true });
  }, [conversationId]);

  const handleDeleteConversation = async () => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            setLoading(true);
            try {
              // Delete all messages in the conversation
              const messagesQuerySnapshot = await getDocs(collection(db, 'conversations', conversationId, 'messages'));
              const deleteMessagesPromises = messagesQuerySnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deleteMessagesPromises);

              // Delete the conversation document
              await deleteDoc(doc(db, 'conversations', conversationId));

              // Navigate back after deleting
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting conversation: ", error);
              Alert.alert("Error", "Failed to delete conversation");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleLongPress = (context, message) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'conversations', conversationId, 'messages', message._id));
            } catch (error) {
              console.error("Error deleting message: ", error);
              Alert.alert("Error", "Failed to delete message");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{ backgroundColor: '#fff' }}
      textInputStyle={{ backgroundColor: '#fff', borderRadius: 20 }}
      user={{
        _id: userPhone, // Current user's phone number
        avatar: 'https://i.pravatar.cc/300',
        name: 'Your Name' // Adjust this as needed
      }}
      onLongPress={handleLongPress}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    marginRight: 10, // Adjust this value to move the button to the left
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Chat;
