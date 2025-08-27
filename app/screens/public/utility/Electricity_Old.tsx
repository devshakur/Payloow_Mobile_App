// import routes from "@/app/navigations/routes";
// import AppText from "@/components/custom/AppText";
// import AppForm from "@/components/custom/forms/AppForm";
// import AppFormField from "@/components/custom/forms/AppFormField";
// import SubmitButton from "@/components/custom/forms/SubmitButton";
// import List from "@/components/custom/list/List";
// import Screen from "@/components/custom/Screen";
// import SVGComponent from "@/components/custom/SVGComponent";
// import { Colors } from "@/constants/Colors";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { FunctionComponent, useEffect, useRef, useState } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import * as Yup from "yup";
// import airtel from "../../../../assets/images/custom/svg/airtel.svg";
// import mtn from "../../../../assets/images/custom/svg/mtn.svg";
// import AppFormPicker from "../../../../components/custom/forms/AppFormPicker";
// import LoadingModal from "../../../../components/custom/LoadingModal";
// import utility from "../../../api/utility";

// interface MeterVerificationResponse {
//   success: boolean;
//   message?: string;
//   data: {
//     invalid: boolean;
//     name: string;
//     address: string;
//   };
// }

// type RootStackParamList = {
//   ElectricitySummary: {
//     meterNumber: string;
//     disco: string;
//     amount: string;
//     phone: string;
//     customerName: string;
//     address: string;
//     type: string;
//   };
//   Transactions: undefined;
// };

// interface ElectricityResponse {
//   success: boolean;
//   data: ElectricProvider[];
// }

// interface ElectricProvider {
//   id: number;
//   code: string;
//   name: string;
// }

// interface ElectricProviderOption {
//   label: string;
//   value: string;
// }

// interface ElectricityProps {
//   navigation: NativeStackNavigationProp<RootStackParamList>;
// }

// const validationSchema = Yup.object().shape({
//   meterNumber: Yup.string()
//     .length(11, "Meter number must be 11 digits")
//     .required("Meter number is required"),
//   disco: Yup.string().required("Please select a disco"),
//   amount: Yup.string().required("Amount is required"),
//   phone: Yup.string()
//     .length(11, "Phone number must be 11 digits")
//     .required("Phone number is required"),
//   // customerName: Yup.string().required("Customer name is required"),
//   // address: Yup.string().required("Address is required"),
//   type: Yup.string().required("Meter type is required"),
// });

// const Electricity: FunctionComponent<ElectricityProps> = ({ navigation }) => {
//   const [disco, setDisco] = useState<string | null>("");
//   const [type, setType] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [accountValid, setAccountValid] = useState<boolean | null>(null); // true | false | null
//   const [electricProviders, setElectricProviders] = useState<
//     ElectricProviderOption[]
//   >([]);

//   const [meterNumber, setMeterNumber] = useState("");
//   const meterNumberRef = useRef("");

//   const [customerName, setCustomerName] = useState("");
//   const [address, setAddress] = useState("");

//   const recentPhones = [
//     { number: "09033196626", icon: mtn },
//     { number: "09073302001", icon: airtel },
//   ];

//   const handleSubmit = async ({
//     meterNumber,
//     disco,
//     amount,
//     phone,
//     customerName,
//     address,
//     type,
//   }: {
//     meterNumber: string;
//     disco: string;
//     amount: string;
//     phone: string;
//     customerName: string;
//     address: string;
//     type: string;
//   }) => {
//     navigation.navigate(routes.ELECTRICITY_SUMMARY, {
//       meterNumber,
//       disco,
//       amount,
//       phone,
//       customerName,
//       address,
//       type,
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = (await utility.getDiscos())
//           .data as ElectricityResponse;
//         const rawProviders = response.data as ElectricProvider[];

//         if (Array.isArray(rawProviders)) {
//           const formattedProviders: ElectricProviderOption[] = rawProviders.map(
//             (provider) => ({
//               label: provider.name,
//               value: provider.code, // Use provider.id if needed instead
//             })
//           );
//           setElectricProviders(formattedProviders); // Use your actual state setter
//         }
//       } catch (error) {

