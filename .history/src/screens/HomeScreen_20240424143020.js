import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { query, doc, getDoc, collection, getDocs, orderBy, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Import arrayUnion and arrayRemove
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';
import { ref, getDownloadURL } from 'firebase/storage';

const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('timestamp', 'desc')));
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
                  profilePictureURL: downloadURL,
                  likes: imageInfo.likes || [],
                  imageId: docSnapshot.id
                });
              } else {
                data.push({
                  imageUrl: imageInfo.imageUrl,
                  title: imageInfo.imageTitle,
                  userId: imageInfo.userId,
                  username: userData.username,
                  profilePictureURL: userData.profilePicture,
                  likes: imageInfo.likes || [],
                  imageId: docSnapshot.id
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

  const handleLike = async (imageId) => {
    try {
      // Update the 'likes' field in the document with the given imageId
      const imageDocRef = doc(db, 'images', imageId);
      await updateDoc(imageDocRef, {
        likes: arrayUnion(imageId) // Add the user's ID to the 'likes' array
      });
      // Update the local state to reflect the like
      setImageData(prevImageData => {
        return prevImageData.map(item => {
          if (item.imageId === imageId) {
            return { ...item, likes: [...item.likes, imageId] };
          }
          return item;
        });
      });
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {imageData.map((item, index) => (
          <View key={index} style={globalStyles.container}>
            <View style={styles.titleContainer}>
              <Image
                source={{ uri: item.profilePictureURL }}
                style={globalStyles.image}
              />
              <Text style={[globalStyles.text, {marginLeft:5}]}>{item.username}  </Text>
            </View>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
            <TouchableOpacity onPress={() => handleLike(item.imageId)}>
              {/* You can use any icon for the like button, such as a heart */}
              <Text>{`Likes: ${item.likes.length}`}</Text>
            </TouchableOpacity>
            <Text style={globalStyles.text}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 150,
    backgroundColor: '#22252A',
  },
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
});

export default HomeScreen;
