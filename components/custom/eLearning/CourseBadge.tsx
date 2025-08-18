// CourseBadge.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  category: string;
}

const CourseBadge = ({ category }: Props) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.app.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: Colors.app.white,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CourseBadge;
