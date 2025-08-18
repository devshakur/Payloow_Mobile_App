import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Business } from "../../../app/screens/investiment/Request";

interface LoanCardProps {
  business: Business;
}

const LoanCard: React.FC<LoanCardProps> = ({ business }) => {
  return (
    <View style={styles.card}>
      {business.loan && (
        <View style={styles.loanContainer}>
          <Text style={styles.loanTitle}>Loan Details:</Text>
          <Text>Amount: ₦{business.loan.loan_amount}</Text>
          <Text>Collateral: {business.loan.collateral}</Text>
          <Text>Credit Score: {business.loan.credit_score}</Text>
          <Text>Status: {business.loan.status}</Text>
          <Text>Amount Disbursed: ₦{business.loan.amount_disbursed}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  loanContainer: {
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  loanTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default LoanCard;
