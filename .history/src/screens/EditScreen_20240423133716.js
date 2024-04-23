import React, { useState } from 'react';
import { View, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditScreen({ route }) {
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);
  const [title, setTitle] = useState('');
  let typetext = ''; // Default value is an empty string
  if (route.params && route.params.typetext) {
    typetext = route.params.typetext; // If typetext exists in route.params, assign its value to typetext
  }

  const uploadImage = () => {
    // Upload image logic
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Set Title...."
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={uploadImage} style={styles.button}>
        {/* Your upload button */}
        <Text>{typetext}</Text> {/* Display typetext */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
