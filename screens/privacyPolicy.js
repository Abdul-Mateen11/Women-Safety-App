import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>
      <Text style={styles.date}>Effective Date: 25/05/2024</Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text>- Personal Information: We may collect personally identifiable information, such as your name, phone number, email address, and emergency contact details when you register for an account or update your profile.</Text>
      <Text>- Location Information: We collect real-time location information to provide location-sharing services with your emergency contacts.</Text>
      <Text>- Usage Data: We may collect information about your interactions with the App, including the pages and features you use and the actions you take.</Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text>We use the information we collect for various purposes, including:</Text>
      <Text>- To provide, maintain, and improve the App and our services.</Text>
      <Text>- To communicate with you about your account and respond to your inquiries.</Text>
      <Text>- To ensure your safety by sharing your location with designated emergency contacts.</Text>
      <Text>- To personalize your experience and provide you with relevant resources, such as lawyers, psychiatrists, and therapists.</Text>
      <Text>- To monitor and analyze usage patterns and trends to improve the App.</Text>

      <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
      <Text>We may share your information with:</Text>
      <Text>- Emergency Contacts: Your real-time location and other relevant information will be shared with your designated emergency contacts when you use the location-sharing or emergency chat features.</Text>
      <Text>- Service Providers: We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service.</Text>
      <Text>- Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</Text>

      {/* Section 4 */}
      <Text style={styles.sectionTitle}>4. Data Security</Text>
      <Text>We take reasonable measures to protect the information we collect from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is completely secure, so we cannot guarantee its absolute security.</Text>

      {/* Section 5 */}
      <Text style={styles.sectionTitle}>5. Data Retention</Text>
      <Text>We will retain your information for as long as your account is active or as needed to provide you with our services. We may also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</Text>

      {/* Section 6 */}
      <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
      <Text>Depending on your jurisdiction, you may have the right to:</Text>
      <Text>- Access and obtain a copy of your information.</Text>
      <Text>- Request correction of any inaccurate or incomplete information.</Text>
      <Text>- Request deletion of your information, subject to certain exceptions.</Text>
      <Text>- Object to or request the restriction of processing your information.</Text>
      <Text>To exercise these rights, please contact us at abdmj908@gmail.com.</Text>

      {/* Section 7 */}
      <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
      <Text>Our App is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have inadvertently received personal information from a child under 13, we will delete such information from our records.</Text>

      {/* Section 8 */}
      <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
      <Text>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of the App after any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the updated Privacy Policy.</Text>

      {/* Section 9 */}
      <Text style={styles.sectionTitle}>9. Contact Us</Text>
      <Text>If you have any questions about this Privacy Policy, please contact us at abdmj908@gmail.com.</Text>

      {/* Closing statement */}
      <Text>By using Women Safety App, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</Text>
      <Text></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
});

export default PrivacyPolicy;
