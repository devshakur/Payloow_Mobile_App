import authApi from "@/app/api/auth";
import paymentApi from "@/app/api/payment";
import { default as userDetails } from "@/app/api/userDetails";
import registerApi from "@/app/api/users";
import authStorage from "@/app/auth/storage";
import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import LoadingModal from "@/components/custom/LoadingModal";
import SVGComponent from "@/components/custom/SVGComponent";
import Address from "@/components/custom/profileSetup/Address";
import KYC from "@/components/custom/profileSetup/KYC";
import RePin from "@/components/custom/profileSetup/RePin";
import SetName from "@/components/custom/profileSetup/SetName";
import SetPin from "@/components/custom/profileSetup/SetPin";
import SetProfilePicture from "@/components/custom/profileSetup/SetProfilePicture";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
// Decorative SVG assets
import BottomShape from "../../../assets/images/custom/svg/Intersect-bottom.svg";
import TopShape from "../../../assets/images/custom/svg/Intersect-top.svg";
import fullLine from "../../../assets/images/custom/svg/full-line.svg";
import line from "../../../assets/images/custom/svg/line.svg";
import { UserData } from "../../context/UserProvider";

type RootStackParamList = {
  FinishedProfileSetUp: undefined;
  SignUp: undefined;
};

interface ProfileSetUpProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface ProfileResponse {
  message: string;
  data: {
    profilePicture: string;
  };
  success: boolean;
}

interface ApiResponse {
  message?: string;
  data?: object;
  success?: boolean;
  msg?: string;
  status?: string;
}

interface AuthResponse {
  message: string;
  data: {
    auth: string;
    verified: boolean;
  };
  success: boolean;
}

