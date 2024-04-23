import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Image, StyleSheet, ScrollView } from 'react-native';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../../firebaseConfig'; // Assuming you have initialized Firebase app and exported `auth` and `db`
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll,del } from 'firebase/storage';
import { getAuth, deleteUser, updateEmail, EmailAuthProvider, updatePassword, reauthenticateWithCredential, sendEmailVerification } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import globalStyles from '../../styles/globalStyles';
const UpdateProfileScreen = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [userDataEmail, setUserDataEmail] = useState('');
  const [inputOldPasswd, setInputOldPasswd] = useState('');
  const [inputNewPasswd, setInputNewPasswd] = useState('');
  const [inputConfirmPasswd, setInputConfirmPasswd] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold userId

  //Navigation to change scenary when signing out or deleting the account. 
  const navigation = useNavigation();
  useEffect(() => {
    // Check if user is logged in
    async function checkUserLoggedIn() {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid); // Set userId if user is logged in
        console.log('Usser is logged in. ' + user.uid);
        const currentUser = auth.currentUser;
        const userEmail = currentUser.email;
        const formattedEmail = userEmail.replace('Email', '');
        setUserDataEmail(formattedEmail); //Saves email value if i want to change email address. 
      } else {
        // Handle case when user is not logged in
        navigation.replace("Login");
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
              const fileRef = ref(storage, `images/${userId}/ProfilePicture/`);
              const downloadURL = await getDownloadURL(fileRef);
              setImage(downloadURL);
            }
          }
        } catch (error) {
          // Get the Default Image if it doesn't exist.
          const fileRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
          const downloadURL = await getDownloadURL(fileRef);
          setImage(downloadURL);
          console.log("Error gettign picture" +  console.error);
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

  //Confirmation if the user wants to delete their account.
  const confirmationDelete = () => {
    Alert.alert(
      'Confirmation Delete',
      'Are you sure you want to delete your profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: handleDeleteProfile,
          style: 'destructive',
          color: 'red',
        },
      ],
      { cancelable: false }
    );
  };

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
        profilePicture: image,
      };
      await updateDoc(userRef, dataToUpdate);
      // Update user email in Firebase Authentication or Password
      const user = auth.currentUser;
      if (user && user.email !== inputEmail) {
        if (inputOldPasswd == '') {
          Alert.alert('Please Fill out the current password Field to change the email');
          return;
        } else {
          const auth = getAuth();
          console.log("Users current email " + userDataEmail);
          // Re-authenticate the user with their current password
          const credential = EmailAuthProvider.credential(userDataEmail, inputOldPasswd);
          await reauthenticateWithCredential(user, credential);
          await updateEmail(auth.currentUser, inputEmail);
          await sendEmailVerification(auth.currentUser);
          const userRef = doc(db, 'users', userId);
          const dataToUpdate = {
            email: inputEmail,
          };
          await updateDoc(userRef, dataToUpdate);
          Alert.alert("A verification email has been sent to " + inputEmail + " To activate your account ");
        }
      }
        const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/; //   8 characters in length,  1 letter in uppercase,  1 letter in lowercase, 1 special character (!@#$&*),   1 number (0-9)
        if(inputNewPasswd != ''){
        if (inputNewPasswd != inputConfirmPasswd) {
          Alert.alert("Passwords do not match");
          return;
        } else if (inputNewPasswd == inputConfirmPasswd && inputOldPasswd == '') {
          Alert.alert("Please enter your current password Before changing your password");
          return;
        }
        else if (!inputNewPasswd.match(regex)) {
          Alert.alert("Password Requirements",
          "Your password must contain:\n\n" +
          "- At least 8 characters\n" +
          "- At least 1 uppercase letter\n" +
          "- At least 1 lowercase letter\n" +
          "- At least 1 special character (!@#$&*)\n" +
          "- At least 1 number (0-9)"
        );
        return;
        } 
        else {
          const auth = getAuth();
          const user = auth.currentUser;
          // Re-authenticate the user with their current password
          const credential = EmailAuthProvider.credential(user.email, inputOldPasswd);
          await reauthenticateWithCredential(user, credential);
          updatePassword(auth.currentUser, inputNewPasswd).then(() => {
            Alert.alert("Password updated successfully");
          }).catch((error) => {
            console.log("Password Error Updated " + error.message);
            // An error occurred
            // ...
          });
        }
        
      }
      if (image) {
        // Upload image to Firebase Storage and update profile with image URL
        await uploadImage(image, userId);
      }

      async function uploadImage(imageUri, userId) {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const deleteRef = ref(storage, `images/${userId}/ProfilePicture/`);
          const fileRef = ref(storage, `images/${userId}/ProfilePicture`);
          // Delete the previous profile picture. And updates the new one.
          await deleteObject(deleteRef);
          console.log("Image Deleted Successfully");
          await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(fileRef);
          Alert.alert("Profile Picture Updated");
          dataToUpdate.profilePicture = downloadURL;
          //   setImage(downloadURL); // Set image URL for display after successful upload
        } catch (error) {
          //If the file does not exist to delete it creates a new one. 
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileRef = ref(storage, `images/${userId}/ProfilePicture/`);
          await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(fileRef);
          dataToUpdate.profilePicture = downloadURL;
          console.log("File Upload First time");
        }
      };
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      //Alert.alert('Failed to update profile', error.message);
    }
  };


