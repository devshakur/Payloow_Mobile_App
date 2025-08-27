import utility from "@/app/api/utility";
import { useUser } from "@/app/context/UserProvider";
import AppButton from "@/components/custom/AppButton";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import List from "@/components/custom/list/List";
import Pin from "@/components/custom/Pin";
import Screen from "@/components/custom/Screen";
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";
import routes from "../../../navigations/routes";

interface AirtimeSummaryProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
type RootStackParamList = {
  FundWallet: undefined;
  AirtimeSummary: {
    network: any;
    phone: any;
    amount: any;
  };
};

// interface Response {
//   message?: string;
//   success: true;
//   data: {
//     statusCode: 201;
//     message: string;
//     data: any;
//     code: string;
//     status: string;
//     finalStatus: string;
//   };
// }

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

const AirtimeSummary: FunctionComponent<AirtimeSummaryProps> = ({
  navigation,
}) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(10);
  const [addDiscount, setAddDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, "AirtimeSummary">>();
  const { user } = useUser();

  let {
    network,
    phone,
    amount,
  }: {
    network: any;
    phone: any;
    amount: any;
  } = route.params ?? {};

  const handlePurchase = async (pin: string) => {
    setLoading(true); // START loading

    const result = await utility.buyAirtime(
      phone,
      Number(amount),
      pin,
      network
    );
    const responseData = result.data as Response;

    if (!result.ok) {
      setLoading(false); // STOP loading before showing error
      setResponseMessage(responseData.data.finalStatus);
      return showModal("failed");
    }

    setLoading(false);
    setResponseMessage(responseData.message || "");
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

  const getFinalPrice = (amount: number, discount: number) => {
    return addDiscount ? amount - discount : amount;
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.middleTitle}>Airtime Summary</AppText>

          <AppText style={styles.history}>History</AppText>
        </View>

        <View style={styles.contents}>
          <View style={styles.summaryContents}>
            <AppText style={styles.amount}>₦{amount}</AppText>

            <View style={styles.innerConatiner}>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Airtime Amount:</AppText>
                <AppText style={styles.value}>
                  ₦{getFinalPrice(amount, discount)}
                </AppText>
              </View>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Type</AppText>
                <AppText style={styles.value}>VTU</AppText>
              </View>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Service Provide</AppText>
                <AppText style={styles.value}>{network}</AppText>
              </View>
            </View>

            <View style={styles.innerConatiner}>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Discount</AppText>
                <AppText style={styles.value}>₦{discount}</AppText>
              </View>
              <List
                leftLabel="Cash back?"
                rightIcon={
                  <Switch
                    value={addDiscount}
                    onValueChange={setAddDiscount}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                }
                listStyle={{ backgroundColor: "#DBE7FE", padding: 5 }}
              />
            </View>

            <List
              leftIcon={
                <View
                  style={{
                    backgroundColor: "#F1F3F9",
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "100%",
                  }}
                >
                  <MaterialCommunityIcons name="wallet" size={24} />
                </View>
              }
              leftLabel={`Wallet (₦${user?.data.wallet.balance})`}
              rightLabelStyle={{ color: Colors.app.primary }}
              rightIcon={
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={Colors.app.primary}
                  size={24}
                />
              }
              rightLabel="Fund Wallet "
              listStyle={{
                height: 81,
                backgroundColor: Colors.app.white,
                padding: 5,
              }}
              onPress={() => navigation.navigate(routes.FUND_WALLET)}
            />
          </View>
          <AppButton
            btnContainerStyle={[
              styles.btn,
              {
                backgroundColor: loading
                  ? Colors.app.loading
                  : Colors.app.primary,
              },
            ]}
            title="Pay"
            titleStyle={styles.btnTitleStyle}
            disabled={loading}
            loading={loading}
            loadingAnimation={
              <ActivityIndicator size="small" color={Colors.app.white} />
            }
            onPress={() => showModal("pin")}
          />
        </View>
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
          responseText={responseMessage || "Successfully buy Airtime"}
        />
      )}
      {/* Modals */}
      {modalVisible && currentModal === "failed" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Failed to buy Airtime"}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    marginTop: 20,
  },
  heading: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  history: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
    textAlign: "center",
  },
  middleTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 28,
    textAlign: "center",
  },
  amount: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 30,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 38,
    textAlign: "center",
  },
  amountLabel: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
    textAlign: "center",
  },
  innerConatiner: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    height: 110,
    width: "100%",
    backgroundColor: Colors.app.white,
    borderRadius: 10,
  },
  label: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 18,
    textAlign: "center",
  },
  value: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 18,
    textAlign: "center",
  },
  innerConatinerContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
  contents: {
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    gap: 170,
  },
  summaryContents: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default AirtimeSummary;
