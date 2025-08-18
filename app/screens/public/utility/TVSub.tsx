import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import List from "@/components/custom/list/List";
import Screen from "@/components/custom/Screen";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import airtel from "../../../../assets/images/custom/svg/airtel.svg";
import AppFormPicker from "../../../../components/custom/forms/AppFormPicker";
import LoadingModal from "../../../../components/custom/LoadingModal";
import utility from "../../../api/utility";
import mtn from "../.././../../assets/images/custom/svg/mtn.svg";

type RootStackParamList = {
  TVSubSummary: {
    cable: string;
    plan: string;
    smartCardNumber: string;
    customerName: string;
    amount: number;
  };
  Transactions: undefined;
};

interface CablePlan {
  id: number | string;
  name: string;
  amount: number;
}

export interface CableApiData {
  cables: {
    DStv: CablePlan[];
    GOtv: CablePlan[];
    NOVA: CablePlan[];
    Startimes: CablePlan[];
  };
}

// API response type
interface CableApiResponse {
  data: {
    cables: {
      [key: string]: CablePlan[];
    };
  };
}

interface AccountNameResponse {
  message: string;
  data: {
    status: boolean;
    message: string;
    data: {
      account_number: string;
      account_name: string;
      bank_id: number;
    };
  };
  success: true;
}

interface TVSubProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({});

