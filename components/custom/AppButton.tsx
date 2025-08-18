import { Colors } from "@/constants/Colors";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import AppText from "./AppText";

// Define the type for the props
interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  btnContainerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  loadingAnimation?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
  btnContainerStyle,
  title,
  onPress,
  titleStyle,
  disabled,
  loading,
  loadingAnimation,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, btnContainerStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <View style={styles.animationContainer}>{loadingAnimation}</View>
      ) : (
        <AppText style={[styles.text, titleStyle]}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    alignSelf: "center",
    margin: 5,
  },
  animationContainer: {
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppButton;
