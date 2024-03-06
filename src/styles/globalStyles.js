
import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({

  title : {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22252A',
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