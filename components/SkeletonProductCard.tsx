// components/custom/easyBuy/SkeletonProductCard.tsx
import { StyleSheet, View } from "react-native";

const SkeletonProductCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.textLine} />
      <View style={[styles.textLine, { width: "60%" }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
    padding: 10,
    justifyContent: "flex-start",
  },
  image: {
    height: 120,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  textLine: {
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
});

export default SkeletonProductCard;
