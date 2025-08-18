import { Colors } from "@/constants/Colors";
import { Picker } from "@react-native-picker/picker";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useUser } from "../../../app/context/UserProvider";

interface ModulesTogglerProps {
  render?: (selectedItem: string) => void;
  current: string;
}

const ModulesToggler: FunctionComponent<ModulesTogglerProps> = ({
  render,
  current,
}) => {
  const items = [
    { title: "Home" },
    { title: "eLearning" },
    { title: "Investment" },
    { title: "Easybuy" },
    { title: "Bills" },
  ];

  const [selectedValue, setSelectedValue] = useState(current);
  ``;

  useEffect(() => {
    setSelectedValue(current);
  }, [current]);

  const onChangeValue = (value: string) => {
    setSelectedValue(value);
    render?.(value);
  };
  const { user, setUser } = useUser();

  return (
    <View style={styles.dropdownButtonStyle}>
      <Image
        style={styles.profileImage}
        source={require("../../../assets/images/custom/profile.png")}
      />

      <View
        style={{
          width: 150,
        }}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onChangeValue(itemValue)}
          mode="dropdown"
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item
              style={{
                fontSize: 15,
                flexWrap: "nowrap",
                fontWeight: "900",
                color: Colors.app.primary,
              }}
              label={item.title}
              value={item.title}
              key={index}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    gap: 10,
    backgroundColor: Colors.app.profile,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.app.input,
    borderWidth: 1,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginLeft: 5,
  },

  dropdownButtonArrowStyle: {
    fontSize: 20,
  },
  picker: {
    width: 160,
  },
});

export default ModulesToggler;
