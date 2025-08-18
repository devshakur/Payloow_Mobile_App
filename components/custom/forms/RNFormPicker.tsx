import React, { FunctionComponent } from "react";
import { useFormikContext } from "formik";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { Colors } from "@/constants/Colors";

interface PickerItem {
  label: string;
  value: any;
  price?: string;
}

interface RNFormPickerProps {
  items: PickerItem[];
  name: string;
  placeholder: { label: string; value: any };
  iconType?: any;
  onSelectItem?: (value: any, price?: string) => void;
  icon?: any;
  style?: any;
}

const RNFormPicker: FunctionComponent<RNFormPickerProps> = ({
  items,
  name,
  placeholder,
  onSelectItem,
  style,
}) => {
  const { setFieldValue, errors, touched, values } = useFormikContext<any>();
  const selectedValue = values?.[name] ?? "";

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => {
          const selectedItem = items.find((item) => item.value === value);
        
          const price = selectedItem?.price;

          setFieldValue(name, value);
          if (onSelectItem) onSelectItem(value, price);
        }}
        style={[styles.picker, style]}
      >
        {placeholder && (
          <Picker.Item
            label={placeholder.label}
            value={placeholder.value}
            color="#aaa"
          />
        )}
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>

      {errors?.[name] && touched?.[name] && (
        <ErrorMessage
          error={typeof errors[name] === "string" ? errors[name] : undefined}
          visible
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    paddingHorizontal: 10,
    height: 50,
  },
});

export default RNFormPicker;
