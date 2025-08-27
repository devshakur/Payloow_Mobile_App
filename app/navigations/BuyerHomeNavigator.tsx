import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import BuyerNavigator from "./BuyerNavigator";
import CategoriesNavigator from "./CategoriesNavigator";
import ProfileNavigator from "./ProfileNavigator";

type BuyerHomeNavigatorParamList = {
  Buyer: undefined;
  InstallmentNavigator: undefined;
  BuyerNavigator: undefined;
  Profile: undefined;
  SwapNavigator: undefined;
  History: undefined;
  Support: undefined;
  Bills: undefined;
  Categories: undefined;
};

const Tab = createBottomTabNavigator<BuyerHomeNavigatorParamList>();

const BuyerHomeNavigator: React.FC = ({ route }: any) => {
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
        name="Buyer"
        component={BuyerNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
          headerShown: false,
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

export default BuyerHomeNavigator;
