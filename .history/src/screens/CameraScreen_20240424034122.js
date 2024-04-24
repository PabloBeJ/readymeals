import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
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
        // Opens camera
        takePhoto();
      } else {
        // Handle case when user is not logged in
        navigation.replace("Login");
      }
    };
    fetchUserData();
  }, []);

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
      // Removed automatic upload after taking photo
      console.log('Image Uri success ' + uri +   +   " User Id : " + userId +     "Redirecting  ...");
      navigation.navigate('Edit', { imageUri: uri, text: text, userId: userId });
    } else {
      console.log('Image picking was cancelled');
    }
  };
}
