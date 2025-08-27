import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import PasswordValidatorContainer from "@/components/custom/PasswordValidatorContainer";
// Removed Screen wrapper as requested; using a plain View as the root container
import SVGComponent from "@/components/custom/SVGComponent";
import { MaterialIcons } from '@expo/vector-icons';
// Decorative SVG assets (existing in assets/images/custom/svg)
import { Colors } from "@/constants/Colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Checkbox } from "expo-checkbox";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";
import loow from "../../../assets/images/custom/svg/loow.svg";
import pay from "../../../assets/images/custom/svg/pay.svg";

const validationSchema = Yup.object().shape({
  // Local part only (10 digits, e.g. 8031234567)
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Enter 10-digit phone number")
    .label("Phone Number"),
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
  const [passwordValue, setPasswordValue] = useState("");
  // Derive local part from stored full phone (which may already have 234 or leading 0)
  const deriveLocalPart = (raw?: string) => {
    if (!raw) return "";
    let digits = raw.replace(/[^0-9]/g, "");
    if (digits.startsWith("234")) digits = digits.slice(3);
    if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
    return digits.slice(0,10);
  };
  const localPhoneInitial = deriveLocalPart(formValues.phone);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
      {/* Decorative, non-interactive background graphics */}
      <View style={styles.backgroundGraphics} pointerEvents="none">
        <View style={styles.topShapeWrapper}>
          <View style={styles.topShapeBox}>
            <TopShape />
          </View>
        </View>
        <View style={styles.bottomShapeWrapper}>
          <View style={styles.bottomShapeBox}>
            <BottomShape />
          </View>
        </View>

        {/* Minimalist geometric accents */}
        <View style={styles.circleLarge} />
        <View style={styles.circleSmall} />
        <View style={styles.squareLarge} />
        <View style={styles.squareSmall} />
      </View>

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.app.dark} />
        </TouchableOpacity>
      </View>

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
        
          <AppForm
            initialValues={{
              email: formValues.email || "",
              phone: localPhoneInitial,
              password: formValues.password || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const fullPhone = `234${values.phone}`; // normalized stored format
              setFormValues((prev) => ({ ...prev, ...values, phone: fullPhone }));
              navigation.navigate(routes.PROFILE_SETUP);
            }}
          >
            <View style={styles.formFields}>
              <View style={[styles.field, styles.fieldFullWidth]}>
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
              <View style={[styles.field, styles.fieldFullWidth]}>
                <AppText style={styles.label}>Enter your phone Number</AppText>
                <View style={styles.phoneRow}>
                  <View style={styles.phonePrefixBox}>
                    <AppText style={styles.phonePrefixText}>234</AppText>
                  </View>
                  <View style={styles.phoneInputFlex}>
                    <AppFormField
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      name="phone"
                      placeholder="XXXXXXXXXX"
                      textContentType="none"
                      customTransform={(raw: string) => {
                        let digits = raw.replace(/[^0-9]/g, "");
                        if (digits.startsWith("234")) digits = digits.slice(3);
                        if (digits.startsWith("0")) digits = digits.slice(1);
                        if (digits.length > 10) digits = digits.slice(0,10);
                        return digits;
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.field, styles.fieldFullWidth]}>
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
                  setVal={setPasswordValue}
                />
              </View>
              <View style={styles.validatorContainer}>
                {
                  /* compute rules */
                }
                <View style={styles.innerValidatorContainer}>
                  <PasswordValidatorContainer
                    style={{ width: 70, height: 20 }}
                    label="lowercase"
                    active={/[a-z]/.test(passwordValue)}
                  />
                  <PasswordValidatorContainer
                    style={{ width: 60, height: 20 }}
                    label="Number"
                    active={/[0-9]/.test(passwordValue)}
                  />
                  <PasswordValidatorContainer
                    style={{ width: 90, height: 20 }}
                    label="8 characters"
                    active={passwordValue.length >= 8}
                  />
                </View>
                <View style={styles.innerValidatorContainer}>
                  <PasswordValidatorContainer
                    style={{ width: 70, height: 20 }}
                    label="Uppercase"
                    active={/[A-Z]/.test(passwordValue)}
                  />
                  <PasswordValidatorContainer
                    style={{ width: 120, height: 20 }}
                    label=" special character"
                    active={/[^A-Za-z0-9]/.test(passwordValue)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.bottomWrapper}>
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
                      <AppText style={styles.linkText}>Terms of Service </AppText>
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
                    backgroundColor: !isChecked ? Colors.app.loading : Colors.app.primary,
                  },
                ]}
                titleStyle={styles.btnTitleStyle}
                title="Proceed"
                disabled={!isChecked}
              />

              <View style={styles.bottomContainer}>
                <AppText style={styles.bottomText}>Already have an account?</AppText>
                <TouchableOpacity onPress={() => navigation.navigate(routes.SIGNIN)}>
                  <AppText style={styles.siginInText}> Login</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </AppForm>
        </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundGraphics: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 8,
    justifyContent: 'flex-start',
    backgroundColor: Colors.app.white,
  },
  topShapeWrapper: {
    position: 'absolute',
    top: 0,
    right: -80,
    opacity: 0.18,
  },
  bottomShapeWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 300,
    opacity: 0.15,
  },
  topShapeBox: {
    width: 240,
    height: 240,
    transform: [{ rotate: '12deg' }],
  },
  bottomShapeBox: {
    width: 260,
    height: 260,
    transform: [{ rotate: '-8deg' }],
  },
  /* Geometric accents copied from SignIn */
  circleLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DDEEFF',
    top: -60,
    left: -80,
    opacity: 0.36,
  },
  circleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CFE6FF',
    top: 40,
    right: 8,
    opacity: 0.32,
  },
  squareLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    backgroundColor: '#CFEFFF',
    left: -8,
    bottom: -10,
    opacity: 0.48,
    transform: [{ rotate: '12deg' }],
    borderRadius: 16,
  },
  squareSmall: {
    position: 'absolute',
    width: 96,
    height: 96,
    backgroundColor: '#9FD8FF',
    right: -6,
    bottom: 20,
    opacity: 0.44,
    transform: [{ rotate: '22deg' }],
    borderRadius: 12,
  },
  headerBar: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.6,
  },
  IconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginTop: 0,
    marginBottom: 24,
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
  fontSize: 28,
  fontWeight: "700",
  color: Colors.app.black,
  marginBottom: 8,
  },
  subTitle: {
  fontSize: 14,
  color: Colors.app.dark,
  fontFamily: "DM Sans",
  fontWeight: "400",
  lineHeight: 20,
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    gap: 16,
  },
  fieldFullWidth: {
    width: '100%',
    alignItems: 'flex-start',
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
  width: '90%',
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
  height: 70, // align with SignIn input row height
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    gap: 6,
  },
  phonePrefixBox: {
    height: 50,
    minWidth: 64,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.app.input,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.app.white,
  },
  phonePrefixText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: Colors.app.dark,
    textAlignVertical: 'center',
  },
  phoneInputFlex: { flex: 1, height: 50 },
  bottomWrapper: {
    gap: 10,
    width: "100%",
  },
  root: {
    flex: 1,
    backgroundColor: Colors.app.white,
  },
});

export default SignUp;
