import AppText from "@/components/custom/AppText";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../../context/UserProvider";

const FundWallet: React.FC = () => {
  const { user } = useUser();

  const accountInfo = {
    bankName: "Wema Bank",
    accountNumber: "1234567890",
    accountName: "Muhammad Bashir Al-Kasim",
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "This is the info to share",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <AppText style={styles.title}>Bank Account Information</AppText>

          <InfoRow
            label="Bank Name"
            value={
              user?.data.verificationDetails?.paystackResponse.dedicated_account
                .bank.name || ""
            }
          />
          <InfoRow
            label="Account Number"
            value={
              user?.data.verificationDetails?.paystackResponse.dedicated_account
                .account_number || ""
            }
          />
          <InfoRow
            label="Account Name"
            value={
              user?.data.verificationDetails?.paystackResponse.dedicated_account
                .account_name || ""
            }
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors.app.primary },
              ]}
              onPress={() => handleCopy("090")}
            >
              <Feather name="copy" size={18} color="white" />
              <AppText style={styles.buttonText}>Copy</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#6C63FF" }]}
              onPress={() => handleShare()}
            >
              <Feather name="share" size={18} color="white" />
              <AppText style={styles.buttonText}>Share</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <AppText style={styles.infoLabel}>{label}</AppText>
    <AppText style={styles.infoValue}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.app.black,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.app.black,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default FundWallet;
