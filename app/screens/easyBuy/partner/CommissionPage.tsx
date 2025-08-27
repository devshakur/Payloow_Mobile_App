import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import {
  Entypo,
  Feather,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "@/components/custom/AppText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useScreen } from "@/app/context/ScreenProvider";
import BalanceWithBackground from "@/components/custom/profile/BalanceWithBackground";
import MenuBg from "@/components/custom/easyBuy/MenuBg";
import routes from "@/app/navigations/routes";

type RootStackParamList = {
  SalesCommissionHistory: undefined;
};

interface CommissionPageProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "SalesCommissionHistory"
  >;
}

const CommissionPage: FunctionComponent<CommissionPageProps> = ({
  navigation,
}) => {
  const { module, setModule } = useScreen();

  return (
    <Screen backgroundColor={Colors.app.screen} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcons}>
            <FontAwesome6 name="receipt" size={24} color="black" />
            <FontAwesome5 name="history" size={24} color="black" />
          </View>
        </View>

        <BalanceWithBackground />

        <View style={styles.menuBg}>
          <MenuBg />
          <MenuBg />
        </View>

        <View style={styles.menuBg}>
          <MenuBg />
          <MenuBg />
        </View>

        <View style={styles.bottomContentsWrapper}>
          <View style={styles.bottomContentsTitleContainer}>
            <AppText style={styles.bottomContentsTitle}>
              Commission Chart
            </AppText>
            <MaterialCommunityIcons
              name="arrow-top-left"
              size={24}
              color={Colors.app.primary}
              onPress={() =>
                navigation.navigate(routes.SALES_COMMISSION_HISTORY)
              }
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  header: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 80,
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
  },
  headerIcons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    flexDirection: "row",
  },
  bottomContentsTitle: {
    color: Colors.app.black,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 28,
  },
  bottomContentsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomContentsWrapper: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    height: 250,
    padding: 10,
    backgroundColor: Colors.app.white,
  },
  menuBg: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: 16,
  },
});

export default CommissionPage;
