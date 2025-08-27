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
    backgroundColor: Colors.app.white,
    elevation: 3,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: -10,
    alignSelf: "flex-start",
  },
  text: {
    color: Colors.app.primary,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CourseBadge;
