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
  const discos = [
    { label: "Eko Electricity Distribution Company (EKEDC)", value: "eko" },
    { label: "Ikeja Electric Plc (IKEDC)", value: "ikeja" },
    { label: "Abuja Electricity Distribution Company (AEDC)", value: "abuja" },
    { label: "Kano Electricity Distribution Company (KEDCO)", value: "kano" },
    { label: "Port Harcourt Electricity Distribution Company (PHEDC)", value: "portharcourt" },
    { label: "Ibadan Electricity Distribution Company (IBEDC)", value: "ibadan" },
    { label: "Kaduna Electric", value: "kaduna" },
    { label: "Jos Electricity Distribution Plc (JEDC)", value: "jos" },
    { label: "Enugu Electricity Distribution Company (EEDC)", value: "enugu" },
  ];

  const meterTypes = [
    { label: "Prepaid", value: "prepaid" },
    { label: "Postpaid", value: "postpaid" },
  ];

  const handleSubmit = ({
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
    navigation.navigate(routes.ELECTRICITY_SUMMARY, {
      meterNumber,
      disco,
      amount,
      phone,
      customerName: "John Doe", // Mock customer name
      address: "Sample Address", // Mock address
      type,
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
          <AppText style={styles.title}>Pay Electricity Bill</AppText>
          <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
            <AppText style={styles.history}>History</AppText>
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
              <AppFormSelectDropDown
                name="disco"
                items={discos}
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
              <AppText style={styles.label}>Meter Type</AppText>
              <AppFormSelectDropDown
                name="type"
                items={meterTypes}
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

export default Electricity;
