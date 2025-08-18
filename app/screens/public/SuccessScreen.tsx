
import { Colors } from "@/constants/Colors";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RoundIcon from "../../../components/custom/RoundIcon";
import AppText from "../../../components/custom/AppText";

// Define the type for route params (optional but helpful for TS)
type SuccessScreenRouteParams = {
  responseText?: string;
};

const SuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<Record<string, SuccessScreenRouteParams>, string>>();
  const responseText = route.params?.responseText || "Success!";

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <RoundIcon
          name="check"
          iconType="ant-design"
          backgroundColor={Colors.app.success}
          iconColor={Colors.app.white}
          size={70}
        />

        <AppText style={styles.title}>Success</AppText>
        <Text style={styles.message}>{responseText}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.app.screen,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.app.light,
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: Colors.app.success,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
