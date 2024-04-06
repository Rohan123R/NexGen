import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from expo-image-picker

const Landingpage = () => {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const toggleCamera = () => {
    setIsCameraVisible(!isCameraVisible);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
        console.log('Picture taken:', uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture: ' + (error.message || error));
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access the gallery was denied.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.cancelled) {
        console.log('Image picked from gallery:', result.uri);
      }
    } catch (error) {
      console.error('Failed to pick image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery: ' + (error.message || error));
    }
  };

  return (
    <View style={styles.container}>
      {isCameraVisible && (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            {/* Image button to take picture */}
            <Image
              source={require('./assets/camera.png')} // Specify the path to your image
              style={styles.cameraButtonImage}
            />
          </TouchableOpacity>
        </Camera>
      )}

      {!isCameraVisible && (
        <View style={styles.fullScreen}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCamera}>
              {/* Image button to switch to camera view */}
              <Image
                source={require('./assets/camera.png')} // Specify the path to your image
                style={styles.cameraButtonImage}
              />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
              {/* Image button to pick image from gallery */}
              <Image
                source={require('./assets/gallery.png')} // Specify the path to your image
                style={styles.cameraButtonImage}
              />
              <Text style={styles.buttonText}>Pick from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4c6ee', // Background color set to light gray
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333', // Title color set to dark gray
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff', // Button background color set to blue
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff', // Button text color set to white
    marginLeft: 10,
    fontSize: 18,
  },
  cameraButtonImage: {
    width: 24, // Specify the width of your image button
    height: 24, // Specify the height of your image button
  },
  camera: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
  },
});

export default Landingpage;
