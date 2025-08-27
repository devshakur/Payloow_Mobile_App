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
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import AppFormSelectDropDown from "@/components/custom/forms/AppFormPicker";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import GridPicker from "@/components/custom/GridPicker";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number"),
  amount: Yup.number()
    .required("Amount is required")
    .min(50, "Minimum amount is ₦50")
    .max(5000, "Maximum amount is ₦5000"),
  network: Yup.string().required("Please select a network"),
});

const Airtime: FunctionComponent<AirtimeProps> = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState<string>("");

  const networks = [
    { label: "MTN", value: "mtn" },
    { label: "Airtel", value: "airtel" },
    { label: "Glo", value: "glo" },
    { label: "9Mobile", value: "9mobile" },
  ];

  const handleSubmit = ({
    phone,
    amount,
    network,
  }: {
    phone: string;
    amount: string;
    network: string;
  }) => {
    navigation.navigate(routes.AIRTIME_SUMMARY, {
      network,
      phone,
      amount,
    });
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.app.dark}
            />
          </TouchableOpacity>
          <AppText style={styles.title}>Buy Airtime</AppText>
          <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
            <AppText style={styles.history}>History</AppText>
          </TouchableOpacity>
        </View>

        <AppForm
          initialValues={{
            phone: "",
            amount: selectedAmount,
            network: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={styles.formContainer}>
            <View style={styles.section}>
              <AppText style={styles.label}>Select Network</AppText>
              <AppFormSelectDropDown
                name="network"
                items={networks}
              />
            </View>

            <View style={styles.section}>
              <AppText style={styles.label}>Phone Number</AppText>
              <AppFormField
                name="phone"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.section}>
              <AppText style={styles.label}>Amount</AppText>
              <AppFormField
                name="amount"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={selectedAmount}
                onChangeText={setSelectedAmount}
              />
            </View>

            <View style={styles.section}>
              <AppText style={styles.label}>Quick Select</AppText>
              <GridPicker
                returnValue={(amount) => setSelectedAmount(amount.toString())}
                itemStyle={{ width: 70, height: 45 }}
                containerStyle={{ gap: 12 }}
                amounts={[100, 200, 500, 1000, 2000, 5000]}
              />
            </View>

            <SubmitButton
              title="Continue"
              btnContainerStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
          </View>
        </AppForm>
      </View>
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
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.app.dark,
    textAlign: "center",
    flex: 1,
  },
  history: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.app.dark,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Airtime;
