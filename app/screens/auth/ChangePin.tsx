import authApi from "@/app/api/auth"; // make sure this matches your API structure
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormOtpInput from "@/components/custom/forms/AppFormOtpInput";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import LoadingModal from "@/components/custom/LoadingModal";
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import Screen from "../../../components/custom/Screen";

type RootStackParamList = {};

interface ChangePinScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface Response {
  message: string;
  data: {
    profilePicture: string;
  };
  success: boolean;
}

const ChangePin: FunctionComponent<ChangePinScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const validationSchema = Yup.object().shape({
    currentPin: Yup.string()
      .required("Current Pin is required")
      .length(4, "Must be exactly 4 digits"),
    newPin: Yup.string()
      .required("New Pin is required")
      .length(4, "Must be exactly 4 digits"),
  });

  const handleSubmit = async (values: {
    currentPin: string;
    newPin: string;
  }) => {
    setLoading(true);
    const result = await authApi.changePin(values.currentPin, values.newPin);
    const responseData = result.data as Response;

    if (!result.ok) {
      setLoading(false);
      setResponseMessage(
        responseData?.message || responseData?.message || "Failed to change pin"
      );
      return setIsError(true);
    }

    setResponseMessage(responseData?.message || "Pin changed successfully");
    setLoading(false);
    setModalVisible(true);
  };

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={25}
            onPress={() => navigation.goBack()}
          />
        </View>

        <AppForm
          initialValues={{ currentPin: "", newPin: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={styles.formContainer}>
            <View style={styles.CODEContainer}>
              <AppText style={styles.CODELabel}>Enter Current Pin</AppText>
              <AppFormOtpInput name="currentPin" numberOfDigits={4} />

              <AppText style={styles.CODELabel}>Enter New Pin</AppText>
              <AppFormOtpInput name="newPin" numberOfDigits={4} />
            </View>

            <SubmitButton
              title="Change Pin"
              btnContainerStyle={styles.btn}
              titleStyle={styles.titleStyle}
            />
          </View>
        </AppForm>

        {isError && (
          <ErrorModal
            visible={isError}
            onClose={() => setIsError(false)}
            responseText={responseMessage || "Failed"}
          />
        )}

        {loading && <LoadingModal visible={loading} />}

        <SuccessModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          responseText={responseMessage || "Successfully changed pin"}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },

  skip: {
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
    textAlign: "center",
  },
  formContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
  CODEContainer: {
    width: "70%",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    gap: 20,
  },
  CODELabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.black,
    alignSelf: "center",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "90%",
    color: Colors.app.white,
  },
});

export default ChangePin;
