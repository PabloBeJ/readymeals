import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/globalStyles';


export default function EditScreen() {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [h1Title, seth1Title] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    console.log("In edit page");
    const { imageUri, text, userId } = route.params;

    console.log("Edit + " + text);
    useEffect(() => {
        setImage(imageUri);
        seth1Title(text);
        console.log("h1tit " + h1Title);
    }, []);

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
            console.log("UserIDChecker :", userRef);
            await setDoc(userRef, {
                imageUrl: downloadURL,
                userId: userId,
                imageTitle: title,
                timestamp: serverTimestamp(),
            });
            setImage(downloadURL);
            navigation.replace('Home');
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    };



    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'flex-start', // Align items at the start of the container
          paddingTop: 20, // Add padding to create space between the title and the top of the screen
          paddingHorizontal: 20, // Add horizontal padding for content spacing
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20, // Add margin at the bottom of the title for spacing
        },
        image: {
          width: 100,
          height: 100,
          resizeMode: 'cover',
          marginBottom: 20, // Add margin at the bottom of the image for spacing
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20, // Add margin at the bottom of the row for spacing
        },
        input: {
          flex: 1,
          height: 40,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
          marginRight: 10, // Add margin to the right of the input for spacing
        },
        buttonMargin: {
          marginLeft: 10, // Add margin to the left of the button for spacing
        },
      });
    
      return (
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>{h1Title}</Text>
    
          {/* Preview Image */}
          <View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
    
          <View style={styles.row}>
            <TextInput
              placeholder="Set Title...."
              value={title}
              onChangeText={text => setTitle(text)}
              style={styles.input}
            />
            <TouchableOpacity onPress={uploadImage} style={[styles.buttonMargin]}>
              <Image source={require("../assets/img/icon_img/upload-icon.png")} style={styles.imageIcon} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }