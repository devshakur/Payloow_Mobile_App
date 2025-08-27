import AppText from "@/components/custom/AppText";
import CustomersPendingLeads from "@/components/custom/easyBuy/CustomersPendingLeads";
import Screen from "@/components/custom/Screen";
import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CustomerProps {
  isActive?: boolean;
}

const Customer: FunctionComponent<CustomerProps> = () => {
  const [screen, setScreen] = useState<string | null>("customers");

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={[
              styles.customers,
              {
                borderColor:
                  screen === "customers" ? Colors.app.primary : Colors.app.dark,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setScreen("customers")}>
              <AppText
                style={[
                  styles.customersLabel,
                  {
                    color:
                      screen === "customers"
                        ? Colors.app.primary
                        : Colors.app.light,
                  },
                ]}
              >
                Customer
              </AppText>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.pending,
              {
                borderColor:
                  screen === "pending" ? Colors.app.primary : Colors.app.dark,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setScreen("pending")}>
              <AppText
                style={[
                  styles.pendingLabel,
                  {
                    color:
                      screen === "pending"
                        ? Colors.app.primary
                        : Colors.app.light,
                  },
                ]}
                numberOfLines={1}
              >
                Orders & Consignment
              </AppText>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.leads,
              {
                borderColor:
                  screen === "leads" ? Colors.app.primary : Colors.app.dark,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setScreen("leads")}>
              <AppText
                style={[
                  styles.leadsLabel,
                  {
                    color:
                      screen === "leads"
                        ? Colors.app.primary
                        : Colors.app.light,
                  },
                ]}
              >
                Leads
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contents}>
          {screen === "customers" && <CustomersPendingLeads />}
          {screen === "pending" && <CustomersPendingLeads />}
          {screen === "leads" && <CustomersPendingLeads />}
        </View>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  contents: {
    width: "90%",
    height: "90%",
    marginTop: 10,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pending: {
    height: "100%",
    width: "33.33%",
    borderBottomColor: Colors.app.primary,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customers: {
    height: "100%",
    width: "33.33%",
    borderBottomColor: Colors.app.primary,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pendingLabel: {
    color: Colors.app.primary,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins",
    lineHeight: 28,
  },
  customersLabel: {
    color: Colors.app.primary,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins",
    lineHeight: 28,
  },
  leadsLabel: {
    color: Colors.app.primary,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins",
    lineHeight: 28,
  },
  leads: {
    height: "100%",
    width: "33.33%",
    borderBottomColor: Colors.app.primary,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Customer;
