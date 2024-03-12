import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import globalStyles from '../styles/globalStyles';

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState(null)
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');

 const navigation = useNavigation();
  useEffect(() => {
    takePhoto();
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
      const uri = imageUri; // Use the imageUri state
      const fileName = title || 'Unnamed_Image'; // Use title as fileName, fallback to 'Unnamed_Image'
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `images/${fileName}`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Image uploaded successfully. Download URL:", downloadURL);
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