import { Colors } from "@/constants/Colors";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import Business from "../screens/investiment/BusinessesList";
import Loans from "../screens/investiment/Debator/Loans";
import Request from "../screens/investiment/Request";
import DebatorNavigator from "./DebtorNavigator.tsx";
import ProfileNavigator from "./ProfileNavigator";
import routes from "./routes";

type DebtorHomeNavigatorParamList = {
  BuyerNavigator: undefined;
  StudentProfileNavigator: undefined;
  Business: undefined;
  AddLoan: undefined;
  Progress: undefined;
  Loan: undefined;
  Debator: undefined;
  Approve: undefined;
  Profile: undefined;
  Loans: undefined;
};

interface DebtorHomeNavigatorProps {}

const Tab = createBottomTabNavigator<DebtorHomeNavigatorParamList>();

const DebtorHomeNavigator: React.FC<DebtorHomeNavigatorProps> = ({
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

    // if (module === "Easy Buy") {
    //   return "none";
    // }

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
        name="Debator"
        component={DebatorNavigator}
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
        name="Loans"
        component={Loans}
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="naira-sign" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="Approve"
        component={Request}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="approval" size={size} color={color} />
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

export default DebtorHomeNavigator;
