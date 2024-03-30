import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Image, StyleSheet, ScrollView } from 'react-native';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebaseConfig'; // Assuming you have initialized Firebase app and exported `auth` and `db`
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import globalStyles from '../styles/globalStyles';
const UpdateProfileScreen = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputOldPasswd, setInputOldPasswd] = useState('');
  const [inputNewPasswd, setInputNewPasswd] = useState('');
  const [inputConfirmPasswd, setInputConfirmPasswd] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold userId
  //Navigation
  const navigation = useNavigation();
  useEffect(() => {
    // Check if user is logged in
    async function checkUserLoggedIn() {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid); // Set userId if user is logged in
        console.log('Usser is logged in. ' + user.uid);
      } else {
        // Handle case when user is not logged in
        console.log('User is not logged in');
      }
    };
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch user profile data if userId is available
      async function fetchProfileData() {
        try {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setInputUsername(userData.username); //Prints the username
            setInputPhone(userData.phone); // Prints the phone number
            setInputEmail(userData.email); //Prints the email
            if (userData.profilePicture) {
              // Get the download URL of the profile picture
              const fileRef = ref(storage, `images/${userId}/ProfilePicture`);
              const downloadURL = await getDownloadURL(fileRef);
              setImage(downloadURL);
            }
          }
        } catch (error) {
          // Get the Default Image if it doesn't exist.
          const fileRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
          const downloadURL = await getDownloadURL(fileRef);
          setImage(downloadURL);
        }
      };
      fetchProfileData();
    }
  }, [userId]);

  //Pick Image gotted from the offical expo document pick image. 
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  //Confirmation if the user wants to update their account.
  const confirmationUpdate = () => {
    Alert.alert(
      'Confirm Update',
      'Are you sure you want to update your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: handleUpdateProfile,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };
  function confirmationDelete() {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: handleDeleteProfile,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  //Update Profile and Image
  async function handleUpdateProfile() {
    try {
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
      const userRef = doc(db, 'users', userId);
      const dataToUpdate = {
        username: inputUsername,
        phone: inputPhone,
        email: inputEmail,
        profileImage: image,
      };
      if (image) {
        // Upload image to Firebase Storage and update profile with image URL
        await uploadImage(image, userId);
      }
      await updateDoc(userRef, dataToUpdate);

      async function uploadImage(imageUri, userId) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const deleteRef = ref(storage, `images/${userId}/ProfilePictue`);
          const fileRef = ref(storage, `images/${userId}/ProfilePicture`);
          // Delete the previous profile picture. And updates the new one.
          await deleteObject(deleteRef);
          console.log("Deleted Successfully");
          await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(fileRef);
          dataToUpdate.profileImage = downloadURL;
          //   setImage(downloadURL); // Set image URL for display after successful upload
        } catch (error) {
          //If the file does not exist to delete it creates a new one. 
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileRef = ref(storage, `images/${userId}/ProfilePicture`);
          await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(fileRef);
          dataToUpdate.profileImage = downloadURL;
          console.log("File Upload First time");
          Alert.alert('Profile updated successfully');
        }
        // Update user email in Firebase Authentication
        const user = auth.currentUser;
        if (user && user.email !== inputEmail) {
          await user.updateEmail(inputEmail);
        }
      };
      Alert.alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      //Alert.alert('Failed to update profile', error.message);
    }
  };

  // Function to delete all files under a folder path pattern
  const deleteFilesUnderPath = async (folderPath) => {
    try {
      const folderRef = ref(storage, folderPath);

      // List all items (files) in the folder
      const folderItems = await listAll(folderRef);

      // Delete each file in the folder
      const deletePromises = folderItems.items.map((item) => deleteObject(item.ref));

      // Wait for all files to be deleted
      await Promise.all(deletePromises);

      console.log('All files under folder path deleted successfully.');
    } catch (error) {
      console.error('Error deleting files under folder path:', error.message);
      // Handle error
    }
  };

  // Function to handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      // Delete user document in Firestore from 'users' collection
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      console.log('User deleted collection');

      // Delete all images under ProfilePicture folder associated with the user in Firebase Storage
      const profilePicturesPath = `images/${userId}/ProfilePicture`;
      await deleteFilesUnderPath(profilePicturesPath);
      console.log('User deleted Storage Profile Picture');

      // Delete all images under MealPictures folder associated with the user in Firebase Storage
      //  const mealPicturesPath = `images/${userId}/MealPictures`;
      // await deleteFilesUnderPath(mealPicturesPath);

      // Delete user account in Firebase Authentication
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        console.log('Auth user delelted succefully.')
      }
      console.log('Profile, related data, and user account deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error.message);
      // Handle error
    }
  };
  function handleCancel(){
    navigation.replace("Home");
  }
  function handleSignOut  ()  {
    auth
      .signOut()
      .then(() => {
        Alert.alert('Such a shame see you soon....');
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <ScrollView style={{flex: 1,  backgroundColor: '#22252A'}}>
    <KeyboardAvoidingView style={[globalStyles.container, { paddingBottom: 50, marginBottom: 50 }]} behavior="padding">
        <Text style={[globalStyles.title, {marginTop: 15}]}>Profile Details</Text>
      <View style={globalStyles.titleContainer}>
      </View>
      <View style={styles.backgroundColor}>
        <View style={styles.inputContainer}>
          <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.textPlacehover}>Username:</Text>
        <Text style={[globalStyles.textPlacehover , styles.containerRight,  {textAlign: 'right' }]}>Avatar:</Text>
        </View>
          <View style={globalStyles.titleContainer}>
            <TextInput
              placeholder="Username"
              value={inputUsername}
              onChangeText={text => setInputUsername(text)}
              style={[styles.input, { width: '70%' }]}
            />
            <TouchableOpacity onPress={pickImage}>
             
              {image && <Image source={{ uri: image }} style={[styles.imageProfile, { marginLeft: 20, marginTop: -30, }]} />}
            </TouchableOpacity>
          </View>
          <Text style={globalStyles.textPlacehover}>Email:</Text>
          <TextInput
            placeholder="Email"
            value={inputEmail}
            onChangeText={text => setInputEmail(text)}
            style={styles.input}
          />
             <Text style={globalStyles.textPlacehover}>Phone Number:</Text>
          <TextInput
            placeholder="Phone Number"
            value={inputPhone}
            onChangeText={text => setInputPhone(text)}
            style={styles.input}
          />
          <Text style={globalStyles.text}>Change Password</Text>
          <Text style={globalStyles.textPlacehover}>Old Password:</Text>
          <TextInput
            placeholder="Enter Your Old Password"
            value={inputOldPasswd}
            onChangeText={text => setInputOldPasswd(text)}
            style={styles.input}
          />
           <Text style={globalStyles.textPlacehover}>New Password:</Text>
          <TextInput
            placeholder="Enter Your New Password"
            value={inputNewPasswd}
            onChangeText={text => setInputNewPasswd(text)}
            style={styles.input}
          />
           <Text style={globalStyles.textPlacehover}>Confirm Password:</Text>
          <TextInput
            placeholder="Enter Your Confirm Password"
            value={inputConfirmPasswd}
            onChangeText={text => setInputConfirmPasswd(text)}
            style={styles.input}
          />
        </View>
        {/** Buttons to login or Register. */}
        <View style={globalStyles.container}>
          <TouchableOpacity style={styles.button}>
            <Text onPress={handleCancel} style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
            <Text onPress={confirmationUpdate} style={styles.buttonOutlineText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
            <Text onPress={handleDeleteProfile} style={styles.buttonOutlineText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
            <Text onPress={handleSignOut} style={styles.buttonOutlineText}>Sign Out</Text>
          </TouchableOpacity>
     </View>
      </View>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginBottom: 10,
  },
  containerRight: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns the child to the end of the parent container
    alignItems: 'flex-end', // Aligns the child to the right side of the parent container
 
  },
  backgroundColor: {
    backgroundColor: 'black',
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 30,
    borderRadius: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  imageProfile: {
    width: 80,
    height: 80,
    borderRadius: 80
  },
});

export default UpdateProfileScreen;
