import { useUser } from "@/app/context/UserProvider";
import AppText from "@/components/custom/AppText";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

const UserMainProfile = () => {
  const { user } = useUser();
  const data = user?.data;

  if (!data) return null;

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageWrapper}>
          {data.profilePicture ? (
            <Image
              source={{ uri: data.profilePicture }}
              style={styles.profileImage}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={120}
              color={Colors.app.primary}
            />
          )}
        </View>

        <View style={styles.sectionBox}>
          <AppText style={styles.sectionTitle}>Basic Info</AppText>
          <Detail
            label="Full Name"
            value={`${data.firstName} ${data.lastName}`}
          />
          <Detail label="Email" value={data.email} />
          <Detail label="Phone" value={data.phone || 0} />
          <Detail label="Address" value={data.Address || "Not specified"} />
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionBox}>
          <AppText style={styles.sectionTitle}>Roles</AppText>
          <Detail label="Main Role" value={data.role || "None"} />
          <Detail label="eLearning Role" value={data.elearningRole || "None"} />
          <Detail
            label="Investment Role"
            value={data.investmentRole || "None"}
          />
          <Detail label="EasyBuy Role" value={data.easyBuyRole || "None"} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.detailContainer}>
    <AppText style={styles.label}>{label}</AppText>
    <AppText style={styles.value}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  imageWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.app.primary,
  },
  sectionBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 12,
    textTransform: "capitalize",
  },
  detailContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: Colors.app.gray,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.app.black,
    textTransform: "capitalize",
  },
  separator: {
    height: 20,
  },
});

export default UserMainProfile;
