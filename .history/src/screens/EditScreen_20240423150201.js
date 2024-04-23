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
    return (
        <View style={globalStyles.container}>
          <Text style={[globalStyles.title, {marginTop: -140, marginBottom: 20}]}>{h1Title}</Text>
      <View>
          {/* Preview Image */}
          {image && <Image source={{ uri: image }} style={styles.image} />}
          </View>
          <View style={styles.row}>
            <TextInput
              placeholder="Set Title...."
              value={title}
              onChangeText={text => setTitle(text)}
              style={styles.input}
            />
            <TouchableOpacity onPress={uploadImage} style={globalStyles.controlButton}>
              <Image source={require("../assets/img/icon_img/upload-icon.png")} style={globalStyles.imageIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
          <TouchableOpacity onPress={uploadImage} style={[globalStyles.controlButton, {marginTop: 20}]}>
              <Image source={require("../assets/img/icon_img/upload-icon.png")} style={globalStyles.imageIcon} />
              <Text style={[globalStyles.title]}>Cancel</Text>
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