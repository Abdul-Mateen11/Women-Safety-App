import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../config'; // Import your Firebase config

interface Resource {
  id: string;
  city: string;
  type: string;
  name: string;
  number: string;
}

const ResourceScreen: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const resourcesSnapshot = await db.collection('Resources').get();
      const fetchedResources: Resource[] = [];
      resourcesSnapshot.forEach(doc => {
        const data = doc.data() as Omit<Resource, 'id'>;
        fetchedResources.push({
          id: doc.id,
          ...data
        });
      });
      fetchedResources.sort((a, b) => {
        if (a.city === b.city) {
          return a.type.localeCompare(b.type);
        }
        return a.city.localeCompare(b.city);
      });
      setResources(fetchedResources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />}
      <ScrollView>
        <Text style={styles.resourcesTitle}>Resources:</Text>
        {resources.map(item => (
          <View key={item.id}>
            <View>
              <Text style={styles.cityTitle}>{item.city}</Text>
              <Text style={styles.typeTitle}>{item.type}</Text>
            </View>
            <View style={styles.resource}>
              <View style={styles.resourceDetails}>
                <Text style={styles.resourceText}>{item.name}</Text>
                <Text style={styles.resourceText}>{item.number}</Text>
              </View>
            </View>
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
});

export default ResourceScreen;
