import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import PasswordValidatorContainer from "@/components/custom/PasswordValidatorContainer";
import Screen from "@/components/custom/Screen";
import SVGComponent from "@/components/custom/SVGComponent";
import { Colors } from "@/constants/Colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Checkbox from "expo-checkbox";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import loow from "../../../assets/images/custom/svg/loow.svg";
import pay from "../../../assets/images/custom/svg/pay.svg";

const validationSchema = Yup.object().shape({
  phone: Yup.string().required().label("Phone Number"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string()
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});

type RootStackParamList = {
  SignIn: undefined;
  SignUpVerificationScreen: undefined;
  ProfileSetUp: undefined;
};

interface SignUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "ProfileSetUp">;
}

const SignUp: FunctionComponent<SignUpProps> = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const { formValues, setFormValues } = useForm();

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View style={styles.IconContainer}>
          <SVGComponent
            width={41}
            height={51}
            style={{ marginHorizontal: 5 }}
            SvgFile={pay}
          />
          <SVGComponent
            width={114}
            height={51}
            SvgFile={loow}
            style={{ marginHorizontal: 35 }}
          />
        </View>
        <View style={styles.heading}>
          <AppText style={styles.title}>Get started</AppText>
          <AppText style={styles.subTitle}>
            Create a free account now with payloow
          </AppText>
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
          }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
        >
          <AppForm
            initialValues={{
              email: formValues.email || "",
              phone: formValues.phone || "",
              password: formValues.password || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setFormValues((prev) => ({ ...prev, ...values }));

              navigation.navigate(routes.PROFILE_SETUP);
            }}
          >
            <View style={styles.formFields}>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter your email</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                  placeholder="Email"
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter your phone Number</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="phone"
                  keyboardType="numeric"
                  name="phone"
                  placeholder="Mobile Number"
                  textContentType="none"
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter password</AppText>
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
            </View>

            <View style={styles.bottomWrapper}>
              <View style={styles.checkboxAndBtn}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={setIsChecked}
                    color={isChecked ? Colors.app.primary : undefined}
                    style={styles.checkbox}
                  />
                  <View style={styles.outerCheckBoxLabelContainer}>
                    <View style={styles.innerTopCheckBoxLabelContainer}>
                      <AppText style={styles.agreementText}>
                        I have read and agree to payloow’s
                      </AppText>

                      <TouchableOpacity>
                        <AppText style={styles.linkText}>
                          Terms of Service{" "}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.innerBottomCheckBoxLabelContainer}>
                      <AppText style={styles.agreementText}>and</AppText>
                      <TouchableOpacity>
                        <AppText style={styles.linkText}>Privacy</AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <SubmitButton
                  btnContainerStyle={[
                    styles.btn,
                    {
                      backgroundColor: !isChecked
                        ? Colors.app.loading
                        : Colors.app.primary,
                    },
                  ]}
                  titleStyle={styles.btnTitleStyle}
                  title="Proceed"
                  disabled={!isChecked}
                />
              </View>

              <View style={styles.bottomContainer}>
                <AppText style={styles.bottomText}>
                  Already have an account?
                </AppText>
                <TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate(routes.SIGNIN)}
                  >
                    <AppText style={styles.siginInText}> Login</AppText>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          </AppForm>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  IconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
  },
  checkboxAndBtn: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  heading: {
    alignSelf: "center",
    width: "90%",
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "auto",
    gap: 16,
  },
  title: {
    fontFamily: "DM Sans",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    color: Colors.app.black,
  },
  subTitle: {
    fontSize: 14,
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontWeight: "600",
    lineHeight: 20,
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 16,
  },
  bottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "90%",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  checkboxContainer: {
    width: "90%",
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  outerCheckBoxLabelContainer: {
    flexDirection: "column",
  },
  lowerCheckboxChildContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "regular",
    color: Colors.app.dark,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "medium",
    color: Colors.app.primary,
    marginLeft: 5,
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
  innerTopCheckBoxLabelContainer: {
    flexDirection: "row",
  },
  innerBottomCheckBoxLabelContainer: {
    flexDirection: "row",
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
    height: 64,
  },
  validatorContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  innerValidatorContainer: {
    flexDirection: "row",
    gap: 11,
    alignSelf: "flex-start",
  },
  bottomWrapper: {
    gap: 10,
    width: "100%",
  },
});

export default SignUp;
