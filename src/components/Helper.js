import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { getAuth, updateEmail, EmailAuthProvider, updatePassword, reauthenticateWithCredential, sendEmailVerification } from "firebase/auth";
    // Check if user is logged in
    const auth = getAuth();

  export  async function userChecker() {
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid); // Set userId if user is logged in
          console.log('Usser is logged in. ' + user.uid);
          const currentUser = auth.currentUser;
          const userEmail = currentUser.email;
          const formattedEmail = userEmail.replace('Email', '');
          setUserDataEmail(formattedEmail); //Saves email value if i want to change email address. 
        } else {
          // Handle case when user is not logged in
          navigation.replace("Login");
        }
      };

      