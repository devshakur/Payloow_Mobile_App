import utility from "@/app/api/utility";
import { UserData, useUser } from "@/app/context/UserProvider";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import Pin from "@/components/custom/Pin";
import Screen from "@/components/custom/Screen";
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { FunctionComponent, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import userDetails from "../../../api/userDetails";
import {
  NetworkData,
  useVariation,
} from "../../../context/VariationPlansProvider";
import routes from "../../../navigations/routes";

type OptionType = {
  label: string;
  value: string;
};

interface DataSummaryProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  FundWallet: undefined;
  DataSummary: {
    network: any;
    phone: any;
    planId: any;
    price?: any;
    selectedPlanType: any;
    plans: OptionType[];
    validity: string;
  };
};

interface Response {
  message?: string;
  success: boolean;
  data: {
    statusCode: number;
    message: string;
    status: string;
    finalStatus: string;
    code: string;
    data: {
      amount: number;
      finalStatus: string;
      mobile_number: string;
      network: string;
      status: string;
    };
  };
}

const DataSummary: FunctionComponent<DataSummaryProps> = ({ navigation }) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const route = useRoute<RouteProp<RootStackParamList, "DataSummary">>();
  const { user, setUser } = useUser();

  const { variation } = useVariation();

  let {
    network,
    phone,
    planId,
    price,
    selectedPlanType,
    plans,
    validity,
  }: {
    network: any;
    phone: any;
    planId: any;
    price?: any;
    selectedPlanType: any;
    plans: OptionType[];
    validity: string;
  } = route.params ?? {};

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        
        // Check if user has auth token
        const authToken = await SecureStore.getItemAsync("auth");
        if (!authToken) {
          setLoadingUser(false);
          return;
        }
        
        const userResult = await userDetails.getUser();
        
        if (userResult.ok && userResult.data) {
          const userData = userResult.data as UserData;
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    // Only fetch if we don't already have user data
    if (!user) {
      fetchUserData();
    } else {
      setLoadingUser(false);
    }
  }, [setUser, user]);

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  // Hide modal
  const hideModal = () => {
    setModalVisible(false);
  };

  const handlePurchase = async (pin: string) => {
    setLoading(true); // START loading

    const result = await utility.buyData(phone, pin, network, validity, planId);


    const responseData = result.data as Response;



    if (!result.ok) {
      setResponseMessage(responseData.message || "");
      showModal("failed");
      return setLoading(false);
    }

    if (responseData.success === false) {
      setResponseMessage(responseData.message || "");
      showModal("failed");
      return setLoading(false);
    } else {
      setResponseMessage(responseData.data.status);
      showModal("success");
      return setLoading(false);
    }
  };

  type OptionType = {
    label: string;
    value: string;
  };

  const getPlanByVariationID = (
    data: OptionType[],
    variationID: string | undefined
  ): string | null => {
    if (!data || !variationID) return null;

    const variation = data.find((item) => item.value === variationID);

    return variation ? variation.label : null;
  };

  const getFinalPrice = (
    variationData: NetworkData,
    networkKey: string | undefined,
    planId: string | undefined,
    price: string | null,
    discount: number,
    applyDiscount: boolean
  ): number => {
    let original: number = 0;

    if (price) {
      original = parseFloat(price);
    } else if (networkKey && planId) {
      const variationKey = Object.keys(variationData).find((key) =>
        key.toLowerCase().includes(networkKey.toLowerCase())
      );

      if (variationKey) {
        const network = variationData[variationKey];

        for (const category of Object.keys(network)) {
          const found = network[category].find(
            (item) => String(item.id) === String(planId)
          );
          if (found) {
            original = found.amount;
            break;
          }
        }
      }
    }

    return applyDiscount ? original - discount : original;
  };
  return (
    <Screen backgroundColor={Colors.app.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color={Colors.app.dark} size={22} />
        </TouchableOpacity>
        <AppText style={styles.title}>Data Summary</AppText>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Plan Details */}
        <AppText style={styles.planName}>
          {getPlanByVariationID(plans, planId) ?? "No plan found"}
        </AppText>
        <AppText style={styles.phoneNumber}>{phone}</AppText>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <AppText style={styles.label}>Data Amount</AppText>
            <AppText style={styles.value}>
              ₦{getFinalPrice(variation, network, planId, price, 0, false)}
            </AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Network</AppText>
            <AppText style={styles.value}>{network?.toUpperCase()}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Plan Type</AppText>
            <AppText style={styles.value}>{selectedPlanType}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Validity</AppText>
            <AppText style={styles.value}>{validity}</AppText>
          </View>
        </View>

        {/* Wallet Info */}
        <TouchableOpacity
          style={styles.walletRow}
          onPress={() => navigation.navigate(routes.FUND_WALLET)}
        >
          <View style={styles.walletIcon}>
            <MaterialCommunityIcons name="wallet" size={22} color={Colors.app.dark} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.label}>Wallet Balance</AppText>
            <AppText style={styles.value}>
              ₦{loadingUser ? "..." : (
                Number(user?.data?.balance?.$numberDecimal || 0)
              ).toLocaleString()}
            </AppText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.app.primary} />
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <View style={styles.footer}>
        <AppButton
          btnContainerStyle={[
            styles.payButton,
            {
              backgroundColor: loading
                ? Colors.app.loading
                : (loading || !network)
                  ? Colors.app.disabled
                  : Colors.app.primary
            },
          ]}
          title="Pay"
          titleStyle={styles.payText}
          disabled={loading || !network}
          loading={loading}
          loadingAnimation={<ActivityIndicator size="small" color={Colors.app.white} />}
          onPress={() => showModal("pin")}
        />
      </View>

      {modalVisible && currentModal === "pin" && (
        <Pin
          isVisible={modalVisible}
          onClose={() => {
            hideModal();
          }}
          onSubmitPin={(pin) => {
            hideModal();
            handlePurchase(pin); // <<< Called here
          }}
        />
      )}
      {modalVisible && currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Successfully buy data"}
        />
      )}
      {/* Modals */}
      {modalVisible && currentModal === "failed" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Failed to buy data"}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerPlaceholder: {
    width: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
  },
  content: {
    paddingHorizontal: 20,
    gap: 24,
    alignItems: "center",
  },
  planName: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
    textAlign: "center",
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark + "90",
  },
  card: {
    width: "100%",
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.app.white,
    padding: 14,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  walletIcon: {
    backgroundColor: Colors.app.screen,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  footer: {
    padding: 20,
  },
  payButton: {
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
  },
  payText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "DMSans-Medium",
  },
});

export default DataSummary;
