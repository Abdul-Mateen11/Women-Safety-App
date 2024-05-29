import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firebase, db } from '../config'; // Ensure the path to your Firebase configuration is correct
import { phoneNumber } from './global';

const CustomerSupportScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation();
  const userPhone = phoneNumber; // Replace with dynamic fetching of user's phone number if available
  const supportRecipient = '+923124697751'; // Customer support recipient
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff', 
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

  const constructConversationId = (participant1, participant2) => {
    const sortedParticipants = [participant1, participant2].sort();
    return sortedParticipants.join('_');
  };

  const conversationId = constructConversationId(userPhone, supportRecipient);

  useLayoutEffect(() => {
    const messagesRef = collection(db, 'Support', conversationId, 'messages');
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
    await addDoc(collection(db, 'Support', conversationId, 'messages'), {
      _id,
      createdAt,
      text,
      user
    });
    await setDoc(doc(db, 'Support', conversationId), {
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
              const messagesQuerySnapshot = await getDocs(collection(db, 'Support', conversationId, 'messages'));
              const deleteMessagesPromises = messagesQuerySnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deleteMessagesPromises);

              await deleteDoc(doc(db, 'Support', conversationId));

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
              await deleteDoc(doc(db, 'Support', conversationId, 'messages', message._id));
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
        <ActivityIndicator size="large" color="#800080" />
      </View>
    );
  }

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputToolbarPrimary}
      renderComposer={(props) => (
        <View style={styles.composerContainer}>
          <Composer
            {...props}
            textInputStyle={styles.textInput}
          />
        </View>
      )}
      renderSend={(props) => (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (props.text && props.onSend) {
              props.onSend({ text: props.text.trim() }, true);
            }
          }}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#800080', //  plum color for user's messages
            },
            left: {
              backgroundColor: '#FFC0CB', // Pink color for received messages
            },
          }}
          textStyle={{
            left: {
              color: '#000000', // Black color for text in left bubble
            },
          }}
          timeTextStyle={{
            left: {
              color: '#000000', // Black color for time text in left bubble
            },
          }}
        />
      )}
      renderInputToolbar={renderInputToolbar}
      messagesContainerStyle={{ backgroundColor: '#fff', paddingBottom: 10 }} // Added paddingBottom for separation
      user={{
        _id: userPhone, // Current user's phone number
        avatar: 'https://i.pravatar.cc/300',
        name: 'Your Name' // Adjust this as needed
      }}
      onLongPress={handleLongPress}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FCA3B7', 
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inputToolbarContainer: {
    borderTopWidth: 1,
    borderTopColor: '#800080', // Plum color for the border
  },
  inputToolbarPrimary: {
    alignItems: 'center',
  },
  composerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: '#800080', // Plum color for the border
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flex: 1,
  },
  textInput: {
    flex: 1,
    color: '#800080', // Plum color for input text
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sendText: {
    color: 'plum',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomerSupportScreen;