//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (meterNumber.length !== 11 || !disco) {
//       setCustomerName("");
//       setAccountValid(null);
//       return;
//     }

//     const timer = setTimeout(() => {
//       const validate = async () => {
//         setLoading(true);
//         try {
//           const response = await utility.validateMeterNumber(
//             meterNumber,
//             disco,
//             type.toUpperCase()
//           );

//           const resData = response.data as MeterVerificationResponse;

//           if (response.ok) {
//             setCustomerName(resData.data.name);
//             setAddress(resData.data.address);
//             setAccountValid(true);
//           } else {
//             setCustomerName(resData.data.name);
//             setAddress(resData.data.address);
//             setAccountValid(false);
//           }
//         } catch (err) {
//           setCustomerName("Error validating meter");
//           setAccountValid(false);
//         } finally {
//           setLoading(false);
//         }
//       };

//       validate();
//     }, 600); // 600ms debounce

//     return () => clearTimeout(timer);
//   }, [meterNumber, disco, type]);

//   const meterTypes = [
//     { label: "PREPAID", value: "Prepaid" },
//     { label: "POSTPAID", value: "Postpaid" },
//   ];

//   return (
//     <Screen backgroundColor={Colors.app.screen}>
//       <View style={styles.container}>
//         <View style={styles.heading}>
//           <MaterialCommunityIcons
//             name="arrow-left"
//             color={Colors.app.black}
//             size={20}
//           />
//           <AppText style={styles.middleTitle}>Pay Electricity Bills</AppText>

//           <TouchableOpacity
//             onPress={() => navigation.navigate(routes.TRANSACTIONS)}
//           >
//             <AppText style={styles.history}>History</AppText>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.content}>
//           <AppForm
//             initialValues={{
//               meterNumber: "",
//               disco: "",
//               amount: "",
//               phone: "",
//               customerName: "",
//               address: "",
//               type: "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             <View style={styles.formFields}>
//               <View style={styles.detailContainer}>
//                 <View
//                   style={{
//                     width: "90%",
//                   }}
//                 >
//                   <AppFormPicker
//                     items={electricProviders || []}
//                     name="disco"
//                     placeholder={{ label: "Select a disconame", value: null }}
//                     pickerStyle={{
//                       width: "100%",
//                     }}
//                     onChange={(value: string, label: string) => {
//                       setDisco(value);
//                     }}
//                   />
//                   <AppFormPicker
//                     items={meterTypes}
//                     name="type"
//                     placeholder={{ label: "Select a meter type", value: null }}
//                     pickerStyle={{
//                       width: "100%",
//                     }}
//                     onChange={(value: string, label: string) => {
//                       setType(value);
//                     }}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     width: "90%",
//                   }}
//                 >
//                   <AppFormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="phone"
//                     keyboardType="numeric"
//                     name="meterNumber"
//                     placeholder="Meter Number"
//                     textContentType="none"
//                     setVal={(value: string) => {
//                       meterNumberRef.current = value;
//                       setMeterNumber(value);
//                     }}
//                   />

//                   <AppFormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     icon="phone"
//                     keyboardType="numeric"
//                     name="phone"
//                     placeholder="Phone Number"
//                     textContentType="none"
//                   />

//                   <AppFormField
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     keyboardType="numeric"
//                     name="amount"
//                     placeholder="Amount"
//                     textContentType="none"
//                   />
//                 </View>

//                 <AppFormField
//                   style={{
//                     borderWidth: 1,
//                     backgroundColor:
//                       accountValid === true
//                         ? Colors.app.primary
//                         : accountValid === false
//                         ? Colors.app.failed
//                         : Colors.app.white,
//                     borderColor: Colors.app.white,
//                     width: "90%",
//                   }}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   keyboardType="numeric"
//                   name="customerName"
//                   placeholder="Customer Number"
//                   textContentType="none"
//                   ousideVal={customerName || ""}
//                   readOnly
//                 />

