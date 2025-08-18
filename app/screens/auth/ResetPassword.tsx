import authApi from "@/app/api/auth";
import { useForm } from "@/app/context/FormContext";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FunctionComponent, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Yup from "yup";

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
  const { setFormValues } = useForm();

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
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <View style={styles.header}>
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
                />
              </View>
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
              title="Submit"
              loading={loading}
              disabled={loading}
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
    height: 64,
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
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
