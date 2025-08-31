import userDetails from "@/app/api/userDetails";
import { useScreen } from "@/app/context/ScreenProvider";
import { UserData, useUser } from "@/app/context/UserProvider";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import List from "@/components/custom/list/List";
import LoadingModal from "@/components/custom/LoadingModal";
import Balance from "@/components/custom/profile/Balance";
import ModulesToggler from "@/components/custom/profile/ModulesToggler";
import Screen from "@/components/custom/Screen";
import BillIcon from "@/components/custom/utility/BillIcon";
import ServiceContainer from "@/components/custom/utility/ServiceContainer";
import { Colors } from "@/constants/Colors";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import FeaturedBusiness from "../../../../components/custom/investiment/FeaturedBusiness";
import JoinAsDebtor from "../../../../components/custom/investiment/JoinAsDebtor.tsx";
import investment from "../../../api/investment";
import utility from "../../../api/utility";
import {
    NetworkData,
    useVariation,
} from "../../../context/VariationPlansProvider";
import { Business } from "../Request";

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
  ChatScreen: undefined;
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

interface DebtorDashboardProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const DebtorDashboard: FunctionComponent<DebtorDashboardProps> = ({
  navigation,
}) => {
  const { module, setModule } = useScreen();
  const { dashboard, setDashboard } = useScreen();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { variation, setVariation } = useVariation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([
      fetchUserData(),
      fetchVariations(),
      fetchBusinesses(),
    ]).finally(() => {
      setRefreshing(false);
      if (user?.data.investmentRole === null) {
        setVisible(true);
      }
    });
  }, [user]);

  useEffect(() => {
    onRefresh();
  }, []);

  const fetchVariations = async () => {
    setRefreshing(true);
    try {
      const res = await utility.getVariations();

      if (res.ok && (res.data as { success: boolean }).success) {
        const rawData = (res.data as { data: NetworkData }).data;
        setVariation(rawData);
      } else {
        console.warn("Failed to fetch variation plans");
      }
    } catch (error) {
      console.error("Error fetching variations:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUserData = async () => {
    setRefreshing(true);
    try {
      // Fetch user data
      const userResult = await userDetails.getUser();
      const userData = userResult.data as UserData;
      if (userResult.ok) {
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
  
    } finally {
      setRefreshing(false);
    }
  };

  const fetchBusinesses = async () => {
    setRefreshing(true);
    try {
      const result = await investment.getBusiness();

      if (result.ok) {
        setBusinesses(result.data as Business[]);
      } else {
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

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

    const navigateToRoute = (role: string) => {
      setLoading(true);
      const routeMap = selected.route;
      if (typeof routeMap === "object" && routeMap !== null) {
        route = (selected.route as Record<string, string>)[role.toLowerCase()];
      }

      if (!route) {
        console.warn(
          `No route found for role "${role}" in ${selectedModule} module.`
        );
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setModule(selectedModule);
        setDashboard(dashboard);
        navigation.reset({
          index: 0,
          routes: [{ name: route as keyof RootStackParamList }],
        });
        setLoading(false);
      }, 500);
    };

    const handleRoleMissing = (moduleName: string) => {
      const roleOptions =
        {
          Investment: [
            { label: "Debtor", role: "debtor" },
            { label: "Investor", role: "investor" },
          ],
          Easybuy: [
            { label: "Buyer", role: "buyer" },
            { label: "Partner", role: "partner" },
          ],
          eLearning: [
            { label: "Student", role: "student" },
            { label: "Tutor", role: "tutor" },
          ],
        }[moduleName] || [];

      Alert.alert(
        "Select Role",
        `Please select your ${moduleName} role to continue.`,
        [
          ...roleOptions.map((item) => ({
            text: item.label,
            onPress: () => navigateToRoute(item.role),
          })),
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setModule("Investment");
              setDashboard("Investment Dashboard");
              navigation.reset({
                index: 0,
                routes: [
                  { name: "DebtorHomeNavigator" as keyof RootStackParamList },
                ],
              });
            },
          },
        ],
        { cancelable: true }
      );
    };

    // Module logic
    if (selectedModule === "Investment") {
      const role = user?.data.investmentRole?.toLowerCase();
      if (role) {
        navigateToRoute(role);
      } else {
        setLoading(false);
        handleRoleMissing("Investment");
      }
    } else if (selectedModule === "Easybuy") {
      const role = user?.data.easyBuyRole?.toLowerCase();
      if (role) {
        navigateToRoute(role);
      } else {
        setLoading(false);

        handleRoleMissing("Easybuy");
      }
    } else if (selectedModule === "eLearning") {
      setLoading(false);
      handleRoleMissing("eLearning");
    } else if (typeof selected.route === "string") {
      route = selected.route;

      setTimeout(() => {
        setModule(selectedModule);
        setDashboard(dashboard);
        navigation.reset({
          index: 0,
          routes: [{ name: route as keyof RootStackParamList }],
        });
        setLoading(false);
      }, 500);
    } else {
      console.warn("Route not resolved properly.");
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View
            style={{
              width: "70%",
            }}
          >
            <ModulesToggler
              render={(selectedItem: string) => {
                if (isValidModuleKey(selectedItem)) {
                  switchModule(selectedItem);
                } else {
                  console.warn("Invalid module key from list:", selectedItem);
                }
              }}
              current={module}
            />
          </View>
          <View style={styles.headerIcons}>
            <MaterialIcons name="messenger-outline" size={24} color="black" />
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="black"
              onPress={() =>
                navigation.navigate("Bills", {
                  screen: "Notifications",
                } as never)
              }
            />
          </View>
        </View>
        <Balance />

        <View style={styles.serviceContainer}>
          <ServiceContainer
            iconColor={Colors.app.primary}
            icon="arrow-up"
            label="Top Up"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "FundWallet",
              } as never)
            }
          />
          <ServiceContainer
            icon="bank-transfer-out"
            label="Send Money"
            iconColor="#D257E5"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "SendMoney",
              } as never)
            }
          />
          <ServiceContainer
            style={{ width: "25%", gap: 10 }}
            iconColor="#DD6D3E"
            icon="widgets-outline"
            label="More"
          />
        </View>

        <View style={styles.utilityContent}>
          <BillIcon
            label="Airtime"
            name="phone"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "Airtime",
              } as never)
            }
          />
          <BillIcon
            label="Data"
            name="wifi"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "Data",
              } as never)
            }
          />
          <BillIcon
            label="Electricity"
            name="electric-bolt"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "Electricity",
              } as never)
            }
          />
          <BillIcon
            label="TV Sub"
            name="television"
            onPress={() =>
              navigation.navigate("Bills", {
                screen: "TVSub",
              } as never)
            }
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
            onPress={() => {
              setDashboard("Buyer");
              setModule("Bills&Easybuy");
              navigation.navigate("BuyerNavigator", {
                screen: "BuyerHomePage",
              } as never);
            }}
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
            onPress={() => {
              setDashboard("Student");
              setModule("eLearning");
              navigation.navigate(routes.STUDENT_HOME_NAVIGATOR as never);
            }}
          />
        </View>

        <View style={styles.bottomContentsWrapper}>
          <View style={styles.bottomContentsTitleContainer}>
            <AppText style={styles.bottomContentsTitle}>For You</AppText>
            <TouchableOpacity>
              <AppText style={styles.viewAll}>View all</AppText>
            </TouchableOpacity>
          </View>
          <FeaturedBusiness businesses={businesses} navigation={navigation} />
        </View>
      </ScrollView>
      {loading && <LoadingModal visible={loading} />}
      {user?.data.easyBuyRole === null && (
        <JoinAsDebtor onClose={() => setVisible(false)} isVisible={visible} />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    flexDirection: "row",
    width: "90%",
  },
  headerIcons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
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
    gap: 20,
    marginBottom: -10,
  },
  viewAll: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
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
});

export default DebtorDashboard;