//                 <AppFormField
//                   style={{
//                     borderWidth: 1,
//                     backgroundColor:
//                       accountValid === true
//                         ? Colors.app.primary
//                         : accountValid === false
//                         ? Colors.app.failed
//                         : Colors.app.white,
//                     borderColor: Colors.app.white,
//                     width: "90%",
//                   }}
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   keyboardType="numeric"
//                   name="address"
//                   placeholder="Address"
//                   textContentType="none"
//                   ousideVal={address || ""}
//                   readOnly
//                 />
//               </View>

//               <SubmitButton
//                 btnContainerStyle={[styles.btn]}
//                 title="Proceed"
//                 titleStyle={styles.btnTitleStyle}
//               />
//             </View>
//             <View style={styles.recent}>
//               {/* <SearchBar onPress={() => setIsSearchPhoneNumber(true)} /> */}

//               <AppText style={styles.recentTitle}>Recents</AppText>

//               {/* {recentPhones.map((item, index) => (
//                 <List
//                   key={index}
//                   leftIcon={
//                     <SVGComponent width={24} height={24} SvgFile={item.icon} />
//                   }
//                   leftLabel={item.number}
//                 />
//               ))} */}
//             </View>
//           </AppForm>
//         </View>
//         {/* {isSearchPhoneNumber && (
//           <SearchBarModal
//             visible={isSearchPhoneNumber}
//             onClose={() => setIsSearchPhoneNumber(false)}
//           />
//         )} */}
//         {loading && <LoadingModal visible={loading} />}
//       </View>
//     </Screen>
//   );
// };

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
//   phoneConatiner: {
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//     height: 80,
//     width: "95%",
//     backgroundColor: Colors.app.white,
//     borderRadius: 10,
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
//   recentTitle: {
//     alignSelf: "flex-start",
//     fontWeight: "900",
//     fontSize: 14,
//     padding: 10,
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
// });

// export default Electricity;

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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import AppFormPicker from "../../../../components/custom/forms/AppFormPicker";
import LoadingModal from "../../../../components/custom/LoadingModal";
import utility from "../../../api/utility";

interface MeterVerificationResponse {
  success: boolean;
  message?: string;
  data: {
    invalid: boolean;
    name: string;
    address: string;
  };
}

type RootStackParamList = {
  ElectricitySummary: {
    meterNumber: string;
    disco: string;
    amount: string;
    phone: string;
    customerName: string;
    address: string;
    type: string;
  };
  Transactions: undefined;
};

interface ElectricityResponse {
  success: boolean;
  data: ElectricProvider[];
}

interface ElectricProvider {
  id: number;
  code: string;
  name: string;
}

interface ElectricProviderOption {
  label: string;
  value: string;
}

interface ElectricityProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({
  meterNumber: Yup.string()
    .length(11, "Meter number must be 11 digits")
    .required("Meter number is required"),
  disco: Yup.string().required("Please select a disco"),
  amount: Yup.string().required("Amount is required"),
  phone: Yup.string()
    .length(11, "Phone number must be 11 digits")
    .required("Phone number is required"),
  type: Yup.string().required("Meter type is required"),
});

