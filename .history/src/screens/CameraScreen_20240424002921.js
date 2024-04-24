import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';
import globalStyles from '../styles/globalStyles';

export default function CameraScreen() {
  const [userId, setUserId] = useState(null); // State to hold userId
  const text = "Upload Image"; // State to hold userId
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const fetchuserId = user.uid;
        // Set Id for use later
        setUserId(fetchuserId);
        // Opens camera after userId is set
      } else {
        // Handle case when user is not logged in
        navigation.replace("Login");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      // UserId is set, navigate to 'Edit' screen
      takePhoto();
    }
  }, [userId]);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Result: ", result);

    if (!result.cancelled && result.assets) {
      const uri = result.assets[0].uri;
      console.log(uri);
      console.log('Image Uri success ' + uri + " User Id : " + userId + " Redirecting  ...");
      navigation.navigate('Edit', { imageUri: uri, text: text, userId: userId });
    } else {
      console.log('Image picking was cancelled');
    }
  };
}
