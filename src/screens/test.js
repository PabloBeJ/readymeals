import React, { useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref, uploadFile, getDownloadURL } from '@react-native-firebase/storage';
import { getFirestore, collection, doc, updateDoc } from '@react-native-firebase/firestore';

const ProfileScreen = ({ user }) => {
  const [imageUri, setImageUri] = useState(null);
  
  const handleChooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        setImageUri(response.uri);
      }
    });
  };

  const handleUploadImage = async () => {
    if (imageUri) {
      const storage = getStorage();
      const imageRef = ref(storage, `profile_images/${user.uid}`);
      
      try {
        await uploadFile(imageRef, imageUri);
        const downloadURL = await getDownloadURL(imageRef);
        
        // Update the user's profile with the image URL
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { profileImage: downloadURL });
        
        console.log('Image uploaded and profile updated:', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.warn('No image selected.');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
      
      <Button title="Choose Image" onPress={handleChooseImage} />
      <Button title="Upload Image" onPress={handleUploadImage} />
    </View>
  );
};

export default ProfileScreen;
