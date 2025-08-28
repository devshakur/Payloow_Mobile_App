import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import GridPicker from "@/components/custom/GridPicker";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FunctionComponent, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  AirtimeSummary: {
    network: any;
    phone: any;
    amount: any;
  };
  Transactions: undefined;
};

interface AirtimeProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const Airtime: FunctionComponent<AirtimeProps> = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState<boolean>(false);

  const networks = [
    { 
      label: "MTN", 
      value: "mtn",
      icon: "📱",
      color: "#FFCC00"
    },
    { 
      label: "Airtel", 
      value: "airtel",
      icon: "📶",
      color: "#FF0000"
    },
    { 
      label: "Glo", 
      value: "glo",
      icon: "🌐",
      color: "#00B04F"
    },
    { 
      label: "9Mobile", 
      value: "9mobile",
      icon: "📡",
      color: "#00A86B"
    },
  ];

  const handleSubmit = () => {
    if (selectedNetwork && phoneNumber && selectedAmount) {
      navigation.navigate(routes.AIRTIME_SUMMARY, {
        network: selectedNetwork,
        phone: phoneNumber,
        amount: selectedAmount,
      });
    }
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              <AppText style={styles.title}>Buy Airtime</AppText>
              <TouchableOpacity onPress={() => navigation.navigate(routes.TRANSACTIONS)}>
                <MaterialCommunityIcons
                  name="history"
                  size={20}
                  color={Colors.app.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* Network Selection */}
              <View style={styles.inputCard}>
                <TouchableOpacity 
                  style={styles.dropdown}
                  onPress={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                >
                  <View style={styles.dropdownContent}>
                    {selectedNetwork ? (
                      <>
                        <AppText style={styles.selectedNetworkIcon}>
                          {networks.find(n => n.value === selectedNetwork)?.icon}
                        </AppText>
                        <AppText style={styles.selectedNetworkText}>
                          {networks.find(n => n.value === selectedNetwork)?.label}
                        </AppText>
                      </>
                    ) : (
                      <AppText style={styles.placeholderText}>Select Network Provider</AppText>
                    )}
                  </View>
                  <MaterialCommunityIcons 
                    name={isNetworkDropdownOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={Colors.app.dark + "60"}
                  />
                </TouchableOpacity>
                
                {isNetworkDropdownOpen && (
                  <View style={styles.dropdownList}>
                    {networks.map((network) => (
                      <TouchableOpacity
                        key={network.value}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedNetwork(network.value);
                          setIsNetworkDropdownOpen(false);
                        }}
                      >
                        <AppText style={styles.networkIcon}>{network.icon}</AppText>
                        <AppText style={styles.networkLabel}>{network.label}</AppText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.app.dark + "60"}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              {/* Amount Input */}
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter amount"
                  placeholderTextColor={Colors.app.dark + "60"}
                  value={selectedAmount}
                  onChangeText={setSelectedAmount}
                  keyboardType="numeric"
                />
              </View>

              {/* Quick Amount Selection */}
              <View style={styles.amountSection}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContainer}
                >
                  <GridPicker
                    returnValue={(amount) => setSelectedAmount(amount.toString())}
                    itemStyle={styles.gridItem}
                    containerStyle={styles.gridPickerContainer}
                    amounts={[100, 200, 500, 1000, 2000, 5000]}
                  />
                </ScrollView>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <AppText style={styles.submitButtonText}>Continue</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.app.dark,
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    flex: 1,
    gap: 12,
    paddingBottom: 20,
  },
  inputCard: {
    backgroundColor: Colors.app.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  textInput: {
    fontSize: 16,
    color: Colors.app.dark,
    paddingVertical: 16,
    fontWeight: "400",
  },
  dropdown: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedNetworkIcon: {
    fontSize: 18,
  },
  selectedNetworkText: {
    fontSize: 16,
    color: Colors.app.dark,
    fontWeight: "500",
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.app.dark + "60",
    fontWeight: "400",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.app.white,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  networkIcon: {
    fontSize: 18,
  },
  networkLabel: {
    fontSize: 16,
    color: Colors.app.dark,
    fontWeight: "400",
  },
  amountSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 4,
  },
  gridPickerContainer: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  gridItem: {
    width: 75,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.app.white,
    borderWidth: 1.5,
    borderColor: Colors.app.primary + "20",
    shadowColor: Colors.app.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButton: {
    backgroundColor: Colors.app.primary,
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.app.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: Colors.app.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Airtime;
