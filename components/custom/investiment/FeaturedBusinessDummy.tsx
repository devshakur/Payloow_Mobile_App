import { Colors } from "@/constants/Colors";
import { Wallet } from "iconsax-react-native";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../AppText";

// Dummy Business Data
const dummyBusinesses = Array.from({ length: 10 }).map((_, i) => ({
  _id: `business_${i + 1}`,
  business_name: `Business ${i + 1}`,
  business_description: `This is a description for Business ${
    i + 1
  }. It offers innovative solutions and services.`,
  loan_amount: (i + 1) * 100000,
  duration: `${(i + 1) * 3} months`,
  isOpen: i % 2 === 0,
}));

export interface Business {
  _id: string;
  business_name: string;
  business_description: string;
  loan_amount?: number;
  duration?: string;
  isOpen?: boolean;
}

// Individual Card
const BusinessCard = ({ business }: { business: Business }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <View style={cardStyles.iconWrapper}>
          <Wallet size={24} color={Colors.app.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <AppText style={cardStyles.title} numberOfLines={1}>
            {business.business_name}
          </AppText>
          <AppText style={cardStyles.subtitle}>Business Loan</AppText>
        </View>
      </View>

      {showTooltip && (
        <View style={cardStyles.tooltip}>
          <AppText style={cardStyles.tooltipText}>
            {business.business_description}
          </AppText>
        </View>
      )}

      <View style={cardStyles.detailsGrid}>
        <View style={cardStyles.detailItem}>
          <AppText style={cardStyles.label}>Amount</AppText>
          <AppText style={cardStyles.value}>
            ₦{business.loan_amount?.toLocaleString() || "0"}
          </AppText>
        </View>
        <View style={cardStyles.detailItem}>
          <AppText style={cardStyles.label}>Duration</AppText>
          <AppText style={cardStyles.value}>{business.duration || "-"}</AppText>
        </View>
        <View style={cardStyles.detailItem}>
          <AppText style={cardStyles.label}>Status</AppText>
          <AppText
            style={[
              cardStyles.value,
              {
                color: business.isOpen
                  ? Colors.app.success
                  : Colors.app.warning,
              },
            ]}
          >
            {business.isOpen ? "Open" : "Pending"}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        style={cardStyles.button}
        onPress={() => setShowTooltip(!showTooltip)}
      >
        <AppText style={cardStyles.buttonText}>
          {showTooltip ? "Hide Info" : "Show Info"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

// FeaturedBusiness Component with Dummy Data
const FeaturedBusinessDummy = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyBusinesses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <BusinessCard business={item} />}
      />
    </View>
  );
};

export default FeaturedBusinessDummy;

// Styles
const cardStyles = StyleSheet.create({
  card: {
    width: 260,
    minHeight: 190,
    marginBottom: 8,
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    padding: 16,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconWrapper: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 10,
  },
  title: { fontSize: 16, fontWeight: "700", color: Colors.app.dark },
  subtitle: { fontSize: 12, color: Colors.app.light, marginTop: 2 },
  tooltip: {
    backgroundColor: Colors.app.grayDark,
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  tooltipText: { color: Colors.app.white, fontSize: 12 },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: { flex: 1, marginRight: 10 },
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

const styles = StyleSheet.create({
  container: { width: "100%", paddingVertical: 12 },
});
