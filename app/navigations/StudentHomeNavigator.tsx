import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useScreen } from "../context/ScreenProvider";
import CoursesNavigator from "./CoursesNavigator";
import MyCoursesNavigator from "./MyCoursesNavigator";
import ProfileNavigator from "./ProfileNavigator";
import StudentNavigator from "./StudentNavigator";

type StudentHomeNavigatorParamList = {
  BuyerNavigator: undefined;
  StudentProfileNavigator: undefined;
  Analytics: undefined;
  MyCourses: undefined;
  Progress: undefined;
  StudentNavigator: undefined;
  Profile: undefined;
  Massenger: undefined;
  Student: undefined;
  Courses: undefined;
};

interface StudentHomeNavigatorProps {}

const Tab = createBottomTabNavigator<StudentHomeNavigatorParamList>();

const StudentHomeNavigator: React.FC<StudentHomeNavigatorProps> = ({
  route,
}: any) => {
  const { module } = useScreen();

  const getTabBarVisibility = (route: any, module: string | null) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "BuyerHome"; // Default to "Feed"
    const hiddenScreens = ["UtilityNavigator"];

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
        name="Student"
        component={StudentNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Left Side Button 2 */}
      <Tab.Screen
        name="MyCourses"
        component={MyCoursesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="book-education"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Right Side Button 1 */}
      <Tab.Screen
        name="Courses"
        component={CoursesNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="book-search"
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

export default StudentHomeNavigator;
