import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import TutorDashboard from "../screens/eLearning/tutor/TutorDashboard";
import BillsNavigator from "./BillsNavigator";

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
  ProductDetailWithCompare: undefined;
  ProductDetail: undefined;
  CompareFeatureScreen: undefined;
  ElearningHomePage: undefined;
  StudentUtility: undefined;
  Bills: undefined;
  TutorChatScreen: undefined;
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

interface TutorNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const TutorNavigator: FunctionComponent<TutorNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElearningHomePage" component={TutorDashboard} />
      <Stack.Screen name="Bills" component={BillsNavigator} />
    </Stack.Navigator>
  );
};

export default TutorNavigator;
