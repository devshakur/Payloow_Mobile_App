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
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import userDetails from "../../../api/userDetails";
import utility from "../../../api/utility";
import routes from "../../../navigations/routes";

interface TVSubSummaryProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  FundWallet: undefined;
  TVSub: { reset?: boolean };
  TVSubSummary: {
    cable: string;
    smartCardNumber: string;
    plan: string;
    customerName: string;
    amount: number;
  };
};

interface CableTokenResponse {
  message?: string;
  success: boolean;
  data?: {
    statusCode: number;
    message: string;
    data: {
      meter_number: string;
      disco: number;
      amount: number;
      status: string;
      finalStatus: string;
      token: string;
    };
    code: string;
    status: string;
    finalStatus: string;
  };
}

const TVSubSummary: FunctionComponent<TVSubSummaryProps> = ({
  navigation,
}) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [pinError, setPinError] = useState<string | null>(null);
  const route = useRoute<RouteProp<RootStackParamList, "TVSubSummary">>();

  const { cable, smartCardNumber, plan, customerName, amount } = route.params;

  const { user, setUser } = useUser();

  // Validation schema
  const validationSchema = yup.object().shape({
    balance: yup
      .number()
      .min(
        Number(amount) || 0,
        `Insufficient balance. You need at least ₦${amount} to complete this transaction. Tap here to fund your wallet.`
      )
      .required("Balance is required"),
  });

  // Validate balance
  const validateBalance = useCallback(
    async (currentBalance: number) => {
      try {
        await validationSchema.validate(
          { balance: currentBalance },
          { abortEarly: false }
        );
        setValidationErrors({});
      } catch (err: any) {
        const errorMessages: { [key: string]: string } = {};
        err.inner.forEach((error: any) => {
          errorMessages[error.path] = error.message;
        });
        setValidationErrors(errorMessages);
      }
    },
    [validationSchema]
  );

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);

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

    const result = await utility.buyCable(
      cable,
      smartCardNumber,
      plan,
      customerName,
      pin,
      amount
    );

    const responseData = result.data as CableTokenResponse;

    if (!result.ok) {
      setLoading(false);

      // Check if it's a PIN-related error
      const errorMessage =
        responseData?.message ||
        responseData?.data?.finalStatus ||
        "Transaction failed";
      if (
        errorMessage.toLowerCase().includes("pin") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("invalid")
      ) {
        setPinError("Invalid PIN. Please check and try again.");
        // Don't close the PIN modal, let user retry
        return;
      } else {
        // Format error message for better UX
        let userFriendlyError = errorMessage;

        // Handle specific error cases
        if (errorMessage.toLowerCase().includes("insufficient")) {
          userFriendlyError =
            "Insufficient balance. Please fund your wallet and try again.";
        } else if (errorMessage.toLowerCase().includes("network")) {
          userFriendlyError =
            "Network error. Please check your connection and try again.";
        } else if (errorMessage.toLowerCase().includes("timeout")) {
          userFriendlyError = "Request timed out. Please try again.";
        } else if (errorMessage.length > 100) {
          userFriendlyError =
            "Transaction failed. Please try again or contact support.";
        }

        setResponseMessage(userFriendlyError);
        showModal("failed");
      }
      return;
    }

    setLoading(false);
    // Create a user-friendly success message with the token
    const token = responseData.data?.data.token;
    const backendMessage = responseData.message;

    let successMessage = `TV Subscription successful!\n\nAmount: ₦${amount}`;

    // Add backend message if available
    if (backendMessage) {
      successMessage += `\n\n${backendMessage}`;
    }

    // Add token if available
    if (token) {
      successMessage += `\n\nToken: ${token}`;
    }

    setResponseMessage(successMessage);
    hideModal(); // Close PIN modal first
    showModal("success");
  };

  // Show modal
  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  // Hide modal
  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.dark}
            size={22}
          />
        </TouchableOpacity>
        <AppText style={styles.title}>TV Subscription Summary</AppText>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Amount */}
        <AppText style={styles.amount}>₦{amount}</AppText>
        <AppText style={styles.subLabel}>{plan}</AppText>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <AppText style={styles.label}>Subscription Amount</AppText>
            <AppText style={styles.value}>₦{amount}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Smart Card Number</AppText>
            <AppText style={styles.value}>{smartCardNumber}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Provider</AppText>
            <AppText style={styles.value}>{cable}</AppText>
          </View>
          <View style={styles.row}>
            <AppText style={styles.label}>Customer Name</AppText>
            <AppText style={styles.value}>{customerName}</AppText>
          </View>
        </View>

        {/* Wallet Info */}
        <TouchableOpacity
          style={styles.walletRow}
          onPress={() => navigation.navigate(routes.FUND_WALLET)}
        >
          <View style={styles.walletIcon}>
            <MaterialCommunityIcons
              name="wallet"
              size={22}
              color={Colors.app.dark}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.label}>Wallet Balance</AppText>
            <AppText style={styles.value}>
              ₦
              {loadingUser
                ? "..."
                : Number(
                    user?.data?.balance?.$numberDecimal || 0
                  ).toLocaleString()}
            </AppText>
            {validationErrors.balance && (
              <AppText style={styles.errorText}>
                {validationErrors.balance}
              </AppText>
            )}
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={Colors.app.primary}
          />
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
                : loading || !!validationErrors.balance
                ? Colors.app.disabled
                : Colors.app.primary,
            },
          ]}
          title="Pay"
          titleStyle={styles.payText}
          disabled={loading || !!validationErrors.balance}
          loading={loading}
          onPress={() => {
            if (!validationErrors.balance) {
              showModal("pin");
            }
          }}
        />
      </View>

      {modalVisible && currentModal === "pin" && (
        <Pin
          isVisible={modalVisible}
          onClose={() => {
            hideModal();
          }}
          onSubmitPin={(pin) => {
            handlePurchase(pin); // <<< Called here
          }}
          loading={loading}
        />
      )}

      {modalVisible && currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
            navigation.navigate("TVSub", { reset: true });
          }}
          responseText={responseMessage || ""}
        />
      )}

      {modalVisible && currentModal === "failed" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || ""}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  headerPlaceholder: {
    width: 22,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  amount: {
    fontSize: 32,
    fontFamily: "DMSans-Bold",
    color: Colors.app.primary,
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.app.screen,
    paddingBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
  },
  value: {
    fontSize: 14,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    padding: 15,
    width: "100%",
  },
  walletIcon: {
    backgroundColor: "#F1F3F9",
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
  },
  footer: {
    padding: 20,
  },
  payButton: {
    borderRadius: 5,
    height: 50,
  },
  payText: {
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
  errorText: {
    color: Colors.app.failed,
    fontSize: 12,
    marginTop: 4,
  },
});

export default TVSubSummary;
