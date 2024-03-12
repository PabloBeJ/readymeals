import React, { useState, useEffect } from 'react';
import { View, Image, Button, TextInput, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { db } from '../../firebaseConfig'; // Adjust this path as needed
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(''); // State to hold the title
  const [isReadyToUpload, setIsReadyToUpload] = useState(false); // State to control the UI
  const navigation = useNavigation()

  useEffect(() => {
    takePhoto(); // Call takePhoto when the component mounts
  }, []);

  async function  takePhoto () {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.uri) {
      const uri = result.uri;
      setImage(uri); // Set image first
      setIsReadyToUpload(true); // Ready to set title and upload
    } else {
      navigation.replace('Home');
    }
  };

async function uploadImage  () {
    if (!image || !title) {
      alert('Please take a photo and set a title.');
      return;
    }
    const uri = image;
    const fileName = title.replace(/ /g, "_") + "_" + Date.now(); // A simple way to generate a unique file name based on the title
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `images/${fileName}`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Image uploaded successfully. Download URL:", downloadURL);
      await saveImageMetadata(downloadURL, title);
      setImage(null);
      setTitle('');
      setIsReadyToUpload(false);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const saveImageMetadata = async (imageUrl, title) => {
    try {
      await addDoc(collection(db, "images"), {
        title: title,
        imageUrl: imageUrl,
      });
      console.log("Image metadata saved successfully");
    } catch (error) {
      console.error("Error saving image metadata: ", error);
    }
  };
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isReadyToUpload && (
        <>
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          <TextInput
            placeholder="Enter image title"
            value={title}
            onChangeText={setTitle}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, width: '80%' }}
          />
          <Button title="Upload" onPress={uploadImage} />
          <Button title="Cancel" onPress={() => setIsReadyToUpload(false)} />
        </>
      )}
    </View>
  );
}
