import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import Business from "../screens/investiment/BusinessesList";
import MyInvestiment from "../screens/investiment/MyInvestiment";
import InvestorNavigator from "./InvestorNavigator";
import ProfileNavigator from "./ProfileNavigator";
import routes from "./routes";

type InvestorHomeNavigatorParamList = {
  BuyerNavigator: undefined;
  StudentProfileNavigator: undefined;
  Business: undefined;
  MyInvestiment: undefined;
  Investor: undefined;
  Approve: undefined;
  Profile: undefined;
};

interface InvestorHomeNavigatorProps {}

const Tab = createBottomTabNavigator<InvestorHomeNavigatorParamList>();

const InvestorHomeNavigator: React.FC<InvestorHomeNavigatorProps> = ({
  route,
}: any) => {
  const { module } = useScreen();

  const getTabBarVisibility = (route: any, module: string | null) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "BuyerHome"; // Default to "Feed"
    const hiddenScreens = [
      routes.AIRTIME,
      routes.DATA,
      routes.TV_SUB,
      routes.ELECTRICITY,
    ];

    if (module === "Easy Buy") {
      return "none";
    }

    return hiddenScreens.includes(routeName as any) ? "none" : "flex";
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
        name="Investor"
        component={InvestorNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="Business"
        component={Business}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bank" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="MyInvestiment"
        component={MyInvestiment}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
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

export default InvestorHomeNavigator;
