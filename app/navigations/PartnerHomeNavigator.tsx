import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import CategoriesNavigator from "./CategoriesNavigator";
import PartnerNavigator from "./PartnerNavigator";
import ProfileNavigator from "./ProfileNavigator";

type PartnerHomeNavigatorParamList = {
  Partner: undefined;
  Installment: undefined;
  PartnerNavigator: undefined;
  CommissionNavigator: undefined;
  Inventory: undefined;
  Customers: undefined;
  SwapNavigator: undefined;
  CategoriesNavigator: undefined;
  InstallmentNavigator: undefined;
  Categories: undefined;
  Profile: undefined;
};

interface PartnerNavigatorProps {}

const Tab = createBottomTabNavigator<PartnerHomeNavigatorParamList>();

const PartnerHomeNavigator: React.FC<PartnerNavigatorProps> = ({
  route,
}: any) => {
  const { module } = useScreen();

  const getTabBarVisibility = (route: any, screen: string | null) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Commission"; // Default to "Feed"
    const hiddenScreens = ["SalesCommissionHistory"];

    return hiddenScreens.includes(routeName) ? "none" : "flex";
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: getTabBarVisibility(route, module), // Hide tab bar on specific screens
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
        name="Partner"
        component={PartnerNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="Categories"
        component={CategoriesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="widgets-outline"
              size={size}
              color={color}
            />
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

export default PartnerHomeNavigator;
