import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import AppFormSelectDropDown from "@/components/custom/forms/AppFormPicker";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface OptionType {
  label: string;
  value: string | number;
}

type RootStackParamList = {
  DataSummary: {
    network: any;
    phone: any;
    planId: any;
    price?: any;
    selectedPlanType?: any;
    plans: OptionType[];
    validity: string;
  };
  Transactions: undefined;
};

interface DataProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^(\+234|0)[0-9]{10}$/, "Enter a valid Nigerian phone number"),
  network: Yup.string().required("Please select a network"),
  planType: Yup.string().required("Please select a data plan"),
});

const Data: FunctionComponent<DataProps> = ({ navigation }) => {
  const networks = [
    { label: "MTN", value: "mtn" },
    { label: "Airtel", value: "airtel" },
    { label: "Glo", value: "glo" },
    { label: "9Mobile", value: "9mobile" },
  ];

  const dataPlans = [
    { label: "1GB - ₦500 (Daily)", value: "1gb-daily" },
    { label: "2GB - ₦1,000 (Weekly)", value: "2gb-weekly" },
    { label: "5GB - ₦2,500 (Monthly)", value: "5gb-monthly" },
    { label: "10GB - ₦5,000 (Monthly)", value: "10gb-monthly" },
    { label: "20GB - ₦10,000 (Monthly)", value: "20gb-monthly" },
  ];

  const handleSubmit = ({
    phone,
    network,
    planType,
  }: {
    phone: string;
    network: string;
    planType: string;
  }) => {
    // Mock data for navigation
    const mockPlans = dataPlans.map(plan => ({
      label: plan.label,
      value: plan.value
    }));

    navigation.navigate(routes.DATA_SUMMARY, {
      network,
      phone,
      planId: planType,
      price: "2500", // Mock price
      selectedPlanType: planType,
      plans: mockPlans,
      validity: "30 days",
    });
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
          <AppText style={styles.title}>Buy Data</AppText>
          <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
            <AppText style={styles.history}>History</AppText>
          </TouchableOpacity>
        </View>

        <AppForm
          initialValues={{
            phone: "",
            network: "",
            planType: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={styles.formContainer}>
            <View style={styles.section}>
              <AppText style={styles.label}>Select Network</AppText>
              <AppFormSelectDropDown
                name="network"
                items={networks}
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

            <View style={styles.section}>
              <AppText style={styles.label}>Select Data Plan</AppText>
              <AppFormSelectDropDown
                name="planType"
                items={dataPlans}
              />
            </View>

            <SubmitButton
              title="Continue"
              btnContainerStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
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
    fontWeight: "700",
    color: Colors.app.dark,
    textAlign: "center",
    flex: 1,
  },
  history: {
    color: Colors.app.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    gap: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.app.dark,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    marginTop: 20,
  },
  submitButtonText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Data;
