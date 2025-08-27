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
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
// Decorative SVG assets
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";

// Validation schema
const validationSchema = Yup.object().shape({
  otp: Yup.string().required("OTP is required").length(5, "OTP must be 5 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[a-z]/, "Lowercase letter required")
    .matches(/[A-Z]/, "Uppercase letter required")
    .matches(/\d/, "Number required")
    .matches(/[@$!%*?&]/, "Special character required"),
});

type RootStackParamList = {
  SignIn: undefined;
};

interface SetNewPasswordProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface AuthResponse {
  message: string;
  data: object;
  success: boolean;
}

const passwordRules = [
  { label: '8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'lowercase', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /\d/.test(p) },
  { label: 'special character', test: (p: string) => /[@$!%*?&]/.test(p) },
];

const SetNewPassword: FunctionComponent<SetNewPasswordProps> = ({ navigation }) => {
  const { formValues } = useForm();
  const [password, setPassword] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const insets = useSafeAreaInsets();

  // Enabled when password filled and OTP length is 5
  const enabled = useMemo(() => password.length > 0 && otpVal.length === 5, [password, otpVal]);

  const ruleStatus = useMemo(() => passwordRules.map(r => ({ label: r.label, active: r.test(password) })), [password]);

  const handleSubmit = async ({ otp, password }: { otp: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await authApi.confirmPasswordReset(
        formValues.email || "",
        otp,
        password
      );
      const data = result.data as AuthResponse;
      if (!result.ok) {
        setErrorMessage(data.message || 'Failed to reset password');
      } else {
        setSuccess(true);
      }
    } catch (e: any) {
      setErrorMessage(e?.response?.data?.message || e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={false}
    >
      {/* Background shapes */}
      <View style={styles.backgroundGraphics} pointerEvents="none">
        <View style={styles.topShapeWrapper}><View style={styles.topShapeBox}><TopShape /></View></View>
        <View style={styles.bottomShapeWrapper}><View style={styles.bottomShapeBox}><BottomShape /></View></View>
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

      <View style={styles.headerSection}>
        <AppText style={styles.title}>Set New Password</AppText>
        <AppText style={styles.subtitle}>Enter the 5-digit code sent to your email and create a new password</AppText>
      </View>

      <View style={styles.container}>
        <AppForm
          initialValues={{ otp: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={styles.formFields}>
            <View style={styles.field}>
              <AppText style={styles.label}>OTP Code</AppText>
              <AppFormOtpInput name="otp" numberOfDigits={5} setVal={setOtpVal} />
            </View>

            <View style={styles.field}>
              <AppText style={styles.label}>New Password</AppText>
              <AppFormField
                name="password"
                placeholder="Enter new password"
                secureTextEntry={!passwordVisible}
                icon="lock"
                passwordVisible={passwordVisible}
                togglePasswordVisibility={() => setPasswordVisible(p => !p)}
                setVal={setPassword}
              />
            </View>

            <View style={styles.validatorsWrapper}>
              {ruleStatus.map(r => (
                <PasswordValidatorContainer
                  key={r.label}
                  label={r.label}
                  style={styles.validatorChip}
                  active={r.active}
                />
              ))}
            </View>
          </View>

          <SubmitButton
            btnContainerStyle={[
              styles.btn,
              { backgroundColor: loading ? Colors.app.loading : enabled ? Colors.app.primary : Colors.app.input }
            ]}
            titleStyle={[
              styles.btnTitleStyle,
              { color: enabled ? Colors.app.white : Colors.app.light }
            ]}
            title="Set Password"
            loading={loading}
            disabled={loading || !enabled}
            loadingAnimation={<ActivityIndicator size="small" color={Colors.app.white} />}
          />
        </AppForm>
      </View>

      <ErrorModal
        visible={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        responseText={errorMessage || ''}
      />
      <SuccessModal
        visible={success}
        onClose={() => {
          setSuccess(false);
          navigation.navigate(routes.SIGNIN);
        }}
        responseText="Password updated successfully"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 8,
    justifyContent: 'flex-start',
    backgroundColor: Colors.app.white,
  },
  backgroundGraphics: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  topShapeWrapper: { position: 'absolute', top: 0, right: -80, opacity: 0.18 },
  bottomShapeWrapper: { position: 'absolute', bottom: 0, left: 300, opacity: 0.15 },
  topShapeBox: { width: 240, height: 240, transform: [{ rotate: '12deg' }] },
  bottomShapeBox: { width: 260, height: 260, transform: [{ rotate: '-8deg' }] },
  circleLarge: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#DDEEFF', top: -60, left: -80, opacity: 0.36 },
  circleSmall: { position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: '#CFE6FF', top: 40, right: 8, opacity: 0.32 },
  squareLarge: { position: 'absolute', width: 220, height: 220, backgroundColor: '#CFEFFF', left: -8, bottom: -10, opacity: 0.48, transform: [{ rotate: '12deg' }], borderRadius: 16 },
  squareSmall: { position: 'absolute', width: 96, height: 96, backgroundColor: '#9FD8FF', right: -6, bottom: 20, opacity: 0.44, transform: [{ rotate: '22deg' }], borderRadius: 12 },
  headerBar: { width: '100%', paddingHorizontal: 8, paddingTop: 0, paddingBottom: 16, alignItems: 'flex-start', justifyContent: 'center' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, opacity: 0.6 },
  headerSection: { width: '90%', alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.app.black, marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '400', color: Colors.app.dark, lineHeight: 20 },
  container: { width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', gap: 32 },
  formFields: { justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '90%', gap: 16 },
  field: { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', width: '100%' },
  label: { fontFamily: 'DM Sans', fontSize: 14, fontWeight: '600', height: 20, color: Colors.app.dark, alignSelf: 'flex-start' },
  validatorsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: '100%', marginTop: 4 },
  validatorChip: { paddingHorizontal: 8, height: 28, justifyContent: 'center' },
  btn: { backgroundColor: Colors.app.primary, width: '90%', color: Colors.app.white, marginTop: 8 },
  btnTitleStyle: { fontFamily: 'DM Sans', fontWeight: '400', lineHeight: 20 },
});

export default SetNewPassword;
