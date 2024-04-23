import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);
  useEffect(() => {
    const getImageData = async () => {
      try {
        const imagesRef = collection(db, 'images');
        const q = query(imagesRef, orderBy('timestamp', 'desc')); // Order by timestamp in descending order
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnapshot) => {
          const imageData = docSnapshot.data();
          const timestamp = imageData.timestamp; // Access the timestamp field from the document data
          console.log('Timestamp:', timestamp);
        });
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };

    getImageData();
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
