import {
  NetworkData,
  useVariation,
} from "@/app/context/VariationPlansProvider";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import {
  default as AppFormPicker,
  default as AppFormSelectDropDown,
} from "@/components/custom/forms/AppFormPicker";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { getNetworkProvider } from "@/constants/getNetwork";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import ninemobile from "../../../../assets/images/custom/svg/9mobile.svg";
import airtel from "../../../../assets/images/custom/svg/airtel.svg";
import glo from "../../../../assets/images/custom/svg/glo.svg";
import mtn from "../../../../assets/images/custom/svg/mtn.svg";

interface OptionType {
  label: string;
  value: string | number;
}

type RootStackParamList = {
  DataSummary: {
    network: any;
    phone: any;
    planId: any;
    price?: any;
    selectedPlanType?: any;
    plans: OptionType[];
    validity: string;
  };
  Transactions: undefined;
};

interface DataProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface Network {
  title: string;
  icon: any;
}

const validationSchema = Yup.object().shape({});

const Data: FunctionComponent<DataProps> = ({ navigation }) => {
  const [matchedNetwork, setMatchedNetwork] = useState<Network | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState(null);

  const { variation } = useVariation();

  const getCategoryOptions = (
    currentNetworkKey: string | undefined
  ): { label: string; value: string }[] => {
    if (!currentNetworkKey) return [];

    const normalizedNetwork = currentNetworkKey.toLowerCase();
    const networkData = Object.entries(variation);

    // Try to match the correct network key (like "MTN", "AIRTEL") from variation object
    const matchedEntry = networkData.find(([key]) =>
      key.toLowerCase().includes(normalizedNetwork)
    );

    if (!matchedEntry) return [];

    const [matchedKey, planCategories] = matchedEntry;

    return Object.keys(planCategories).map((category) => ({
      label: category,
      value: category,
    }));
  };

  const planTypes = getCategoryOptions(matchedNetwork?.title);

  const getPriceByVariationID = (
    variations: typeof variation,
    networkKey: string | undefined,
    variationID: string | number | undefined
  ): { price: string; validity: string } | null => {
    if (!variations || !networkKey || variationID === undefined) return null;

    const matchedKey = Object.keys(variations).find((key) =>
      key.toLowerCase().includes(networkKey.toLowerCase())
    );

    if (!matchedKey) return null;

    const networkPlans = variations[matchedKey];

    for (const category of Object.keys(networkPlans)) {
      const planList = networkPlans[category];

      const found = planList.find(
        (item) => String(item.id) === String(variationID)
      );

      if (found) {
        return {
          price: String(found.amount),
          validity: found.validity,
        };
      }
    }

    return null;
  };

  type OptionType = {
    label: string;
    value: string | number;
  };

  const getFormattedPlansByCategory = (
    variations: NetworkData,
    networkKey: string | undefined,
    planType: string | undefined
  ): OptionType[] => {
    if (!variations || !networkKey || !planType) return [];

    // Match network key (case-insensitive)
    const matchedNetworkKey = Object.keys(variations).find((key) =>
      key.toLowerCase().includes(networkKey.toLowerCase())
    );

    if (!matchedNetworkKey) return [];

    const networkPlans = variations[matchedNetworkKey];

    // Match plan type (case-insensitive)
    const matchedCategoryKey = Object.keys(networkPlans).find((key) =>
      key.toLowerCase().includes(planType.toLowerCase())
    );

    if (!matchedCategoryKey) return [];

    const plans = networkPlans[matchedCategoryKey];

    return plans.map((item) => ({
      label: `${item.size} - ${item.validity}`,
      value: item.id,
    }));
  };

  let plans: OptionType[] = [];

  if (selectedPlanType) {
    plans = getFormattedPlansByCategory(
      variation,
      matchedNetwork?.title,
      selectedPlanType
    );
  }

  const networks = [
    { label: "MTN", value: "mtn" },
    { label: "Airtel", value: "airtel" },
    { label: "Glo", value: "glo" },
    { label: "9Mobile", value: "9mobile" },
  ];

  const recentPhones = [
    { number: "09033196626", icon: mtn },
    { number: "09073302001", icon: airtel },
  ];

  const handleSubmit = async ({
    phone,
    planId,
    network,
  }: {
    phone: string;
    planId: string;
    network: string;
  }) => {
    if (network === "") {
      network = matchedNetwork?.title.toLowerCase() || "";
    }

    const planInfo = getPriceByVariationID(
      variation,
      matchedNetwork?.title,
      planId
    );

    navigation.navigate(routes.DATA_SUMMARY, {
      network,
      phone,
      planId,
      price: planInfo?.price,
      selectedPlanType,
      plans,
      validity: planInfo?.validity || "",
    });
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
          <AppText style={styles.middleTitle}>Data</AppText>

          <TouchableOpacity
            onPress={() => navigation.navigate(routes.TRANSACTIONS)}
          >
            <AppText style={styles.history}>History</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <AppForm
            initialValues={{
              phone: "",
              planId: "",
              network: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formFields}>
              <View style={styles.phoneConatiner}>
                <AppText style={[styles.label, { marginLeft: 10 }]}>
                  Enter Beneficiary Number
                </AppText>
                <View style={styles.inputAndSelectDropDown}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.app.input,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 0,
                      height: 43.5,
                      width: "15%",
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      marginBottom: 10,
                    }}
                  >
                    <SVGComponent
                      SvgFile={
                        matchedNetwork?.title === "mtn"
                          ? mtn
                          : matchedNetwork?.title === "airtel"
                          ? airtel
                          : matchedNetwork?.title === "glo"
                          ? glo
                          : ninemobile
                      }
                    />
                  </View>
                  <AppFormSelectDropDown
                    style={{
                      width: "10%",
                      height: 43.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderRadius: 0,
                    }}
                    name="network"
                    items={networks}
                    onSelectItem={(value) =>
                      setMatchedNetwork({
                        title: value,
                        icon: "",
                      })
                    }
                  />
                  <AppFormField
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    defaultValue="09033196626"
                    keyboardType="numeric"
                    name="phone"
                    placeholder="Phone Number"
                    textContentType="none"
                    setVal={(val) => setMatchedNetwork(getNetworkProvider(val))}
                  />
                </View>
              </View>
              <View style={styles.planContainer}>
                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <AppText style={[styles.label]}>
                    Enter Beneficiary Number
                  </AppText>
                  <AppFormPicker
                    name="planType"
                    items={planTypes}
                    placeholder={{ label: "Select a Plan Type", value: null }}
                    onSelectItem={(value) => setSelectedPlanType(value)}
                    pickerStyle={{
                      width: "100%",
                    }}
                  />
                </View>

                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <AppText style={[styles.label]}>
                    Enter Beneficiary Number
                  </AppText>
                  <AppFormPicker
                    items={plans || []}
                    name="planId"
                    placeholder={{ label: "Select a Plan", value: null }}
                    // onSelectItem={handleSelectPlan}
                    pickerStyle={{
                      width: "100%",
                    }}
                  />
                </View>
              </View>
              <SubmitButton
                btnContainerStyle={[styles.btn]}
                title="Pay"
                titleStyle={styles.btnTitleStyle}
                disabled={matchedNetwork === null}
              />
            </View>
            <View style={styles.recent}>
              {/* <SearchBar onPress={() => setIsSearchPhoneNumber(true)} /> */}

              <AppText style={styles.recentTitle}>Recents</AppText>

              {/* {recentPhones.map((item, index) => (
                <List
                  key={index}
                  leftIcon={
                    <SVGComponent width={24} height={24} SvgFile={item.icon} />
                  }
                  leftLabel={item.number}
                />
              ))} */}
            </View>
          </AppForm>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
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
  phoneConatiner: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: 100,
    width: "95%",
    backgroundColor: Colors.app.white,
    borderRadius: 10,
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 10,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "95%",
    color: Colors.app.white,
    marginBottom: 20,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
  content: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  inputAndSelectDropDown: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  input: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: "65%",
    marginBottom: 10,
  },
  amountInput: {
    width: "90%",
  },
  planContainer: {
    width: "95%",
    backgroundColor: Colors.app.white,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    borderRadius: 10,
  },
  recentTitle: {
    alignSelf: "flex-start",
    fontWeight: "900",
    fontSize: 14,
    padding: 10,
  },
  recent: {
    width: "85%",
    alignItems: "center",
    backgroundColor: Colors.app.white,
    height: 130,
    borderRadius: 5,
  },
  firstTitleStyle: {
    fontWeight: "500",
    fontStyle: "normal",
    fontSize: 12,
    fontFamily: "DM Sans",
    lineHeight: 18,
    color: Colors.app.dark,
  },
  secoundTitleStyle: {
    fontWeight: "500",
    fontStyle: "normal",
    fontSize: 12,
    fontFamily: "DM Sans",
    lineHeight: 18,
    color: Colors.app.dark,
  },
  field: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
});

export default Data;
