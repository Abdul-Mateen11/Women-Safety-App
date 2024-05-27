import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../config'; // Ensure the path to your Firebase configuration is correct
import { phoneNumber } from './global'; // Import phoneNumber from your global file

const EmergencyContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'emergencyContacts'), where('userPhone', '==', phoneNumber));
    const unsubscribe = onSnapshot(q, snapshot => {
      const contactsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addContact = async () => {
    if (newContactName && newContactPhone) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'emergencyContacts'), {
          name: newContactName,
          phone: newContactPhone,
          userPhone: phoneNumber // Link contacts to the user's phone number
        });
        setNewContactName('');
        setNewContactPhone('');
      } catch (error) {
        console.error(error);
        Alert.alert('Error adding contact.');
      }
      setLoading(false);
    } else {
      Alert.alert('Please fill in both name and phone number.');
    }
  };

  const updateContact = async (id) => {
    if (newContactName && newContactPhone) {
      setLoading(true);
      const oldContactPhone = editingContact.phone;
      try {
        // Update the phone number in the emergencyContacts collection
        await updateDoc(doc(db, 'emergencyContacts', id), {
          name: newContactName,
          phone: newContactPhone
        });

        // Find and update the corresponding conversation(s) in the conversations collection
        const q = query(collection(db, 'conversations'), where('participants', 'array-contains', oldContactPhone));
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(db);

        querySnapshot.forEach(docSnapshot => {
          const convoData = docSnapshot.data();
          if (convoData.participants.includes(oldContactPhone)) {
            // Update the conversation's participants to reflect the new phone number
            const updatedParticipants = convoData.participants.map(participant =>
              participant === oldContactPhone ? newContactPhone : participant
            );
            batch.update(doc(db, 'conversations', docSnapshot.id), { participants: updatedParticipants });
          }
        });

        await batch.commit();

        setEditingContact(null);
        setNewContactName('');
        setNewContactPhone('');
      } catch (error) {
        console.error(error);
        Alert.alert('Error updating contact.');
      }
      setLoading(false);
    } else {
      Alert.alert('Please fill in both name and phone number.');
    }
  };

  const deleteContact = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'emergencyContacts', id));
    } catch (error) {
      console.error(error);
      Alert.alert('Error deleting contact.');
    }
    setLoading(false);
  };

  const startEditing = (contact) => {
    setEditingContact(contact);
    setNewContactName(contact.name);
    setNewContactPhone(contact.phone);
  };

  const cancelEditing = () => {
    setEditingContact(null);
    setNewContactName('');
    setNewContactPhone('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={() => startEditing(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteContact(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#800080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Contact Name"
          value={newContactName}
          onChangeText={setNewContactName}
        />
        <TextInput
          style={styles.inputText}
          placeholder="Contact Phone"
          value={newContactPhone}
          onChangeText={setNewContactPhone}
          keyboardType="phone-pad"
        />
        {editingContact ? (
          <>
            <TouchableOpacity onPress={() => updateContact(editingContact.id)} style={styles.addButton}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEditing} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={addContact} style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  inputText: {
    backgroundColor: 'white',
    borderColor: '#800080',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#800080',
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactDetails: {
    flexDirection: 'column',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#555',
  },
  contactActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#f8f8f8',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f8f8f8',
    padding: 5,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  inputText: {
    backgroundColor: '#1f1f1f',
    borderColor: '#800080',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: 'white',
  },
  addButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#800080',
    fontSize: 16,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactDetails: {
    flexDirection: 'column',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  contactPhone: {
    fontSize: 16,
    color: '#555',
  },
  contactActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles = lightTheme; // Change to darkTheme for dark mode

export default EmergencyContact;
