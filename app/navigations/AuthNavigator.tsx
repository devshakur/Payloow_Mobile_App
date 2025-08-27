import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { Colors } from "../../constants/Colors";
import FinishedProfileSetUp from "../screens/auth/FinishedProfileSetUp";
import OTP from "../screens/auth/OTP";
import ProfileSetUp from "../screens/auth/ProfileSetUp";
import ResetPassword from "../screens/auth/ResetPassword";
import SetNewPassword from "../screens/auth/SetNewPassword";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import WelcomeScreen from "../screens/auth/WelcomeScreen";

type AuthStackParamList = {
  WelcomeScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  SignUpVerificationScreen: undefined;
  ResetPassword: undefined;
  SetNewPassword: undefined;
  ProfileSetUp: undefined;
  FinishedProfileSetUp: undefined;
  OTP: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.app.screen }}>
      <StatusBar style="dark" translucent />
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SetNewPassword"
          component={SetNewPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProfileSetUp"
          component={ProfileSetUp}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FinishedProfileSetUp"
          component={FinishedProfileSetUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  );
};

export default AuthNavigator;
