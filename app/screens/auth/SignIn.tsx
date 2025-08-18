import authApi from "@/app/api/auth";
import useAuth from "@/app/auth/useAuth";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import ErrorMessage from "@/components/custom/forms/ErrorMessage";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  contact: Yup.string()
    .test(
      "email-or-phone",
      "Enter a valid email or phone number",
      (
        value = "" // Default to an empty string if undefined
      ) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || // Email regex
        /^\d{10,15}$/.test(value) // Phone regex (10-15 digits)
    )
    .required("Email or phone number is required"),
  password: Yup.string().required().min(4).label("Password"),
});

type RootStackParamList = {
  SignIn: undefined;
  ResetPassword: undefined;
  SignUp: undefined;
};

interface SignInProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface AuthResponse {
  message: string;
  data: {
    auth: string;
    verified: boolean;
  };
  success: boolean;
}

const SignIn: FunctionComponent<SignInProps> = ({ navigation }) => {
  const auth = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async ({
    contact,
    password,
  }: {
    contact: string;
    password: string;
  }) => {
    setLoading(true);
    const result = await authApi.login(contact, password);
    const responseData = result.data as AuthResponse;



    if (!result.ok) {
      setErrorMessage("Incorrect Email or Password");
      return setLoading(false);
    }
    setLoading(false);

    auth.logIn(responseData);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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

          <AppText style={styles.skip}>Skip for Now</AppText>
        </View>
        <View style={styles.content}>
          <AppForm
            initialValues={{ contact: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.errorContainer}>
              {errorMessage && (
                <ErrorMessage
                  error={errorMessage}
                  visible={Boolean(errorMessage)}
                />
              )}
            </View>
            <View style={styles.formFields}>
              <View style={styles.field}>
                <AppText style={styles.label}>Phone number</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="contact"
                  placeholder="Email or Phone"
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>Password</AppText>
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
              <TouchableOpacity
                style={styles.resetContainer}
                onPress={() => navigation.navigate(routes.RESET_PASSWORD)}
              >
                <AppText style={styles.forgotPassword}>
                  Forgot Password?
                </AppText>
              </TouchableOpacity>
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
              title="Log In"
              loading={loading}
              disabled={loading}
              loadingAnimation={
                <ActivityIndicator size="small" color={Colors.app.white} />
              }
            />
          </AppForm>
          <View style={styles.bottomContainer}>
            <AppText style={styles.bottomText}>
              Already have an account?
            </AppText>
            <TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(routes.SIGNUP)}
              >
                <AppText style={styles.siginInText}> Register</AppText>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
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
    gap: 36,
    marginTop: 10,
  },
  heading: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  errorContainer: {
    width: "90%",
    marginBottom: -30,
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
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  field: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    height: 66,
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "400",
    color: Colors.app.primary,
    alignSelf: "flex-end",
  },
  resetContainer: {
    alignSelf: "flex-end",
  },
  btn: {
    backgroundColor: Colors.app.primary,
    width: "90%",
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
  content: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "90%",
  },
  bottomText: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "400",
    color: Colors.app.dark,
  },
  siginInText: {
    fontSize: 14,
    color: Colors.app.primary,
    fontFamily: "DM Sans",
    fontWeight: "400",
    lineHeight: 20,
    textDecorationLine: "underline",
  },
});

export default SignIn;
