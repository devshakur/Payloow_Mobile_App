import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";
import { getIn, useFormikContext } from "formik";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppFormFilePickerProps {
  name: string;
  label?: string;
}

const AppFormFilePicker: React.FC<AppFormFilePickerProps> = ({
  name,
  label,
}) => {
  const { setFieldValue, handleBlur, values, errors, touched } =
    useFormikContext<{ [key: string]: any }>();

  const file = getIn(values, name);
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);
  const hasError = isTouched && error;

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // or specific types like 'application/pdf'
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFieldValue(name, pickedFile);
      }
    } catch (e) {
      console.warn("File pick cancelled or failed", e);
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
        <Text style={styles.pickerText}>
          {file?.name ? file.name : "Pick a File"}
        </Text>
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
  picker: {
    backgroundColor: Colors.app.white,
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 60,
  },
  pickerText: {
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppFormFilePicker;
