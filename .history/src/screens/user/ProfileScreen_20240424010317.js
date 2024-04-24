import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { initializeApp } from '@react-native-firebase/app';
import { db, storage, auth } from '../../../firebaseConfig';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { query, doc, getDoc, collection, getDocs, orderBy, where } from 'firebase/firestore';
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
