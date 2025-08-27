import authApi from "@/app/api/auth";
import useAuth from "@/app/auth/useAuth";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import ErrorMessage from "@/components/custom/forms/ErrorMessage";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
// Decorative SVG assets (existing in assets/images/custom/svg)
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";

const validationSchema = Yup.object().shape({
  contact: Yup.string()
    .transform((val) => (val ? val.trim() : val))
    .test(
      "email-or-phone",
      "Enter a valid email or phone number",
      (value = "") => {
        const cleaned = value.replace(/\s+/g, "");
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ||
          /^\+?\d{10,15}$/.test(cleaned)
        );
      }
    )
    .required("Email or phone number is required"),
  password: Yup.string().required("Password is required").min(4, "Password is too short"),
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
  const insets = useSafeAreaInsets();

  const handleSubmit = useCallback(
    async ({ contact, password }: { contact: string; password: string }) => {
      setErrorMessage(null);
      setLoading(true);
      try {
        const sanitizedContact = contact.trim();
        const result = await authApi.login(sanitizedContact, password);
        const responseData = result.data as AuthResponse;
        if (!result.ok) {
          setErrorMessage("Incorrect email / phone or password");
          setLoading(false);
          return;
        }
        setLoading(false);
        auth.logIn(responseData);
  } catch {
        setLoading(false);
        setErrorMessage("Network error. Please try again.");
      }
    },
    [auth]
  );

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
  
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
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

        <View style={styles.headerSection}>
          <AppText style={styles.title}>Welcome Back</AppText>
          <AppText style={styles.subtitle}>
            Log in to continue managing your finances, learning, and more.
          </AppText>
        </View>
        <View style={styles.container}>
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
                <AppText style={styles.label}>Email or Phone</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="contact"
                  placeholder="Enter your email or phone"
                  textContentType="emailAddress"
                  customTransform={(v: string) => v.replace(/\s+/g, "")}            
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>Password</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="password"
                  placeholder="Enter your password"
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
                <AppText style={styles.forgotPassword}>Forgot Password?</AppText>
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
            <AppText style={styles.bottomText}>Don&apos;t have an account?</AppText>
            <TouchableOpacity onPress={() => navigation.navigate(routes.SIGNUP)}>
              <AppText style={styles.siginInText}> Register</AppText>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 8,
    justifyContent: "flex-start",
    backgroundColor: Colors.app.white,
  },
  backgroundGraphics: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  /* Geometric accents */
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
  bottomShapeBox: {
    width: 260,
    height: 260,
    transform: [{ rotate: '-8deg' }],
  },
  decorativeBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  circlePrimary: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: '#E8F0FF',
    top: -120,
    right: -80,
  },
  circleSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: '#F4F8FF',
    top: -40,
    left: -60,
  },
  headerSection: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerBar: {
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 16,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.app.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.app.dark,
    lineHeight: 20,
  },

  container: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    gap: 32,
  },
  heading: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  errorContainer: {
    width: '90%',
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
    height: 70, // slightly taller to accommodate larger input font
  },
  formFields: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%',
    gap: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: "DM Sans",
    fontWeight: "400",
    color: Colors.app.primary,
    alignSelf: "flex-end",
  },
  resetContainer: {
    alignSelf: "flex-end",
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
  content: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '90%',
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
