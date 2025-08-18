import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import AppText from "../AppText";

interface ErrorMessageProps {
  error?: string;
  visible?: boolean;
}

function ErrorMessage({ error, visible }: ErrorMessageProps) {
  if (!visible || !error) return <AppText style={styles.placeholder} />; // Return an empty placeholder

  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    width: "100%",
  } as TextStyle,
  placeholder: {
    height: 10, // Reserve the same height for consistency
  } as TextStyle,
});

export default ErrorMessage;
