import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/globalStyles';


export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null)
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(null); // State to hold userId
  const [username, setUsername] = useState(null); // State to hold userId
  const [profilePicture, setprofilePicture] = useState(null); // State to hold userId
  const navigation = useNavigation();
  useEffect(() => {

  const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const fetchuserId = user.uid;
        console.log("fetchuserId   " + fetchuserId); 
        setUserId(fetchuserId);
        console.log("User data11 " + userId );
        const userDocRef = doc(db, 'users', userId); // Assuming 'users' is the collection storing user information
        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const fetchedUsername = userData.username;
            const fetchedProfilePicture = userData.profilePicture;
            setUsername(fetchedUsername); // Set the username state
            setprofilePicture(fetchedProfilePicture); // Set the Profile Picture state
          }
        } catch (error) {
          console.error('Error retrieving user document:', error);
        }
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

  const uploadImage = async () => {
    try {
      const user = auth.currentUser;
      const uri = imageUri; // Use the imageUri state
      const fileName = title || 'Unnamed_Image'; // Use title as fileName, fallback to 'Unnamed_Image'
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `images/${fileName}`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Image uploaded successfully. Download URL:", downloadURL);
      console.log("Hello");
       // Add user details to Firestore

      
       const randomId = `${userId}_${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
    
       const userRef = doc(db, "images", randomId);
       console.log("UserIDChecker :",  userRef);
       await setDoc(userRef, {
         imageUrl: downloadURL,
         userId: userId,
         imageTitle: title,
       });   
      setImage(downloadURL); // Set image URL for display after successful upload
      navigation.replace('Home');
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };
  return (
    <View style={globalStyles.container}>
      {/* Preview Image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.row} >
        <TextInput
          placeholder="Set Title...."
          value={title}
          onChangeText={text => setTitle(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={uploadImage} style={[globalStyles.controlButton, styles.buttonMargin]}>
          <Image source={require("../assets/img/icon_img/upload-icon.png")} style={globalStyles.imageIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 380,
    height: 380,
    borderRadius: 20,
    marginTop: -120,
    marginBottom: 30,
  },
  // So the text input and the button are on the same line. 
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  // Text Input of log in and uplaod picture
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '70%',
    fontSize: 20,
    marginRight: 15,
  },

});