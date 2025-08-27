import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import CountdownTimer from "@/components/custom/CountdownTimer";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormOtpInput from "@/components/custom/forms/AppFormOtpInput";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
// Decorative SVG assets
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";

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
  const countdownRef = useRef<CountdownTimerHandle>(null);
  const [loading, setLoading] = useState(false);
  const [otpVal, setOtpVal] = useState("");
  const { setFormValues } = useForm();
  const insets = useSafeAreaInsets();

  const handleSubmit = async ({ otp }: { otp: string }) => {
    setLoading(true);
    setFormValues((prev) => ({ ...prev, otp }));
    // Simulate brief delay (replace with API if needed)
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(routes.SET_NEW_PASSWORD);
    }, 400);
  };

  const handleResendOTP = async () => {};



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
        <AppText style={styles.title}>Password Reset Code</AppText>
        <AppText style={styles.subtitle}>Enter the 6-digit verification code sent to your email</AppText>
      </View>

      <View style={styles.container}>        
        <AppForm
          initialValues={{ otp: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={styles.formFields}>          
            <View style={styles.field}>            
              <AppText style={styles.label}>Enter your reset code</AppText>
              <AppFormOtpInput name="otp" numberOfDigits={6} setVal={setOtpVal} />
            </View>

            <View style={styles.resendRow}>
              <View style={styles.leftInnerResetContainer}>
                <AntDesign name="questioncircle" size={22} color={Colors.app.primary} />
                <TouchableOpacity onPress={handleResendOTP}>
                  <AppText style={styles.resendText}>Didn’t get the code?</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.rightInnerResetContainer}>
                <CountdownTimer
                  ref={countdownRef}
                  onExpire={() => Alert.alert("OTP Expired!", "Request a new OTP.")}
                />
              </View>
            </View>

            <SubmitButton
              btnContainerStyle={[
                styles.btn,
                { backgroundColor: loading ? Colors.app.loading : otpVal.length === 6 ? Colors.app.primary : Colors.app.input }
              ]}
              titleStyle={[
                styles.btnTitleStyle,
                { color: otpVal.length === 6 ? Colors.app.white : Colors.app.light }
              ]}
              title="Verify Code"
              loading={loading}
              disabled={loading || otpVal.length !== 6}
              loadingAnimation={<ActivityIndicator size="small" color={Colors.app.white} />}
            />
          </View>
        </AppForm>
      </View>
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
  backgroundGraphics: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
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
  formFields: { justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '90%', gap: 20 },
  field: { width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column', gap: 12 },
  label: { fontFamily: 'DM Sans', fontSize: 14, fontWeight: '600', color: Colors.app.dark, alignSelf: 'flex-start' },
  resendRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftInnerResetContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rightInnerResetContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resendText: { fontSize: 14, fontWeight: '400', color: Colors.app.black },
  btn: { backgroundColor: Colors.app.primary, width: '90%', color: Colors.app.white, marginTop: 8 },
  btnTitleStyle: { fontFamily: 'DM Sans', fontWeight: '400', lineHeight: 20 },
});

export default OTP;
