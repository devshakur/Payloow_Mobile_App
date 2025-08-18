import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImageBoxProps {
  onSelectedImage: (uri: string) => void;
}

const ImageBox: FunctionComponent<ImageBoxProps> = ({ onSelectedImage }) => {
  // Image picker function
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Error", "Permission to access camera roll is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        onSelectedImage(uri); // Update image state
      }
    } catch (error) {
      Alert.alert("Error", "Could not open media library. Try again later.");
      console.error("Image Picker Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <AntDesign name="pluscircle" size={30} color={Colors.app.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 336,
    height: 116,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.app.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.bgPrimary,
  },
});

export default ImageBox;
