// UtilityNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Notifications from "../screens/public/Notifications";
import SuccessScreen from "../screens/public/SuccessScreen";
import TransactionDetail from "../screens/public/TransactionDetail";
import Transactions from "../screens/public/Transactions";
import Airtime from "../screens/public/utility/Airtime";
import AirtimeSummary from "../screens/public/utility/AirtimeSummary";
import Data from "../screens/public/utility/Data";
import DataSummary from "../screens/public/utility/DataSummary";
import Electricity from "../screens/public/utility/Electricity";
import ElectricitySummary from "../screens/public/utility/ElectricitySummary";
import ErrorScreen from "../screens/public/utility/ErrorScreen";
import FundWallet from "../screens/public/utility/FundWallet";
import TVSub from "../screens/public/utility/TVSub";
import TVSubSummary from "../screens/public/utility/TVSubSummary";
import Widthdraw from "../screens/public/Withdraw";
import WithdrawSummary from "../screens/public/WithdrawSummary";

const Stack = createNativeStackNavigator();

const Bills = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FundWallet" component={FundWallet} />
      <Stack.Screen name="Airtime" component={Airtime} />
      <Stack.Screen name="AirtimeSummary" component={AirtimeSummary} />
      <Stack.Screen name="Electricity" component={Electricity} />
      <Stack.Screen name="ElectricitySummary" component={ElectricitySummary} />
      <Stack.Screen name="WithdrawSummary" component={WithdrawSummary} />
      <Stack.Screen name="Data" component={Data} />
      <Stack.Screen name="DataSummary" component={DataSummary} />
      <Stack.Screen name="TVSub" component={TVSub} />
      <Stack.Screen name="TVSubSummary" component={TVSubSummary} />
      <Stack.Screen name="SendMoney" component={Widthdraw} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default Bills;
