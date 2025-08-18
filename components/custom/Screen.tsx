import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView
import { Colors } from "../../constants/Colors";

// Define types for the props
interface ScreenProps {
  children: ReactNode; // Type for children
  backgroundColor?: string; // Optional background color
  style?: any;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  backgroundColor,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.app.gray,
  },
});

export default Screen;
