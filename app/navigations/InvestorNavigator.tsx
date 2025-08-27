import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import BusinessDetail from "../../components/custom/investiment/BusinessDetail";
import InvestorDashboard from "../screens/investiment/Investor/InvestorDashboard";
import { Business } from "../screens/investiment/Request";
import BillStuff from "./Bills";

type RootStackParamList = {
  UtilityHomePage: undefined;
  Airtime: undefined;
  Electricity: undefined;
  TVSub: undefined;
  AirtimeSummary: undefined;
  ElectricitySummary: undefined;
  ErrorScreen: undefined;
  SuccessScreen: undefined;
  TVSubSummary: undefined;
  Data: undefined;
  DataSummary: undefined;
  InvestorHomePage: undefined;
  InvestorUtility: undefined;
  Bills: undefined;
  BusinessDetail: { business: Business };
  ChatScreen: undefined;
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

interface InvestorNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const InvestorNavigator: FunctionComponent<InvestorNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvestorHomePage" component={InvestorDashboard} />
      <Stack.Screen name="Bills" component={BillStuff} />
      <Stack.Screen name="BusinessDetail" component={BusinessDetail} />
    </Stack.Navigator>
  );
};

export default InvestorNavigator;
