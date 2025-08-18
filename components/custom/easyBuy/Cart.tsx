import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import start from "../../../assets/images/custom/svg/star.svg";
import AppText from "../AppText";
import SVGComponent from "../SVGComponent";

interface CartProps {
  handleSelect?: (id: number, name: string, price: string) => void;
  product: Product;
}

const Cart: FunctionComponent<CartProps> = ({ handleSelect, product }) => {
  return (
    <TouchableOpacity
      onPress={() => handleSelect?.(1, "iphone", "$3000")} // Pass details
      style={styles.cartContainer}
    >
      <Image style={styles.cartImage} source={{ uri: product.imageUrl }} />
      <View style={styles.cartDetails}>
        <AppText numberOfLines={1} style={styles.label}>
          {product.name}
        </AppText>
        <AppText style={styles.price}>₦{product.price.$numberDecimal}</AppText>
        <View style={styles.rateInventoryAndOrder}>
          <View style={styles.rateAndInventory}>
            <View style={styles.rate}>
              <SVGComponent
                width={12}
                height={12}
                style={{ marginHorizontal: 5 }}
                SvgFile={start}
              />
              <AppText style={styles.rateValue}></AppText>
            </View>
            <AppText style={styles.inventory}>{product.stock}</AppText>
          </View>
          <Feather
            style={styles.order}
            name="shopping-cart"
            size={12}
            color="black"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cartContainer: {
    height: 194,
    width: 160,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.white,
    gap: 16,
    borderColor: Colors.app.screen,
    borderWidth: 1,
  },
  cartImage: {
    width: 134,
    height: 80,
  },
  cartDetails: {
    width: 134,
    height: 68,
    gap: 4,
  },
  rateInventoryAndOrder: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 36,
  },
  label: {
    color: Colors.app.dark,
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    overflow: "hidden",
  },
  price: {
    color: Colors.app.black,
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
  },
  rateAndInventory: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  rate: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -20,
    gap: 0,
  },
  inventory: {
    color: Colors.app.black,
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 18,
  },
  rateValue: {
    color: Colors.app.black,
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 18,
    marginLeft: -10,
  },
  order: {
    marginRight: -5,
  },
});

export default Cart;
