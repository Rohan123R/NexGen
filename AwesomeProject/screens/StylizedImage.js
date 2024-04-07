import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const StylizedImagePage = ({ route }) => {
  const { stylizedImageData } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${stylizedImageData}` }}
        style={styles.stylizedImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stylizedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default StylizedImagePage;
