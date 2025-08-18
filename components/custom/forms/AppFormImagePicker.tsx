import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { getIn, useFormikContext } from "formik";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppFormImagePickerProps {
  name: string;
  label?: string;
}

const AppFormImagePicker: React.FC<AppFormImagePickerProps> = ({
  name,
  label,
}) => {
  const { setFieldValue, handleBlur, values, errors, touched } =
    useFormikContext<{ [key: string]: any }>();

  const uri = getIn(values, name);
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  const hasError = isTouched && error;

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFieldValue(name, uri);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.mediaPicker,
          hasError && { borderColor: Colors.app.failed },
        ]}
        onPress={handlePick}
        onBlur={() => handleBlur(name)}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <Text style={styles.mediaText}>Pick Image</Text>
        )}
      </TouchableOpacity>

      {hasError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  mediaPicker: {
    backgroundColor: Colors.app.white,
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  mediaText: {
    color: "#333",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppFormImagePicker;
