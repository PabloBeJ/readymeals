
import { StyleSheet } from 'react-native';
//Global images style properties for image icon and for image profile.

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22252A',
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  //Differenet sizes for pictures.
  image: {
    width: 60,
    height: 60,
    borderRadius: 80
  },
  imageIcon: {
    width: 30,
    height: 30,
  },
  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  textPlacehover: {
    fontSize: 20,
    fontWeight: 'light',
    color: '#aba8a7',
    marginBottom: ' 200px',
  },
  //Buttons for the footer and camera. 
  controlButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonForm: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  controlButtonText: {
    fontSize: 20,
  },
});

export default globalStyles;