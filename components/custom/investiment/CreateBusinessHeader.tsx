import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreateBusinessHeader({
  onAddBusiness,
}: {
  onAddBusiness: () => void;
}) {
  return (
    <View style={styles.headerCard}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Grow Your Portfolio!</Text>
        <Text style={styles.subheading}>
          You have a great start. Add more businesses to expand your impact and
          reach new opportunities.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onAddBusiness}>
          <Text style={styles.buttonText}>Add New Business</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require("@/assets/images/create-business.jpg")} // replace with your illustration
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
