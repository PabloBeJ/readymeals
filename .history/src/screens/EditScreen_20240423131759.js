import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditScreen({ route }) {
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [title, setTitle] = useState('');
  let typetext = ''; // Default value is an empty string
  if (route.params && route.params.typetext) {
    typetext = route.params.typetext; // If typetext exists in route.params, assign its value to typetext
  }

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
         timestamp: serverTimestamp(),
       });   
      setImage(downloadURL); // Set image URL for display after successful upload
   //   navigation.replace('Home');
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };
  
  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Set Title...."
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={uploadImage} style={styles.button}>
        {/* Your upload button */}
        <Text>{typetext}</Text> {/* Display typetext */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
