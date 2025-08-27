import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../AppText";

interface CategoryCardProps {
  image?: any;
  label?: string;
  onPress?: () => void;
}

const CategoryCard: FunctionComponent<CategoryCardProps> = ({
  image,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image style={styles.image} source={image} />
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.white,
    width: 155,
    height: 130,
    borderRadius: 5,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 133,
    height: 75,
  },
  label: {
    color: Colors.app.primary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DM Sans",
    lineHeight: 24,
  },
});
export default CategoryCard;
