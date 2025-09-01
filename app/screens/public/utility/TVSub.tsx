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
import { useFormikContext } from "formik";
import { FunctionComponent, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface Plan {
  id: number;
  name: string;
  amount: number;
}

type RootStackParamList = {
  TVSubSummary: {
    cable: string;
    plan: string;
    smartCardNumber: string;
    customerName: string;
    amount: number;
  };
  Transactions: undefined;
};

interface TVSubProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({
  cable: Yup.string().required("Please select a cable provider"),
  plan: Yup.string().required("Please select a subscription plan"),
  smartCardNumber: Yup
    .string()
    .required("Smart card number is required")
    .matches(/^[0-9]+$/, "Smart card number must contain only numbers")
    .min(10, "Smart card number must be at least 10 digits"),
});

const TVSub: FunctionComponent<TVSubProps> = ({ navigation }) => {
  const [cableProviders, setCableProviders] = useState<{ label: string; value: string }[]>([]);
  const [allPlans, setAllPlans] = useState<{ [key: string]: Plan[] }>({});
  const [loadingCables, setLoadingCables] = useState(true);
  const [cablesError, setCablesError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const fetchCables = async () => {
      try {
        setLoadingCables(true);
        setCablesError(null);
        const response = await utility.getCables();
        const responseData = response.data as {
          success: boolean;
          data: { cables: { [key: string]: any }; plans: { [key: string]: Plan[] } };
        };

        if (responseData.success && responseData.data && responseData.data.cables) {
          // Transform API response to dropdown format
          const cableNames = Object.keys(responseData.data.cables);
          const transformedCables = cableNames.map((name: string) => ({
            label: name,
            value: name,
          }));
          setCableProviders(transformedCables);
          setAllPlans(responseData.data.plans);
        } else {
          setCablesError("Failed to load cable providers");
        }
      } catch (error) {
        console.error("Error fetching cables:", error);
        setCablesError("Failed to load cable providers");
        // Fallback to static data if API fails
        setCableProviders([
          { label: "DStv", value: "DStv" },
          { label: "GOtv", value: "GOtv" },
          { label: "StarTimes", value: "Startimes" },
          { label: "NOVA", value: "NOVA" },
        ]);
      } finally {
        setLoadingCables(false);
      }
    };

    fetchCables();
  }, []);

  const PlanSelector = () => {
    const { values } = useFormikContext<{ cable: string }>();
    const [filteredPlans, setFilteredPlans] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
      if (values.cable && allPlans[values.cable]) {
        const plans = allPlans[values.cable].map((plan: Plan) => ({
          label: `${plan.name} - ₦${plan.amount}`,
          value: plan.id.toString(),
        }));
        setFilteredPlans(plans);
      } else {
        setFilteredPlans([]);
      }
    }, [values.cable]);

    return (
      <AppFormSelectDropDown
        name="plan"
        data={filteredPlans}
        placeholder="Select Subscription Plan"
      />
    );
  };

  const handleSubmit = async ({
    cable,
    plan,
    smartCardNumber,
  }: {
    cable: string;
    plan: string;
    smartCardNumber: string;
  }) => {
    setValidating(true);
    try {
      const res = await utility.validateCableNumber(smartCardNumber, cable);
      if (res.ok && (res.data as any).success) {
        const customerName = (res.data as any).data.name;
        // Find the selected plan details
        const selectedProviderPlans = allPlans[cable] || [];
        const selectedPlan = selectedProviderPlans.find((p) => p.id.toString() === plan);
        const amount = selectedPlan?.amount || 0;
        const planLabel = selectedPlan?.name || plan;

        navigation.navigate(routes.TV_SUB_SUMMARY, {
          cable,
          plan: planLabel,
          smartCardNumber,
          customerName,
          amount,
        });
      } else {
        Alert.alert("Validation Failed", (res.data as any).message || "Invalid smart card number.");
      }
    } catch (error) {
      console.error("Validation Error:", error);
      Alert.alert("Error", "An unexpected error occurred during validation.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={Colors.app.dark}
            />
          </TouchableOpacity>
          <AppText style={styles.title}>TV Subscription</AppText>
          <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
            <MaterialCommunityIcons name="history" size={22} color={Colors.app.primary} />
          </TouchableOpacity>
        </View>

        <AppForm
          initialValues={{
            cable: "",
            plan: "",
            smartCardNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={styles.formContainer}>
            <View style={styles.section}>
              <AppText style={styles.label}>Select Cable Provider</AppText>
              <AppFormSelectDropDown
                name="cable"
                data={cableProviders}
                placeholder={loadingCables ? "Loading cable providers..." : "Select Cable Provider"}
              />
              {cablesError && (
                <AppText style={styles.errorText}>{cablesError}</AppText>
              )}
            </View>

            <View style={styles.section}>
              <AppText style={styles.label}>Smart Card Number</AppText>
              <AppFormField
                name="smartCardNumber"
                placeholder="Enter smart card number"
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.section}>
              <AppText style={styles.label}>Select Subscription Plan</AppText>
              <PlanSelector />
            </View>

            <SubmitButton
              title="Continue"
              btnContainerStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
              loading={validating}
            />
          </View>
        </AppForm>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "DMSans-Bold",
    color: Colors.app.dark,
    textAlign: "center",
    flex: 1,
  },
  history: {
    color: Colors.app.primary,
    fontSize: 14,
    fontFamily: "DMSans-Medium",
  },
  formContainer: {
    flex: 1,
    gap: 12,
  },
  section: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: Colors.app.dark,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    marginTop: 20,
    width: "100%",
  },
  submitButtonText: {
    color: Colors.app.white,
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
  errorText: {
    color: Colors.app.failed,
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    marginTop: 5,
  },
});

export default TVSub;
