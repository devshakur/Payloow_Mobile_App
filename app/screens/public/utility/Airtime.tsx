import routes from "@/app/navigations/routes";
// Use DM Sans font for all text in this screen
import AppText from "@/components/custom/AppText";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from 'yup';

type RootStackParamList = {
  AirtimeSummary: { network: any; phone: any; amount: any };
  Transactions: undefined;
};

interface AirtimeProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type AirtimeRouteParams = {
  reset?: boolean;
};

const Airtime: FunctionComponent<AirtimeProps> = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const route = useRoute<RouteProp<Record<string, AirtimeRouteParams>, string>>();

  // Reset form if coming back with reset flag
  useEffect(() => {
    if (route?.params && (route.params as AirtimeRouteParams).reset) {
      setSelectedAmount("");
      setSelectedNetwork("");
      setPhoneNumber("");
      setErrors({});
      // Do not mutate route.params, just reset state locally
    }
  }, [route?.params]);

  const networks = [
    { label: "MTN", value: "mtn", color: "#FFCC00" },
    { label: "Airtel", value: "airtel", color: "#FF0000" },
    { label: "Glo", value: "glo", color: "#00B04F" },
    { label: "9Mobile", value: "9mobile", color: "#055d3dff" },
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const schema = yup.object().shape({
    network: yup.string().required('Please select a network'),
    phone: yup.string().matches(/^0\d{10}$/, 'Please enter a valid 11-digit phone number').required('Phone number is required'),
    amount: yup.string()
      .required('Please enter an amount')
      .test('is-valid-number', 'Please enter a valid amount', (value) => {
        if (!value || value.trim() === '') return false;
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
      })
      .test('min-amount', 'Amount must be at least ₦100', (value) => {
        if (!value || value.trim() === '') return true; // Skip if empty (handled by required)
        const num = parseFloat(value);
        return !isNaN(num) && num >= 100;
      })
      .test('max-amount', 'Amount cannot exceed ₦50,000', (value) => {
        if (!value || value.trim() === '') return true; // Skip if empty (handled by required)
        const num = parseFloat(value);
        return !isNaN(num) && num <= 50000;
      }),
  });

  const handleSubmit = async () => {
    const data = {
      network: selectedNetwork,
      phone: phoneNumber,
      amount: selectedAmount, // Pass as string for validation
    };

    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      navigation.navigate(routes.AIRTIME_SUMMARY, {
        network: selectedNetwork,
        phone: phoneNumber,
        amount: selectedAmount, // Pass as string
      });
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {};
      err.inner.forEach((error: any) => {
        errorMessages[error.path] = error.message;
      });
      setErrors(errorMessages);
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.app.dark} />
            </TouchableOpacity>
            <AppText style={styles.title}>Buy Airtime</AppText>
            <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
              <MaterialCommunityIcons name="history" size={22} color={Colors.app.primary} />
            </TouchableOpacity>
          </View>

          {/* Network Selection */}
          <View style={styles.section}>
            <AppText style={[styles.label, errors.network && { color: 'red' }]}>Select Network</AppText>
            <View style={styles.networkRow}>
              {networks.map((net) => (
                <TouchableOpacity
                  key={net.value}
                  style={[
                    styles.networkButton,
                    selectedNetwork === net.value && { borderColor: net.color, backgroundColor: net.color + "15" },
                    errors.network && { borderColor: 'red' },
                  ]}
                  onPress={() => {
                    setSelectedNetwork(net.value);
                    setErrors(prev => ({ ...prev, network: '' }));
                  }}
                >
                  <AppText style={[styles.networkText, { color: net.color }]}>{net.label}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            {errors.network && <AppText style={styles.error}>{errors.network}</AppText>}
          </View>

          {/* Phone Input */}
          <View style={styles.section}>
            <AppText style={[styles.label, errors.phone && { color: 'red' }]}>Phone Number</AppText>
            <TextInput
              style={[styles.input, errors.phone && { borderColor: 'red' }]}
              placeholder="e.g. 08012345678"
              placeholderTextColor={Colors.app.dark + "50"}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setErrors(prev => ({ ...prev, phone: '' }));
              }}
              keyboardType="phone-pad"
            />
            {errors.phone && <AppText style={styles.error}>{errors.phone}</AppText>}
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <AppText style={[styles.label, errors.amount && { color: 'red' }]}>Amount</AppText>
            <TextInput
              style={[styles.input, errors.amount && { borderColor: 'red' }]}
              placeholder="Enter amount"
              placeholderTextColor={Colors.app.dark + "50"}
              value={selectedAmount}
              onChangeText={(text) => {
                // Only allow numeric input and limit to max length
                const numericText = text.replace(/[^0-9]/g, '');
                const amount = parseInt(numericText) || 0;
                
                // Limit to maximum amount
                if (amount > 50000) {
                  setSelectedAmount('50000');
                } else {
                  setSelectedAmount(numericText);
                }
                
                setErrors(prev => ({ ...prev, amount: '' }));
              }}
              keyboardType="numeric"
            />
            {errors.amount && <AppText style={styles.error}>{errors.amount}</AppText>}
            <AppText style={styles.helperText}>Amount must be between ₦100 - ₦50,000</AppText>
          </View>

          {/* Quick Amounts */}
          <View style={styles.section}>
            <View style={styles.amountRow}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.amountChip,
                    selectedAmount === amt.toString() && { backgroundColor: Colors.app.primary },
                    errors.amount && { borderColor: 'red' },
                  ]}
                  onPress={() => {
                    setSelectedAmount(amt.toString());
                    setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                >
                  <AppText
                    style={[
                      styles.amountText,
                      selectedAmount === amt.toString() && { color: Colors.app.white },
                    ]}
                  >
                    ₦{amt}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <AppText style={styles.submitText}>Continue</AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.app.dark,
  },
  section: {
    gap: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.app.dark,
    marginBottom: 4,
  },
  networkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  networkButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.app.dark + "30",
  },
  networkText: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.app.dark + "20",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.app.dark,
  },
  amountRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  amountChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.app.white,
    borderWidth: 1,
    borderColor: Colors.app.dark + "20",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.app.dark,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: Colors.app.dark + "70",
    marginTop: 2,
  },
});

export default Airtime;