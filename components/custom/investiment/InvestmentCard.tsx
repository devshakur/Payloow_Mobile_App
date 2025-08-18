import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Investment } from "../../../app/screens/investiment/MyInvestiment";

const InvestmentCard = ({ investment }: { investment: Investment }) => {
  const { business } = investment;
  const paidAmount = investment.repaymentSchedule
    .filter((repay) => repay.status === "paid")
    .reduce((sum, r) => sum + parseFloat(r.amount.$numberDecimal), 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{business.business_name}</Text>
      <Text style={styles.desc}>{business.business_description}</Text>
      <Text>Stage: {business.business_stage}</Text>
      <Text>Model: {business.customer_model}</Text>
      <Text>Industries: {business.industry.join(", ")}</Text>

      <Text style={styles.sectionTitle}>Investment Details:</Text>
      <Text>Amount Invested: ₦{investment.amount}</Text>
      <Text>Status: {investment.status}</Text>
      <Text>
        Payment Term: {investment.paymentTerm} {investment.paymentFrequency}
      </Text>
      <Text>Expected ROI: {investment.expectedRoi}%</Text>
      <Text>Paid Amount: ₦{paidAmount}</Text>

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

      {[
        ["Website", business.website],
        ["Twitter", business.twitter_url],
        ["LinkedIn", business.linkedIn_url],
        ["Facebook", business.facebook_url],
        ["YouTube", business.youTube_url],
        ["Instagram", business.instagram_url],
        ["TikTok", business.tikTok_url],
      ].map(
        ([label, url]) =>
          url && (
            <Text
              key={label}
              style={styles.link}
              onPress={() => Linking.openURL(url)}
            >
              {label}
            </Text>
          )
      )}

      {["financial_statements", "growth_plans", "loan_requirements"].map(
        (field) => {
          const list = (business as any)[field];
          if (list?.length > 0) {
            return (
              <View key={field} style={styles.fileSection}>
                <Text style={styles.fileTitle}>
                  {field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  :
                </Text>
                {list.map((url: string, idx: number) => (
                  <Text
                    key={idx}
                    style={styles.link}
                    onPress={() => Linking.openURL(url)}
                  >
                    View File {idx + 1}
                  </Text>
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
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    marginVertical: 4,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 2,
    fontSize: 15,
  },
  link: {
    color: "#007bff",
    marginTop: 8,
  },
  loanContainer: {
    marginTop: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  loanTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  fileSection: {
    marginTop: 8,
  },
  fileTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
});

export default InvestmentCard;
