import React, { FunctionComponent } from "react";
import { Text } from "react-native";
import Screen from "../../../components/custom/Screen";

interface OrdersProps {}

const Orders: FunctionComponent<OrdersProps> = () => {
  return (
    <Screen>
      <Text>Orders</Text>
    </Screen>
  );
};

export default Orders;
