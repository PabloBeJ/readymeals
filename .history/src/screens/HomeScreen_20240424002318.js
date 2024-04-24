import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { db, storage } from '../../firebaseConfig';
import { query, doc, getDoc, collection, getDocs, orderBy } from 'firebase/firestore'; // Import orderBy
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';
import { ref, getDownloadURL } from 'firebase/storage';
const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);
  useEffect(() => {

    const fetchImageData = async () => {
      try {
        //Goes to firestroe and orders all images by timestamp most recent at the top
        const querySnapshot = await getDocs(query(collection(db, 'images'), where('userId', '==', currentUser.uid), orderBy('timestamp', 'desc')));
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
