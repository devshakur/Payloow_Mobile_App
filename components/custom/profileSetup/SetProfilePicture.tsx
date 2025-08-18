import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import React, { FunctionComponent, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { useForm } from "../../../app/context/FormContext";
import AppButton from "../AppButton";
import AppText from "../AppText";

interface SetProfilePictureProps {
  onClose: (updatedValues?: any) => void;
}

const SetProfilePicture: FunctionComponent<SetProfilePictureProps> = ({
  onClose,
}) => {
  const { setFormValues } = useForm();
  const [image, setImage] = useState<string | null>(null); // State to hold the chosen image

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
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri); // Update image state
        setFormValues((prevValues) => ({
          ...prevValues,
          image: uri, // Save the chosen image in the form state
        }));
        setTimeout(() => {
          onClose?.({ image: uri });
        }, 30); // 30ms delay
      }
    } catch (error) {
      Alert.alert("Error", "Could not open media library. Try again later.");
      console.error("Image Picker Error:", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.profileImageContainer}>
        <AppText style={styles.label}>Add a Profile Picture</AppText>
        <Image
          style={styles.profileImage}
          source={
            image
              ? { uri: image } // Show the chosen image if available
              : require("../../../assets/images/custom/profile.png") // Default fallback image
          }
        />
      </View>

      <View style={styles.btnContainer}>
        <AppButton
          titleStyle={styles.btnTitleStyle}
          btnContainerStyle={styles.btn}
          title="Add Profile Image"
          onPress={pickImage}
        />
        <AppButton
          titleStyle={styles.skipTitleStyle}
          btnContainerStyle={[
            styles.skipBtn,
            { backgroundColor: Colors.app.white },
          ]}
          title="Skip this step"
          onPress={() => onClose({ type: "skip" })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  skipBtn: {
    backgroundColor: Colors.app.white,
    width: "100%",
  },
  titleStyle: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.app.white,
    lineHeight: 16,
  },
  skipTitleStyle: {
    fontWeight: "500",
    fontSize: 14,
    color: Colors.app.primary,
    lineHeight: 16,
    fontFamily: "DM Sans",
  },
  formContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 300,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginLeft: 5,
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 20,
    fontWeight: "500",
    height: 30,
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  btnContainer: {
    width: "100%",
  },
  profileImageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
});

export default SetProfilePicture;
