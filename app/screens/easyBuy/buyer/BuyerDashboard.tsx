import { useScreen } from "@/app/context/ScreenProvider";
import { UserData, useUser } from "@/app/context/UserProvider";
import AppText from "@/components/custom/AppText";
import FeatureProduct from "@/components/custom/easyBuy/FeatureProduct";
import JoinEasyBuy from "@/components/custom/easyBuy/JoinEasyBuy";
import Balance from "@/components/custom/profile/Balance";
import ModulesToggler from "@/components/custom/profile/ModulesToggler";
import Screen from "@/components/custom/Screen";
import BillIcon from "@/components/custom/utility/BillIcon";
import ServiceContainer from "@/components/custom/utility/ServiceContainer";
import { Colors } from "@/constants/Colors";
import { Entypo, Foundation, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
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
import List from "../../../../components/custom/list/List";
import easyBuy from "../../../api/easyBuy";
import userDetails from "../../../api/userDetails";
import utility from "../../../api/utility";
import {
  NetworkData,
  useVariation,
} from "../../../context/VariationPlansProvider";

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
  UtilityHomePage: undefined;
  BuyerHomeNavigator: undefined;
  BuyerNavigator: undefined;
  StudentNavigator: undefined;
  InvestorUtility: undefined;
  FundWallet: undefined;
  Bills: undefined;
};

export interface ProductCategory {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface Product {
  _id: string;
  partner: string;
  name: string;
  description: string;
  price: {
    $numberDecimal: string;
  };
  color: string[];
  isFeatured: boolean;
  category: ProductCategory;
  stock: number;
  image: string;
  imageUrl: string;
  additionalImages: string[];
  additionalImagesUrls: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  deactivatedByAdmin: boolean;
  isActive: boolean;
}

export interface ProductDataWrapper {
  data: Product[];
  message: string;
  status: number;
}

export interface ProductResponseData {
  success: boolean;
  message: string;
  data: ProductDataWrapper;
}

interface BuyerDashboardProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

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

const BuyerDashboard: FunctionComponent<BuyerDashboardProps> = ({
  navigation,
}) => {
  const { module, setModule } = useScreen();
  const { dashboard, setDashboard } = useScreen();
  const { user, setUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const { variation, setVariation } = useVariation();

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchUserData(), fetchVariations(), fetchProducts()]).finally(
      () => {
        setRefreshing(false);
        if (user?.data.easyBuyRole === null) {
          setVisible(true);
        }
      }
    );
  }, [user]);

  useEffect(() => {
    onRefresh(); // fetches both user + transactions
  }, []);

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

  const fetchProducts = async () => {
    setRefreshing(true);
    try {
      const result = await easyBuy.getProducts();
      const response = result.data as ProductResponseData;

      const responseData = response.data as ProductDataWrapper;

      if (result.ok) {
        const productList = responseData.data;

        setProducts(productList);
      } else {
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const switchModule = (selectedModule: string) => {
    setRefreshing(true);

    if (!isValidModuleKey(selectedModule)) {
      console.warn("Invalid module selected:", selectedModule);
      setRefreshing(false);
      return;
    }

    const selected = moduleRouteMap[selectedModule];
    let dashboard = selected.dashboard;
    let route: string | undefined;

    const navigateToRoute = (role: string) => {
      setRefreshing(true);
      const routeMap = selected.route;
      if (typeof routeMap === "object" && routeMap !== null) {
        route = (selected.route as Record<string, string>)[role.toLowerCase()];
      }

      if (!route) {
        console.warn(
          `No route found for role "${role}" in ${selectedModule} module.`
        );
        setRefreshing(false);
        return;
      }

      setTimeout(() => {
        setModule(selectedModule);
        setDashboard(dashboard);
        navigation.reset({
          index: 0,
          routes: [{ name: route as keyof RootStackParamList }],
        });
        setRefreshing(false);
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
              setModule("Easybuy");
              setDashboard("Easybuy Dashboard");
              navigation.reset({
                index: 0,
                routes: [
                  { name: "BuyerNavigator" as keyof RootStackParamList },
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
        setRefreshing(false);
        handleRoleMissing("Investment");
      }
    } else if (selectedModule === "Easybuy") {
      const role = user?.data.easyBuyRole?.toLowerCase();
      if (role) {
        navigateToRoute(role);
      } else {
        setRefreshing(false);

        handleRoleMissing("Easybuy");
      }
    } else if (selectedModule === "eLearning") {
      setRefreshing(false);
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
        setRefreshing(false);
      }, 500);
    } else {
      console.warn("Route not resolved properly.");
      setRefreshing(false);
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
                screen: "TvSub",
              } as never)
            }
          />
        </View>

        <View style={styles.modulesContainer}>
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
            onPress={() => switchModule("eLearning")}
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
            onPress={() => switchModule("Investment")}
          />
        </View>

        <View style={styles.bottomContentsWrapper}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <View style={styles.bottomContentsTitleContainer}>
              <AppText style={styles.bottomContentsTitle}>
                Easy Buy Products
              </AppText>
              <TouchableOpacity>
                <AppText style={styles.viewAll}>View all</AppText>
              </TouchableOpacity>
            </View>
            {products && (
              <FeatureProduct
                onRefreshing={(value) => (value === true ? onRefresh() : {})}
                navigation={navigation}
                products={products}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <JoinEasyBuy
        isVisible={visible}
        onClose={() => setVisible(false)}
        userRole="partner"
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    gap: 40,
  },
  headerIcons: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    flexDirection: "row",
    width: "30%",
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
    height: 130,
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
    fontWeight: "800",
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

export default BuyerDashboard;
