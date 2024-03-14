import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';


const Footer = () => {
  //Navifate the different pages.
  const navigation = useNavigation();
  function home() {
    navigation.replace('Home');
  }

  // Ask user for permision to use the camera is so it will take to the cameras if no error,
  async function uploadImage() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status == 'granted') {
      navigation.replace('Camera');
    }
    else Alert.alert('Access denied');
  };
  function favourites() {
    navigation.replace('Favourites');
  }
  function profile() {
    navigation.replace('Profile');
  }

  return (
    <View style={styles.footer}>

      <TouchableOpacity onPress={home} style={[globalStyles.controlButton, styles.buttonMargin]}>
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
      <Image source={require("../assets/img/profilePicture.png")} style={globalStyles.imageProfile}
        />
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
