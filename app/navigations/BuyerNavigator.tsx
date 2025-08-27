import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import BuyerDashboard from "../screens/easyBuy/buyer/BuyerDashboard";
import CartDetail from "../screens/easyBuy/easyBuyCheckOut/CartDetail";
import CompareFeatureScreen from "../screens/easyBuy/easyBuyCheckOut/CompareFeatureScreen";
import EasyBuyCheckOut from "../screens/easyBuy/easyBuyCheckOut/EasyBuyCheckOut";
import InstallmentPlan from "../screens/easyBuy/easyBuyCheckOut/InstallmentPlan";
import ProductDetail from "../screens/easyBuy/easyBuyCheckOut/ProductDetail";
import ProductDetailWithCompare from "../screens/easyBuy/easyBuyCheckOut/ProductDetailWithCompare";
import CategoriesPage from "../screens/easyBuy/easyBuyTradeIn/CategoriesPage";
import ChatScreen from "../screens/eLearning/ChatScreen";
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
  ProductDetailWithCompare: undefined;
  ProductDetail: undefined;
  CompareFeatureScreen: undefined;
  BuyerHomePage: undefined;
  BuyerUtility: undefined;
  CartDetail: undefined;
  BuyerDashboard: undefined;
  EasyBuyCheckOut: undefined;
  InstallmentPlan: undefined;
  BuyerBills: undefined;
  CategoriesPage: undefined;
  ChatScreen: undefined;
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

interface BuyerNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const BuyerNavigator: FunctionComponent<BuyerNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuyerDashboard" component={BuyerDashboard} />
      <Stack.Screen
        name="ProductDetailWithCompare"
        component={ProductDetailWithCompare}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen
        name="CompareFeatureScreen"
        component={CompareFeatureScreen}
      />
      <Stack.Screen name="CartDetail" component={CartDetail} />
      <Stack.Screen name="EasyBuyCheckOut" component={EasyBuyCheckOut} />
      <Stack.Screen name="InstallmentPlan" component={InstallmentPlan} />
      <Stack.Screen name="BuyerBills" component={BillStuff} />
      <Stack.Screen name="CategoriesPage" component={CategoriesPage} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default BuyerNavigator;
