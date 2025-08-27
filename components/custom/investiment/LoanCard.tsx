// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Business } from "../../../app/screens/investiment/Request";

// interface LoanCardProps {
//   business: Business;
// }

// const LoanCard: React.FC<LoanCardProps> = ({ business }) => {
//   return (
//     <View style={styles.card}>
//       {business.loan && (
//         <View style={styles.loanContainer}>
//           <Text style={styles.loanTitle}>{business.business_name}</Text>
//           <Text style={styles.loanTitle}>Loan Details:</Text>
//           <Text>Amount: ₦{business.loan.loan_amount}</Text>
//           <Text>Collateral: {business.loan.collateral}</Text>
//           <Text>Credit Score: {business.loan.credit_score}</Text>
//           <Text>Status: {business.loan.status}</Text>
//           <Text>Amount Disbursed: ₦{business.loan.amount_disbursed}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 16,
//     marginHorizontal: 12,
//     marginVertical: 8,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   loanContainer: {
//     marginTop: 10,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     padding: 8,
//   },
//   loanTitle: {
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
// });

// export default LoanCard;

import { Colors } from "@/constants/Colors";
import { Wallet } from "iconsax-react-native"; // Make sure you have this installed
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Business } from "../../../app/screens/investiment/Request";
import AppText from "../AppText";

interface LoanCardProps {
  business: Business;
  onAddLoan?: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ business, onAddLoan }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!business.loan) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with icon */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Wallet size={24} color={Colors.app.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <AppText style={styles.title} numberOfLines={1}>
              {business.business_name}
            </AppText>
            <AppText style={styles.subtitle}>Business Loan</AppText>
          </View>
        </View>

        {/* Optional tooltip for description */}
        {showTooltip && (
          <View style={styles.tooltip}>
            <AppText style={styles.tooltipText}>
              {business.business_description}
            </AppText>
          </View>
        )}

        {/* Loan Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <AppText style={styles.label}>Amount</AppText>
            <AppText style={styles.value}>
              ₦{Number(business.loan.loan_amount).toLocaleString() || "0"}
            </AppText>
          </View>

          <View style={styles.detailItem}>
            <AppText style={styles.label}>Collateral</AppText>
            <AppText style={styles.value}>
              {business.loan.collateral || "-"}
            </AppText>
          </View>

          <View style={styles.detailItem}>
            <AppText style={styles.label}>Credit Score</AppText>
            <AppText style={styles.value}>
              {business.loan.credit_score || "-"}
            </AppText>
          </View>

          <View style={styles.detailItem}>
            <AppText style={styles.label}>Status</AppText>
            <AppText
              style={[
                styles.value,
                {
                  color:
                    business.loan.status === "approved"
                      ? Colors.app.success
                      : Colors.app.warning,
                },
              ]}
            >
              {business.loan.status}
            </AppText>
          </View>

          <View style={styles.detailItem}>
            <AppText style={styles.label}>Disbursed</AppText>
            <AppText style={styles.value}>
              ₦{Number(business.loan.amount_disbursed).toLocaleString() || "0"}
            </AppText>
          </View>
        </View>

        {/* Action Button */}
        {/* <TouchableOpacity style={styles.button} onPress={onAddLoan}>
          <AppText style={styles.buttonText}>Add Loan</AppText>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 350,
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    // shadowColor: "#000",
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 4,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconWrapper: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 12,
  },
  title: { fontSize: 16, fontWeight: "700", color: Colors.app.dark },
  subtitle: { fontSize: 12, color: Colors.app.light },
  tooltip: {
    backgroundColor: Colors.app.grayDark,
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  tooltipText: { color: Colors.app.white, fontSize: 12 },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: { width: "48%", marginBottom: 8 }, // ensures spacing
  label: { fontSize: 12, color: Colors.app.light, marginBottom: 2 },
  value: { fontSize: 14, fontWeight: "600", color: Colors.app.dark },
  button: {
    backgroundColor: "#14A6B9",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: Colors.app.white, fontWeight: "700" },
});

export default LoanCard;
