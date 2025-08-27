import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import airtel from "../../../assets/images/custom/svg/airtel.svg";
import mtn from "../../../assets/images/custom/svg/mtn.svg";
import AppTextInput from "../../../components/custom/AppTextInput";
import AppFormDropDownPickerWithSearch from "../../../components/custom/forms/AppFormDropDownPickerWithSearch";
import GridPicker from "../../../components/custom/GridPicker";
import LoadingModal from "../../../components/custom/LoadingModal";
import payment from "../../api/payment";

type RootStackParamList = {
  WithdrawSummary: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
    amount: string;
    bankName: string;
  };
  Transactions: undefined;
};

export interface BankApiResponse {
  message: string;
  data: {
    status: boolean;
    message: string;
    data: Bank[];
  };
}
export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
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

interface WithdrawProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({});

const Withdraw: FunctionComponent<WithdrawProps> = ({ navigation }) => {
  const [amount, setAmount] = useState<string | null>("1000");
  const [bankCode, setBankCode] = useState<string | null>("1000");
  const [bankName, setBankName] = useState<string | null>("1000");
  const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountValid, setAccountValid] = useState<boolean | null>(null); // true | false | null

  const [accountNumber, setAccountNumber] = useState("");
  const accountNumberRef = useRef("");

  const [accountName, setAccountName] = useState("");

  const recentPhones = [
    { number: "09033196626", icon: mtn },
    { number: "09073302001", icon: airtel },
  ];

  const handleSubmit = async ({
    accountNumber,
    bankCode,
    amount,
  }: {
    accountNumber: string;
    bankCode: string;
    amount: string;
  }) => {
    navigation.navigate(routes.WITHDRAW_SUMMARY, {
      accountNumber,
      bankCode,
      accountName: accountName,
      amount,
      bankName: bankName || "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch banks
        const bankResponse = (await payment.getBankList()).data; // replace with actual function
        const rawBanks = bankResponse as BankApiResponse;

        if (Array.isArray(rawBanks.data.data)) {
          const formattedBanks = rawBanks.data.data.map((bank: Bank) => ({
            label: bank.name,
            value: bank.code,
          }));
          setBanks(formattedBanks);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (accountNumber.length !== 10 || !bankCode) {
      setAccountName("");
      setAccountValid(null);
      return;
    }

    const timer = setTimeout(() => {
      const validate = async () => {
        setLoading(true);
        try {
          const response = await payment.validateAccountNumber(
            accountNumber,
            bankCode
          );
          const resData = response.data as AccountNameResponse;

          if (response.ok && resData.data.status) {
            setAccountName(resData.data.data.account_name);
            setAccountValid(true);
          } else {
            setAccountName(resData.data.message || "Invalid account number");
            setAccountValid(false);
          }
        } catch (err) {
          setAccountName("Error validating account");
          setAccountValid(false);
        } finally {
          setLoading(false);
        }
      };

      validate();
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [accountNumber, bankCode]);

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
              accountNumber: "",
              bankCode: "",
              amount: "",
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
                  <AppText style={[styles.label]}>Select Bank Name</AppText>
                  <AppFormDropDownPickerWithSearch
                    data={banks || []}
                    name="bankCode"
                    placeholder="Select Bank"
                    onChange={(value: string, label: string) => {
                      setBankCode(value);
                      setBankName(label);
                    }}
                  />
                </View>
                <View
                  style={{
                    width: "90%",
                  }}
                >
                  <AppText style={[styles.label]}>Enter Account Number</AppText>

                  <AppFormField
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="phone"
                    keyboardType="numeric"
                    name="accountNumber"
                    placeholder="Account Number"
                    textContentType="none"
                    setVal={(value: string) => {
                      accountNumberRef.current = value;
                      setAccountNumber(value);
                    }}
                  />

                  <AppTextInput
                    value={accountName}
                    editable={false}
                    style={{
                      borderWidth: 1,
                      marginTop: 6,
                      backgroundColor:
                        accountValid === true
                          ? Colors.app.primary
                          : accountValid === false
                          ? Colors.app.failed
                          : Colors.app.white,
                      borderColor: Colors.app.white,
                    }}
                    borderColor={Colors.app.input}
                    placeholder="Account Name"
                    customTextStyle={{
                      color: Colors.app.white,
                    }}
                  />
                </View>
                <View style={styles.field}>
                  <AppText style={[styles.label]}>Enter Amount</AppText>
                  <AppFormField
                    style={styles.amountInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    name="amount"
                    placeholder="Amount"
                    textContentType="none"
                    ousideVal={amount || ""}
                  />
                </View>
                <AppText style={[styles.label, { marginLeft: 16 }]}>
                  Select Amount
                </AppText>

                <GridPicker
                  returnValue={(item) => setAmount(item.toString())}
                  itemStyle={{ width: 58.5 }}
                  containerStyle={{ gap: 14 }}
                  amounts={[1000, 2000, 3000, 5000]}
                />
              </View>

              <TextInput style={styles.custom} placeholder="Custom" />

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

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     width: "100%",
//     alignItems: "center",
//     gap: 20,
//     marginVertical: 10,
//   },
//   heading: {
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//     width: "90%",
//   },
//   history: {
//     color: Colors.app.primary,
//     fontFamily: "DM Sans",
//     fontSize: 14,
//     fontWeight: "400",
//     fontStyle: "normal",
//     lineHeight: 20,
//     textAlign: "center",
//   },
//   middleTitle: {
//     color: Colors.app.black,
//     fontFamily: "DM Sans",
//     fontSize: 16,
//     fontWeight: "600",
//     fontStyle: "normal",
//     lineHeight: 28,
//     textAlign: "center",
//   },

//   label: {
//     fontFamily: "DM Sans",
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.app.dark,
//     alignSelf: "flex-start",
//   },
//   formFields: {
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "column",
//     width: "90%",
//     gap: 10,
//   },
//   btn: {
//     backgroundColor: Colors.app.primary,
//     width: "95%",
//     color: Colors.app.white,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   btnTitleStyle: {
//     fontFamily: "DM Sans",
//     color: Colors.app.white,
//     fontWeight: "400",
//     lineHeight: 20,
//   },
//   content: {
//     width: "100%",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 2,
//   },
//   inputAndSelectDropDown: {
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//     width: "100%",
//   },
//   input: {
//     borderTopLeftRadius: 0,
//     borderBottomLeftRadius: 0,
//     width: "65%",
//   },
//   amountInput: {
//     width: "90%",
//   },
//   detailContainer: {
//     width: "95%",
//     backgroundColor: Colors.app.white,
//     justifyContent: "center",
//     alignItems: "center",
//     height: 420,
//     borderRadius: 10,
//   },
//   recent: {
//     width: "85%",
//     alignItems: "center",
//     backgroundColor: Colors.app.white,
//     height: 130,
//     borderRadius: 5,
//   },
//   firstTitleStyle: {
//     fontWeight: "500",
//     fontStyle: "normal",
//     fontSize: 12,
//     fontFamily: "DM Sans",
//     lineHeight: 18,
//     color: Colors.app.dark,
//   },
//   secoundTitleStyle: {
//     fontWeight: "500",
//     fontStyle: "normal",
//     fontSize: 12,
//     fontFamily: "DM Sans",
//     lineHeight: 18,
//     color: Colors.app.dark,
//   },
//   field: {
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "column",
//   },
//   customerName: {
//     fontWeight: "400",
//     fontStyle: "normal",
//     fontSize: 14,
//     fontFamily: "DM Sans",
//     lineHeight: 20,
//     color: Colors.app.primary,
//     marginTop: -10,
//   },
//   amnountConatiner: {
//     width: "95%",
//     backgroundColor: Colors.app.white,
//     justifyContent: "center",
//     alignItems: "center",
//     height: 150,
//     gap: 0,
//     borderRadius: 10,
//   },
//   recentTitle: {
//     alignSelf: "flex-start",
//     fontWeight: "900",
//     fontSize: 14,
//     padding: 10,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.app.screen,
  },
  custom: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    marginBottom: 16,
  },
  history: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "500",
  },
  middleTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  formFields: {
    width: "95%",
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.app.dark,
    marginBottom: 6,
    marginLeft: 4,
  },

  field: {
    marginBottom: 18,
  },

  amountInput: {
    width: "100%",
  },

  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  detailContainer: {
    width: "100%",
    marginBottom: 20,
  },

  customerName: {
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "DM Sans",
    lineHeight: 20,
    color: Colors.app.primary,
    marginTop: 6,
    marginLeft: 4,
  },

  recent: {
    width: "95%",
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  recentTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
  },
});

export default Withdraw;
