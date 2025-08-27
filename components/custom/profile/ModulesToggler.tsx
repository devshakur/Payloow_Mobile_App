import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons"; // for icons
import { FunctionComponent, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
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
    { label: "Home", value: "Home", icon: "home-outline" },
    { label: "E-learning", value: "eLearning", icon: "book-outline" },
    { label: "Investment", value: "Investment", icon: "cash-outline" },
    { label: "Easybuy", value: "Easybuy", icon: "cart-outline" },
    { label: "Bills", value: "Bills", icon: "receipt-outline" },
  ];

  const [selectedValue, setSelectedValue] = useState(current);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setSelectedValue(current);
  }, [current]);

  const onChangeValue = (value: string) => {
    setSelectedValue(value);
    render?.(value);
  };

  const { user } = useUser();

  return (
    <View style={styles.wrapper}>
      {/* Profile image */}
      <Image
        style={styles.profileImage}
        source={require("../../../assets/images/custom/profile.png")}
      />

      {/* Dropdown */}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: Colors.app.primary },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.dropdownContainer}
        activeColor={Colors.app.profile}
        data={items}
        labelField="label"
        valueField="value"
        placeholder="Select Module"
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderRightIcon={() => (
          <Ionicons
            name={isFocus ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.app.primary}
          />
        )}
        // Render selected value with icon
        renderSelectedItem={(item) => (
          <View style={styles.selectedItem}>
            <Ionicons
              name={item.icon}
              size={18}
              color={Colors.app.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.selectedText}>{item.label}</Text>
          </View>
        )}
        // Render dropdown items with icon
        renderItem={(item) => (
          <View style={styles.item}>
            <Ionicons
              name={item.icon}
              size={18}
              color={Colors.app.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.itemText}>{item.label}</Text>
          </View>
        )}
        onChange={(item) => {
          onChangeValue(item.value);
          setIsFocus(false);
        }}
        flatListProps={{ scrollEnabled: false }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.app.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.app.input,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 240,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
  },
  dropdown: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: Colors.app.profile,
    justifyContent: "center",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  selectedTextStyle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.app.primary,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.app.primary,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 14,
    color: Colors.app.dark,
    fontWeight: "600",
  },
  itemTextStyle: {
    fontSize: 14,
    color: "gray",
    fontWeight: "600",
  },
  dropdownContainer: {
    borderRadius: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.app.input,
  },
});

export default ModulesToggler;
