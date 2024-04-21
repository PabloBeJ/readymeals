import React,  {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { getAuth} from "firebase/auth";
import { ref, getDownloadURL} from "firebase/storage";
import { doc, getDoc} from "firebase/firestore";
import { storage, db} from "../../firebaseConfig";


const Footer = () => {
  //Navifate the different pages.
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  useEffect(() => {
 // Check if user is logged in
 async function checkUserLoggedIn() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
      fetchProfileData(user.uid);
  } else {
    // Handle case when user is not logged in
    navigation.replace("Login");
  }
};
    checkUserLoggedIn();
  }, []);
   // Fetch user profile data if userId is available
   async function fetchProfileData(userId) {
    try {
      const userRef = doc(db, "users", userId);   
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.profilePicture) {
          // Get the download URL of the profile picture
          const fileRef = ref(storage, `images/${userId}/ProfilePicture`);
          //Downloads image File
          const downloadURL = await getDownloadURL(fileRef);
          //Set the image.
          setImage(downloadURL);
        }
      }
    } catch (error) {
      // Get the Default Image if it doesn't exist.
          const fileRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
          const downloadURL = await getDownloadURL(fileRef);
          setImage(downloadURL);
      console.log("Error Fetch " + error.message);
    }
  };

  // Button actions for the button part of the app.
  function home() {
    setIsPressed(!isPressed)
    navigation.replace('Home');
  }
  // Ask user for permision to use the camera is so it will take to the cameras if no error,
  async function uploadImage() {
    setIsPressed(!isPressed);
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status == 'granted') {
      navigation.replace('Camera');
    }
    else Alert.alert('Access denied');
  };
  function favourites() {
    setIsPressed(!isPressed);
    navigation.replace('Favourites');
  }
  function profile() {
    setIsPressed(!isPressed);
    navigation.replace('Profile');
  }

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={home} style={globalStyles.controlButton}>
        <Image source={require("../assets/img/icon_img/home-icon.png")} style={globalStyles.imageIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={uploadImage} style={globalStyles.controlButton}>
        <Image source={require("../assets/img/icon_img/plus-icon.png")} style={globalStyles.imageIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={favourites} style={globalStyles.controlButton}>
        <Image source={require("../assets/img/icon_img/star-icon.png")} style={globalStyles.imageIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={profile} style={globalStyles.controlButton}>
      {image && <Image source={{ uri: image }} style={[globalStyles.imageIcon, {borderRadius: 20, }]} />}
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    flex: 1,
    position: 'absolute',
    bottom: -10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row', 
    marginVertical: 10,
    marginHorizontal:-20,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 30,
    color: '#555',
  },
});

export default Footer;
