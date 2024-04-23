import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const imagesRef = collection(db, 'images');
        const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('timestamp', 'desc')));

    
        const data = [];
  
        for (const docSnapshot of querySnapshot.docs) {
          const imageInfo = docSnapshot.data();
          const userRef = doc(db, 'users', imageInfo.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData && userData.username && userData.profilePicture) {
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
  
        setImageData(data);
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };
    fetchImageData();
  }, []);

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
              <Text style={globalStyles.text}>{item.username}  </Text>
            </View>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
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
