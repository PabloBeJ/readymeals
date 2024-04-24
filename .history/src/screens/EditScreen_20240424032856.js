import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet, Text , Alert , KeyboardAvoidingView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../firebaseConfig';
import { collection, query, getDocs, doc, setDoc,updateDoc, getDoc,Docs, serverTimestamp, where,deleteDoc} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/globalStyles';


export default function EditScreen() {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [h1Title, seth1Title] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { imageUri, text, userId, Titletext} = route.params; 
    useEffect(() => {
        setImage(imageUri);
        seth1Title(text);
        console.log("h1tit " + h1Title);
    }, [imageUri, text]);

    // Uploads And creates a new picture
    const uploadImage = async () => {
        try {
            const uri = imageUri; // Use the imageUri state
            const fileName = title || 'Unnamed_Image'; // Use title as fileName, fallback to 'Unnamed_Image'
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileRef = ref(storage, `images/${fileName}`);
            await uploadBytes(fileRef, blob);
            const downloadURL = await getDownloadURL(fileRef);
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

    const updateImage = async () => {
        try {
            const q = query(collection(db, 'images'), where("imageUrl", "==", imageUri)); // Collection group query to search across all 'Images' subcollections
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]; // Get the first document from the query results
                // Update the title field of the matched document
                await updateDoc(doc.ref, { imageTitle: title });
                console.log("Title updated successfully in Firestore");
            } else {
                console.log("No matching document found in Firestore");
            }
        } catch (error) {
            console.error("Error updating title in Firestore: ", error);
        }
    };
    
    // Deletes Picture
    // Uploads And creates a new picture
    const deleteImage = async () => {
        try {
            const q = query(collection(db, 'images'), where("imageUrl", "==", imageUri)); // Collection group query to search across all 'Images' subcollections
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]; // Get the first document from the query results
                // Update the title field of the matched document
                await deleteDoc(doc.ref);
                Alert.alert("Image Deleted Successfully");
                navigation.replace('Profile');
            } else {
                console.log("No matching document found in Firestore");
            }
        } catch (error) {
            console.error("Error Deletin Firestore: ", error);
        }
    };

    function cancelCam() {
        navigation.replace("Camera");
    }
    function cancelProf() {
        navigation.replace("Profile");
    }

    
    return (
        <KeyboardAvoidingView style={globalStyles.container} behavior="padding">
            <Text style={[globalStyles.title, { marginBottom: 200 }]}>{h1Title}</Text>
            <View>
                {/* Preview Image */}
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
            <View style={styles.row}>
                <TextInput
                    placeholder="Set Title...."
                    value={title !== '' ? title : Titletext}
                    onChangeText={text => setTitle(text)}
                    style={styles.input} />

                {text === "Upload Image" && (
                    <TouchableOpacity onPress={uploadImage} style={globalStyles.controlButton}>
                        <Image source={require("../assets/img/icon_img/plus-icon.png")} style={globalStyles.imageIcon} />
                    </TouchableOpacity>)}
                {text === "Update Image" && (
                    <TouchableOpacity onPress={updateImage} style={globalStyles.controlButton}>
                        <Image source={require("../assets/img/icon_img/plus-icon.png")} style={globalStyles.imageIcon} />
                    </TouchableOpacity>)}
            </View>
            <View style={styles.row}>
            {text === "Upload Image" && (
                <TouchableOpacity onPress={cancelCam} style={[styles.controlButton, styles.row, { marginTop: 10 }]}>
                    <Image source={require("../assets/img/icon_img/arrow-icon.png")} style={globalStyles.imageIcon} />
                    <Text style={globalStyles.controlButtonText}>Cancel</Text>
                </TouchableOpacity>)}
            {text === "Update Image" && (
                <TouchableOpacity onPress={cancelProf} style={[styles.controlButton, styles.row, { marginTop: 10 }]}>
                    <Image source={require("../assets/img/icon_img/arrow-icon.png")} style={globalStyles.imageIcon} />
                    <Text style={globalStyles.controlButtonText}>Cancel</Text>
                </TouchableOpacity>)}

                {/* Conditional rendering of the delete button */}
                {text === "Update Image" && (
                    <TouchableOpacity onPress={deleteImage} style={[styles.controlButton, styles.row, { marginTop: 10, marginLeft: 20 }]}>
                        <Image source={require("../assets/img/icon_img/delete-icon.png")} style={[globalStyles.imageIcon, { marginTop: -3 }]} />
                        <Text style={globalStyles.controlButtonText}>Delete</Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
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