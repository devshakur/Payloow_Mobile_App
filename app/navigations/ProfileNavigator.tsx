import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import ChangePin from "../screens/auth/ChangePin";
import ChangeEmail from "../screens/public/ChangeEmail";
import ChangePassword from "../screens/public/ChangePassword";
import Orders from "../screens/public/Orders";
import Profile from "../screens/public/Profile";
import TransactionDetail from "../screens/public/TransactionDetail";
import Transactions, { TransactionRes } from "../screens/public/Transactions";
import UserMainProfile from "../screens/public/UserMainProfile";

type RootStackParamList = {
  Profile: undefined;
  Buyer: undefined;
  Partner: undefined;
  ChangePassword: undefined;
  ChangeEmail: undefined;
  Orders: undefined;
  Transactions: undefined;
  TransactionDetail: { transaction: TransactionRes };
  UserMainProfile: undefined;
  ChangePin: undefined;
};

interface ProfileNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileNavigator: FunctionComponent<ProfileNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      <Stack.Screen name="UserMainProfile" component={UserMainProfile} />
      <Stack.Screen name="ChangePin" component={ChangePin} />
      
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
