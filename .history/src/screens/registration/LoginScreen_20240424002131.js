import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet,  Text, TextInput, Image, TouchableOpacity,  View, Alert,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../../styles/globalStyles';
import { doc, setDoc } from "firebase/firestore"; 
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  async function Register() {
    navigation.replace('Register');
  };

  async function Login() {
      try {
  //    await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      console.error('Login failed:', error.message);
      Alert.alert('Error', error.message);
    } 
  };
  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior="padding">
      <View style={globalStyles.titleContainer}>
        <Image
          source={require("../../assets/img/LogoReadyMeals.jpg")}
          style={globalStyles.image}
        />
        <Text style={[globalStyles.title, { marginLeft: 20}]}>Ready Meals</Text>
      </View>
      <View style={styles.backgroundColor}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email...."
            value={email}
            onChangeText={text => setEmail(text)}
            style={[styles.input, { marginBottom: 10 }]} 
          />
          <TextInput
            placeholder="Password...."
            value={password}
            onChangeText={text => setPassword(text)}
            style={[styles.input, { marginBottom: 20 }]} 
            secureTextEntry
          />
        </View>
        {/** Buttons to login or Register. */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={Login} style={globalStyles.buttonForm}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={Register} style={[globalStyles.buttonForm, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  backgroundColor:{
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
    fontSize: 20
  },
  buttonContainer: {
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
