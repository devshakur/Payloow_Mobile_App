import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import { Colors } from "@/constants/Colors";

interface MenuBgProps {}

const MenuBg: FunctionComponent<MenuBgProps> = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>Amount to be paid</AppText>
      <AppText style={styles.value}>₦0.00</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: Colors.app.white,
    width: 155,
    height: 68,
    gap: 4,
    padding: 13,
  },
  label: {
    color: Colors.app.black,
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "DM Sans",
    lineHeight: 18,
    alignSelf: "flex-start",
  },
  value: {
    color: Colors.app.black,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DM Sans",
    lineHeight: 20,
    alignSelf: "flex-start",
  },
});

export default MenuBg;