const TVSub: FunctionComponent<TVSubProps> = ({ navigation }) => {
  const [cableNames, setCableNames] = useState<
    { label: string; value: string }[]
  >([]);
  const [cableName, setCableName] = useState<string>("");

  const [selectedCablePlans, setSelectedCablePlans] = useState<
    { label: string; value: string | number }[]
  >([]);

  const [allPlans, setAllPlans] = useState<{ [key: string]: CablePlan[] }[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [accountValid, setAccountValid] = useState<boolean | null>(null); // true | false | null
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const smartCardNumberRef = useRef("");
  const [customerName, setCustomerName] = useState("");

  const recentPhones = [
    { number: "09033196626", icon: mtn },
    { number: "09073302001", icon: airtel },
  ];

  const cleanCableName = (name: string): string => {
    return name.toUpperCase().replace(/S$/, "");
  };

  const getCableAmount = (
    cableType: string,
    planId: string | number
  ): number => {
    // allPlans is an array with one object, so we take the first element
    const plansObject = allPlans[0];
    if (!plansObject) return 0;

    const cablePlans = plansObject[cableType];
    if (!cablePlans) return 0;

    const foundPlan = cablePlans.find((plan) => plan.id === planId);
    return foundPlan?.amount || 0;
  };

  const handleSubmit = async ({
    cable,
    smartCardNumber,
    customerName,
    plan,
  }: {
    cable: string;
    smartCardNumber: string;
    plan: string;
    customerName: string;
  }) => {
    navigation.navigate(routes.TV_SUB_SUMMARY, {
      cable,
      smartCardNumber,
      plan,
      customerName,
      amount: getCableAmount(plan, plan),
    });
  };

  useEffect(() => {
    const fetchCableTitles = async () => {
      setLoading(true);
      try {
        const cableResponse = (await utility.getCables())
          .data as CableApiResponse;

        const cables = cableResponse.data.cables;

        // Transform { DStv: [...], GOtv: [...] } into [{ DStv: [...] }, { GOtv: [...] }]
        const formattedPlans = Object.entries(cables).map(([key, value]) => ({
          [key]: value,
        }));

        setAllPlans(formattedPlans); // Now it's [{DStv: [...]}, {GOtv: [...]}, ...]

        // Dropdown for cable names
        const formattedTitles = Object.keys(cables).map((title) => ({
          label: title,
          value: title,
        }));

        setCableNames(formattedTitles);
      } catch (error) {
     
      } finally {
        setLoading(false);
      }
    };

    fetchCableTitles();
  }, []);

  const getPlansByCableName = (cableName: string) => {
    const found = allPlans.find((planObj) => planObj[cableName]);
    const plans = found ? found[cableName] : [];

    // Return as { label, value }
    return plans.map((plan) => ({
      label: plan.name,
      value: plan.id,
    }));
  };

  const handleCableChange = (cableName: string) => {
    const formattedPlans = getPlansByCableName(cableName);
    setSelectedCablePlans(formattedPlans);
  };

  useEffect(() => {
    if (smartCardNumber.length < 10 || !cableName) {
      setCustomerName("");
      setAccountValid(null);
      return;
    }

    const timer = setTimeout(() => {
      const validate = async () => {
        setLoading(true);
        try {
          const response = await utility.validateCableNumber(
            smartCardNumber,
            cleanCableName(cableName)
          );
          const resData = response.data as AccountNameResponse;

       
          if (response.ok && resData.data.status) {
            setCustomerName(resData.data.data.account_name);
            setAccountValid(true);
          } else {
            setCustomerName(resData.data.message || "Invalid account number");
            setAccountValid(false);
          }
        } catch (err) {
          setCustomerName("Error validating account");
          setAccountValid(false);
        } finally {
          setLoading(false);
        }
      };

      validate();
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [smartCardNumber, cableName]);

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.middleTitle}>Send Money</AppText>

          <TouchableOpacity
            onPress={() => navigation.navigate(routes.TRANSACTIONS)}
          >
            <AppText style={styles.history}>History</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <AppForm
            initialValues={{
              cable: "",
              smartCardNumber: "",
              plan: "",
              customerName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formFields}>
              <View style={styles.detailContainer}>
                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <AppText style={[styles.label]}>Select Cable Name</AppText>
                  <AppFormPicker
                    items={cableNames || []}
                    name="cable"
                    placeholder={{ label: "Select a cablenames", value: null }}
                    pickerStyle={{
                      width: "100%",
                    }}
                    onChange={(value: string, label: string) => {
                      setCableName(value);
                      handleCableChange(value);
                    }}
                  />
                </View>
                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <AppText style={[styles.label, { marginBottom: 5 }]}>
                    Enter Account Number
                  </AppText>

                  <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="phone"
                    keyboardType="numeric"
                    name="smartCardNumber"
                    placeholder="Meter Number"
                    textContentType="none"
                    setVal={(value: string) => {
                      smartCardNumberRef.current = value;
                      setSmartCardNumber(value);
                    }}
                  />

                  <AppText style={[styles.label]}>Select Plans</AppText>
                  <AppFormPicker
                    items={selectedCablePlans || []}
                    name="plan"
                    placeholder={{ label: "Select a cabel plan", value: null }}
                    pickerStyle={{
                      width: "100%",
                    }}
                    onChange={(value: string, label: string) => {
                      setCableName(value);
                    }}
                  />

                  <AppFormField
                    style={{
                      borderWidth: 1,
                      backgroundColor:
                        accountValid === true
                          ? Colors.app.primary
                          : accountValid === false
                          ? Colors.app.failed
                          : Colors.app.white,
                      borderColor: Colors.app.white,
                      width: "100%",
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    name="customerName"
                    placeholder="Customer Name"
                    textContentType="none"
                    ousideVal={customerName || ""}
                    readOnly
                  />
                </View>
              </View>

              <SubmitButton
                btnContainerStyle={[styles.btn]}
                title="Proceed"
                titleStyle={styles.btnTitleStyle}
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
        {/* {isSearchPhoneNumber && (
          <SearchBarModal
            visible={isSearchPhoneNumber}
            onClose={() => setIsSearchPhoneNumber(false)}
          />
        )} */}
        {loading && <LoadingModal visible={loading} />}
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
    height: 80,
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
  },
  amountInput: {
    width: "90%",
  },
  detailContainer: {
    width: "95%",
    backgroundColor: Colors.app.white,
    justifyContent: "center",
    alignItems: "center",
    height: 350,
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
  customerName: {
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 14,
    fontFamily: "DM Sans",
    lineHeight: 20,
    color: Colors.app.primary,
    marginTop: -10,
  },
  amnountConatiner: {
    width: "95%",
    backgroundColor: Colors.app.white,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    gap: 0,
    borderRadius: 10,
  },
});

export default TVSub;
