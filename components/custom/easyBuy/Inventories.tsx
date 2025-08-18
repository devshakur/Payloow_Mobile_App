import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import MenuBg from "./MenuBg";

interface InventoriesProps {}

const Inventories: FunctionComponent<InventoriesProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuBg}>
        <MenuBg />
        <MenuBg />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBg: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: 16,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Inventories;
