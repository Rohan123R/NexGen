import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const StylizedImage = () => {
  const route = useRoute();
  const stylizedImageData = route.params?.stylizedImageData;

  return (
    <View style={styles.container}>
      {stylizedImageData && (
        <Image source={{ uri: `data:image/png;base64,${stylizedImageData}` }} style={styles.stylizedImage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stylizedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default StylizedImage;
