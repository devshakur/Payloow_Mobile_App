import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { FunctionComponent } from "react";
import { CourseType } from "../../components/custom/eLearning/StudentCourse";
import CartDetail from "../screens/easyBuy/easyBuyCheckOut/CartDetail";
import CompareFeatureScreen from "../screens/easyBuy/easyBuyCheckOut/CompareFeatureScreen";
import EasyBuyCheckOut from "../screens/easyBuy/easyBuyCheckOut/EasyBuyCheckOut";
import InstallmentPlan from "../screens/easyBuy/easyBuyCheckOut/InstallmentPlan";
import ProductDetail from "../screens/easyBuy/easyBuyCheckOut/ProductDetail";
import ProductDetailWithCompare from "../screens/easyBuy/easyBuyCheckOut/ProductDetailWithCompare";
import ChatScreen from "../screens/eLearning/ChatScreen";
import ConversationList from "../screens/eLearning/ConversationList";
import MessageDetail from "../screens/eLearning/MessageTutor";
import CourseCardDetail from "../screens/eLearning/student/CourseCardDetail";
import CourseDetailPage from "../screens/eLearning/student/CourseDetailPage";
import HomePage from "../screens/public/HomePage";
import Bills from "./Bills";

type RootStackParamList = {
  HomePage: undefined;
  Airtime: undefined;
  Electricity: undefined;
  TVSub: undefined;
  AirtimeSummary: undefined;
  ElectricitySummary: undefined;
  ErrorScreen: undefined;
  TVSubSummary: undefined;
  Data: undefined;
  DataSummary: undefined;
  ProductDetailWithCompare: undefined;
  ProductDetail: undefined;
  CompareFeatureScreen: undefined;
  BuyerHomePage: undefined;
  BuyerUtility: undefined;
  CartDetail: undefined;
  Bills: undefined;
  EasyBuyCheckOut: undefined;
  InstallmentPlan: undefined;
  ChatScreen: undefined;
  MessageTutor: undefined;
  CourseCardDetail: undefined;
  CourseDetailPage: { course: CourseType };
  MessageDetail: { receiverId: string };
  ConversationList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeNavigator: FunctionComponent = () => {
  return (
    <>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen
          name="Bills"
          component={Bills}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CartDetail" component={CartDetail} />
        <Stack.Screen name="EasyBuyCheckOut" component={EasyBuyCheckOut} />
        <Stack.Screen name="InstallmentPlan" component={InstallmentPlan} />
        <Stack.Screen
          name="ProductDetailWithCompare"
          component={ProductDetailWithCompare}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen
          name="CompareFeatureScreen"
          component={CompareFeatureScreen}
        />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="CourseCardDetail" component={CourseCardDetail} />
        <Stack.Screen name="CourseDetailPage" component={CourseDetailPage} />
        <Stack.Screen name="ConversationList" component={ConversationList} />
        <Stack.Screen name="MessageDetail" component={MessageDetail} />
      </Stack.Navigator>
    </>
  );
};

export default HomeNavigator;
