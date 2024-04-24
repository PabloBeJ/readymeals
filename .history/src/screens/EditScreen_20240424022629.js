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
    const { imageUri, text, userId, Titletext} = route.params;
    
    console.log("Edit UserId " + userId);
    useEffect(() => {
        setImage(imageUri);
        seth1Title(text);
        console.log("h1tit " + h1Title);
    }, [imageUri, text]);

    // Uploads And creates a new picture
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

    //Edit picture.
    // Uploads And creates a new picture
    const updateImage = async () => {
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

    // Deletes Picture
    // Uploads And creates a new picture
    const DeleteImage = async () => {
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

    function cancel() {
        navigation.replace("Camera");
    }

    return (
        <View style={globalStyles.container}>
            <Text style={[globalStyles.title, { marginBottom: 20 }]}>{h1Title}</Text>
            <View>
                {/* Preview Image */}
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
            <View style={styles.row}>
                <TextInput
                    placeholder="Set Title...."
                    value={Titletext}
                    onChangeText={text => setTitle(text)}
                    style={styles.input} />
                <TouchableOpacity onPress={uploadImage} style={globalStyles.controlButton}>
                    <Image source={require("../assets/img/icon_img/plus-icon.png")} style={globalStyles.imageIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={cancel} style={[styles.controlButton, styles.row, { marginTop: 10 }]}>
                    <Image source={require("../assets/img/icon_img/arrow-icon.png")} style={globalStyles.imageIcon} />
                    <Text style={globalStyles.controlButtonText}>Cancel</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={uploadImage} style={[styles.controlButton, styles.row, { marginTop: 10, marginLeft: 20 }]}>
                    <Image source={require("../assets/img/icon_img/delete-icon.png")} style={[globalStyles.imageIcon, { marginTop: -3 }]} />
                    <Text style={globalStyles.controlButtonText}>Delete</Text>
                </TouchableOpacity>



            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    image: {
        width: 380,
        height: 360,
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
    //Buttons for the footer and camera. 
    controlButton: {
        backgroundColor: '#fff',
        borderRadius: 50,
        height: 50,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },

});