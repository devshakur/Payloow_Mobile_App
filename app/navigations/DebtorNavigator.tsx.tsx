import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import BusinessDetail from "../../components/custom/investiment/BusinessDetail";
import ChatScreen from "../screens/eLearning/ChatScreen";
import DebtorDashboard from "../screens/investiment/Debator/DebtorDashboard";
import { Business } from "../screens/investiment/Request";
import BillStuff from "./Bills";

type RootStackParamList = {
  UtilityHomePage: undefined;
  DebatorHomePage: undefined;
  DebatorUtility: undefined;
  Bills: undefined;
  BusinessDetail: { business: Business };
  ChatScreen: undefined;
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

interface DebtorNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const DebtorNavigator: FunctionComponent<DebtorNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DebatorHomePage" component={DebtorDashboard} />
      <Stack.Screen name="Bills" component={BillStuff} />
      <Stack.Screen name="BusinessDetail" component={BusinessDetail} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default DebtorNavigator;
