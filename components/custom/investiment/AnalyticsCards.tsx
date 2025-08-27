import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export interface InvestmentAnalytics {
  totalInvestments: number;
  activeInvestments: number;
  netProfit: number;
  returns: number;
}

interface AnalyticsCardsProps {
  analytics: InvestmentAnalytics | null;
  loading: boolean;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  analytics,
  loading,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.app.primary} />
      </View>
    );
  }

  if (!analytics) return null;

  return (
    <View style={styles.cardsWrapper}>
      <View style={styles.row}>
        <View style={styles.card}>
          <AppText style={styles.label}>Total Investments</AppText>
          <AppText style={styles.value}>{analytics.totalInvestments}</AppText>
        </View>
        <View style={styles.card}>
          <AppText style={styles.label}>Active Investments</AppText>
          <AppText style={styles.value}>{analytics.activeInvestments}</AppText>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.card}>
          <AppText style={styles.label}>Net Profit</AppText>
          <AppText style={styles.value}>{analytics.netProfit}</AppText>
        </View>
        <View style={styles.card}>
          <AppText style={styles.label}>Returns</AppText>
          <AppText style={styles.value}>{analytics.returns}</AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsWrapper: {
    width: "100%",
    marginBottom: 18,
    alignItems: "center",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.app.white,
    borderRadius: 6,
    padding: 18,
    marginBottom: 0,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    color: Colors.app.primary,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "DM Sans",
  },
  value: {
    fontSize: 22,
    color: Colors.app.success,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  loadingContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
});

export default AnalyticsCards;
