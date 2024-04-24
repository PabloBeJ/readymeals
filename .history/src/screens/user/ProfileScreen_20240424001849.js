import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native'
import { initializeApp } from '@react-native-firebase/app';
import { db ,storage} from '../../../firebaseConfig';
import Footer from '../../components/Footer';
import globalStyles from '../../styles/globalStyles';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { query, doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
const ProfileScreen = () => {
  const navigation = useNavigation()


  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={{ width: 200, height: 200, margin: 5 }} />
  )
  
/*
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
 */


const [imageData, setImageData] = useState([]);
useEffect(() => {

  const fetchImageData = async () => {
    try {
      //Goes to firestroe and orders all images by timestamp most recent at the top
      const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('timestamp', 'desc')));
      //Array to create for later
      const data = [];
      // for loop of all contneet
      for (const docSnapshot of querySnapshot.docs) {
        //Gets data Api for the image location
        const imageInfo = docSnapshot.data();
        //Opens firestore of users that has the same ID (To see who uopload it)
        const userRef = doc(db, 'users', imageInfo.userId);
        const userSnap = await getDoc(userRef);
        // If user exist
        if (userSnap.exists()) {
          const userData = userSnap.data();
          //Gets the users username and profile pcitre
          if (userData && userData.username && userData.profilePicture) {
            // If the user exist but does not have any profile picture a defualt image will be set. 
            if (userData.profilePicture == "default.png" || !userData.profilePicture) {
              // If profile picture doesn't exist or is empty, fetch default image from storage
              const fileRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
              const downloadURL = await getDownloadURL(fileRef);
              //Fill content of array.  mixing bot firestore values.
              data.push({
                imageUrl: imageInfo.imageUrl,
                title: imageInfo.imageTitle,
                userId: imageInfo.userId,
                username: userData.username,
                profilePictureURL: downloadURL
              });
            } else {
              // If  not mixes both firestore values. 
              data.push({
                imageUrl: imageInfo.imageUrl,
                title: imageInfo.imageTitle,
                userId: imageInfo.userId,
                username: userData.username,
                profilePictureURL: userData.profilePicture
              });
            }
          }
        }
      }
      setImageData(data);
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };
  fetchImageData();
}, []);



return (
  <View style={globalStyles.container}>

    <FlatList
      data={imageData}
      renderItem={renderImageItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
    />

    <Footer />  
  </View>
)
}




export default ProfileScreen

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