const ProfileSetUp: FunctionComponent<ProfileSetUpProps> = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerCode, setCustomerCode] = useState<string>();
  const { formValues } = useForm();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const getToken = async (contact: string, password: string) => {
    try {
      setLoading(true);
      const result = await authApi.login(contact, password);
      if (result.ok) {
        const responseData = result.data as AuthResponse;
        await authStorage.storeToken(responseData.data.auth);
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerCode = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const userResult = await userDetails.getUser();

      const userData = userResult.data as UserData;
      if (userResult.ok) {
        setCustomerCode(userData.data.paystackCustomerCode);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch {
      console.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const setPin = async (pin: string) => {
    setLoading(true);
    const result = await authApi.setPin(pin);

    const responseData = result.data as ApiResponse;

    if (!result.ok) {
      setLoading(false);
      setResponseMessage(
        responseData?.message || responseData?.msg || "Failed to set pin"
      );
      return setIsError(true);
    }
    setLoading(false);
  };

  const verifyCustomer = async (
    customer_code: string,
    country: string,
    bvn: string,
    phone: string,
    firstName: string,
    lastName: string,
    bank: string
  ) => {
    setLoading(true);
    const result = await paymentApi.verifyCustomer(
      customer_code,
      country,
      bvn,
      phone,
      firstName,
      lastName,
      bank
    );

    const responseData = result.data as ApiResponse;

    if (!result.ok) {
      setLoading(false);
      setResponseMessage(
        responseData?.message ||
          responseData?.msg ||
          "Failed to verify customer"
      );
      return setIsError(true);
    }

    setLoading(false);
    setCurrentScreen(currentScreen + 1);
  };

  const uploadProfileImage = async (imageUri: any) => {
    const formData = new FormData();
    const mime = getMimeType(imageUri);
    const ext = mime.split("/")[1];

    formData.append("profilePicture", {
      uri: imageUri,
      name: `main.${ext}`,
      type: mime,
    } as any);

    try {
      const response = await userDetails.setProfileImage(formData);
      const res = response.data as ProfileResponse;

      if (response.ok) {
        return navigation.navigate(routes.FINISHED_PROFILE_SETUP);
      } else {
        setResponseMessage(res.message || "Failed to upload image");
        return setIsError(true);
      }
    } catch {
      return setIsError(true);
    }
  };

  // Create user after first two steps
  const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    country: string,
    state: string,
    address: string
  ) => {
    setLoading(true);
    const result = await registerApi.register(
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      state,
      address
    );

    const responseData = result.data as ApiResponse;
    if (!result.ok) {
      setLoading(false);
      setResponseMessage(
        responseData?.message || responseData?.msg || "Failed to register user"
      );
      return setIsError(true);
    }

    setLoading(false);
    // login then proceed to next screen
    const auth = await getToken(phone, password);
    if (auth) {
      await getCustomerCode();
      setCurrentScreen((prev) => prev + 1);
    }
  };

  // Unified onClose handler for steps
  const onClose = async (updatedValues?: any) => {
    if (!updatedValues) return;

    if (currentScreen < 5) {
      if (currentScreen === 1) {
        // just advance
        setCurrentScreen(currentScreen + 1);
      } else if (currentScreen === 2) {
        const { firstName, lastName, email, password, phone, country, state, address } = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          phone: formValues.phone,
          country: formValues.country,
          state: formValues.state,
          address: formValues.address,
          ...updatedValues,
        } as any;

        await createUser(
          firstName ?? "",
          lastName ?? "",
          email ?? "",
          password ?? "",
            phone ?? "",
          country ?? "",
          state ?? "",
          address ?? ""
        );
      } else if (currentScreen === 3) {
        const { country, bvn, accountNumber, firstName, lastName, bank } = {
          country: formValues.country,
          bvn: formValues.bvn,
          accountNumber: formValues.accountNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          bank: formValues.bank,
          ...updatedValues,
        } as any;

        await verifyCustomer(
          customerCode || "",
          country,
          bvn,
          accountNumber,
          firstName,
          lastName,
          bank
        );
      } else if (currentScreen === 4 && formValues.pin?.trim()) {
        const { pin } = formValues;
        await setPin(pin);
        setCurrentScreen(currentScreen + 1);
      } else if (currentScreen === 4) {
        // first pin entry -> advance
        setCurrentScreen(currentScreen + 0); // wait for rePin
      }
    } else {
      if (updatedValues?.type === "skip") {
        return navigation.navigate(routes.FINISHED_PROFILE_SETUP);
      }
      const { image } = updatedValues;
      await uploadProfileImage(image);
    }
  };

  const onCloseError = () => {
    // Simply dismiss error and allow user to correct inputs on the same step
    setIsError(false);
    setResponseMessage(null);
  };

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg"; // Fallback
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Background decorative shapes */}
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
        <AppText style={styles.title}>Set Profile</AppText>
        <View style={styles.progress}>
          {[...Array(5)].map((_, index) => (
            <SVGComponent
              key={index}
              width={32}
              height={0}
              SvgFile={index < currentScreen ? fullLine : line}
            />
          ))}
        </View>
      </View>

      <View style={styles.stepsContainer}>
        {currentScreen === 1 && <SetName onClose={onClose} />}
        {currentScreen === 2 && <Address onClose={onClose} />}
        {currentScreen === 3 && <KYC onClose={onClose} />}
        {currentScreen === 4 && !formValues.pin?.trim() && (
          <SetPin onClose={onClose} />
        )}
        {currentScreen === 4 && formValues.pin?.trim() && (
          <RePin onClose={onClose} />
        )}
        {currentScreen === 5 && <SetProfilePicture onClose={onClose} />}
      </View>

      {isError && (
        <ErrorModal
          visible={isError}
          onClose={onCloseError}
          responseText={responseMessage || "Failed"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 8,
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
  headerBar: { width: '100%', paddingHorizontal: 8, paddingBottom: 8, alignItems: 'flex-start', justifyContent: 'center' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, opacity: 0.6 },
  headerSection: { width: '90%', alignSelf: 'center', marginBottom: 8, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.app.black },
  progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', gap: 2, alignSelf: 'center' },
  stepsContainer: { width: '100%', alignItems: 'center', gap: 32, paddingBottom: 40 },
});

export default ProfileSetUp;
