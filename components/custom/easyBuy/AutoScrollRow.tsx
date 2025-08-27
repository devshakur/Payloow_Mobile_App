// components/AutoScrollRow.tsx
import { Marquee } from "@animatereactnative/marquee";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Product } from "../../../app/screens/easyBuy/buyer/BuyerDashboard";
import DashboardCart from "./DashboardCart";

interface AutoScrollRowProps {
  products: Product[];
  speed?: number; // 1 = default, higher = faster
  reverse?: boolean; // set true to scroll right-to-left or left-to-right
  spacing?: number; // space between repeated groups
  handleSelect?: (product: Product) => void;
}

const AutoScrollRow: React.FC<AutoScrollRowProps> = ({
  products,
  speed = 1.2,
  reverse = false,
  spacing = 16,
  handleSelect,
}) => {
  if (!products?.length) return null;

  return (
    <View style={styles.container}>
      {/* Marquee repeats its children automatically and loops forever */}
      <Marquee
        direction="horizontal"
        speed={speed}
        spacing={spacing}
        reverse={reverse}
        style={{ height: 220 }}
      >
        <View style={styles.row}>
          {products.map((product) => (
            <View key={product._id} style={styles.item}>
              <DashboardCart
                product={product}
                // We'll clean up DashboardCart typing next, this passes the product through
                handleSelect={() => handleSelect?.(product)}
              />
            </View>
          ))}
        </View>
      </Marquee>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center" },
  item: { marginHorizontal: 8 },
});

export default AutoScrollRow;
