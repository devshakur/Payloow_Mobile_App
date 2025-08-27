import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import PartnerDashboard from "../screens/easyBuy/partner/PartnerDashboard";
import BillStuff from "./Bills";

type RootStackParamList = {
  PartnerMainScreen: undefined;
  PartnerUtility: undefined;
  Bills: undefined;
  ChatScreen: undefined;
  BuyerBills: undefined;
  PartnerDashboard: undefined;
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

interface PartnerNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const PartnerNavigator: FunctionComponent<PartnerNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} />
      <Stack.Screen name="Bills" component={BillStuff} />
    </Stack.Navigator>
  );
};

export default PartnerNavigator;
