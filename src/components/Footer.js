import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';


const Footer = () => {
  //Navifate the different pages.
   const navigation = useNavigation(); 


  function home(){
    navigation.replace('Home');
  }

// Ask user for permision to use the camera is so it will take to the cameras if no error,
  async function uploadImage () {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status == 'granted') {
       navigation.replace('Camera');
    }
    else Alert.alert('Access denied');
  };
  function favourites(){
    navigation.replace('CustomCamera');
  }
  function profile(){

  }
 
  return (
    <View style={styles.footer}>
      
    <TouchableOpacity onPress={home} style={[globalStyles.controlButton, styles.buttonMargin]}>
      <Text style={[styles.controlButtonText, {fontSize:30}]}>🏠</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={uploadImage} style={globalStyles.controlButton}>
       <Text style={styles.text}>➕</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={favourites}style={globalStyles.controlButton}>
      <Text style={[styles.controlButtonText, {fontSize:30}]}>⭐</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={profile} style={globalStyles.controlButton}>
      <Text style={[styles.controlButtonText, {fontSize:30}]}>👤</Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({ 
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        borderRadius: 80,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed from 'center' to 'space-between' as it conflicts with the flexDirection below
        flexDirection: 'row', // Moved up to be after height
        flex: 1, // Moved up to be before flexDirection
        padding: 10, 
        margin:10// Padding to adjust the content inside 
      },
      buttonMargin:{
        
      },
  text: {
    fontSize: 30,
    color: '#555',
  },
});

export default Footer;
