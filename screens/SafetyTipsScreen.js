import React, { useLayoutEffect } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SafetyTipsScreen = () => {
  const { darkMode } = useTheme();
  const navigation = useNavigation();

  const DATA = [
    {
      title: "Personal Safety",
      data: [
        "Always let someone know your route when walking alone.",
        "Be aware of your surroundings and avoid distractions like using phones when walking alone.",
        "Stay in well-lit, populated areas during night to ensure visibility."
      ]
    },
    {
      title: "Online Safety",
      data: [
        "Regularly update your passwords and use two-factor authentication to enhance security.",
        "Ignore suspicious emails and messages to avoid phishing attacks.",
        "Limit personal information shared on social media to protect your privacy."
      ]
    },
    {
      title: "Travel Safety",
      data: [
        "Learn about local customs and laws before traveling.",
        "Research and understand cultural norms of your destination to avoid misunderstandings.",
        "Keep digital and physical copies of important documents in case of loss or theft.",
        "Use reputable transportation services and avoid unmarked taxis."
      ]
    },
    {
      title: "Home Safety",
      data: [
        "Secure all potential entry points with quality locks to deter burglars.",
        "Install a security system and smoke detectors to monitor and protect your home.",
        "Plan and practice emergency evacuation routes with all household members."
      ]
    },
    {
      title: "Interactive Guides and Checklists",
      data: [
        "Educate your family on safety protocols for various emergencies, such as fires or natural disasters.",
        "Keep emergency kits updated and accessible to ensure readiness.",
        "Know the local authority contacts and procedures for reporting incidents promptly."
      ]
    },
    {
      title: "Legal Rights Information",
      data: [
        "Understand the process of filing a complaint against harassment to protect your rights.",
        "Know your rights when interacting with law enforcement to ensure fair treatment.",
        "Consult legal experts when rights are infringed to get professional advice."
      ]
    },
    {
      title: "Self Defense Techniques",
      data: [
        "Learn basic self-defense moves through interactive online courses.",
        "Practice situational awareness drills to enhance your response in real scenarios.",
        "Engage in physical conditioning to improve your strength and agility for self-defense.",
        "Always be aware of your surroundings and avoid potentially unsafe areas when alone.",
        "Use your voice as a powerful deterrent, shouting loudly to attract attention if you feel threatened.",
        "Consider carrying a whistle or a personal alarm to use in case of an emergency to draw attention quickly.",
        "Learn to identify and target vulnerable areas of an attacker's body such as the eyes, nose, throat, and groin.",
        "Take self-defense classes to develop confidence in your physical abilities and learn practical defense techniques."
      ]
    }
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#A94064', // Pink color for the header background
      },
      headerTintColor: '#fff', 
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: darkMode ? '#333333' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: darkMode ? '#FFFFFF' : '#800080' }]}>{item}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.header, { backgroundColor: darkMode ? '#800080' : '#800080' }]}>
      <Text style={[styles.headerText, { color: darkMode ? '#FFFFFF' : '#FFFFFF' }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: darkMode ? '#121212' : '#FFFFFF' }]}>
      <View style={[styles.titleBar, { backgroundColor: darkMode ? 'pink' : 'pink' }]}>
        <Text style={[styles.titleBarText, { color: darkMode ? '#FFFFFF' : '#FFFFFF' }]}>Safety Tips</Text>
      </View>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleBar: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  header: {
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  title: {
    fontSize: 16,
  }
});

export default SafetyTipsScreen;
