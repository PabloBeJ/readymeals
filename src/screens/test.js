import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ScrollView } from 'react-native'
import { auth, storage } from '../../firebaseConfig';
import Footer from '../components/Footer';
import globalStyles from '../styles/globalStyles';
import { ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';

const HomeScreen = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchFilesFromStorage();
  }, []);

  const fetchFilesFromStorage = async () => {
    try {
      // Gets all the images in the storage.  in Firebase.
      const getImages = await listAll(ref(storage, 'images/'));
  
      // Map over each image location to get its download URL, title, and timestamp
      const filePromises = getImages.items.map(async (imageLocation) => {

        // Get the download URL for the image
        const downloadURL = await getDownloadURL(imageLocation);
        
        // Get the image name as its title
        const imageTitle = imageLocation.name;
        
        // Get the metadata for the image to access its creation time
        const metadata = await getMetadata(imageLocation);
        // Check if metadata.timeCreated is a valid timestamp
        // If valid, convert it to milliseconds
        const timestamp = new Date(metadata.timeCreated).getTime() || 0;
        
        // Return an object with download URL, image title, and timestamp
        return { downloadURL, imageTitle, timestamp };
      });
      
      // Wait for all filePromises to resolve
      const imageURLs = await Promise.all(filePromises);
      
      // Sort images by timestamp the most recent order will appear at the top.
      imageURLs.sort((a, b) => b.timestamp - a.timestamp);
      
      // Set images
      setImages(imageURLs);
    } catch (error) {
      console.error('Error fetching files from Firebase Storage:', error);
    }
  };
  return (
    <View>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View style={globalStyles.container}>
            <View style={styles.titleContainer}>
              <Image
                source={require("../assets/img/profilePicture.png")}
                style={globalStyles.image}
              />
              <Text style={globalStyles.text}>Pablo_bt</Text>
            </View>
            <Image source={{ uri: item.downloadURL }} style={styles.image} />
            <Text style={globalStyles.text}>{item.imageTitle}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={1}
        contentContainerStyle={[
          styles.flatListContentContainer,
          { paddingBottom: 100, backgroundColor: '#22252A' },
        ]}
      />
      <Footer />
    </View>
  );
};
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