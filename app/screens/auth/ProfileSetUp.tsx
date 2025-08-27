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
import Screen from "@/components/custom/Screen";
import Address from "@/components/custom/profileSetup/Address";
import KYC from "@/components/custom/profileSetup/KYC";
import RePin from "@/components/custom/profileSetup/RePin";
import SetName from "@/components/custom/profileSetup/SetName";
import SetPin from "@/components/custom/profileSetup/SetPin";
import SetProfilePicture from "@/components/custom/profileSetup/SetProfilePicture";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      return setIsError(true);
    }
  };

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
    setResponseMessage(null); // Reset previous errors
    let result;

    result = await registerApi.register(
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
        responseData?.message ||
          responseData?.msg ||
          "Failed to create an account"
      );
      return setIsError(true);
    }

    // Retrieve and store the token after registration
    const tokenResult = await getToken(phone, password);
    await getCustomerCode();
    if (!tokenResult) {
      setLoading(false);
      return; // Stop execution if token retrieval fails
    }
    authStorage.storeToken(tokenResult);
    setLoading(false);
    setCurrentScreen(currentScreen + 1);
  };

  const onClose = async (updatedValues?: any) => {
    if (currentScreen < 5) {
      if (currentScreen === 1) {
        // move on
        setCurrentScreen(currentScreen + 1);
      } else if (currentScreen === 2) {
        const { country, state, address } = updatedValues;
        const { firstName, lastName, email, password, phone } = formValues;
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
        const { country, bvn, accountNumber, firstName, lastName, bank } =
          updatedValues;

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
        // Handle pin submit
        const { pin } = formValues;
        await setPin(pin);
        setCurrentScreen(currentScreen + 1);
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
    if (currentScreen === 2) {
      setIsError(false);
      navigation.navigate(routes.SIGNUP);
    }
    setIsError(false);
  };

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg"; // Fallback
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
    >
      <Screen backgroundColor={Colors.app.white}>
        <View style={styles.container}>
          <View style={styles.headerAndProgressContainer}>
            <View style={styles.header}>
              <MaterialCommunityIcons
                name="arrow-left"
                color={Colors.app.black}
                size={20}
                onPress={() => navigation.goBack()}
              />

              <AppText style={styles.title}>Set Profile</AppText>
            </View>
            {/* Progress Bar */}
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

        {/* Modals */}
        {isError && (
          <ErrorModal
            visible={isError}
            onClose={onCloseError}
            responseText={responseMessage || "Failed"}
          />
        )}

        {loading && <LoadingModal visible={loading} />}
      </Screen>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
  },
  progress: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "70%",
    gap: 2,
    alignSelf: "center",
  },
  title: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "600",
    height: 26,
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 100,
    marginTop: 10,
    width: "90%",
  },
  headerAndProgressContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
});

export default ProfileSetUp;
