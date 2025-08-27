import { Colors } from "@/constants/Colors";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface Item {
  label: string;
  value: string;
}

interface AppFormMultiSelectProps {
  name: string;
  data: Item[];
  placeholder: string;
  onFocus?: () => void;
}

const AppFormMultiSelect: React.FC<AppFormMultiSelectProps> = ({
  name,
  data,
  placeholder,
  onFocus,
}) => {
  const { values, setFieldValue } = useFormikContext<{ [key: string]: any }>();
  const [selectedValues, setSelectedValues] = useState<string[]>(
    values[name] || []
  );

  useEffect(() => {
    setSelectedValues(values[name] || []);
  }, [values[name]]);

  const handleChange = (value: string[]) => {
    setSelectedValues(value);
    setFieldValue(name, value);
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        inputSearchStyle={styles.searchInputStyle}
        selectedStyle={styles.selectedItem}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search
        value={selectedValues}
        onChange={handleChange}
        onFocus={onFocus}
        containerStyle={styles.dropdownContainer}
        activeColor={Colors.app.input}
        itemTextStyle={styles.itemText}
        searchPlaceholder="Search..."
        dropdownPosition="bottom"
        inside={false}
        keyboardAvoiding={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.app.white,
  },
  dropdownContainer: {
    maxHeight: 250,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: Colors.app.white,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.app.primary,
  },
  searchInputStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: Colors.app.primary,
  },
  selectedItem: {
    borderRadius: 10,
    backgroundColor: Colors.app.input,
    padding: 6,
    margin: 4,
  },
  itemText: {
    fontSize: 14,
    color: Colors.app.light,
  },
});

export default AppFormMultiSelect;
