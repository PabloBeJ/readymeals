import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native'
import { initializeApp } from '@react-native-firebase/app';
import { db, storage, auth } from '../../../firebaseConfig';
import Footer from '../../components/Footer';
import globalStyles from '../../styles/globalStyles';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { query, doc, getDoc, collection, getDocs, orderBy, where } from 'firebase/firestore'; // Import orderBy

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null); // State to hold userId
  const navigation = useNavigation()


  function editImage() {
  
  }

  const renderImageItem = ({ item }) => (
    <TouchableOpacity onPress={editImage}>
    <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200, margin: 5 }} />
    </TouchableOpacity>
  )
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        const fetchuserId = user.uid;
        // Set Id for use later
        setUserId(fetchuserId);
        console.log("UserId" + fetchuserId);
        // Opens camera after userId is set
      } else {
        // Handle case when user is not logged in
        navigation.replace("Login");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        if (!userId) return; // Exit early if userId is not set

        const querySnapshot = await getDocs(query(collection(db, 'images'), where('userId', '==', userId), orderBy('timestamp', 'desc')));
        const data = [];
        for (const docSnapshot of querySnapshot.docs) {
          const imageInfo = docSnapshot.data();
          const userRef = doc(db, 'users', imageInfo.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData && userData.username && userData.profilePicture) {
              if (userData.profilePicture == "default.png" || !userData.profilePicture) {
                const fileRef = ref(storage, `images/default/cooking-947738_960_720.jpg`);
                const downloadURL = await getDownloadURL(fileRef);
                data.push({
                  imageUrl: imageInfo.imageUrl,
                  title: imageInfo.imageTitle,
                  userId: imageInfo.userId,
                  username: userData.username,
                  profilePictureURL: downloadURL
                });
              } else {
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
  }, [userId]); // Include userId as a dependency

  
  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.title, {marginVertical:10}]}> Account </Text>
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
export default ProfileScreen;