const Electricity: FunctionComponent<ElectricityProps> = ({ navigation }) => {
  const [disco, setDisco] = useState<string | null>(null);
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [accountValid, setAccountValid] = useState<boolean | null>(null);
  const [electricProviders, setElectricProviders] = useState<
    ElectricProviderOption[]
  >([]);

  const [meterNumber, setMeterNumber] = useState("");
  const meterNumberRef = useRef("");

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async ({
    meterNumber,
    disco,
    amount,
    phone,
    customerName,
    address,
    type,
  }: {
    meterNumber: string;
    disco: string;
    amount: string;
    phone: string;
    customerName: string;
    address: string;
    type: string;
  }) => {
    navigation.navigate(routes.ELECTRICITY_SUMMARY, {
      meterNumber,
      disco,
      amount,
      phone,
      customerName,
      address,
      type,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = (await utility.getDiscos())
          .data as ElectricityResponse;
        if (Array.isArray(response.data)) {
          const formatted = response.data.map((p) => ({
            label: p.name,
            value: p.code,
          }));
          setElectricProviders(formatted);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (meterNumber.length !== 11 || !disco) {
      setCustomerName("");
      setAccountValid(null);
      return;
    }

    const timer = setTimeout(() => {
      const validate = async () => {
        setLoading(true);
        try {
          const response = await utility.validateMeterNumber(
            meterNumber,
            disco,
            type.toUpperCase()
          );

          const resData = response.data as MeterVerificationResponse;

          if (response.ok) {
            setCustomerName(resData.data.name);
            setAddress(resData.data.address);
            setAccountValid(true);
          } else {
            setCustomerName(resData.data.name);
            setAddress(resData.data.address);
            setAccountValid(false);
          }
        } catch {
          setCustomerName("Error validating meter");
          setAccountValid(false);
        } finally {
          setLoading(false);
        }
      };

      validate();
    }, 600);

    return () => clearTimeout(timer);
  }, [meterNumber, disco, type]);

  const meterTypes = [
    { label: "PREPAID", value: "Prepaid" },
    { label: "POSTPAID", value: "Postpaid" },
  ];

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
          />
          <AppText style={styles.middleTitle}>Pay Electricity Bills</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate(routes.TRANSACTIONS)}
          >
            <AppText style={styles.history}>History</AppText>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.content}>
          <AppForm
            initialValues={{
              meterNumber: "",
              disco: "",
              amount: "",
              phone: "",
              customerName: "",
              address: "",
              type: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formFields}>
              {/* Picker & Inputs */}
              <View style={styles.detailContainer}>
                <AppFormPicker
                  items={electricProviders}
                  name="disco"
                  placeholder={{ label: "Select a disco", value: null }}
                  pickerStyle={styles.fullWidth}
                  onChange={(val) => setDisco(val)}
                />
                <AppFormPicker
                  items={meterTypes}
                  name="type"
                  placeholder={{ label: "Select meter type", value: null }}
                  pickerStyle={styles.fullWidth}
                  onChange={(val) => setType(val)}
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  name="meterNumber"
                  placeholder="Meter Number"
                  style={styles.fullWidth}
                  setVal={(val: string) => {
                    meterNumberRef.current = val;
                    setMeterNumber(val);
                  }}
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  name="phone"
                  placeholder="Phone Number"
                  style={styles.fullWidth}
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  name="amount"
                  placeholder="Amount"
                  style={styles.fullWidth}
                />

                {/* Auto-filled fields */}
                <AppFormField
                  style={[
                    styles.fullWidth,
                    styles.validationField,
                    {
                      backgroundColor:
                        accountValid === true
                          ? Colors.app.success
                          : accountValid === false
                          ? Colors.app.failed
                          : Colors.app.white,
                    },
                  ]}
                  name="customerName"
                  placeholder="Customer Name"
                  ousideVal={customerName || ""}
                  readOnly
                />
                <AppFormField
                  style={[
                    styles.fullWidth,
                    styles.validationField,
                    {
                      backgroundColor:
                        accountValid === true
                          ? Colors.app.success
                          : accountValid === false
                          ? Colors.app.failed
                          : Colors.app.white,
                    },
                  ]}
                  name="address"
                  placeholder="Address"
                  ousideVal={address || ""}
                  readOnly
                />
              </View>

              {/* Button */}
              <SubmitButton
                btnContainerStyle={styles.btn}
                title="Proceed"
                titleStyle={styles.btnTitleStyle}
              />
            </View>
          </AppForm>
        </View>

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
  },
  middleTitle: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  formFields: {
    alignItems: "center",
    width: "90%",
    marginTop: 10,
  },
  detailContainer: {
    width: "100%",
    backgroundColor: Colors.app.white,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 10,
  },
  fullWidth: {
    width: "100%",
  },
  validationField: {
    borderWidth: 1,
    borderColor: Colors.app.white,
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    marginTop: 20,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
  },
});

export default Electricity;
