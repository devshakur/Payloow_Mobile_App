// import routes from "@/app/navigations/routes";
// import AppText from "@/components/custom/AppText";
// import AppForm from "@/components/custom/forms/AppForm";
// import AppFormField from "@/components/custom/forms/AppFormField";
// import AppFormSelectDropDown from "@/components/custom/forms/AppFormPicker";
// import SubmitButton from "@/components/custom/forms/SubmitButton";
// import GridPicker from "@/components/custom/GridPicker";
// import Screen from "@/components/custom/Screen";
// import SVGComponent from "@/components/custom/SVGComponent";
// import { Colors } from "@/constants/Colors";
// import { getNetworkProvider } from "@/constants/getNetwork";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { FunctionComponent, useState } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import * as Yup from "yup";
// import ninemobile from "../../../../assets/images/custom/svg/9mobile.svg";
// import airtel from "../../../../assets/images/custom/svg/airtel.svg";
// import glo from "../../../../assets/images/custom/svg/glo.svg";
// import mtn from "../../../../assets/images/custom/svg/mtn.svg";

// type RootStackParamList = {
//   AirtimeSummary: {
//     network: any;
//     phone: any;
//     amount: any;
//   };
//   Transactions: undefined;
// };

// interface AirtimeProps {
//   navigation: NativeStackNavigationProp<RootStackParamList>;
// }

// interface Network {
//   title: string;
//   icon: any;
// }

// const validationSchema = Yup.object().shape({
//   amount: Yup.number()
//     .typeError("Amount must be a number")
//     .required("Amount is required")
//     .min(50, "Minimum amount is ₦50")
//     .max(5000, "Maximum amount is ₦5000"),
// });

// const Airtime: FunctionComponent<AirtimeProps> = ({ navigation }) => {
//   const [amount, setAmount] = useState<string | null>("1000");
//   const [matchedNetwork, setMatchedNetwork] = useState<Network | null>(null);

//   const networks = [
//     { label: "MTN", value: "mtn" },
//     { label: "Airtel", value: "airtel" },
//     { label: "Glo", value: "glo" },
//     { label: "9Mobile", value: "9mobile" },
//   ];

//   const recentPhones = [
//     { number: "09033196626", icon: mtn },
//     { number: "09073302001", icon: airtel },
//   ];

//   const handleSubmit = async ({
//     phone,
//     amount,
//     network,
//   }: {
//     phone: string;
//     amount: string;
//     network: string;
//   }) => {
//     if (network === "") {
//       network = matchedNetwork?.title.toLowerCase() || "";
//     }
//     navigation.navigate(routes.AIRTIME_SUMMARY, {
//       network,
//       phone,
//       amount,
//     });
//   };

//   return (
//     <Screen backgroundColor={Colors.app.screen}>
//       <View style={styles.container}>
//         <View style={styles.heading}>
//           <MaterialCommunityIcons
//             name="arrow-left"
//             color={Colors.app.black}
//             size={20}
//           />
//           <AppText style={styles.middleTitle}>Airtime</AppText>

//           <TouchableOpacity
//             onPress={() => navigation.navigate(routes.TRANSACTIONS)}
//           >
//             <AppText style={styles.history}>History</AppText>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.content}>
//           <AppForm
//             initialValues={{
//               phone: "",
//               amount: "",
//               network: matchedNetwork?.title.toLowerCase() || "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             <View style={styles.formFields}>
//               <View style={styles.phoneConatiner}>
//                 <AppText style={[styles.label, { marginLeft: 10 }]}>
//                   Enter Beneficiary Number
//                 </AppText>
//                 <View style={styles.inputAndSelectDropDown}>
//                   <View
//                     style={{
//                       borderWidth: 1,
//                       borderColor: Colors.app.input,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       borderRightWidth: 0,
//                       height: 43.5,
//                       width: "15%",
//                       borderRadius: 0,
//                       borderTopLeftRadius: 5,
//                       borderBottomLeftRadius: 5,
//                       marginBottom: 10,
//                     }}
//                   >
//                     <SVGComponent
//                       SvgFile={
//                         matchedNetwork?.title === "mtn"
//                           ? mtn
//                           : matchedNetwork?.title === "airtel"
//                           ? airtel
//                           : matchedNetwork?.title === "glo"
//                           ? glo
//                           : ninemobile
//                       }
//                     />
//                   </View>
//                   <AppFormSelectDropDown
//                     style={{
//                       width: "10%",
//                       height: 43.5,
//                       borderLeftWidth: 0,
//                       borderRightWidth: 0,
//                       borderRadius: 0,
//                     }}
//                     name="network"
//                     items={networks}
//                     onSelectItem={(value) =>
//                       setMatchedNetwork({
//                         title: value,
//                         icon: "",
//                       })
//                     }
//                   />
//                   <AppFormField
//                     style={styles.input}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     defaultValue="09033196626"
//                     keyboardType="numeric"
//                     name="phone"
//                     placeholder="Phone Number"
//                     textContentType="none"
//                     setVal={(val) => setMatchedNetwork(getNetworkProvider(val))}
//                   />
//                 </View>
//               </View>
//               <View style={styles.amnountConatiner}>
//                 <View style={styles.field}>
//                   <AppText style={[styles.label]}>Enter Amount</AppText>
//                   <AppFormField
//                     style={styles.amountInput}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     keyboardType="numeric"
//                     name="amount"
//                     placeholder="Amount"
//                     textContentType="none"
//                     ousideVal={amount || ""}
//                   />
//                 </View>
//                 <AppText style={[styles.label, { marginLeft: 16 }]}>
//                   Select Amount
//                 </AppText>