// Function to delete a user's entire content (profile picture and all food pictures)
const deleteUseFolder = async (userId) => {
  try {
    // Delete Profile Picture
    const profilePictureRef = ref(storage, `images/${userId}/ProfilePicture`);
    await deleteObject(profilePictureRef);
    console.log('Profile picture deleted successfully');

    // Delete all images in FoodPictures folder
    const foodPicturesRef = ref(storage, `images/${userId}/FoodPictures/`);
    const foodPicturesList = await listAll(foodPicturesRef);
    
    for (let i = 0; i < foodPicturesList.items.length; i++) {
      await deleteObject(foodPicturesList.items[i]);
    }
    
    console.log('All food pictures deleted successfully');

    console.log('User content deleted successfully');
  } catch (error) {
    console.error('Error deleting user content:', error);
  }
};
  // Function to handle profile deletion
  async function handleDeleteProfile() {
    if (inputOldPasswd == '') {
      Alert.alert('Please enter your Current Password to confirm to delete.');
    } else {
      // Delete user document in Firestore from 'users' collection
      const auth = getAuth();
      const user = auth.currentUser;
      // Re-authenticate the user with their current password
      const credential = EmailAuthProvider.credential(user.email, inputOldPasswd);
      if (user) {
        await reauthenticateWithCredential(user, credential);

        const userRef = doc(db, 'users', userId);
        console.log("Getting User Id" + userId);
      // Delete all images under ProfilePicture folder associated with the user in Firebase Storage
        await deleteUseFolder(userId);
        console.log('User deleted Storage Profile Picture');
       
        //Delete Firestore Content
        await deleteDoc(userRef);
        console.log('User deleted Firestore');
        //Delete Authenticated User
        await deleteUser(user);
        console.log('Auth user delelted succefully.')
      }
      console.log('Profile, related data, and user account deleted successfully.');
      Alert.alert('Profile deleted successfully');
      navigation.replace("Login");
    }
  };

  function handleSignOut() {
    auth
      .signOut()
      .then(() => {
        Alert.alert('Such a shame see you soon....');
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#22252A' }}>
      <KeyboardAvoidingView style={[globalStyles.container, { paddingBottom: 25, marginBottom: 25 }]}>
        <Text style={[globalStyles.title, { marginTop: 15 }]}>Profile Details</Text>
        <View style={globalStyles.titleContainer}>
        </View>
        <View style={styles.backgroundColor}>
          <View style={styles.inputContainer}>
            <View style={globalStyles.titleContainer}>
              <Text style={globalStyles.textPlacehover}>Username:</Text>
              <Text style={[globalStyles.textPlacehover, styles.containerRight, { textAlign: 'right' }]}>Avatar:</Text>
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
            <Text style={globalStyles.textPlacehover}>Current Password:</Text>
            <TextInput
              placeholder="Enter Your Current Password"
              value={inputOldPasswd}
              onChangeText={text => setInputOldPasswd(text)}
              style={styles.input}
              secureTextEntry
            />
            <Text style={globalStyles.textPlacehover}>New Password:</Text>
            <TextInput
              placeholder="Enter Your New Password"
              value={inputNewPasswd}
              onChangeText={text => setInputNewPasswd(text)}
              style={styles.input}
              secureTextEntry
            />
            <Text style={globalStyles.textPlacehover}>Confirm Password:</Text>
            <TextInput
              placeholder="Enter Your Confirm Password"
              value={inputConfirmPasswd}
              onChangeText={text => setInputConfirmPasswd(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
          {/** Buttons to login or Register. */}
          <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button}>
              <Text onPress={confirmationUpdate} style={styles.buttonOutlineText}>Update Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text onPress={confirmationDelete} style={styles.buttonOutlineDeleteText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text onPress={handleSignOut} style={styles.buttonText}>Sign Out</Text>
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
    backgroundColor: '#202225',
    width: '100%',
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
  buttonOutlineDelete: {
    backgroundColor: '#7A0A0A',
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
  buttonOutlineDeleteText: {
    color: '#EC1919',
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
