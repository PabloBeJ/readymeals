
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
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  image : {
    width: 60,
    height: 60,
    borderRadius: 80
  },
  imageIcon : {
    width: 30,
    height: 30,
  },
  imageProfile : {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
  controlButtonText: {
    fontSize: 20,
  },
});

export default globalStyles;