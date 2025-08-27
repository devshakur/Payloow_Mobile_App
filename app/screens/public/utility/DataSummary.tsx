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
  const [discount, setDiscount] = useState<number>(10);
  const [addDiscount, setAddDiscount] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, "DataSummary">>();
  const { user } = useUser();

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
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.middleTitle}>Data Summary</AppText>
          <AppText style={styles.history}>History</AppText>
        </View>

        <View style={styles.contents}>
          <View style={styles.summaryContents}>
            <AppText numberOfLines={2} style={styles.planTitle}>
              {getPlanByVariationID(plans, planId) ?? "No plan found"}
            </AppText>

            <View style={styles.innerConatiner}>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Data Amount:</AppText>
                <AppText style={styles.value}>
                  ₦
                  {getFinalPrice(
                    variation,
                    network,
                    planId,
                    price,
                    discount,
                    addDiscount
                  )}
                </AppText>
              </View>

              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Service Provide</AppText>
                <AppText style={styles.value}>{network.toUpperCase()}</AppText>
              </View>

              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Plan Types</AppText>
                <AppText style={styles.value}>{selectedPlanType}</AppText>
              </View>
            </View>

            <View style={styles.innerConatiner}>
              <View style={styles.innerConatinerContent}>
                <AppText style={styles.label}>Discount</AppText>
                <AppText style={styles.value}> ₦{discount}</AppText>
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
            disabled={network === null || loading}
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
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 5,
    marginTop: 10,
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
  planTitle: {
    color: Colors.app.success,
    fontFamily: "DM Sans",
    fontSize: 12,
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

export default DataSummary;
