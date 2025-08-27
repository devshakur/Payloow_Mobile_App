import { Colors } from "@/constants/Colors";
import { Wallet } from "iconsax-react-native"; // make sure to install iconsax-react-native
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import routes from "../../../app/navigations/routes";
import AppText from "../AppText";

export interface Business {
  _id: string;
  business_name: string;
  business_description: string;
  loan_amount?: number;
  duration?: string;
  isOpen?: boolean;
  repayment?: number;
  business_stage?: string;
  customer_model?: string;
  industry?: string[];
}

// Individual Card
const BusinessCard = ({
  business,
  navigation,
}: {
  business: Business;
  navigation?: any;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <View style={cardStyles.iconWrapper}>
          <Wallet size={24} color={Colors.app.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
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
        <View>
          <AppText style={cardStyles.label}>Amount</AppText>
          <AppText style={cardStyles.value}>
            ₦{business.loan_amount?.toLocaleString() || "0"}
          </AppText>
        </View>
        <View>
          <AppText style={cardStyles.label}>Duration</AppText>
          <AppText style={cardStyles.value}>{business.duration || "-"}</AppText>
        </View>
        <View>
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
        <View>
          <AppText style={cardStyles.label}>Repayment</AppText>
          <AppText style={cardStyles.value}>
            ₦{business.repayment?.toLocaleString() || "0"}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        style={cardStyles.button}
        onPress={() => navigation?.navigate(routes.INVESTMENT)}
      >
        <AppText style={cardStyles.buttonText}>Add Loan</AppText>
      </TouchableOpacity>
    </View>
  );
};

// Wrapper with horizontal scroll
const FeaturedBusiness = ({
  businesses,
  navigation,
}: {
  businesses: Business[];
  navigation?: any;
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={businesses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <BusinessCard business={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default FeaturedBusiness;

// Styles
const cardStyles = StyleSheet.create({
  card: {
    width: 260,
    height: 200,
    marginBottom: 5,
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    padding: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 26,
    // shadowOffset: { width: 0, height: 3 },
    // elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconWrapper: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 12,
  },
  title: { fontSize: 16, fontWeight: "700", color: Colors.app.dark },
  subtitle: { fontSize: 12, color: Colors.app.light },
  infoIcon: { fontSize: 14, color: Colors.app.gray, marginLeft: 8 },
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
  label: { fontSize: 12, color: Colors.app.light, marginBottom: 2 },
  value: { fontSize: 14, fontWeight: "600", color: Colors.app.dark },
  button: {
    backgroundColor: "#14A6B9",
    marginTop: 5,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: Colors.app.white, fontWeight: "700" },
});

const styles = StyleSheet.create({
  container: { width: "100%", paddingVertical: 12 },
});
