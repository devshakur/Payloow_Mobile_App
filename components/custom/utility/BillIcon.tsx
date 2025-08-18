import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import AppText from "../AppText";

interface BillIconProps {
  name: any;
  size?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  label: string;
}

const BillIcon: React.FC<BillIconProps> = ({
  name,
  size = 24,
  onPress,
  style,
  label,
}) => {
  // Check if the icon exists in MaterialCommunityIcons, otherwise fallback to MaterialIcons
  const IconComponent =
    name in MaterialCommunityIcons.glyphMap
      ? MaterialCommunityIcons
      : MaterialIcons;

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <IconComponent name={name} color={Colors.app.primary} size={size} />
      </View>
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.profile,
    flexDirection: "column",
    width: 40,
    height: 40,
    borderRadius: 20, // Instead of "100%" use 20 to ensure it's a circle
  },
  label: {
    fontFamily: "DM Sans",
    color: Colors.app.primary,
    fontWeight: "400",
    lineHeight: 18,
    fontSize: 12,
  },
});

export default BillIcon;
