import easyBuy from "@/app/api/easyBuy";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./AppText";

interface Props {
  productId: string;
  quantity: number;
  onQuantityChange: (newQty: number) => void;
  setLoading: (val: boolean) => void;
  setErrorMessage: (msg: string) => void;
}

const IncrementDecrement = ({
  productId,
  quantity,
  onQuantityChange,
  setLoading,
  setErrorMessage,
}: Props) => {
  const updateQuantity = async (newQty: number) => {
    try {
      setLoading(true);
      const result = await easyBuy.addToCart(productId, newQty);
      if (result.ok) {
        setLoading(false);
        onQuantityChange(newQty);
      } else {
        setLoading(false);
        setErrorMessage("Failed to update the cart");
      }
    } catch (err) {
      setLoading(false);
      
    }
  };

  const increment = () => updateQuantity(1);

  const decrement = () => {
    if (quantity > 1) updateQuantity(-1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement} style={styles.button}>
        <Ionicons name="remove" size={20} color="#000" />
      </TouchableOpacity>
      <AppText style={styles.quantity}>{quantity}</AppText>
      <TouchableOpacity onPress={increment} style={styles.button}>
        <Ionicons name="add" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default IncrementDecrement;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});
