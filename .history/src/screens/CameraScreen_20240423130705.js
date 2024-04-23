import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/globalStyles';


export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null)
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(null); // State to hold userId
  const navigation = useNavigation();
  useEffect(() => {

  const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const fetchuserId = user.uid;
        // Set Id for use later
        setUserId(fetchuserId);
        //Opens camera
        takePhoto();
      }
      else {
        // Handle case when user is not logged in
        navigation.replace("Login");
      }
    };
       fetchUserData();
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
      setImageUri(uri); // Set local URI for preview, but don't upload yet
      setImage(uri); //
      console.log(uri);
      // Removed automatic upload after taking photo
      console.log('Image Uri success ' + uri); 
    } else {
      console.log('Image picking was cancelled');
    }
  };
}
