import utility from "@/app/api/utility";
import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormSelectDropDown from "@/components/custom/forms/AppFormDropDownPickerWithSearch";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

type RootStackParamList = {
  ElectricitySummary: {
    meterNumber: string;
    disco: string;
    amount: string;
    phone: string;
    customerName: string;
    address: string;
    type: string;
  };
  Transactions: undefined;
};

interface ElectricityProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({
  meterNumber: Yup.string()
    .required("Meter number is required")
    .matches(/^[0-9]{10,11}$/, "Enter a valid meter number (10-11 digits)"),
  disco: Yup.string().required("Please select a distribution company"),
  amount: Yup.string()
    .required("Amount is required")
    .matches(/^[0-9]+$/, "Amount must be a valid number"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number"),
  type: Yup.string().required("Please select meter type"),
});

const Electricity: FunctionComponent<ElectricityProps> = ({ navigation }) => {
  const [discos, setDiscos] = useState<{label: string, value: string}[]>([]);
  const [loadingDiscos, setLoadingDiscos] = useState(true);
  const [discosError, setDiscosError] = useState<string | null>(null);
  const [validatingMeter, setValidatingMeter] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'invalid_meter' | 'network_error' | 'server_error' | null>(null);

  const meterTypes = [
    { label: "Prepaid", value: "prepaid" },
    { label: "Postpaid", value: "postpaid" },
  ];

  useEffect(() => {
    const fetchDiscos = async () => {
      try {
        setLoadingDiscos(true);
        setDiscosError(null);
        const response = await utility.getDiscos();
        const responseData = response.data as { success: boolean; data: any[] };
        
        if (responseData.success && responseData.data) {
          // Transform API response to dropdown format
          const transformedDiscos = responseData.data.map((disco: any) => ({
            label: disco.name,
            value: disco.code
          }));
          setDiscos(transformedDiscos);
        } else {
          setDiscosError("Failed to load distribution companies");
        }
      } catch (error) {
        console.error("Error fetching discos:", error);
        setDiscosError("Failed to load distribution companies");
        // Fallback to static data if API fails
        setDiscos([
          { label: "Eko Electricity Distribution Company (EKEDC)", value: "eko" },
          { label: "Ikeja Electric Plc (IKEDC)", value: "ikeja" },
          { label: "Abuja Electricity Distribution Company (AEDC)", value: "abuja" },
          { label: "Kano Electricity Distribution Company (KEDCO)", value: "kano" },
          { label: "Port Harcourt Electricity Distribution Company (PHEDC)", value: "portharcourt" },
          { label: "Ibadan Electricity Distribution Company (IBEDC)", value: "ibadan" },
          { label: "Kaduna Electric", value: "kaduna" },
          { label: "Jos Electricity Distribution Plc (JEDC)", value: "jos" },
          { label: "Enugu Electricity Distribution Company (EEDC)", value: "enugu" },
        ]);
      } finally {
        setLoadingDiscos(false);
      }
    };

    fetchDiscos();
  }, []);

  const handleSubmit = async ({
    meterNumber,
    disco,
    amount,
    phone,
    type,
  }: {
    meterNumber: string;
    disco: string;
    amount: string;
    phone: string;
    type: string;
  }) => {
    try {
      setValidatingMeter(true);
      setValidationError(null);
      setErrorType(null);

      // Validate meter number
      const response = await utility.validateMeterNumber(meterNumber, disco, type.toUpperCase());
      const responseData = response.data as {
        success: boolean;
        message?: string;
        data: {
          invalid: boolean;
          name: string;
          address: string;
        };
      };

      if (responseData.success && !responseData.data.invalid) {
        // Success case
        navigation.navigate(routes.ELECTRICITY_SUMMARY, {
          meterNumber,
          disco,
          amount,
          phone,
          customerName: responseData.data.name,
          address: responseData.data.address,
          type,
        });
      } else {
        // Failure case - determine error type
        if (responseData.data.name === "INVALID METER NUMBER") {
          setErrorType('invalid_meter');
          setValidationError("The meter number you entered could not be found. Please check and try again.");
        } else {
          setErrorType('server_error');
          setValidationError(responseData.message || "Unable to validate meter. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Error validating meter:", error);

      // Determine error type based on the error
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('network') || error.message?.includes('timeout')) {
        setErrorType('network_error');
        setValidationError("Network connection issue. Please check your internet connection and try again.");
      } else {
        setErrorType('server_error');
        setValidationError("We're having trouble validating your meter right now. Please try again in a moment.");
      }
    } finally {
      setValidatingMeter(false);
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.app.dark} />
            </TouchableOpacity>
            <AppText style={styles.title}>Pay Electricity Bill</AppText>
            <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
              <MaterialCommunityIcons name="history" size={22} color={Colors.app.primary} />
            </TouchableOpacity>
          </View>

          <AppForm
            initialValues={{
              meterNumber: "",
              disco: "",
              amount: "",
              phone: "",
              type: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <View style={styles.formContainer}>
              <View style={styles.section}>
                <AppText style={styles.label}>Select Distribution Company</AppText>
                {loadingDiscos ? (
                  <View style={styles.loadingContainer}>
                    <AppText style={styles.loadingText}>Loading distribution companies...</AppText>
                  </View>
                ) : discosError ? (
                  <View style={styles.errorContainer}>
                    <AppText style={styles.errorText}>{discosError}</AppText>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={() => {
                        setLoadingDiscos(true);
                        setDiscosError(null);
                        // Re-fetch discos
                        const fetchDiscos = async () => {
                          try {
                            const response = await utility.getDiscos();
                            const responseData = response.data as { success: boolean; data: any[] };
                            
                            if (responseData.success && responseData.data) {
                              const transformedDiscos = responseData.data.map((disco: any) => ({
                                label: disco.name,
                                value: disco.code
                              }));
                              setDiscos(transformedDiscos);
                            }
                          } catch (error) {
                            console.error("Error retrying discos fetch:", error);
                          } finally {
                            setLoadingDiscos(false);
                          }
                        };
                        fetchDiscos();
                      }}
                    >
                      <AppText style={styles.retryText}>Retry</AppText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <AppFormSelectDropDown
                    name="disco"
                    data={discos}
                    placeholder="Select Distribution Company"
                  />
                )}
              </View>
               <View style={styles.section}>
                <AppText style={styles.label}>Meter Type</AppText>
                <AppFormSelectDropDown
                  name="type"
                  data={meterTypes}
                  placeholder="Select Meter Type"
                />
              </View>


              <View style={styles.section}>
                <AppText style={styles.label}>Meter Number</AppText>
                <AppFormField
                  name="meterNumber"
                  placeholder="Enter meter number"
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>

             
              <View style={styles.section}>
                <AppText style={styles.label}>Amount (₦)</AppText>
                <AppFormField
                  name="amount"
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.section}>
                <AppText style={styles.label}>Phone Number</AppText>
                <AppFormField
                  name="phone"
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              {validationError && (
                <View style={styles.errorContainer}>
                  <View style={styles.errorHeader}>
                    <MaterialCommunityIcons
                      name={errorType === 'network_error' ? 'wifi-off' : errorType === 'invalid_meter' ? 'account-alert' : 'alert-circle'}
                      size={24}
                      color="#ff4444"
                      style={styles.errorIcon}
                    />
                    <AppText style={styles.errorTitle}>
                      {errorType === 'network_error' ? 'Connection Issue' :
                       errorType === 'invalid_meter' ? 'Invalid Meter Number' :
                       'Validation Error'}
                    </AppText>
                  </View>

                  <AppText style={styles.errorMessage}>{validationError}</AppText>

                  <View style={styles.errorActions}>
                    {errorType === 'network_error' && (
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          // Clear the error and let user try again
                          setValidationError(null);
                          setErrorType(null);
                        }}
                      >
                        <AppText style={styles.retryText}>Try Again</AppText>
                      </TouchableOpacity>
                    )}

                    {errorType === 'invalid_meter' && (
                      <View style={styles.errorSuggestions}>
                        <AppText style={styles.suggestionText}>Suggestions:</AppText>
                        <AppText style={styles.suggestionItem}>• Double-check your meter number</AppText>
                        <AppText style={styles.suggestionItem}>• Ensure you&apos;ve selected the correct distribution company</AppText>
                        <AppText style={styles.suggestionItem}>• Try removing any spaces or special characters</AppText>
                      </View>
                    )}

                    {errorType === 'server_error' && (
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          setValidationError(null);
                          setErrorType(null);
                        }}
                      >
                        <AppText style={styles.retryText}>Try Again</AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              <SubmitButton
                title="Continue"
                btnContainerStyle={styles.submitButton}
                titleStyle={styles.submitButtonText}
                loading={validatingMeter}
              />
            </View>
          </AppForm>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
    marginBottom: 2,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 20,
    width: "100%",
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "DMSans-Bold",
    color: Colors.app.white,
    textAlign: "center",
  },
  loadingContainer: {
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.app.dark + "20",
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark + "60",
  },
  errorContainer: {
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ff4444",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  errorIcon: {
    marginRight: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: "DMSans-Bold",
    color: "#ff4444",
    flex: 1,
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark,
    lineHeight: 20,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: "#ff4444",
    textAlign: "center",
  },
  errorActions: {
    alignItems: "flex-start",
  },
  errorSuggestions: {
    width: "100%",
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
    marginBottom: 8,
  },
  suggestionItem: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
    color: Colors.app.dark + "80",
    lineHeight: 18,
    marginBottom: 4,
    paddingLeft: 8,
  },
  retryButton: {
    backgroundColor: Colors.app.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    fontFamily: "DMSans-Medium",
    color: Colors.app.white,
  },
});

export default Electricity;
