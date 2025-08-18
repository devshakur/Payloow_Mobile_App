import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import BusinessesList from "../screens/investiment/BusinessesList";
import CategoriesNavigator from "./CategoriesNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";
import CoursesNavigator from "./CoursesNavigator";

type MainHomeNavigatorParamList = {
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
  HomeNavigator: undefined;
  Profile: undefined;
};

interface MainHomeNavigatorProps {}

const Tab = createBottomTabNavigator<MainHomeNavigatorParamList>();

const MainHomeNavigator: React.FC<MainHomeNavigatorProps> = ({
  route,
}: any) => {
  const { module } = useScreen();

  const getTabBarVisibility = (route: any, module: string | null) => {
    const routeName = getFocusedRouteNameFromRoute(route);

    const hiddenScreens = ["BuyerUtility"];

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
        name="Home"
        component={HomeNavigator}
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

      {/* Right Side Button 1 */}
      <Tab.Screen
        name="Courses"
        component={CoursesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />

      {/* Right Side Button 1 */}
      <Tab.Screen
        name="Invest"
        component={BusinessesList}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="barchart" size={size} color={color} />
          ),
        }}
      />

      {/* Right Side Button 2 */}
      <Tab.Screen
        name="Profile"
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

export default MainHomeNavigator;
