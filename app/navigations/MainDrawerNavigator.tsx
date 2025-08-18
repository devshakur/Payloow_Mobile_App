import CustomDrawerContent from "@/components/custom/CustomDrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { FunctionComponent } from "react";
import { useScreen } from "../context/ScreenProvider";
import BillsHomeNavigator from "./BillsHomeNavigator";
import BuyerHomeNavigator from "./BuyerHomeNavigator";
import DebtorHomeNavigator from "./DebtorHomeNavigator";
import InvestorHomeNavigator from "./InvestorHomeNavigator";
import MainHomeNavigator from "./MainHomeNavigator";
import PartnerHomeNavigator from "./PartnerHomeNavigator";
import StudentHomeNavigator from "./StudentHomeNavigator";
import TutorHomeNavigator from "./TutorHomeNavigator";

interface MainDrawerNavigatorProps {}

const LeftDrawer = createDrawerNavigator();

const MainDrawerNavigator: FunctionComponent<MainDrawerNavigatorProps> = () => {
  const { dashboard } = useScreen();

  return (
    <LeftDrawer.Navigator
      screenOptions={{
        drawerPosition: "left",
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <LeftDrawer.Screen
        name="MainHomeNavigator"
        component={MainHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />

      <LeftDrawer.Screen
        name="BillsHomeNavigator"
        component={BillsHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="BuyerHomeNavigator"
        component={BuyerHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="PartnerHomeNavigator"
        component={PartnerHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="StudentHomeNavigator"
        component={StudentHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="TutorHomeNavigator"
        component={TutorHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="InvestorHomeNavigator"
        component={InvestorHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
      <LeftDrawer.Screen
        name="DebtorHomeNavigator"
        component={DebtorHomeNavigator}
        options={{
          headerShown: false,
          drawerLabel: () => null,
        }}
      />
    </LeftDrawer.Navigator>
  );
};

export default MainDrawerNavigator;
