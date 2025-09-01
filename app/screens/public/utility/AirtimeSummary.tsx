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
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import * as yup from 'yup';
import userDetails from "../../../api/userDetails";
import routes from "../../../navigations/routes";

interface AirtimeSummaryProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
type RootStackParamList = {
  FundWallet: undefined;
  Airtime: { reset?: boolean } | undefined;
  AirtimeSummary: { network: any; phone: any; amount: any };
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

const AirtimeSummary: FunctionComponent<AirtimeSummaryProps> = ({ navigation }) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  // Discount feature currently disabled
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [pinError, setPinError] = useState<string | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, "AirtimeSummary">>();
  const { user, setUser } = useUser();

  let { network, phone, amount } = route.params ?? {};

  // Validation schema
  const validationSchema = yup.object().shape({
    balance: yup.number()
      .min(amount || 0, `Insufficient balance. You need at least ₦${amount} to complete this transaction. Tap here to fund your wallet.`)
      .required('Balance is required'),
  });

  // Validate balance
  const validateBalance = useCallback(async (currentBalance: number) => {
    try {
      await validationSchema.validate({ balance: currentBalance }, { abortEarly: false });
      setValidationErrors({});
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {};
      err.inner.forEach((error: any) => {
        errorMessages[error.path] = error.message;
      });
      setValidationErrors(errorMessages);
    }
  }, [validationSchema]);

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

  // Validate balance whenever user data or amount changes
  useEffect(() => {
    if (user && !loadingUser) {
      const currentBalance = Number(user?.data?.balance?.$numberDecimal || 0);
      validateBalance(currentBalance);
    }
  }, [user, amount, loadingUser, validateBalance]);

  const handlePurchase = async (pin: string) => {
    setLoading(true);
    setPinError(null); // Clear any previous PIN errors

    const result = await utility.buyAirtime(phone, Number(amount), pin, network);
    const responseData = result.data as Response;

    if (!result.ok) {
      setLoading(false);

      // Check if it's a PIN-related error
      const errorMessage = responseData?.message || responseData?.data?.finalStatus || "Transaction failed";
      if (errorMessage.toLowerCase().includes("pin") ||
          errorMessage.toLowerCase().includes("incorrect") ||
          errorMessage.toLowerCase().includes("invalid")) {
        setPinError("Invalid PIN. Please check and try again.");
        // Don't close the PIN modal, let user retry
        return;
      } else {
        setResponseMessage(errorMessage);
        showModal("failed");
      }
      return;
    }

    setLoading(false);
    setResponseMessage(responseData.message || "");
    hideModal(); // Close PIN modal first
    showModal("success");
  };

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const getFinalPrice = (amount: number) => amount; // No discount logic currently

  return (
    <Screen backgroundColor={Colors.app.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color={Colors.app.dark} size={22} />
        </TouchableOpacity>
        <AppText style={styles.title}>Airtime Summary</AppText>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Amount */}
        <AppText style={styles.amount}>₦{amount}</AppText>
        <AppText style={styles.subLabel}>{phone}</AppText>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <AppText style={styles.label}>Airtime Amount</AppText>
            <AppText style={styles.value}>₦{getFinalPrice(amount)}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Type</AppText>
            <AppText style={styles.value}>VTU</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Provider</AppText>
            <AppText style={styles.value}>{network}</AppText>
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
            {validationErrors.balance && (
              <AppText style={styles.errorText}>
                {validationErrors.balance}
              </AppText>
            )}
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
                : (loading || !!validationErrors.balance) 
                  ? Colors.app.disabled 
                  : Colors.app.primary 
            },
          ]}
          title="Pay"
          titleStyle={styles.payText}
          disabled={loading || !!validationErrors.balance}
          loading={loading}
          loadingAnimation={<ActivityIndicator size="small" color={Colors.app.white} />}
          onPress={() => showModal("pin")}
        />
      </View>

      {/* Modals */}
      {modalVisible && currentModal === "pin" && (
        <Pin
          isVisible={modalVisible}
          onClose={hideModal}
          onSubmitPin={handlePurchase}
          errorMessage={pinError}
        />
      )}
      {modalVisible && currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={hideModal}
          onBack={() => {
            hideModal();
            // Reset navigation stack so returning does not go back to summary
            navigation.reset({
              index: 0,
              routes: [
                { name: "Airtime", params: { reset: true } as any },
              ],
            });
          }}
          responseText={responseMessage || "Airtime purchase successful"}
        />
      )}
      {modalVisible && currentModal === "failed" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Airtime purchase failed"}
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
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  content: {
    paddingHorizontal: 20,
    gap: 24,
    alignItems: "center",
  },
  amount: {
    fontSize: 32,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  subLabel: {
    fontSize: 14,
    color: Colors.app.dark + "70",
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
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
  },
  value: {
    fontSize: 14,
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
    fontFamily: "DMSans-Bold",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AirtimeSummary;
