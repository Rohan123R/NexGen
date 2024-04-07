import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Styles = ({ route }) => {
  const { uri } = route.params;

  const addStyles = () => {
    // Add your logic here to apply styles to the image using the uri
    // For example, you can open a modal to choose styles or navigate to another screen
    // This function will be called when the button is pressed
    console.log('Add styles to image:', uri);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={addStyles}>
        <Text style={styles.buttonText}>Add Styles</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set your preferred background color here
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Styles;
