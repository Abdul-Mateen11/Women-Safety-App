import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { db } from '../config'; // Import your Firebase config

const AddResourceScreen = () => {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editType, setEditType] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddResourceDisabled, setIsAddResourceDisabled] = useState(true);

  useEffect(() => {
    setIsAddResourceDisabled(!city || !type || !name || !number);
  }, [city, type, name, number]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const resourcesSnapshot = await db.collection('Resources').get();
      const fetchedResources = [];
      resourcesSnapshot.forEach(doc => {
        const data = doc.data();
        fetchedResources.push({
          id: doc.id,
          city: data.city,
          type: data.type,
          name: data.name,
          number: data.number,
        });
      });
      fetchedResources.sort((a, b) => {
        if (a.city === b.city) {
          return a.type.localeCompare(b.type);
        }
        return a.city.localeCompare(b.city);
      });
      setResources(fetchedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const addResource = async () => {
    if (!city || !type || !name || !number) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      await db.collection('Resources').add({
        type: type,
        name: name,
        city: city,
        number: number,
      });
      console.log('Resource added successfully!');
      setCity('');
      setType('');
      setName('');
      setNumber('');
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      setLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setLoading(true);
    try {
      await db.collection('Resources').doc(id).delete();
      console.log('Resource deleted successfully!');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      setLoading(false);
    }
  };

  const editResource = async () => {
    setLoading(true);
    try {
      await db.collection('Resources').doc(editId).update({
        city: editCity,
        type: editType,
        name: editName,
        number: editNumber,
      });
      console.log('Resource updated successfully!');
      fetchResources();
      setEditMode(false);
      setEditId('');
      setEditCity('');
      setEditType('');
      setEditName('');
      setEditNumber('');
    } catch (error) {
      console.error('Error updating resource:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />}
      <ScrollView>
        <View style={styles.addResourceContainer}>
          <Text style={styles.label}>City Name:</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={text => setCity(text)}
          />
          <Text style={styles.label}>Resource Type:</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={text => setType(text)}
          />
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={text => setNumber(text)}
          />
          <TouchableOpacity 
            onPress={addResource} 
            style={[styles.addButton, isAddResourceDisabled && { opacity: 0.5 }]} 
            disabled={isAddResourceDisabled}
          >
            <Text style={styles.buttonText}>Add Resource</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.resourcesTitle}>Resources:</Text>
        {resources.map(item => (
          <View key={item.id}>
            <View>
              <Text style={styles.cityTitle}>{item.city}</Text>
              <Text style={styles.typeTitle}>{item.type}</Text>
            </View>
            <View style={[styles.resource]}>
              <View style={styles.resourceDetails}>
                <Text style={styles.resourceText}>{item.name}</Text>
                <Text style={styles.resourceText}>{item.number}</Text>
              </View>
              <View style={styles.resourceButtons}>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Delete Resource',
                    'Are you sure you want to delete this resource?',
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {text: 'Delete', onPress: () => deleteResource(item.id)},
                    ],
                    {cancelable: true},
                  );
                }}>
                  <Text style={styles.button}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setEditMode(true);
                  setEditId(item.id);
                  setEditName(item.name);
                  setEditNumber(item.number);
                  setEditType(item.type);
                  setEditCity(item.city)
                }}>
                  <Text style={styles.button}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            {editMode && editId === item.id && (
              <View style={styles.editContainer}>
              <Text style={styles.label}>Edit City:</Text>
              <TextInput
                style={styles.input}
                value={editCity}
                onChangeText={text => setEditCity(text)}
              />
              <Text style={styles.label}>Edit Type:</Text>
              <TextInput
                style={styles.input}
                value={editType}
                onChangeText={text => setEditType(text)}
              />
              <Text style={styles.label}>Edit Name:</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={text => setEditName(text)}
              />
              <Text style={styles.label}>Edit Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={editNumber}
                onChangeText={text => setEditNumber(text)}
              />
              <TouchableOpacity onPress={editResource} style={[styles.addButton]}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addResourceContainer: {
    backgroundColor: 'pink',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'pink',
  },
  cityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#800080',
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffb6c1',
  },
  resource: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  resourceDetails: {
    flex: 1,
  },
  resourceText: {
    fontSize: 16,
    color: '#000000',
  },
  resourceButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'pink',
    color: 'white',
    borderRadius: 5,
  },
  editContainer: {
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddResourceScreen;
