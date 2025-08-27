import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import BillsNavigator from "./BillsNavigator";
import CategoriesNavigator from "./CategoriesNavigator";
import CoursesCategoriesNavigator from "./CoursesNavigator";
import ProfileNavigator from "./ProfileNavigator";

type BillsHomeNavigatorParamList = {
  BuyerProfileNavigator: undefined;
  InstallmentNavigator: undefined;
  BuyerNavigator: undefined;
  Easybuy: undefined;
  SwapNavigator: undefined;
  Home: undefined;
  Histories: undefined;
  Courses: undefined;
  Invest: undefined;
  Account: undefined;
  Bills: undefined;
};

const Tab = createBottomTabNavigator<BillsHomeNavigatorParamList>();

const BillsHomeNavigator: React.FC = ({ route }: any) => {
  const { module } = useScreen();

  const getTabBarVisibility = (route: any, module: string | null) => {
    const routeName = getFocusedRouteNameFromRoute(route);

    const hiddenScreens = [""];

    // if (module === "EasyBuy") {
    //   return "none";
    // }

    return hiddenScreens.includes(routeName as any) ? "none" : "flex";
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: getTabBarVisibility(route, module),
          backgroundColor: Colors.app.white,
          borderColor: Colors.app.white,
          paddingHorizontal: 5,
        },
        tabBarItemStyle: {
          marginHorizontal: 5,
        },
        headerShown: false,
      })}
    >
      {/* Left Side Button 1 */}
      <Tab.Screen
        name="Bills"
        component={BillsNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="Easybuy"
        component={CategoriesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="shopping" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="Courses"
        component={CoursesCategoriesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={size}
              color={color}
            />
          ),
        }}
      />

   

      {/* Right Side Button 2 */}
      <Tab.Screen
        name="Account"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BillsHomeNavigator;
