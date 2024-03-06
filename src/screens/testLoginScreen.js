import { firestore, auth }  from '../../firebaseConfig';  // Assuming you have exported firestore and auth from firebase.js

// Function to add data to Firestore based on the logged-in user
const addDataToFirestore = async (userData) => {
  try {
    // Get the current user
    const currentUser = auth.currentUser;

    // Check if a user is logged in
    if (!currentUser) {
      console.log('No user is currently logged in.');
      return;
    }

    // Add data to Firestore with the user's UID as the document ID
    await firestore.collection('users').doc(currentUser.uid).set(userData);
    
    console.log('Data added to Firestore successfully!');
  } catch (error) {
    console.error('Error adding data to Firestore:', error);
  }
};

// Example usage:
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  // Any other user-related data you want to store
};

// Call the function with the user data
addDataToFirestore(userData);
