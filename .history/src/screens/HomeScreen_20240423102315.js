useEffect(() => {
  const fetchImageData = async () => {
    try {
      const imagesRef = collection(db, 'images');
      console.log('imagesRef:', imagesRef); // Log imagesRef to check its value
      const querySnapshot = await getDocs(orderBy(imagesRef, 'timestamp', 'desc')); // Order by timestamp in descending order
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
