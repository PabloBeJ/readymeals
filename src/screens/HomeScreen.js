import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native'
import { initializeApp } from '@react-native-firebase/app';
import { auth ,storage} from '../../firebaseConfig';
import Footer from '../components/Footer';
import globalStyles from '../styles/globalStyles';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
const HomeScreen = () => {
  const navigation = useNavigation()
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchFilesFromStorage();
  }, []);
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }


  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={{ width: 200, height: 200, margin: 5 }} />
  )
  

  const fetchFilesFromStorage = async () => {
    try {
      const listResult = await listAll(ref(storage, 'images/'));
      const filePromises = listResult.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        return downloadURL;
      });
      const imageURLs = await Promise.all(filePromises);
      setImages(imageURLs);
    } catch (error) {
      console.error('Error fetching files from Firebase Storage:', error);
    }
  }
 
  return (
    <View style={globalStyles.container}>

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />

      <Footer />  
    </View>
  )
}


export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})