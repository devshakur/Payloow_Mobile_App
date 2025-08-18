import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonWithIconProps {
  btnContainerStyle?: any;
  title?: string;
  onPress?: () => void;
  titleColor?: string;
  titleStyle?: any;
  icon?: React.ReactNode;
  iconPosition?: string;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  btnContainerStyle,
  title,
  onPress,
  titleColor = "#000",
  titleStyle,
  icon,
  iconPosition = "left",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, btnContainerStyle]}
      onPress={onPress}
    >
      {iconPosition === "left" && icon}
      <Text style={[styles.text, { color: titleColor }, titleStyle]}>
        {title}
      </Text>
      {iconPosition === "right" && icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 5,
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default ButtonWithIcon;
