import { useScreen } from "@/app/context/ScreenProvider";
import { Colors } from "@/constants/Colors";
import { Entypo, Feather, Foundation } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { FunctionComponent, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useUser } from "../../app/context/UserProvider";
import AppButton from "./AppButton";
import List from "./list/List";
import LoadingModal from "./LoadingModal";

type RootStackParamList = {
  Airtime: undefined;
  Data: undefined;
  TVSub: undefined;
  Electricity: undefined;
  AirtimeSummary: undefined;
  DataSummary: undefined;
  TVSubSummary: undefined;
  ElectricitySummary: undefined;
  StudentHomeNavigator: undefined;
  InvestorHomeNavigator: undefined;
  BuyerNavigator: undefined;
  StudentNavigator: undefined;
  Bills: undefined;
  CategoriesNavigator: undefined;
  Courses: undefined;
};

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
    route: "BillsHomeNavigator", // No roles
    primaryPages: ["BillsDashboard"],
  },
  Home: {
    dashboard: "Home",
    route: "MainHomeNavigator",
    primaryPages: ["HomePage"],
  },
};

type ModuleKey = keyof typeof moduleRouteMap;

const isValidModuleKey = (key: string): key is ModuleKey => {
  return key in moduleRouteMap;
};

const CustomDrawerContent: FunctionComponent<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const { dashboard, setDashboard } = useScreen();
  const { module, setModule } = useScreen();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();

  const switchModule = (selectedModule: string) => {
    setLoading(true);

    if (!isValidModuleKey(selectedModule)) {
      console.warn("Invalid module selected:", selectedModule);
      setLoading(false);
      return;
    }

    const selected = moduleRouteMap[selectedModule];
    let dashboard = selected.dashboard;
    let route: string | undefined;

    // Investment module
    if (selectedModule === "Investment") {
      const role = user?.data.investmentRole?.toLowerCase(); // e.g., "debtor", "investor"
      if (!role) {
        console.warn("Missing investmentRole in user data.");
        setLoading(false);
        return;
      }

      const routeMap = selected.route;
      if (typeof routeMap === "object" && routeMap !== null) {
        route = (routeMap as Record<string, string>)[role];
      }

      if (!route) {
        console.warn(`No route found for role "${role}" in Investment module.`);
        setLoading(false);
        return;
      }

      // Easybuy module
    } else if (selectedModule === "Easybuy") {
      const role = user?.data.easyBuyRole?.toLowerCase(); // e.g., "buyer", "partner"
      if (!role) {
        console.warn("Missing easyBuyRole in user data.");
        setLoading(false);
        return;
      }

      const routeMap = selected.route;
      if (typeof routeMap === "object" && routeMap !== null) {
        route = (routeMap as Record<string, string>)[role];
      }

      if (!route) {
        console.warn(`No route found for role "${role}" in Easybuy module.`);
        setLoading(false);
        return;
      }

      // eLearning module
    } else if (selectedModule === "eLearning") {
      const role = user?.data.elearningRole?.toLowerCase() || "student"; // e.g., "student", "tutor"
      if (!role) {
        console.warn("Missing eLearningRole in user data.");
        setLoading(false);
        return;
      }

      const routeMap = selected.route;
      if (typeof routeMap === "object" && routeMap !== null) {
        route = (routeMap as Record<string, string>)[role];
      }

      if (!route) {
        console.warn(`No route found for role "${role}" in eLearning module.`);
        setLoading(false);
        return;
      }

      // Modules with no roles (Bills, Home)
    } else if (typeof selected.route === "string") {
      route = selected.route;
    }

    if (!route) {
      console.warn("Route not resolved properly.");
      setLoading(false);
      return;
    }

    setModule(selectedModule);

    setTimeout(() => {
      setDashboard(dashboard);

      navigation.reset({
        index: 0,
        routes: [{ name: route as keyof RootStackParamList }],
      });

      setLoading(false);
    }, 500);
  };

  return (
    <View style={styles.drawerContent}>
      {user?.data.profilePicture ? (
        <Image
          style={styles.profileImage}
          source={{ uri: user.data.profilePicture }}
        />
      ) : (
        <View style={styles.profileImagePlaceholder}>
          <Feather name="user" size={60} color={Colors.app.primary} />
        </View>
      )}

      {/* <ButtonWithIcon
        icon={
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            titleStyle={styles.titleStyle}
            color={Colors.app.primary}
          />
        }
        iconPosition="right"
        titleStyle={styles.titleStyle}
        btnContainerStyle={styles.btn}
        title={`${
          dashboard === "Buyer"
            ? "Switch to Partner View"
            : dashboard === "Partner"
            ? "Switch to Buyer View"
            : dashboard === "Student"
            ? "Switch to Tutor View"
            : dashboard === "Tutor"
            ? "Switch to Student View"
            : dashboard === "Investor"
            ? "Switch to Debator View"
            : dashboard === "Debator"
            ? "Switch to Investor View"
            : dashboard
        } `}
        onPress={() => {
          const dashboardSwitch: { [key: string]: string } = {
            Buyer: "Partner",
            Partner: "Buyer",
            Student: "Tutor",
            Tutor: "Student",
            Investor: "Investor",
            Debator: "Debator",
          };

          const screenMapping: { [key: string]: keyof typeof routes } = {
            Buyer: "BUYER_HOME_NAVIGATOR",
            Partner: "PARTNER_HOME_NAVIGATOR",
            student: "STUDENT_HOME_NAVIGATOR",
            Tutor: "TUTOR_HOME_NAVIGATOR",
            Investor: "DEBATOR_HOME_NAVIGATOR",
            Debator: "INVESTOR_HOME_NAVIGATOR",
          };

          const newDashboard = dashboardSwitch[dashboard] || dashboard;
          setDashboard(newDashboard);

          if (dashboard === "Student") {
            setModule("eLearning");
          } else if (dashboard === "Buyer" || dashboard === "Partner") {
            setModule("Easybuy");
          } else if (dashboard === "Investor" || dashboard === "Debator") {
            setModule("Investment");
          } else if (dashboard === "Bills") {
            setModule("Bills");
          } else if (dashboard === "Home") {
            setModule("Home");
          }

          const screenKey = screenMapping[newDashboard];

          console.log("curr nav", screenKey);

          if (screenKey) {
            navigation.navigate(routes[screenKey] as never);
          }
        }}
      /> */}

      <View style={styles.btnContainer}>
        <AppButton
          titleStyle={styles.titleStyle}
          btnContainerStyle={styles.btn}
          title={`${dashboard} `}
        />
      </View>

      <View style={styles.modulesContainer}>
        <List
          leftIcon={
            <View
              style={{
                backgroundColor: "#EDFDF8",
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Feather
                name="shopping-cart"
                size={24}
                color={Colors.app.success}
              />
            </View>
          }
          leftTopLabel="Easy Buy"
          leftTopLabelStyle={{
            fontWeight: "900",
          }}
          leftBottomLabel="Shop on Payloow now"
          onPress={() => switchModule("Easybuy")}
        />

        <List
          leftIcon={
            <View
              style={{
                backgroundColor: "#EFF4FF",
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Entypo name="open-book" size={24} color={Colors.app.primary} />
            </View>
          }
          leftTopLabel="E-Learning"
          leftTopLabelStyle={{
            fontWeight: "900",
          }}
          leftBottomLabel="Learn or tutor with us"
          onPress={() => () => switchModule("eLearning")}
        />

        <List
          leftIcon={
            <View
              style={{
                backgroundColor: "#FFF4EF",
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <Foundation name="graph-trend" size={24} color="#DD6D3E" />
            </View>
          }
          leftTopLabel="Investment"
          leftTopLabelStyle={{
            fontWeight: "900",
          }}
          leftBottomLabel="Islamic investment at your fingertips"
          onPress={() => () => switchModule("Investment")}
        />
      </View>
      {loading && <LoadingModal visible={loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    paddingHorizontal: 15,
    paddingTop: 50,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: 10,
    backgroundColor: Colors.app.screen,
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.app.primary,
  },
  profileImagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.app.primary,
    backgroundColor: Colors.app.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulesContainer: {
    // width: "100%",
    // height: 65,
    // backgroundColor: Colors.app.white,
    // borderRadius: 10,
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "column",
    // padding: 10,
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.primary,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btnContainer: {
    width: "100%",
    alignItems: "center",
  },
  btn: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.app.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.app.white,
  },
});

export default CustomDrawerContent;
