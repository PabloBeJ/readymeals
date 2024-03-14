import React, { useState } from 'react';
import { Button, View, Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../firebaseConfig'; // Adjust the import path as necessary

const uploadImageToStorage = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(path);
    const snapshot = await ref.put(blob);
    return await snapshot.ref.getDownloadURL();
  } catch (error) {
    console.error('Error uploading image: ', error);
    return null;
  }
};

const ImagePickerAndUploader = () => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Please select an image before submitting.');
      return;
    }

    try {
      const filename = `${Date.now()}.jpg`;
      const imageUrl = await uploadImageToStorage(imageUri, `images/${filename}`);
      
      if (imageUrl) {
        // Save imageUrl to your database
        const docRef = await db.collection('images').add({
          url: imageUrl,
          createdAt: new Date(),
        });
        console.log('Image uploaded successfully with document ID: ', docRef.id);
        Alert.alert('Upload Successful', 'Image uploaded successfully!');
        setImageUri(null); // Clear imageUri after successful upload
      } else {
        Alert.alert('Upload Failed', 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading the image.');
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}
      <Button title="Pick an Image" onPress={pickImage} />
      {imageUri && <Button title="Submit" onPress={handleUpload} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ImagePickerAndUploader;
