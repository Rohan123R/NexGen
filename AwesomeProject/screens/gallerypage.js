import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GallerySelectionPage = () => {
    const [contentImage, setContentImage] = useState(null);
    const [styleImage, setStyleImage] = useState(null);
    const [contentConfirmed, setContentConfirmed] = useState(false);
    const [styleConfirmed, setStyleConfirmed] = useState(false);

    const selectImage = async (setImage, setConfirmed) => {
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
            setImage(result.uri);
            setConfirmed(true); // Set confirmation status to true when an image is selected
          }
        } catch (error) {
          console.error('Failed to pick image from gallery:', error);
          Alert.alert('Error', 'Failed to pick image from gallery: ' + (error.message || error));
        }
      };

  const convertToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
      return base64;
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!contentConfirmed || !styleConfirmed) {
      Alert.alert('Error', 'Please confirm both content and style images.');
      return;
    }

    const contentBase64 = await convertToBase64(contentImage);
    const styleBase64 = await convertToBase64(styleImage);

    if (!contentBase64 || !styleBase64) {
      Alert.alert('Error', 'Failed to convert images to base64.');
      return;
    }

    try {
      const response = await fetch('YOUR_BACKEND_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentImage: contentBase64, styleImage: styleBase64 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to post images to backend');
      }

      // Handle successful response from backend
      // For example, display a success message or navigate to another screen
      Alert.alert('Success', 'Images posted successfully to backend.');
      // Reset state
      setContentImage(null);
      setStyleImage(null);
    } catch (error) {
      console.error('Error posting images to backend:', error);
      Alert.alert('Error', 'Failed to post images to backend: ' + (error.message || error));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={() => selectImage(setContentImage, setContentConfirmed)}>
          <Text>Select Content Image</Text>
        </TouchableOpacity>
        {contentImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: contentImage }} style={styles.image} />
            {!contentConfirmed && (
              <TouchableOpacity style={styles.confirmButton} onPress={() => setContentConfirmed(true)}>
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={() => selectImage(setStyleImage, setStyleConfirmed)}>
          <Text>Select Style Image</Text>
        </TouchableOpacity>
        {styleImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: styleImage }} style={styles.image} />
            {!styleConfirmed && (
              <TouchableOpacity style={styles.confirmButton} onPress={() => setStyleConfirmed(true)}>
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
  },
  imagePickerButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default GallerySelectionPage;
