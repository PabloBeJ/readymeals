import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { query, doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';
import { ref, getDownloadURL } from 'firebase/storage';

const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);

  // Function to handle saving a recipe
  const handleSaveRecipe = (recipeId) => {
    // Implement saving logic here
    console.log('Recipe saved with ID:', recipeId);
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        // Fetch image data from Firestore
        const querySnapshot = await getDocs(query(collection(db, 'images'), orderBy('timestamp', 'desc')));
        const data = [];

        // Iterate over the query snapshot
        for (const docSnapshot of querySnapshot.docs) {
          const imageInfo = docSnapshot.data();
          const userRef = doc(db, 'users', imageInfo.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData && userData.username && userData.profilePicture) {
              // Construct recipe object
              const recipe = {
                imageUrl: imageInfo.imageUrl,
                title: imageInfo.imageTitle,
                userId: imageInfo.userId,
                username: userData.username,
                profilePictureURL: userData.profilePicture
              };
              data.push(recipe);
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
              <Text style={[globalStyles.text, {marginLeft:5}]}>{item.username}  </Text>
            </View>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
            <Text style={globalStyles.text}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleSaveRecipe(item.userId)} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
