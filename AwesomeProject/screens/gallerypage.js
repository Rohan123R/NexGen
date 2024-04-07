import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const GallerySelectionPage = ({ navigation }) => {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
   
  const [stylizedImageData, setStylizedImageData] = useState(null); 

  const selectImage = async (setImage) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    let imageUri = pickerResult.assets[0].uri;
    setImage(imageUri);
  };

  const handleSubmit = async () => {
    if (!contentImage || !styleImage) {
      Alert.alert('Error', 'Please select both content and style images.');
      return;
    }

    try {
      // Convert content image to base64
      let contentBase64 = await convertToBase64(contentImage);
      
      // Convert style image to base64
      let styleBase64 = await convertToBase64(styleImage);

      // Send base64-encoded images to backend
      await sendImagesToBackend(contentBase64, styleBase64);
      
      // Reset selected images after submitting
      setContentImage(null);
      setStyleImage(null);
      
      // Optionally show a success message
      Alert.alert('Success', 'Images submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit images: ' + error.message);
    }
  };

  const convertToBase64 = async (imageUri) => {
    let response = await fetch(imageUri);
    let blob = await response.blob();
    return await blobToBase64(blob);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendImagesToBackend = async (contentBase64, styleBase64) => {
    try {
        const imageDataArray = [];
        imageDataArray.push({ image: contentBase64 });
        imageDataArray.push({ image: styleBase64 });

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
      
  
      // Handle successful response from backend if needed
    } catch (error) {
      console.error('Error sending images to backend:', error);
      throw error; // Propagate the error to the calling function if needed
    }
  };
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => selectImage(setContentImage)} style={styles.button}>
        <Text style={[styles.buttonText, { color: 'green' }]}>Select Content Image</Text>
      </TouchableOpacity>
      {contentImage && <Image source={{ uri: contentImage }} style={styles.image} />}
      
      <TouchableOpacity onPress={() => selectImage(setStyleImage)} style={styles.button}>
        <Text style={[styles.buttonText, { color: 'blue' }]}>Select Style Image</Text>
      </TouchableOpacity>
      {styleImage && <Image source={{ uri: styleImage }} style={styles.image} />}

      <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: 'purple' }]}>
        <Text style={{ color: 'white' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

export default GallerySelectionPage;
