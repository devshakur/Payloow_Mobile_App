import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import AppText from "../AppText";

interface AppFormDatePickerProps {
  name: string;
}

const AppFormDatePicker: React.FC<AppFormDatePickerProps> = ({ name }) => {
  const { values, setFieldValue } = useFormikContext<{ [key: string]: Date }>();
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = values[name] || new Date();

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <AppText style={styles.inputText}>
          {selectedDate.toDateString()}
        </AppText>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setFieldValue(name, selectedDate);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.app.input,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.app.white,
    width: "100%",
  },
  inputText: {
    fontSize: 16,
    color: Colors.app.dark,
  },
});

export default AppFormDatePicker;
