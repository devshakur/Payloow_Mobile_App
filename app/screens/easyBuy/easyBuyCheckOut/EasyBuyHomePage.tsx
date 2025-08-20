import React from "react";

const EasyBuyHomePage = () => {
	return (
		<></>
	);
};

export default EasyBuyHomePage;

// The following imports are commented out for future use
// import Balance from "@/components/custom/profile/Balance";
// import ModulesToggler from "@/components/custom/profile/ModulesToggler";
// import BillIcon from "@/components/custom/utility/BillIcon";
// import Screen from "@/components/custom/Screen";
// import ServiceContainer from "@/components/custom/utility/ServiceContainer";
// import { Colors } from "@/constants/Colors";
// import { Entypo, Feather, Foundation, MaterialIcons } from "@expo/vector-icons";
// import { ServerContainer } from "@react-navigation/native";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import List from "@/components/custom/list/List";
// import AppText from "@/components/custom/AppText";
// import Balance from "@/components/custom/profile/Balance";
// import ModulesToggler from "@/components/custom/profile/ModulesToggler";
// import BillIcon from "@/components/custom/utility/BillIcon";
// import Screen from "@/components/custom/Screen";
// import ServiceContainer from "@/components/custom/utility/ServiceContainer";
// import { Colors } from "@/constants/Colors";
// import { Entypo, Feather, Foundation, MaterialIcons } from "@expo/vector-icons";
// import { ServerContainer } from "@react-navigation/native";
// import React, { FunctionComponent } from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import List from "@/components/custom/list/List";
// import AppText from "@/components/custom/AppText";

// interface EasyBuyHomePageProps {}

// const EasyBuyHomePage: FunctionComponent<EasyBuyHomePageProps> = () => {
//   return (
//     <Screen backgroundColor={Colors.app.screen}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <ModulesToggler />
//           <View style={styles.headerIcons}>
//             <Feather name="search" size={24} color="black" />
//             <Feather name="shopping-cart" size={24} color="black" />
//             <MaterialIcons name="notifications-none" size={24} color="black" />
//           </View>
//         </View>
//         <Balance />
//         <View style={styles.serviceContainer}>
//           <ServiceContainer
//             iconColor={Colors.app.primary}
//             icon="arrow-up"
//             label="Top Up"
//           />
//           <ServiceContainer
//             style={{ width: "35%", gap: 10 }}
//             icon="bank-transfer-out"
//             label="Withdraw"
//             iconColor="#D257E5"
//           />
//           <ServiceContainer
//             iconColor="#DD6D3E"
//             icon="widgets-outline"
//             label="More"
//           />
//         </View>

//         <View style={styles.utilityContent}>
//           <BillIcon label="Airtime" name="phone" />
//           <BillIcon label="Data" name="wifi" />
//           <BillIcon label="Electrcity" name="electric-bolt" />
//           <BillIcon label="TV Sub" name="television" />
//         </View>

//         <View style={styles.modulesContainer}>
//           <List
//             leftIcon={
//               <View
//                 style={{
//                   backgroundColor: "#EDFDF8",
//                   width: 40,
//                   height: 40,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: 5,
//                 }}
//               >
//                 <Feather name="shopping-cart" size={24} color="black" />
//               </View>
//             }
//             leftTopLabel="Easybuy"
//             leftBottomLabel="Shop on payloow now"
//           />
//           <List
//             leftIcon={
//               <View
//                 style={{
//                   backgroundColor: "#EFF4FF",
//                   width: 40,
//                   height: 40,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: 5,
//                 }}
//               >
//                 <Entypo name="open-book" size={24} color="black" />
//               </View>
//             }
//             leftTopLabel="E-learning"
//             leftBottomLabel="Learn or tutor with us"
//           />
//           <List
//             leftIcon={
//               <View
//                 style={{
//                   backgroundColor: "#FFF4EF",
//                   width: 40,
//                   height: 40,
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: 5,
//                 }}
//               >
//                 <Foundation name="graph-trend" size={24} color="black" />
//               </View>
//             }
//             leftTopLabel="Investment"
//             leftBottomLabel="Islamic investment at your finger hand"
//           />
//         </View>

//         <View style={styles.transactions}>
//           <View style={styles.transactionTitleContainer}>
//             <AppText style={styles.transactionTitle}>For You</AppText>
//             <TouchableOpacity>
//               <AppText style={styles.viewAll}>View all</AppText>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     height: "70%",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 20,
//     marginVertical: 10,

//   },
//   header: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 50,
//     flexDirection: "row",
//     width: "90%",
//   },
//   headerIcons: {
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 10,
//     flexDirection: "row",
//   },
//   serviceContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//     gap: 7,
//     width: "85%",
//   },
//   utilityContent: {
//     backgroundColor: Colors.app.white,
//     width: "90%",
//     height: 86,
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
//   modulesContainer: {
//     width: "90%",
//     height: 150,
//     backgroundColor: Colors.app.white,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//     padding: 10,
//   },
//   viewAll: {
//     color: Colors.app.primary,
//     fontSize: 14,
//     fontWeight: "400",
//     fontStyle: "normal",
//     lineHeight: 20,
//   },
//   transactionTitle: {
//     color: Colors.app.black,
//     fontSize: 18,
//     fontWeight: "500",
//     fontFamily: "DM Sans",
//     lineHeight: 28,
//   },
//   transactionTitleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   transactions: {
//     width: "90%",
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//   },
// });

// export default EasyBuyHomePage;
