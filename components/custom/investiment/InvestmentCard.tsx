// import React from "react";
// import { Linking, StyleSheet, Text, View } from "react-native";
// import { Investment } from "../../../app/screens/investiment/MyInvestiment";

// const InvestmentCard = ({ investment }: { investment: Investment }) => {
//   const { business } = investment;
//   const paidAmount = investment.repaymentSchedule
//     .filter((repay) => repay.status === "paid")
//     .reduce((sum, r) => sum + parseFloat(r.amount.$numberDecimal), 0);

//   return (
//     <View style={styles.card}>
//       <Text style={styles.title}>{business.business_name}</Text>
//       <Text style={styles.desc}>{business.business_description}</Text>
//       <Text>Stage: {business.business_stage}</Text>
//       <Text>Model: {business.customer_model}</Text>
//       <Text>Industries: {business.industry.join(", ")}</Text>

//       <Text style={styles.sectionTitle}>Investment Details:</Text>
//       <Text>Amount Invested: ₦{investment.amount}</Text>
//       <Text>Status: {investment.status}</Text>
//       <Text>
//         Payment Term: {investment.paymentTerm} {investment.paymentFrequency}
//       </Text>
//       <Text>Expected ROI: {investment.expectedRoi}%</Text>
//       <Text>Paid Amount: ₦{paidAmount}</Text>

//       {business.loan && (
//         <View style={styles.loanContainer}>
//           <Text style={styles.loanTitle}>Loan Details:</Text>
//           <Text>Amount: ₦{business.loan.loan_amount}</Text>
//           <Text>Collateral: {business.loan.collateral}</Text>
//           <Text>Credit Score: {business.loan.credit_score}</Text>
//           <Text>Status: {business.loan.status}</Text>
//           <Text>Amount Disbursed: ₦{business.loan.amount_disbursed}</Text>
//         </View>
//       )}

//       {[
//         ["Website", business.website],
//         ["Twitter", business.twitter_url],
//         ["LinkedIn", business.linkedIn_url],
//         ["Facebook", business.facebook_url],
//         ["YouTube", business.youTube_url],
//         ["Instagram", business.instagram_url],
//         ["TikTok", business.tikTok_url],
//       ].map(
//         ([label, url]) =>
//           url && (
//             <Text
//               key={label}
//               style={styles.link}
//               onPress={() => Linking.openURL(url)}
//             >
//               {label}
//             </Text>
//           )
//       )}

//       {["financial_statements", "growth_plans", "loan_requirements"].map(
//         (field) => {
//           const list = (business as any)[field];
//           if (list?.length > 0) {
//             return (
//               <View key={field} style={styles.fileSection}>
//                 <Text style={styles.fileTitle}>
//                   {field
//                     .replace("_", " ")
//                     .replace(/\b\w/g, (l) => l.toUpperCase())}
//                   :
//                 </Text>
//                 {list.map((url: string, idx: number) => (
//                   <Text
//                     key={idx}
//                     style={styles.link}
//                     onPress={() => Linking.openURL(url)}
//                   >
//                     View File {idx + 1}
//                   </Text>
//                 ))}
//               </View>
//             );
//           }
//           return null;
//         }
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 16,
//     marginVertical: 8,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   desc: {
//     marginVertical: 4,
//   },
//   sectionTitle: {
//     fontWeight: "bold",
//     marginTop: 8,
//     marginBottom: 2,
//     fontSize: 15,
//   },
//   link: {
//     color: "#007bff",
//     marginTop: 8,
//   },
//   loanContainer: {
//     marginTop: 8,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     padding: 8,
//   },
//   loanTitle: {
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   fileSection: {
//     marginTop: 8,
//   },
//   fileTitle: {
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
// });

// export default InvestmentCard;

import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Investment } from "../../../app/screens/investiment/MyInvestiment";