//                 <GridPicker
//                   returnValue={(item) => setAmount(item.toString())}
//                   itemStyle={{ width: 58.5 }}
//                   containerStyle={{ gap: 14 }}
//                   amounts={[1000, 2000, 3000, 5000]}
//                 />
//               </View>
//               <SubmitButton
//                 btnContainerStyle={styles.btn}
//                 title="Pay"
//                 titleStyle={styles.btnTitleStyle}
//                 disabled={matchedNetwork === null}
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
//     height: 100,
//     width: "95%",
//     backgroundColor: Colors.app.white,
//     borderRadius: 10,
//     padding: 7,
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
//     width: "70%",
//     marginBottom: 10,
//   },
//   amountInput: {
//     width: "90%",
//   },
//   amnountConatiner: {
//     width: "95%",
//     backgroundColor: Colors.app.white,
//     justifyContent: "center",
//     alignItems: "center",
//     height: 170,
//     gap: 0,
//     borderRadius: 10,
//   },
//   recent: {
//     width: "85%",
//     alignItems: "center",
//     backgroundColor: Colors.app.white,
//     height: 130,
//     borderRadius: 5,
//   },
//   recentTitle: {
//     alignSelf: "flex-start",
//     fontWeight: "900",
//     fontSize: 14,
//     padding: 10,
//   },
//   firstTitleStyle: {
//     fontWeight: "500",
//     fontStyle: "normal",
//     fontSize: 12,
//     fontFamily: "DM Sans",
//     lineHeight: 18,
//     color: Colors.app.white,
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
// });

// export default Airtime;

import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import GridPicker from "@/components/custom/GridPicker";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import ninemobile from "../../../../assets/images/custom/svg/9mobile.svg";
import airtel from "../../../../assets/images/custom/svg/airtel.svg";
import glo from "../../../../assets/images/custom/svg/glo.svg";
import mtn from "../../../../assets/images/custom/svg/mtn.svg";

type RootStackParamList = {
  AirtimeSummary: {
    network: any;
    phone: any;
    amount: any;
  };
  Transactions: undefined;
};

interface AirtimeProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const Airtime: FunctionComponent<AirtimeProps> = ({ navigation }) => {
  const [visible, setVisible] = useState(true); // show modal immediately
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");

  const networks = [
    { title: "MTN", icon: mtn, value: "mtn" },
    { title: "Airtel", icon: airtel, value: "airtel" },
    { title: "Glo", icon: glo, value: "glo" },
    { title: "9Mobile", icon: ninemobile, value: "9mobile" },
  ];

  const hasErrors = (field: string) => {
    if (field === "amount")
      return parseInt(amount) < 50 || parseInt(amount) > 5000;
    if (field === "phone") return phone.length !== 10; // now only last 10 digits matter
    return false;
  };

  const handleSubmit = () => {
    setVisible(false);
    navigation.navigate(routes.AIRTIME_SUMMARY, { phone, amount, network });
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Title
            title="Buy Airtime"
            left={(props) => (
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={Colors.app.dark}
              />
            )}
            titleStyle={styles.title}
          />
          <Card.Content>
            {/* Network Picker */}
            <View style={styles.section}>
              <AppText style={styles.label}>Select Network</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.networkRow}
              >
                {networks.map((item, index) => (
                  <Button
                    key={index}
                    mode={network === item.value ? "contained" : "outlined"}
                    style={styles.networkBtn}
                    onPress={() => setNetwork(item.value)}
                  >
                    <SVGComponent width={28} height={22} SvgFile={item.icon} />
                  </Button>
                ))}
              </ScrollView>
            </View>

            {/* Phone Input */}
            <View style={styles.section}>
              <AppText style={styles.label}>Beneficiary Number</AppText>
              <TextInput
                mode="outlined"
                value={"+234" + phone}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                left={<TextInput.Icon icon="phone" />}
                onChangeText={(text) => {
                  // Strip out "+234" if user tries to delete or edit it
                  let cleaned = text.replace(/^\+234/, "");
                  // Keep only numbers
                  cleaned = cleaned.replace(/\D/g, "");
                  setPhone(cleaned);
                }}
              />
              <HelperText type="error" visible={hasErrors("phone")}>
                Phone number must be 10 digits (after +234)
              </HelperText>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <AppText style={styles.label}>Amount</AppText>
              <TextInput
                mode="outlined"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                left={<TextInput.Icon icon="currency-ngn" />}
              />
              <HelperText type="error" visible={hasErrors("amount")}>
                Amount must be between ₦50 - ₦5000
              </HelperText>
            </View>

            {/* Quick Amount Picker */}

            <AppText style={styles.label}>Quick Pick</AppText>
            <GridPicker
              returnValue={(item) => setAmount(item.toString())}
              itemStyle={{ width: 70, height: 45 }}
              containerStyle={{ gap: 12 }}
              amounts={[100, 200, 500, 1000]}
            />
          </Card.Content>

          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={
                !phone ||
                !amount ||
                !network ||
                hasErrors("phone") ||
                hasErrors("amount")
              }
            >
              Pay
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 16,
  },
  card: {
    borderRadius: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    marginBottom: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.app.dark,
  },
  networkRow: {
    flexDirection: "row",
    gap: 2,
  },
  networkBtn: {
    borderRadius: 5,
    marginRight: 5,
  },
  actions: {
    justifyContent: "flex-end",
    marginTop: 10,
  },
});

export default Airtime;
