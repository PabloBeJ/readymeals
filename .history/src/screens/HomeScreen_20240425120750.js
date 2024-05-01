import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { query, doc, getDoc, collection, getDocs, orderBy , ref} from 'firebase/firestore'; // Import orderBy
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
            //Gets the users username and profile pcitre
            if (userData && userData.username && userData.profilePicture) {
              // If the user exist but does not have any profile picture a defualt image will be set. 
              if (userData.profilePicture == "default.png" || !userData.profilePicture) {
                console.log(`Profile picture does not exist for user: ${userData.username}`);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {imageData.map((item, index) => (
          <View key={index} style={globalStyles.container}>
            <View style={styles.titleContainer}>
              <Image
                source={{ uri: item.profilePictureURL }}
                style={globalStyles.image}
              />
              <Text style={[globalStyles.text , { marginLeft: 5 }]}>{item.username}  </Text>
            </View>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
            <View style={styles.rowContainer}>
              <Text style={globalStyles.text}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleSaveRecipe(item.imageUrl)} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
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
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 'auto',
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
    left: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
    container: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 150,
      backgroundColor: '#22252A',
    },
    rowContainer: {
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
