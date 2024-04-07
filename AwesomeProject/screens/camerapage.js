import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Button, Image } from "react-native";
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const CameraPage = ({ navigation }) => {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const cameraRef = useRef(null);
  const [stylizedImageData, setStylizedImageData] = useState(null);
  useEffect(() => {
    setIsCameraVisible(false);
  }, []);

  const toggleCamera = () => {
    setIsCameraVisible(!isCameraVisible);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
        console.log('Picture taken:', uri);

        // Add the captured image URI to the array
        setCapturedImages([...capturedImages, uri]);

        cameraRef.current.pausePreview(); // Pause the camera preview
        setIsCameraVisible(false); // Hide the camera view
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture: ' + (error.message || error));
      }
    }
  };

  const submitImages = async () => {
    try {
        // Create an array to store each image data
        const imageDataArray = [];
    
        // Iterate through each captured image
        await Promise.all(capturedImages.map(async (imageUri) => {
          // Read the image file as base64
          const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
          console.log(base64);
    
          // Push the base64-encoded image data to the array
          imageDataArray.push({ image: base64 });
        }));
    
        // Send the array of image data to the backend in JSON format
        const response=await fetch('http://192.168.111.228:5000/processimage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageDataArray),
        });
        if (!response.ok) {
            throw new Error('Failed to send image to backend');
          }
          console.log("succesful");
         
          const responseData = await response.json();
            const stylizedImage = responseData.stylized_image;
            console.log(stylizedImage)
            setStylizedImageData(stylizedImage);
            navigation.navigate('StylizedImagePage', { stylizedImageData });

        // Clear the captured images array after submitting
        setCapturedImages([]);
    
      } catch (error) {
        console.error('Error submitting images:', error);
        Alert.alert('Error', 'Failed to submit images: ' + (error.message || error));
      }
    };

  

  return (
    <View style={styles.container}>
      <Button title="Capture Content" onPress={toggleCamera} />
      <Button title="Capture Style" onPress={toggleCamera} />
      {capturedImages.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      ))}
      <Button title="Submit" onPress={submitImages} />
      {isCameraVisible && (
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
          <Button title="Take Picture" onPress={takePicture} />
        </Camera>
      )}

      {stylizedImageData && (
      <Image
        source={{ uri: `data:image/jpeg;base64,${stylizedImageData}` }}
        style={styles.stylizedImage}
      />
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set background color to white
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default CameraPage;