const InvestmentCard = ({ investment }: { investment: Investment }) => {
  const { business } = investment;
  const paidAmount = investment.repaymentSchedule
    .filter((repay) => repay.status === "paid")
    .reduce((sum, r) => sum + parseFloat(r.amount.$numberDecimal), 0);

  return (
    <View style={styles.card}>
      {/* Business Info */}
      <Text style={styles.title}>{business.business_name}</Text>
      <Text style={styles.subtitle}>{business.business_description}</Text>

      <View style={styles.tagContainer}>
        <View style={styles.tag}>
          <Feather name="layers" size={14} color="#444" />
          <Text style={styles.tagText}>{business.business_stage}</Text>
        </View>
        <View style={styles.tag}>
          <Feather name="users" size={14} color="#444" />
          <Text style={styles.tagText}>{business.customer_model}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        <Feather name="briefcase" size={14} color="#666" />{" "}
        {business.industry.join(", ")}
      </Text>

      {/* Investment Details */}
      <Text style={styles.sectionTitle}>Investment Details</Text>
      <View style={styles.detailRow}>
        <FontAwesome5 name="hand-holding-usd" size={14} color="#007bff" />
        <Text style={styles.label}>Amount Invested</Text>
        <Text style={styles.value}>₦{investment.amount}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="verified" size={14} color="#ff9800" />
        <Text style={styles.label}>Status</Text>
        <Text
          style={[
            styles.status,
            investment.status === "active"
              ? styles.statusActive
              : styles.statusInactive,
          ]}
        >
          {investment.status}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Feather name="calendar" size={14} color="#007bff" />
        <Text style={styles.label}>Payment Term</Text>
        <Text style={styles.value}>
          {investment.paymentTerm} {investment.paymentFrequency}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Feather name="trending-up" size={14} color="#ff6b35" />
        <Text style={styles.label}>Expected ROI</Text>
        <Text style={[styles.value, styles.highlight]}>
          {investment.expectedRoi}%
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Feather name="check-circle" size={14} color="#2e7d32" />
        <Text style={styles.label}>Paid Amount</Text>
        <Text style={[styles.value, styles.success]}>₦{paidAmount}</Text>
      </View>

      {/* Loan Section */}
      {business.loan && (
        <View style={styles.loanContainer}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          <View style={styles.detailRow}>
            <FontAwesome5 name="money-bill-wave" size={14} color="#007bff" />
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>₦{business.loan.loan_amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="shield" size={14} color="#6a1b9a" />
            <Text style={styles.label}>Collateral</Text>
            <Text style={styles.value}>{business.loan.collateral}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="star" size={14} color="#ff9800" />
            <Text style={styles.label}>Credit Score</Text>
            <Text style={styles.value}>{business.loan.credit_score}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="alert-circle" size={14} color="#f44336" />
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{business.loan.status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="download" size={14} color="#2e7d32" />
            <Text style={styles.label}>Amount Disbursed</Text>
            <Text style={styles.value}>₦{business.loan.amount_disbursed}</Text>
          </View>
        </View>
      )}

      {/* Social Links */}
      <View style={styles.linksContainer}>
        {[
          ["Website", business.website, "globe"],
          ["Twitter", business.twitter_url, "twitter"],
          ["LinkedIn", business.linkedIn_url, "linkedin"],
          ["Facebook", business.facebook_url, "facebook"],
          ["YouTube", business.youTube_url, "youtube"],
          ["Instagram", business.instagram_url, "instagram"],
          ["TikTok", business.tikTok_url, "music"],
        ].map(
          ([label, url, icon]) =>
            url && (
              <TouchableOpacity
                key={label}
                style={styles.linkBtn}
                onPress={() => Linking.openURL(url)}
              >
                <FontAwesome5
                  name={icon as any}
                  size={12}
                  color="#007bff"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.linkText}>{label}</Text>
              </TouchableOpacity>
            )
        )}
      </View>

      {/* Files */}
      {["financial_statements", "growth_plans", "loan_requirements"].map(
        (field) => {
          const list = (business as any)[field];
          if (list?.length > 0) {
            return (
              <View key={field} style={styles.fileSection}>
                <Text style={styles.sectionTitle}>
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
                {list.map((url: string, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.fileBtn}
                    onPress={() => Linking.openURL(url)}
                  >
                    <Feather name="paperclip" size={12} color="#007bff" />
                    <Text style={styles.fileText}>View File {idx + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }
          return null;
        }
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#222" },
  subtitle: { marginVertical: 6, fontSize: 14, color: "#555" },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 15,
    color: "#333",
  },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 4 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2f7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { fontSize: 12, marginLeft: 4, color: "#444" },
  meta: { fontSize: 13, color: "#666", marginBottom: 6 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: { fontSize: 13, color: "#555", marginLeft: 6, flex: 1 },
  value: { fontSize: 13, fontWeight: "500", color: "#222" },
  highlight: { color: "#ff6b35", fontWeight: "bold" },
  success: { color: "#2e7d32", fontWeight: "bold" },
  status: { fontSize: 13, fontWeight: "600", textTransform: "capitalize" },
  statusActive: { color: "#2e7d32" },
  statusInactive: { color: "#d32f2f" },
  loanContainer: {
    marginTop: 12,
    backgroundColor: "#f9fafc",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  linksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef6ff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  linkText: { fontSize: 12, color: "#007bff", fontWeight: "500" },
  fileSection: { marginTop: 10 },
  fileBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  fileText: { marginLeft: 6, fontSize: 13, color: "#007bff" },
});

export default InvestmentCard;
