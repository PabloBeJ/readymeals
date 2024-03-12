import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native'
import { auth, storage } from '../../firebaseConfig';
import Footer from '../components/Footer';
import globalStyles from '../styles/globalStyles';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
const HomeScreen = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchFilesFromStorage();
  }, []);

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
    <View>
      {/*Scrool View of all the image publish by useers and printed at the center of the screeen */}
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View style={globalStyles.container}>
            <View style={styles.titleContainer}>
              <Image
                source={require("../assets/img/profilePicture.png")}
                style={globalStyles.image}
              />
               <Text style={globalStyles.text}> Pablo_bt </Text>
            </View>
            <Image source={{ uri: item }} style={styles.image} />
            <Text style={globalStyles.text}> Titulo de Comida </Text>
          </View>
          
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        contentContainerStyle={[styles.flatListContentContainer, { paddingBottom: 100 , backgroundColor: '#22252A', }]}
      />
      <Footer />
    </View>
  )
}
export default HomeScreen

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 'auto',
    position: 'relative',
    left: 0,
  },
  image: {
    width: '90%',
    aspectRatio: 1 / 1,
    resizeMode: 'cover',
    marginVertical: 10,
    borderRadius: 10,
  },
})