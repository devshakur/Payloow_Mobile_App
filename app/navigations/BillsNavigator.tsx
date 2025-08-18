// UtilityNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TransactionDetail from "../screens/public/TransactionDetail";
import Transactions from "../screens/public/Transactions";
import BillsDashboard from "../screens/public/utility/BillsDashboard";
import Bills from "./Bills";

const Stack = createNativeStackNavigator();

const BillsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BillsHomePage" component={BillsDashboard} />
      <Stack.Screen name="Bills" component={Bills} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
    </Stack.Navigator>
  );
};

export default BillsNavigator;
