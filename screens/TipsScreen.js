import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TipsScreen = () => {
  const tips = [
    { id: 1, title: "Stay Aware", content: "Always be aware of your surroundings." },
    { id: 2, title: "Trust your instincts", content: "If something feels wrong, it probably is." },
    { id: 3, title: "Emergency Contacts", content: "Keep your emergency contacts updated." },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tips.map(tip => (
        <View key={tip.id} style={styles.tipContainer}>
          <Text style={styles.title}>{tip.title}</Text>
          <Text>{tip.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  tipContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default TipsScreen;
