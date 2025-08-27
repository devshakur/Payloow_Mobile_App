import { Colors } from "@/constants/Colors";
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import AppText from "../AppText";

interface CartProps {
  handleSelect?: (product: Product) => void; // <-- change
  product: Product;
}

const DashboardCart: FunctionComponent<CartProps> = ({
  handleSelect,
  product,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleSelect?.(product)} // <-- change
      style={styles.cartContainer}
    >
      {/* Full Image */}
      <Image
        style={styles.cartImage}
        resizeMode="cover"
        source={{ uri: product.imageUrl }}
      />

      {/* Price Overlay */}
      <View style={styles.priceTag}>
        <AppText style={styles.price}>₦{product.price.$numberDecimal}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    width: 170,
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.app.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  cartImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  priceTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  price: {
    color: Colors.app.white,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default DashboardCart;
