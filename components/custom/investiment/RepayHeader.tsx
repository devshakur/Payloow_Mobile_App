import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RepayHeader({ onAddLoan }: { onAddLoan: () => void }) {
  return (
    <View style={styles.headerCard}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Manage Your Loan Repayments!</Text>
        <Text style={styles.subheading}>
          Select the installments you want to repay and submit your payment to
          keep your loan on track.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onAddLoan}>
          <Text style={styles.buttonText}>Repay Now!</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("@/assets/images/loan-approved.jpg")} // replace with your illustration
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  image: {
    width: 120,
    height: 120,
  },
});
