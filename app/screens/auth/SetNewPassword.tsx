import authApi from "@/app/api/auth";
import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import AppFormOtpInput from "@/components/custom/forms/AppFormOtpInput";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import PasswordValidatorContainer from "@/components/custom/PasswordValidatorContainer";
import Screen from "@/components/custom/Screen";
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  otp: Yup.string().required().length(6).label("OTP"),
  password: Yup.string().required().min(4).label("Password"),
});

type RootStackParamList = {
  SignIn: undefined;
  ResetPassword: undefined;
};

interface SetNewPasswordProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
}

const SetNewPassword: FunctionComponent<SetNewPasswordProps> = ({
  navigation,
}) => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { formValues } = useForm();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  interface AuthResponse {
    message: string;
    data: object;
    success: boolean;
  }

  const handleSubmit = async ({
    otp,
    password,
  }: {
    otp: string;
    password: string;
  }) => {
    setLoading(true);
    const result = await authApi.confirmPasswordReset(
      formValues.email || "",
      otp,
      password
    );

    const responseData = result.data as AuthResponse;

    if (!result.ok) {
      showModal("failed");
      setResponseMessage(responseData.message);
      setLoading(false);
    } else {
      showModal("success");
      setResponseMessage(responseData.message);
      setLoading(false);
      setTimeout(() => {
        navigation.navigate(routes.SIGNIN);
      }, 2000);
    }
  };

  // Show modal
  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  // Hide modal
  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={Colors.app.black}
            size={20}
            onPress={() => navigation.goBack()}
          />

          <AppText style={styles.title}>Set New Password</AppText>
        </View>
        <View style={styles.content}>
          <AppForm
            initialValues={{ email: "", otp: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formFields}>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter New Password</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                  value={formValues.email}
                  readOnly
                  placeholder="Email"
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.OTPContainer}>
                <AppText style={styles.label}>Enter OTP</AppText>
                <AppFormOtpInput name="otp" numberOfDigits={6} />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter New Password</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="password"
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  textContentType="password"
                  passwordVisible={passwordVisible}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
              </View>
              <View style={styles.validatorContainer}>
                <View style={styles.innerValidatorContainer}>
                  <PasswordValidatorContainer
                    style={{ width: 70, height: 20 }}
                    label="lowercase"
                  />
                  <PasswordValidatorContainer
                    style={{ width: 60, height: 20 }}
                    label="Number"
                  />
                  <PasswordValidatorContainer
                    style={{ width: 90, height: 20 }}
                    label="8 characters"
                  />
                </View>
                <View style={styles.innerValidatorContainer}>
                  <PasswordValidatorContainer
                    style={{ width: 70, height: 20 }}
                    label="Uppercase"
                  />
                  <PasswordValidatorContainer
                    style={{ width: 120, height: 20 }}
                    label=" special character"
                  />
                </View>
              </View>
              <View style={styles.reserContainer}>
                <View style={styles.leftInnerResetContainer}>
                  <AntDesign
                    name="questioncircle"
                    size={24}
                    color={Colors.app.primary}
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate(routes.RESET_PASSWORD)}
                  >
                    <AppText style={styles.leftInnerResetLebel}>
                      Didn’t get the code?
                    </AppText>
                  </TouchableOpacity>
                </View>
                <View style={styles.rightInnerResetContainer}></View>
              </View>
            </View>
            <SubmitButton
              btnContainerStyle={[
                styles.btn,
                {
                  backgroundColor: loading
                    ? Colors.app.loading
                    : Colors.app.primary,
                },
              ]}
              titleStyle={styles.btnTitleStyle}
              title="Submit"
              loading={loading}
              disabled={loading}
              loadingAnimation={
                <ActivityIndicator size="small" color={Colors.app.white} />
              }
            />
          </AppForm>
        </View>
      </View>
      {modalVisible && currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={() => {
            hideModal();
            navigation.navigate(routes.SIGNIN);
          }}
          responseText={responseMessage || "Successfully reset password"}
        />
      )}
      {/* Modals */}
      {modalVisible && currentModal === "failed" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "User with this email not found"}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 36,
  },
  title: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    height: 26,
  },
  heading: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 70,
    marginTop: 23,
    width: "90%",
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  field: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    gap: 5,
  },
  formFields: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "90%",
    color: Colors.app.white,
    marginVertical: 10,
  },
  content: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  validatorContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 6,
  },
  innerValidatorContainer: {
    flexDirection: "row",
    gap: 11,
    alignSelf: "flex-start",
  },
  OTPContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    marginBottom: 10,
  },
  OTPLabel: {
    alignSelf: "flex-start",
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
  leftInnerResetLebel: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    height: 20,
    fontStyle: "normal",
  },
  leftInnerResetContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  rightInnerResetContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  reserContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
});

export default SetNewPassword;
