import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import TutorProfileScreen from "../screens/eLearning/tutor/TutorProfileScreen";
import ProfileNavigator from "./ProfileNavigator";
import routes from "./routes";
import TutorCoursesNavigator from "./TutorCoursesNavigator";
import TutorNavigator from "./TutorNavigator";
type TutorHomeNavigatorParamList = {
  Buyer: undefined;
  StudentProfileNavigator: undefined;
  Analytics: undefined;
  CoursesScreen: undefined;
  Tutor: undefined;
  MyCourses: undefined;
  Profile: undefined;
  Details: undefined;
  TutorProfile: undefined;
};

interface TutorHomeNavigatorProps {}

const Tab = createBottomTabNavigator<TutorHomeNavigatorParamList>();

const TutorHomeNavigator: React.FC<TutorHomeNavigatorProps> = ({
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
        name="Tutor"
        component={TutorNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="MyCourses"
        component={TutorCoursesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="book-edit"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="TutorProfile"
        component={TutorProfileScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="information"
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

export default TutorHomeNavigator;
