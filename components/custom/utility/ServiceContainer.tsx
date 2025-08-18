import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppText from "../AppText";

interface ServiceContainerProps {
  label: string;
  icon: any;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconColor: any;
}

const ServiceContainer: FunctionComponent<ServiceContainerProps> = ({
  label,
  icon,
  onPress,
  style,
  iconColor,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      <AppText style={styles.text}>{label}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.white,
    width: "37.5%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    gap: 2,
  },
  text: {
    color: Colors.app.dark,
    fontSize: 12,
    fontWeight: "semibold",
  },
});

export default ServiceContainer;
