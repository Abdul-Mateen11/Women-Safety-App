import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-web';

const TermsOfService = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Effective Date: 25/05/2024</Text>
      <Text>Welcome to Women Safety App (the "App"). These Terms of Service ("Terms") govern your use of our mobile application, which provides location-sharing, emergency chat, and access to resources such as lawyers, psychiatrists, therapists, and other safety services for women. By accessing or using the App, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the App.</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text>By using the App, you agree to these Terms and our Privacy Policy. If you do not agree, do not access or use the App. We may update these Terms from time to time, and your continued use of the App constitutes acceptance of those changes.</Text>

      <Text style={styles.sectionTitle}>2. Description of Services</Text>
      <Text>Women Safety App provides the following services:</Text>
      <Text>- <Text style={styles.bold}>Location Sharing</Text>: Allows users to share their real-time location with emergency contacts.</Text>
      <Text>- <Text style={styles.bold}>Emergency Chat</Text>: Enables users to communicate quickly with emergency contacts and designated safety personnel.</Text>
      <Text>- <Text style={styles.bold}>Resources</Text>: Provides access to a list of verified lawyers, psychiatrists, therapists, and other relevant professionals.</Text>
      <Text>- <Text style={styles.bold}>Emergency Contacts</Text>: Maintains a list of emergency contacts and facilitates communication with them.</Text>
      <Text>- <Text style={styles.bold}>Data Maintenance</Text>: Stores user data to provide quick and effective services.</Text>

      <Text style={styles.sectionTitle}>3. User Registration</Text>
<Text>To use certain features of the App, you must register and create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</Text>

<Text style={styles.sectionTitle}>4. User Responsibilities</Text>
<Text>You are responsible for:</Text>
<Text style={styles.listItem}>- Maintaining the confidentiality of your account information, including your password.</Text>
<Text style={styles.listItem}>- All activities that occur under your account.</Text>
<Text style={styles.listItem}>- Complying with all applicable laws while using the App.</Text>
<Text style={styles.listItem}>- Not using the App for any unlawful or harmful purpose.</Text>

<Text style={styles.sectionTitle}>5. Emergency Situations</Text>
<Text>The App is designed to assist in emergency situations, but it does not replace emergency services. In case of an emergency, always contact your local emergency services immediately.</Text>

<Text style={styles.sectionTitle}>6. Data Privacy</Text>
<Text>We value your privacy. Please review our Privacy Policy to understand how we collect, use, and share information about you. By using the App, you consent to the collection and use of your information as described in the Privacy Policy.</Text>

<Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
<Text>To the fullest extent permitted by law, Women Safety App and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</Text>
<Text style={styles.listItem}>- Your use of or inability to use the App.</Text>
<Text style={styles.listItem}>- Any unauthorized access to or use of our servers and/or any personal information stored therein.</Text>
<Text style={styles.listItem}>- Any interruption or cessation of transmission to or from the App.</Text>
<Text style={styles.listItem}>- Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the App by any third party.</Text>
<Text style={styles.listItem}>- Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the App.</Text>

<Text style={styles.sectionTitle}>8. Indemnification</Text>
<Text>You agree to defend, indemnify, and hold harmless Women Safety App and its affiliates, officers, employees, agents, partners, and licensors from and against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the App, or your violation of these Terms.</Text>

<Text style={styles.sectionTitle}>9. Termination</Text>
<Text>We reserve the right to suspend or terminate your account and your access to the App at any time, for any reason, and without notice, including for violation of these Terms. Upon termination, your right to use the App will immediately cease.</Text>

<Text style={styles.sectionTitle}>10. Governing Law</Text>
<Text>These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Pakistan.</Text>

      <Text style={styles.contact}>11. Contact Us</Text>
      <Text>If you have any questions about these Terms, please contact us at abdmj908@gmail.com.</Text>

      <Text style={styles.agreement}>By using Women Safety App, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</Text>
      <Text>  </Text>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  contact: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  agreement: {
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default TermsOfService;
