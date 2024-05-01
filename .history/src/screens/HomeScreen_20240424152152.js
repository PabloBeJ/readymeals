import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../../firebaseConfig';
import { query, doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';

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
             
              <Image
                source={{ uri: item.profilePictureURL }}
                style={globalStyles.image}
              />
              <Text style={[globalStyles.text, { marginLeft: 5 }]}>{item.username}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[globalStyles.text, styles.titleText]}>{item.title}</Text>
              <TouchableOpacity onPress={() => handleSaveRecipe(item.imageUrl)} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  titleText: {
    textAlign: 'center', // Center the title text
    flex: 1, // Allow the title to take up remaining space
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '90%',
    aspectRatio: 1 / 1,
    resizeMode: 'cover',
    marginVertical: 10,
    borderRadius: 10,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
