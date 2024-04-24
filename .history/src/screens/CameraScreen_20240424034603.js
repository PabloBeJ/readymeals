import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';
import globalStyles from '../styles/globalStyles';

export default function CameraScreen() {
  const [userId, setUserId] = useState(null);
  const text = "Upload Image";
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const fetchuserId = user.uid;
        setUserId(fetchuserId);
      } else {
        navigation.replace("Login");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Open camera automatically only if userId is not null
    if (userId !== null) {
      takePhoto();
    }
  }, [userId]); // Depend on userId changes

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

  return (
    <View style={globalStyles.container}>
      {/* You can render a loading indicator or any UI while waiting for the camera to open */}
      {/* This is optional and depends on your UI design */}
    </View>
  );
}
