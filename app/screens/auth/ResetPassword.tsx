import authApi from "@/app/api/auth";
import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
// Decorative SVG assets (existing in assets/images/custom/svg)
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

type RootStackParamList = {
  SetNewPassword: undefined;
};

interface ResetPasswordProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface AuthResponse {
  message: string;
  data: object;
  success: boolean;
}

const ResetPassword: FunctionComponent<ResetPasswordProps> = ({
  navigation,
}) => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const { setFormValues } = useForm();
  const insets = useSafeAreaInsets();

  const handleSubmit = async ({ email }: { email: string }) => {
    setFormValues((prev) => ({ ...prev, ...{ email } }));
    const result = await authApi.resetPassword(email);

    const responseData = result.data as AuthResponse;

    if (!result.ok) {
      setLoading(false);
      setResponseMessage(responseData.message);
      return setIsError(true);
    } else {
      setLoading(false);
      navigation.navigate(routes.SET_NEW_PASSWORD);
    }
  };

  const onClose = async () => {
    setIsError(false);
    setResponseMessage(null);
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
        <AppText style={styles.title}>Reset Password</AppText>
        <AppText style={styles.subtitle}>
          Enter your email to receive a password reset code
        </AppText>
      </View>

      <View style={styles.container}>
        <View style={styles.content}>
          <AppForm
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formFields}>
              <View style={styles.field}>
                <AppText style={styles.label}>Enter email</AppText>
                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                  placeholder="Email"
                  textContentType="emailAddress"
                  setVal={setEmailValue}
                />
              </View>
            </View>
            <SubmitButton
              btnContainerStyle={[
                styles.btn,
                {
                  backgroundColor: loading
                    ? Colors.app.loading
                    : emailValue.trim().length > 0
                    ? Colors.app.primary
                    : Colors.app.input,
                },
              ]}
              titleStyle={[
                styles.btnTitleStyle,
                {
                  color: emailValue.trim().length > 0 ? Colors.app.white : Colors.app.light,
                },
              ]}
              title="Submit"
              loading={loading}
              disabled={loading || emailValue.trim().length === 0}
              loadingAnimation={
                <ActivityIndicator size="small" color={Colors.app.white} />
              }
            />
          </AppForm>
        </View>
      </View>

      {/* Modals */}
      {isError && (
        <ErrorModal
          visible={isError}
          onClose={onClose}
          responseText={responseMessage || "Failed to Reset password"}
        />
      )}
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
  bottomShapeBox: {
    width: 260,
    height: 260,
    transform: [{ rotate: '-8deg' }],
  },
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
    height: 70,
  },
  formFields: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '90%',
    gap: 16,
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
    gap: 32,
  },
});

export default ResetPassword;
