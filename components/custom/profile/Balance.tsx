import { useUser } from "@/app/context/UserProvider";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppText from "../AppText";

interface BalanceProps {
  label?: any;
  balanceAmount?: any;
}

const Balance: FunctionComponent<BalanceProps> = ({ balanceAmount, label }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [textWidth, setTextWidth] = useState(0);

  const { user } = useUser();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Handle layout to measure text width
  const onTextLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    setTextWidth(width); // Set the width of the balance text
  };

  return (
    <View style={[styles.container, { minWidth: textWidth }]}>
      {/* Visibility toggle button */}
      <View style={styles.labelContainer}>
        <AppText style={[styles.label, label]}>Wallet Balance</AppText>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { paddingLeft: textWidth ? textWidth * 0.1 : 10 },
          ]} // Adjust padding based on text width
          onPress={toggleVisibility}
        >
          <MaterialCommunityIcons
            name={isVisible ? "eye-off" : "eye"}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {/* Balance amount with dynamic visibility */}
      <Text
        style={[styles.balanceAmount, balanceAmount]}
        onLayout={onTextLayout}
      >
        {isVisible
          ? "******"
          : `₦${Number(user?.data.balance?.$numberDecimal || 0).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              }
            )}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceAmount: {
    fontSize: 30,
    color: Colors.app.black,
    textAlign: "left",
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: 38,
    fontFamily: "DM Sans",
  },
  toggleButton: {
    paddingLeft: 10, // Initial padding for the icon
    marginTop: 20,
  },
  labelContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
    color: Colors.app.black,
    marginTop: 15,
    fontFamily: "DM Sans",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default Balance;
