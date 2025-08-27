// components/custom/investiment/LoanBusinessCard.tsx
import { Business } from "@/app/screens/investiment/Request";
import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

const LoanBusinessCard = ({ business }: { business: Business }) => {
  const loan = business.loan;

  return (
    <View style={styles.card}>
      {/* Business Info */}
      <AppText style={styles.title}>{business.name}</AppText>
      <AppText style={styles.subtext}>{business.description}</AppText>

      <View style={styles.separator} />

      {/* Loan Info */}
      <AppText style={styles.loanTitle}>Loan Details</AppText>
      <AppText>Amount: ${loan?.amount}</AppText>
      <AppText>Interest: {loan?.interestRate}%</AppText>
      <AppText>Duration: {loan?.duration} months</AppText>
      <AppText>Status: {loan?.status}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
});

export default LoanBusinessCard;
