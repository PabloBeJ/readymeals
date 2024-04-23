import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { db, storage } from '../../firebaseConfig'; // Import the `db` and `storage` objects
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage'; // Import the `ref` and `getDownloadURL` functions
import globalStyles from '../styles/globalStyles';
import Footer from '../components/Footer';
const HomeScreen = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const imagesRef = collection(db, 'images'); // Referencia a la colección 'images'
        const querySnapshot = await getDocs(imagesRef); // Recupera todos los documentos de la colección 'images'
        const data = [];

        for (const docSnapshot of querySnapshot.docs) {
          const imageInfo = docSnapshot.data();

          // Verifica que la URL de la imagen y el userId estén definidos
          if (imageInfo && imageInfo.imageUrl && imageInfo.userId) {

            const userRef = doc(db, 'users', imageInfo.userId); // Referencia al documento del usuario
            const userSnap = await getDoc(userRef); // Recupera el documento del usuario
            if (userSnap.exists()) {
              const userData = userSnap.data(); // Extrae los datos del usuario
              // Verifica que todos los datos del usuario necesarios estén presentes
              if (userData && userData.username && userData.profilePicture) {

                data.push({
                  imageUrl: imageInfo.imageUrl,
                  title: imageInfo.title,
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
    <View>
      <ScrollView>
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
              source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={globalStyles.text}>{item.title}</Text>

          </View>
        ))}

      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    paddingBottom: 100,
    backgroundColor: '#22252A'
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
})

export default HomeScreen;
