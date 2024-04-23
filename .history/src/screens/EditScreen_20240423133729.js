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


export default function EditScreen() {
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
      }
      else {
        // Handle case when user is not logged in
        navigation.replace("Login");
      }
    };
       fetchUserData();
  }, [userId]);


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
      <TouchableOpacity onPress={uploadImage} style={[globalStyles.controlButton, styles.buttonMargin]}>
          <Image source={require("../assets/img/icon_img/upload-icon.png")} style={globalStyles.imageIcon}
          />
        </TouchableOpacity>
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