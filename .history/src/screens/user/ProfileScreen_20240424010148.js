import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { initializeApp } from '@react-native-firebase/app';
import { db, storage, auth } from '../../../firebaseConfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { query, doc, getDoc, collection, getDocs, orderBy, where } from 'firebase/firestore';
import CustomHeader from '../../components/CustomHeader'; // Import the custom header
import Footer from '../../components/Footer';
import globalStyles from '../../styles/globalStyles';

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [imageData, setImageData] = useState([]);
  const navigation = useNavigation();

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200, margin: 5 }} />
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const fetchuserId = user.uid;
        setUserId(fetchuserId);
      } else {
        navigation.replace("Login");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        if (!userId) return;

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
  }, [userId]);

  return (
    <View style={globalStyles.container}>
      <CustomHeader title="Profile" onPressBack={() => navigation.goBack()} />
      <Text style={globalStyles.title}>Document </Text>
      <FlatList
        data={imageData}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
      <Footer />
    </View>
  );
}

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
});

export default ProfileScreen;
