import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { useFormikContext } from "formik";
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import ErrorMessage from "./ErrorMessage";

interface PickerItem {
  label: string;
  value: any;
  icon?: any;
}

interface AppFormPickerProps {
  items: PickerItem[];
  name: string;
  placeholder?: { label: string; value: any };
  onSelectItem?: (value: any, label?: string) => void;
  style?: any;
  pickerStyle?: any;
  onChange?: (value: string, label: string) => void;
}

const AppFormPicker: FunctionComponent<AppFormPickerProps> = ({
  items,
  name,
  placeholder,
  onSelectItem,
  style,
  pickerStyle,
  onChange,
}) => {
  const { setFieldValue, errors, touched, values } = useFormikContext<any>();
  const selectedValue = values?.[name] ?? "";

  const handleSelection = (value: string) => {
    setFieldValue(name, value);
    const selectedItem = items.find((item) => item.value === value);

    if (onChange && selectedItem) {
      onChange(selectedItem.value, selectedItem.label);
    }

    if (onSelectItem) {
      onSelectItem(value, selectedItem?.label);
    }
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleSelection}
          style={[styles.picker, pickerStyle]}
        >
          {placeholder && (
            <Picker.Item
              label={placeholder.label}
              value={placeholder.value}
              color="#aaa"
            />
          )}
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {errors?.[name] && touched?.[name] && (
        <ErrorMessage
          error={typeof errors[name] === "string" ? errors[name] : undefined}
          visible
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 10,
  },
});

export default AppFormPicker;
