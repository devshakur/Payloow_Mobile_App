// components/custom/profile/BusinessCart.tsx
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../AppText";

interface Business {
  _id: string;
  business_name: string;
  business_description: string;
  industry: string[];
  business_stage: string;
  customer_model: string;
  website?: string;
  twitter_url?: string;
  linkedIn_url?: string;
  facebook_url?: string;
  youTube_url?: string;
  instagram_url?: string;
  tikTok_url?: string;
  financial_statements: string[];
  growth_plans: string[];
  loan_requirements: string[];
  isOpen?: boolean;
  createdAt?: string;
  updatedAt?: string;
  loan?: {
    loan_amount: number;
    collateral: string;
    credit_score: number;
    status: string;
    amount_disbursed: number;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface BusinessCartProps {
  business: Business;
  handleSelect?: (business: Business) => void;
}

const BusinessCart: React.FC<BusinessCartProps> = ({
  business,
  handleSelect,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelect?.(business)}
    >
      <AppText style={styles.title}>{business.business_name}</AppText>
      <AppText numberOfLines={2} style={styles.desc}>
        {business.business_description}
      </AppText>
      <AppText style={styles.stage}>Stage: {business.business_stage}</AppText>
      <AppText style={styles.model}>Model: {business.customer_model}</AppText>
      <AppText numberOfLines={1} style={styles.industry}>
        {business.industry.join(", ")}
      </AppText>
      {business.loan && (
        <AppText style={styles.loan}>
          Loan: ₦{business.loan.loan_amount} | Collateral:{" "}
          {business.loan.collateral} | Credit Score:{" "}
          {business.loan.credit_score} | Status: {business.loan.status}
        </AppText>
      )}
      {business.website && (
        <AppText
          style={styles.link}
          onPress={() => business.website && Linking.openURL(business.website)}
        >
          Website
        </AppText>
      )}
      {business.twitter_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.twitter_url && Linking.openURL(business.twitter_url)
          }
        >
          Twitter
        </AppText>
      )}
      {business.linkedIn_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.linkedIn_url && Linking.openURL(business.linkedIn_url)
          }
        >
          LinkedIn
        </AppText>
      )}
      {business.facebook_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.facebook_url && Linking.openURL(business.facebook_url)
          }
        >
          Facebook
        </AppText>
      )}
      {business.youTube_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.youTube_url && Linking.openURL(business.youTube_url)
          }
        >
          YouTube
        </AppText>
      )}
      {business.instagram_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.instagram_url && Linking.openURL(business.instagram_url)
          }
        >
          Instagram
        </AppText>
      )}
      {business.tikTok_url && (
        <AppText
          style={styles.link}
          onPress={() =>
            business.tikTok_url && Linking.openURL(business.tikTok_url)
          }
        >
          TikTok
        </AppText>
      )}
      {business.financial_statements?.length > 0 && (
        <AppText style={styles.fileTitle}>
          Financial Statements: {business.financial_statements.length}
        </AppText>
      )}
      {business.growth_plans?.length > 0 && (
        <AppText style={styles.fileTitle}>
          Growth Plans: {business.growth_plans.length}
        </AppText>
      )}
      {business.loan_requirements?.length > 0 && (
        <AppText style={styles.fileTitle}>
          Loan Requirements: {business.loan_requirements.length}
        </AppText>
      )}
      <Feather name="chevron-right" size={16} color={Colors.app.black} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 150,
    width: 200,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.app.white,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.dark,
  },
  desc: {
    fontSize: 12,
    color: Colors.app.light,
    marginVertical: 4,
  },
  industry: {
    fontSize: 12,
    color: Colors.app.profile,
  },
  stage: {
    fontSize: 12,
    color: Colors.app.primary,
  },
  model: {
    fontSize: 12,
    color: Colors.app.primary,
  },
  loan: {
    fontSize: 12,
    color: Colors.app.failed,
    marginVertical: 2,
  },
  link: {
    fontSize: 12,
    color: Colors.app.primary,
    textDecorationLine: "underline",
    marginVertical: 2,
  },
  fileTitle: {
    fontSize: 12,
    color: Colors.app.black,
    fontWeight: "bold",
    marginVertical: 2,
  },
});

export default BusinessCart;
