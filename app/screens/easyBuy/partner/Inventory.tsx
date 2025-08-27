import AppText from "@/components/custom/AppText";
import Inventories from "@/components/custom/easyBuy/Inventories";
import OrdersAndConsignments from "@/components/custom/easyBuy/OrdersAndConsignments";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface InventoryProps {
  isActive?: boolean;
}

const Inventory: FunctionComponent<InventoryProps> = () => {
  const [screen, setScreen] = useState<string | null>("inventory");

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={[
              styles.inventory,
              {
                borderColor:
                  screen === "inventory" ? Colors.app.primary : Colors.app.dark,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setScreen("inventory")}>
              <AppText
                style={[
                  styles.inventoryLabel,
                  {
                    color:
                      screen === "inventory"
                        ? Colors.app.primary
                        : Colors.app.light,
                  },
                ]}
              >
                Inventory
              </AppText>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.ordersAndConsignment,
              {
                borderColor:
                  screen === "ordersAndConsignment"
                    ? Colors.app.primary
                    : Colors.app.dark,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setScreen("ordersAndConsignment")}>
              <AppText
                style={[
                  styles.ordersAndConsignmentLabel,
                  {
                    color:
                      screen === "ordersAndConsignment"
                        ? Colors.app.primary
                        : Colors.app.light,
                  },
                ]}
                numberOfLines={1}
              >
                Orders & Consignment
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contents}>
          {screen === "inventory" && <Inventories />}
          {screen === "ordersAndConsignment" && <OrdersAndConsignments />}
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  contents: {
    width: "90%",
    height: "90%",
    marginTop: 10,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  ordersAndConsignment: {
    height: "100%",
    width: "50%",
    borderBottomColor: Colors.app.primary,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inventory: {
    height: "100%",
    width: "50%",
    borderBottomColor: Colors.app.primary,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ordersAndConsignmentLabel: {
    color: Colors.app.primary,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins",
    lineHeight: 28,
  },
  inventoryLabel: {
    color: Colors.app.primary,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins",
    lineHeight: 28,
  },
});
export default Inventory;
