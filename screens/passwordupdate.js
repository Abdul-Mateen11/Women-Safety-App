import { db } from '../config';
const hashPasswords = async () => {
    try {
      // Fetch all users
      const usersSnapshot = await db.collection('users').get();
      const batch = db.batch();
  
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const plainTextPassword = userData.password; // Assuming the field is named 'password'
  
        // Hash the password
        const hashedPassword = bcrypt.hashSync(plainTextPassword, 10);
  
        // Update the password field with the hashed password
        const userRef = db.collection('users').doc(doc.id);
        batch.update(userRef, { password: hashedPassword });
      });
  
      // Commit the batch
      await batch.commit();
      console.log('Passwords updated successfully.');
    } catch (error) {
      console.error('Error updating passwords:', error);
    }
  };
  
  hashPasswords();