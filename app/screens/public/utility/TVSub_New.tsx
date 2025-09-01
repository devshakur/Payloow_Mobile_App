// import routes from "@/app/navigations/routes";
// import AppText from "@/components/custom/AppText";
// import AppForm from "@/components/custom/forms/AppForm";
// import AppFormSelectDropDown from "@/components/custom/forms/AppFormDropDownPickerWithSearch";
// import AppFormField from "@/components/custom/forms/AppFormField";
// import SubmitButton from "@/components/custom/forms/SubmitButton";
// import Screen from "@/components/custom/Screen";
// import { Colors } from "@/constants/Colors";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { FunctionComponent } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import * as Yup from "yup";

// type RootStackParamList = {
//   TVSubSummary: {
//     cable: string;
//     plan: string;
//     smartCardNumber: string;
//     customerName: string;
//     amount: number;
//   };
//   Transactions: undefined;
// };

// interface TVSubProps {
//   navigation: NativeStackNavigationProp<RootStackParamList>;
// }

// const validationSchema = Yup.object().shape({
//   cable: Yup.string().required("Please select a cable provider"),
//   plan: Yup.string().required("Please select a subscription plan"),
//   smartCardNumber: Yup.string()
//     .required("Smart card number is required")
//     .matches(/^[0-9]+$/, "Smart card number must contain only numbers")
//     .min(10, "Smart card number must be at least 10 digits"),
// });

// const TVSub: FunctionComponent<TVSubProps> = ({ navigation }) => {
//   const cableProviders = [
//     { label: "DStv", value: "dstv" },
//     { label: "GOtv", value: "gotv" },
//     { label: "StarTimes", value: "startimes" },
//     { label: "NOVA", value: "nova" },
//   ];

//   const subscriptionPlans = [
//     // DStv Plans
//     { label: "DStv Premium - ₦24,500", value: "dstv-premium", provider: "dstv", amount: 24500 },
//     { label: "DStv Compact Plus - ₦16,600", value: "dstv-compact-plus", provider: "dstv", amount: 16600 },
//     { label: "DStv Compact - ₦10,500", value: "dstv-compact", provider: "dstv", amount: 10500 },
//     { label: "DStv Confam - ₦6,200", value: "dstv-confam", provider: "dstv", amount: 6200 },
//     { label: "DStv Yanga - ₦3,500", value: "dstv-yanga", provider: "dstv", amount: 3500 },
    
//     // GOtv Plans
//     { label: "GOtv Supa Plus - ₦6,400", value: "gotv-supa-plus", provider: "gotv", amount: 6400 },
//     { label: "GOtv Supa - ₦4,850", value: "gotv-supa", provider: "gotv", amount: 4850 },
//     { label: "GOtv Max - ₦3,950", value: "gotv-max", provider: "gotv", amount: 3950 },
//     { label: "GOtv Jolli - ₦2,950", value: "gotv-jolli", provider: "gotv", amount: 2950 },
//     { label: "GOtv Jinja - ₦1,900", value: "gotv-jinja", provider: "gotv", amount: 1900 },
    
//     // StarTimes Plans
//     { label: "StarTimes Nova - ₦1,100", value: "startimes-nova", provider: "startimes", amount: 1100 },
//     { label: "StarTimes Basic - ₦1,850", value: "startimes-basic", provider: "startimes", amount: 1850 },
//     { label: "StarTimes Smart - ₦2,600", value: "startimes-smart", provider: "startimes", amount: 2600 },
//     { label: "StarTimes Classic - ₦3,200", value: "startimes-classic", provider: "startimes", amount: 3200 },
//     { label: "StarTimes Super - ₦5,500", value: "startimes-super", provider: "startimes", amount: 5500 },
//   ];

//   const handleSubmit = ({
//     cable,
//     plan,
//     smartCardNumber,
//   }: {
//     cable: string;
//     plan: string;
//     smartCardNumber: string;
//   }) => {
//     // Find the selected plan details
//     const selectedPlan = subscriptionPlans.find(p => p.value === plan);
//     const amount = selectedPlan?.amount || 0;
//     const planLabel = selectedPlan?.label || plan;

//     navigation.navigate(routes.TV_SUB_SUMMARY, {
//       cable,
//       plan: planLabel,
//       smartCardNumber,
//       customerName: "John Doe",
//       amount,
//     });
//   };

//   return (
//     <Screen backgroundColor={Colors.app.screen}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <MaterialCommunityIcons
//               name="arrow-left"
//               size={24}
//               color={Colors.app.dark}
//             />
//           </TouchableOpacity>
//           <AppText style={styles.title}>TV Subscription</AppText>
//           <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
//             <AppText style={styles.history}>History</AppText>
//           </TouchableOpacity>
//         </View>

//         <AppForm
//           initialValues={{
//             cable: "",
//             plan: "",
//             smartCardNumber: "",
//           }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           <View style={styles.formContainer}>
//             <View style={styles.section}>
//               <AppText style={styles.label}>Select Cable Provider</AppText>
//               <AppFormSelectDropDown
//                 name="cable"
//                 data={cableProviders}
//                 placeholder="Select Cable Provider"
//               />
//             </View>

//             <View style={styles.section}>
//               <AppText style={styles.label}>Smart Card Number</AppText>
//               <AppFormField
//                 name="smartCardNumber"
//                 placeholder="Enter smart card number"
//                 keyboardType="numeric"
//                 autoCapitalize="none"
//               />
//             </View>

//             <View style={styles.section}>
//               <AppText style={styles.label}>Select Subscription Plan</AppText>
//               <AppFormSelectDropDown
//                 name="plan"
//                 data={subscriptionPlans}
//                 placeholder="Select Subscription Plan"
//               />
//             </View>

//             <SubmitButton
//               title="Continue"
//               btnContainerStyle={styles.submitButton}
//               titleStyle={styles.submitButtonText}
//             />
//           </View>
//         </AppForm>
//       </View>
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.app.dark,
//     textAlign: "center",
//     flex: 1,
//   },
//   history: {
//     color: Colors.app.primary,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   formContainer: {
//     flex: 1,
//     gap: 20,
//   },
//   section: {
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: Colors.app.dark,
//     marginBottom: 8,
//   },
//   submitButton: {
//     backgroundColor: Colors.app.primary,
//     marginTop: 20,
//   },
//   submitButtonText: {
//     color: Colors.app.white,
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default TVSub;
