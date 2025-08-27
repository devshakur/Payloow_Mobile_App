import AppText from "@/components/custom/AppText"; // ✅ your custom text component
import { Colors } from "@/constants/Colors";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const InvestmentHeader = ({
  onStartInvesting,
}: {
  onStartInvesting: () => void;
}) => {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={require("@/assets/images/create-business.jpg")}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Heading */}
      <AppText style={styles.heading}>Empower New Businesses 🚀</AppText>

      {/* Subtext */}
      <AppText style={styles.subtext}>
        Support innovative startups and growing businesses while earning
        attractive returns on your investments.
      </AppText>

      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaButton} onPress={onStartInvesting}>
        <AppText style={styles.ctaText}>Start Investing</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.primary, // light brand color background
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  illustration: {
    width: "90%",
    height: 160,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: Colors.dark.subText,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default InvestmentHeader;
