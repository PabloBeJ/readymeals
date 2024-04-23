import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Image, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../../styles/globalStyles';
//import { doc, collection, addDoc, setDoc, firestore } from "firebase/firestore";
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db , storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll,del }  from 'firebase/storage';
const LoginScreen = () => {
  const [inputemail, setEmail] = useState('');
  const [inputpassword, setPassword] = useState('');
  const [inputconfirmPassword, setConfirmPassword] = useState('');
  const [inputphone, setPhone] = useState('');
  const [inputusername, setUsername] = useState('');
  const navigation = useNavigation();

  // Example Firestore Query
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  };

  // GET DEfault profile picture
  const getDefaultProfilePictureURL = async () => {
    const defaultProfilePicRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
    try {
      const url = await getDownloadURL(defaultProfilePicRef);
      console.log("Got profile Picture. " + url);
      return url;
    } catch (error) {
      console.error("Error getting default profile picture:", error);
      return null;
    }
  };



  const Register = async () => {
    try {
      if (inputemail == '' || inputpassword == '' || inputconfirmPassword == '' || inputphone == '' || inputusername == '') {
        Alert.alert('Please enter all the required fields');
        return;
      }
      if (!inputpassword || !inputconfirmPassword || inputpassword !== inputconfirmPassword) {
        Alert.alert('Passwords do not match');
        return;
      }
      const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/; //   8 characters in length,  1 letter in uppercase,  1 letter in lowercase, 1 special character (!@#$&*),   1 number (0-9)
      if (!inputpassword.match(regex)) {
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
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, inputemail, inputpassword);

      const userId = userCredential.user.uid;
      // Add user details to Firestore
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        email: inputemail,
        phone: inputphone,
        username: inputusername,
        profilePicture: "default.png"
      });
  

// Get the download URL of the default image
const defaultImageRef = ref(storage, 'images/default/cooking-947738_960_720.jpg');
const defaultImageUrl = await getDownloadURL(defaultImageRef);

// Fetch the default image as a blob
const defaultImageBlob = await fetch(defaultImageUrl).then(res => res.blob());

// Upload the default image blob to the user's ProfilePicture folder
const userImageRef = ref(storage, `images/${userId}/ProfilePicture`);
await uploadBytes(userImageRef, defaultImageBlob);

   // Display success message or handle navigation
   console.log("Default image uploaded successfully to user's ProfilePicture folder.");


      Alert.alert('Welcome. User: ' + inputusername + ' Registered successfully!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error creating user:', error.message);
      Alert.alert('Error', error.message);
    }
  };
  async function Cancel() {
    navigation.replace('Login');
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#22252A' }}>
      <KeyboardAvoidingView style={[globalStyles.container, { paddingBottom: 50 }]} behavior="padding">
        <View style={globalStyles.titleContainer}>
          <Image
            source={require("../../assets/img/LogoReadyMeals.jpg")}
            style={[globalStyles.image, { marginRight: 20 }]}
          />
          <Text style={globalStyles.title}>Ready Meals</Text>
        </View>
        <View style={styles.backgroundColor}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={inputemail}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Username"
              value={inputusername}
              onChangeText={text => setUsername(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={inputpassword}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder="Confirm Password"
              value={inputconfirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder="Phone Number"
              value={inputphone}
              onChangeText={text => setPhone(text)}
              style={styles.input}
            />
          </View>
          {/** Buttons to login or Register. */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={Register} style={globalStyles.buttonForm}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={Cancel} style={[globalStyles.buttonForm, styles.buttonOutline]}>
              <Text style={styles.buttonOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
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
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
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
});
