// import { Colors } from "@/constants/Colors";
// import { useFormikContext } from "formik";
// import React, { FunctionComponent, useEffect, useState } from "react";
// import { StyleSheet, View } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";

// interface Item {
//   label: string;
//   value: string;
// }

// interface FormValues {
//   [key: string]: string;
// }

// interface AppFormDropDownPickerWithSearchProps {
//   data: Item[];
//   name: string;
//   placeholder: string;
//   onChange?: (value: string, label: string) => void;
// }

// const AppFormDropDownPickerWithSearch: FunctionComponent<
//   AppFormDropDownPickerWithSearchProps
// > = ({ data, name, placeholder, onChange }) => {
//   const { values, setFieldValue } = useFormikContext<FormValues>();
//   const [selectedValue, setSelectedValue] = useState(values[name] || "");

//   const handleSelection = (value: string) => {
//     setSelectedValue(value);
//     setFieldValue(name, value);

//     const selectedItem = data.find((item) => item.value === value);
//     if (onChange && selectedItem) {
//       onChange(selectedItem.value, selectedItem.label);
//     }
//   };

//   useEffect(() => {
//     setSelectedValue(values[name]);
//   }, [values[name]]);

//   return (
//     <View style={styles.container}>
//       <Dropdown
//         data={data}
//         search
//         labelField="label"
//         valueField="value"
//         placeholder={placeholder}
//         searchPlaceholder="Search..."
//         value={selectedValue}
//         onChange={(item: any) => handleSelection(item.value)}
//         style={styles.dropdown}
//         containerStyle={styles.dropdownContainer}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         itemTextStyle={styles.itemTextStyle}
//         activeColor={Colors.app.input}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,

//     width: "100%",
//   },
//   dropdown: {
//     height: 50,
//     borderColor: Colors.app.input,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: Colors.app.white,
//     padding: 10,
//   },
//   dropdownContainer: {
//     borderRadius: 8,
//   },
//   placeholderStyle: {
//     color: Colors.app.dark,
//     fontSize: 14,
//   },
//   selectedTextStyle: {
//     color: Colors.app.primary,
//     fontSize: 14,
//   },
//   itemTextStyle: {
//     color: Colors.app.primary,
//   },
// });

// export default AppFormDropDownPickerWithSearch;

import { Colors } from "@/constants/Colors";
import { useFormikContext } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface Item {
  label: string;
  value: string;
}

interface FormValues {
  [key: string]: string;
}

interface AppFormDropDownPickerWithSearchProps {
  data: Item[];
  name: string;
  placeholder: string;
  onChange?: (value: string, label: string) => void;
}

const AppFormDropDownPickerWithSearch: FunctionComponent<
  AppFormDropDownPickerWithSearchProps
> = ({ data, name, placeholder, onChange }) => {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  const [selectedValue, setSelectedValue] = useState(values[name] || "");

  const handleSelection = (value: string) => {
    setSelectedValue(value);
    setFieldValue(name, value);

    const selectedItem = data.find((item) => item.value === value);
    if (onChange && selectedItem) {
      onChange(selectedItem.value, selectedItem.label);
    }
  };

  useEffect(() => {
    setSelectedValue(values[name]);
  }, [values[name]]);

  return (
    <View style={styles.container}>
      <Dropdown
        data={data}
        search
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={selectedValue}
        onChange={(item: any) => handleSelection(item.value)}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor={Colors.app.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.app.white,
    padding: 10,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  placeholderStyle: {
    color: Colors.app.dark,
    fontSize: 14,
  },
  selectedTextStyle: {
    color: Colors.app.primary,
    fontSize: 14,
  },
  itemTextStyle: {
    color: Colors.app.primary,
  },
});

export default AppFormDropDownPickerWithSearch;
