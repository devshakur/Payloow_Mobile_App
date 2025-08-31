// TutorLayout.tsx
import { useScreen } from "@/app/context/ScreenProvider";
import { useUser } from "@/app/context/UserProvider";
import { useVariation } from "@/app/context/VariationPlansProvider";
import AppText from "@/components/custom/AppText";
import RegisterTutorModal from "@/components/custom/eLearning/RegisterTutorModal";
import List from "@/components/custom/list/List";
import LoadingModal from "@/components/custom/LoadingModal";
import Balance from "@/components/custom/profile/Balance";
import ModulesToggler from "@/components/custom/profile/ModulesToggler";
import Screen from "@/components/custom/Screen";
import BillIcon from "@/components/custom/utility/BillIcon";
import ServiceContainer from "@/components/custom/utility/ServiceContainer";
import { Colors } from "@/constants/Colors";
import { Feather, Foundation, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FunctionComponent, ReactNode, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ModuleKey = keyof typeof moduleRouteMap;

const moduleRouteMap = {
  eLearning: {
    dashboard: "eLearning Dashboard",
    route: {
      student: "StudentHomeNavigator",
      tutor: "TutorHomeNavigator",
    },
    primaryPages: ["StudentDashboard", "TutorDashboard"],
  },
  Investment: {
    dashboard: "Investment Dashboard",
    route: {
      debtor: "DebtorHomeNavigator",
      investor: "InvestorHomeNavigator",
    },
    primaryPages: ["DebtorDashboard", "InvestorDashboard"],
  },
  Easybuy: {
    dashboard: "Easybuy Dashboard",
    route: {
      buyer: "BuyerHomeNavigator",
      partner: "PartnerHomeNavigator",
    },
    primaryPages: ["BuyerDashboard", "PartnerDashboard"],
  },
  Bills: {
    dashboard: "Bills Dashboard",
    route: "BillsHomeNavigator",
    primaryPages: ["BillsDashboard"],
  },
  Home: {
    dashboard: "Home",
    route: "MainHomeNavigator",
    primaryPages: ["HomePage"],
  },
};

const isValidModuleKey = (key: string): key is ModuleKey => {
  return key in moduleRouteMap;
};

const TutorLayout: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => {
  const { module, setModule, dashboard, setDashboard } = useScreen();
  const { user, setUser } = useUser();
  const { variation, setVariation } = useVariation();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // fetch logic omitted for brevity, keep as is ...

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: "70%" }}>
            <ModulesToggler
              render={(selectedItem: string) => {
                if (isValidModuleKey(selectedItem)) {
                  // switchModule logic
                }
              }}
              current={module}
            />
          </View>
          <View style={styles.headerIcons}>
            <MaterialIcons
              onPress={() => navigation.navigate("TutorChatScreen")}
              name="messenger-outline"
              size={24}
              color="black"
            />
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="black"
              onPress={() =>
                navigation.navigate("Bills", { screen: "Notifications" })
              }
            />
          </View>
        </View>

        {/* Balance */}
        <Balance />

        {/* Services */}
        <View style={styles.serviceContainer}>
          <ServiceContainer
            iconColor={Colors.app.primary}
            icon="arrow-up"
            label="Top Up"
            onPress={() =>
              navigation.navigate("Bills", { screen: "FundWallet" })
            }
          />
          <ServiceContainer
            icon="bank-transfer-out"
            label="Send Money"
            iconColor="#D257E5"
            onPress={() =>
              navigation.navigate("Bills", { screen: "SendMoney" })
            }
          />
          <ServiceContainer
            style={{ width: "25%", gap: 10 }}
            iconColor="#DD6D3E"
            icon="widgets-outline"
            label="More"
          />
        </View>

        {/* Bills */}
        <View style={styles.utilityContent}>
          <BillIcon
            label="Airtime"
            name="phone"
            onPress={() => navigation.navigate("Bills", { screen: "Airtime" })}
          />
          <BillIcon
            label="Data"
            name="wifi"
            onPress={() => navigation.navigate("Bills", { screen: "Data" })}
          />
          <BillIcon
            label="Electricity"
            name="electric-bolt"
            onPress={() =>
              navigation.navigate("Bills", { screen: "Electricity" })
            }
          />
          <BillIcon
            label="TV Sub"
            name="television"
            onPress={() => navigation.navigate("Bills", { screen: "TVSub" })}
          />
        </View>

        {/* Modules */}
        <View style={styles.modulesContainer}>
          <List
            leftIcon={
              <View style={styles.iconBox("#EDFDF8")}>
                <Feather
                  name="shopping-cart"
                  size={24}
                  color={Colors.app.success}
                />
              </View>
            }
            leftTopLabel="Easy Buy"
            leftTopLabelStyle={{ fontWeight: "900" }}
            leftBottomLabel="Shop on Payloow now"
            onPress={() => {}}
          />
          <List
            leftIcon={
              <View style={styles.iconBox("#FFF4EF")}>
                <Foundation name="graph-trend" size={24} color="#DD6D3E" />
              </View>
            }
            leftTopLabel="Investment"
            leftTopLabelStyle={{ fontWeight: "900" }}
            leftBottomLabel="Islamic investment at your fingertips"
            onPress={() => {}}
          />
        </View>

        {/* For You + Injected children */}
        <View style={styles.bottomContentsWrapper}>
          <View style={styles.bottomContentsTitleContainer}>
            <AppText style={styles.bottomContentsTitle}>For You</AppText>
            <TouchableOpacity>
              <AppText style={styles.viewAll}>View all</AppText>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>

      {loading && <LoadingModal visible={loading} />}
      <RegisterTutorModal
        onClose={() => setVisible(false)}
        isVisible={visible}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
    flexDirection: "row",
    width: "90%",
  },
  headerIcons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    flexDirection: "row",
  },
  serviceContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    width: "85%",
  },
  utilityContent: {
    backgroundColor: Colors.app.white,
    width: "90%",
    height: 86,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modulesContainer: {
    width: "90%",
    height: 120,
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
    marginBottom: -10,
    gap: 10,
  },
  viewAll: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
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
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  iconBox: (bg: string) => ({
    backgroundColor: bg,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  }),
});

export default TutorLayout;
