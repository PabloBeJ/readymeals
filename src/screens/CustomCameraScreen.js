import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import firebase from 'firebase/app';
import 'firebase/storage'; // Import Firebase Storage module

// Puedo preguntar a mi superviso. 

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [photoTaken, setPhoTaken] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flashMode, setFlashMode] = useState('off');
  const cameraRef = useRef(null);

  //Takes pictures and makes sure there is a quality and makes it a previww
  const takePicture = async () => {
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5,   aspect: [4, 3], allowsEditing: true, });
      setPhoTaken(true);
      setCapturedImage(photo);
    } catch (error) { }
  };


  //If the we retake photo disables the functions.  
  function retakePicture() {
    setCapturedImage(null);
    setPhoTaken(false);
  };

 const onFlashMode = () => {
  setFlashMode(prevMode => {
    if (prevMode === 'on')return 'off'; 
    else return 'on';
   });
};


// Function to upload image to Firebase Storage
const uploadImage = async (uri, imageName) => {

  if (!capturedImage) {
    Alert.alert('Error', 'No image captured.');
    console.log('Error message: ' , error); 
    return;
  }
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase.storage().ref().child("images/" + imageName);
  ref.put(blob);
}

//Code to switch Camera between front and back --> Reference at the oficial document of react native expo camera. 
  const onSwitchCamera = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  // Define which type of display either camera or the preview of the photo taken.
  let displayType;

  // Check the condition and assign the appropriate content to render
  if (photoTaken && capturedImage) {
    displayType = (
      <View style={{ flex: 1 }}>
        <ImageBackground source={{ uri: capturedImage.uri }} style={{ flex: 1 }}>
          <View style={styles.previewControlsContainer}>
            <TouchableOpacity onPress={retakePicture} style={styles.previewButton}>
              <Text style={styles.previewButtonText}>Re-take</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewButtonText} onPress={uploadImage}>Save photo</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  } else {
    displayType = (
      <Camera
        type={type}
        flashMode={flashMode}
        style={{ flex: 0.95 }}
        zoom={0.1}
        ref={cameraRef}
      />
    );
  }

  // Return the content
  return (
    <View style={[styles.container, styles.componentWithBorder]}>
      <View style={{ flex: 1 }}>
        {/* Depending if i took the photo it will show me the display of camera or photo */}
        {displayType}
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={onFlashMode} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>⚡️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={[styles.captureButton]}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSwitchCamera} style={styles.controlButton}>
            <Text style={styles.controlButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#22252A',
  },
  startCameraButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startCameraButton: {
    width: 130,
    borderRadius: 4,
    backgroundColor: '#14274e',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 10, // Add margin bottom for spacing
  },
  startCameraButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  controlButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 20,
  },


  // Buttons to retake and save that are on the top 2 screens. 
  previewControlsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },

  //Buttom row for flash.
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20, // Added paddingBottom to move controls above the bottom of the screen
    paddingTop: 20, // Added paddingBottom to move controls above the bottom of the screen
    position: 'flex',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Make the background transparent to overlay on top of camera preview
  },
  // Button for the camera (White circle)
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 80,
    backgroundColor: '#fff',
  },

  previewButton: {
    width: 130,
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
