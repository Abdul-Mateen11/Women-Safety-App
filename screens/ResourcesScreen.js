import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { db } from '../config'; // Import your Firebase config
import { useHeaderHeight } from '@react-navigation/elements';
import { useTheme } from '../ThemeContext'; // Import useTheme from your ThemeContext
import { TouchableOpacity } from 'react-native-gesture-handler';

const ResourceScreen = ({ navigation }) => {
  const { darkMode } = useTheme(); // Get the current theme
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  
  useEffect(() => {
    fetchResources();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff', 
    });
  }, [navigation]);

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
  const openWhatsApp = async (phone) => {
  const url = `whatsapp://send?phone=${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'WhatsApp is not installed');
        } else {
          return Linking.openURL(url);
        }
      })
    };

  return (
    <View style={[baseStyles.container, darkMode ? darkTheme.container : lightTheme.container]}>
      <View style={darkMode ? darkTheme.titleBar : lightTheme.titleBar}>
        <Text style={darkMode ? darkTheme.titleBarText : lightTheme.titleBarText}>Resources</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#800080" style={baseStyles.loadingIndicator} />}
      <ScrollView>
        {resources.reduce((acc, item, index) => {
          const previousCity = resources[index - 1]?.city;
          if (previousCity !== item.city) {
            acc.push(
              <View key={item.city} style={baseStyles.cityContainer}>
                <Text style={baseStyles.cityTitle}>{item.city}</Text>
              </View>
            );
          }
          acc.push(
            <View key={item.id}>
              <Text style={baseStyles.typeTitle}>{item.type}</Text>
              <View style={darkMode ? darkTheme.resource : lightTheme.resource}>
                <View style={baseStyles.resourceDetails}>
                  <TouchableOpacity onPress={() => openWhatsApp(item.number)}>
                  <Text style={darkMode ? darkTheme.resourceText : lightTheme.resourceText}>{item.name}</Text>
                  <Text style={darkMode ? darkTheme.resourceText : lightTheme.resourceText}>{item.number}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
          return acc;
        }, [])}
      </ScrollView>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
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
  cityContainer: {
    backgroundColor: '#800080',
    padding: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  cityTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center', 
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffb6c1', 
    marginLeft: 10,
  },
  resourceDetails: {
    flex: 1,
  },
});

const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  titleBar: {
    backgroundColor: 'pink',
    padding: 10,
    alignItems: 'center',
  },
  titleBarText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  resource: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: 'plum',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  resourceText: {
    fontSize: 15,
    color: '#800080',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  titleBar: {
    backgroundColor: 'pink',
    padding: 10,
    alignItems: 'center',
  },
  titleBarText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  resource: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#555',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#1f1f1f',
    marginHorizontal: 10,
  },
  resourceText: {
    fontSize: 15,
    color: '#800080',
  },
});

export default ResourceScreen;
