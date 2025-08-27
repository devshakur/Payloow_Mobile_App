import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { getIn, useFormikContext } from "formik";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppFormVideoPickerProps {
  name: string;
  label?: string;
}

const AppFormVideoPicker: React.FC<AppFormVideoPickerProps> = ({
  name,
  label,
}) => {
  const { setFieldValue, handleBlur, values, errors, touched } =
    useFormikContext<{ [key: string]: any }>();

  const video = getIn(values, name); // can be a URI or full file object
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);
  const hasError = isTouched && error;

  const handlePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0]; // return the full video file object
      setFieldValue(name, file); // Expose file object to form
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.picker, hasError && { borderColor: Colors.app.failed }]}
        onPress={handlePick}
        onBlur={() => handleBlur(name)}
      >
        <Text style={styles.text}>
          {video ? "✅ Video Selected" : "🎬 Select Video"}
        </Text>
      </TouchableOpacity>

      {hasError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 14,
    color: "#333",
  },
  picker: {
    backgroundColor: Colors.app.white,
    borderColor: Colors.app.profile,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  text: {
    color: "#333",
    fontSize: 14,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppFormVideoPicker;
