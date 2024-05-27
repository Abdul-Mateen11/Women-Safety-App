import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppVersionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your application is up to date.</Text>
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Current version</Text>
        <Text style={styles.version}>10.1.0.298</Text>
      </View>
      <View style={styles.updateButton}>
        <Text style={styles.updateButtonText}>CHECK FOR UPDATES</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    color: '#800080',
    fontSize: 19,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#800080',
    fontSize: 17,
  },
  version: {
    color: '#800080',  
    fontSize: 15,
    marginVertical: 5,
  },
  updateButton: {
    backgroundColor: 'pink',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 5, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AppVersionScreen;
