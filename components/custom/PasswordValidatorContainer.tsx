import React, { FunctionComponent } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppText from "./AppText";
import { Colors } from "@/constants/Colors";

interface PasswordValidatorContainerProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

const PasswordValidatorContainer: FunctionComponent<
  PasswordValidatorContainerProps
> = ({ label, style }) => {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.label}>{label}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.app.input,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
  },
});

export default PasswordValidatorContainer;
