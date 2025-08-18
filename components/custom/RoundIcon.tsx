import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";

type IconType =
  | "font-awesome"
  | "material-community-icon"
  | "ant-design"
  | "material-icon"
  | "fontisto"
  | "font-awesome-5"
  | "feather";

interface RoundIconProps {
  name: string;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  iconType?: string;
  onPress?: () => void;
}

const RoundIcon: React.FC<RoundIconProps> = ({
  name,
  size = 40,
  backgroundColor,
  iconColor = "#fff",
  iconType,
  onPress,
}) => {
  const IconComponent =
    iconType === "font-awesome"
      ? FontAwesome
      : iconType === "material-community-icon"
      ? MaterialCommunityIcons
      : iconType === "ant-design"
      ? AntDesign
      : iconType === "material-icon"
      ? MaterialIcons
      : iconType === "fontisto"
      ? Fontisto
      : iconType === "font-awesome-5"
      ? FontAwesome5
      : iconType === "feather"
      ? Feather
      : MaterialCommunityIcons; // Fallback to MaterialCommunityIcons

  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        } as ViewStyle
      }
    >
      <IconComponent name={name} color={iconColor} size={size * 0.5} />
    </TouchableOpacity>
  );
};

export default RoundIcon;
