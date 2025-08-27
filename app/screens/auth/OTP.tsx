import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import CountdownTimer from "@/components/custom/CountdownTimer";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormOtpInput from "@/components/custom/forms/AppFormOtpInput";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  otp: Yup.string().required().length(6).label("OTP"),
});

type RootStackParamList = {
  SetNewPassword: undefined;
};

interface OTPProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "SetNewPassword">;
}

interface CountdownTimerHandle {
  resetTimer: () => void;
}

const OTP: FunctionComponent<OTPProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const countdownRef = useRef<CountdownTimerHandle>(null);
  const [loading, setLoading] = useState(false);
  const [backgroundLoading, setbackgroundLoading] = useState(false);
  const { setFormValues } = useForm();

  const handleSubmit = ({ otp }: { otp: string }) => {
    setFormValues((prev) => ({ ...prev, ...{ otp } }));
    navigation.navigate(routes.SET_NEW_PASSWORD);
  };

  const handleResendOTP = async () => {};



  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name="arrow-left"
          color={Colors.app.black}
          size={20}
          onPress={() => navigation.goBack()}
        />

        <AppText style={styles.title}>Password Reset Code</AppText>
      </View>

      <AppForm
        initialValues={{ otp: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View style={styles.formContainer}>
          <View style={styles.OTPContainer}>
            <AppText style={styles.OTPLabel}>Enter your reset code</AppText>
            <AppFormOtpInput name="otp" numberOfDigits={6} />
          </View>

          <View style={styles.reserContainer}>
            <View style={styles.leftInnerResetContainer}>
              <AntDesign
                name="questioncircle"
                size={24}
                color={Colors.app.primary}
              />
              <TouchableOpacity onPress={handleResendOTP}>
                <AppText style={styles.leftInnerResetLebel}>
                  Didn’t get the code?
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.rightInnerResetContainer}>
              <CountdownTimer
                ref={countdownRef}
                onExpire={() =>
                  Alert.alert("OTP Expired!", "Request a new OTP.")
                }
              />
            </View>
          </View>
          <SubmitButton
            loading={loading}
            disabled={loading}
            loadingAnimation={
              <ActivityIndicator size="large" color={Colors.app.light} />
            }
            btnContainerStyle={[
              styles.btn,
              {
                backgroundColor: loading
                  ? Colors.app.loading
                  : Colors.app.primary,
              },
            ]}
            titleStyle={styles.btnTitleStyle}
            title="Set OTP"
          />
        </View>
      </AppForm>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  leftInnerResetLebel: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    height: 20,
    fontStyle: "normal",
  },
  rightInnerResetLabel: {
    color: Colors.app.dark,
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
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
  },
  OTPContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    gap: 12,
  },
  container: {
    gap: 30,
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    alignSelf: "center",
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
    gap: 40,
    marginTop: 23,
    width: "100%",
  },
  OTPLabel: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.black,
    alignSelf: "flex-start",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
});

export default OTP;
