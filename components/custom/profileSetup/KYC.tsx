import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import payment from "../../../app/api/payment";
import { useForm } from "../../../app/context/FormContext";
import AppText from "../AppText";
import AppForm from "../forms/AppForm";
import AppFormDropDownPickerWithSearch from "../forms/AppFormDropDownPickerWithSearch";
import AppFormField from "../forms/AppFormField";
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";

const validationSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  bvn: Yup.string()
    .required("BVN or NIN is required")
    .matches(/^\d{11}$/, "BVN must be 11 digits"),
  accountNumber: Yup.string()
    .required("Account number is required")
    .matches(/^\d{10}$/, "Account number must be exactly 10 digits"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  bank: Yup.string().required("Bank is required"),
});

export interface BankApiResponse {
  message: string;
  data: {
    status: boolean;
    message: string;
    data: Bank[];
  };
}

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KYCProps {
  onClose: (updatedValues?: any) => void;
}

const KYC: FunctionComponent<KYCProps> = ({ onClose }) => {
  const { formValues, setFormValues } = useForm();
  const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bankResponse = (await payment.getBankList()).data;
        const rawBanks = bankResponse as BankApiResponse;

        if (Array.isArray(rawBanks.data.data)) {
          const formattedBanks = rawBanks.data.data.map((bank: Bank) => ({
            label: bank.name,
            value: bank.code,
          }));
          setBanks(formattedBanks);
        }
      } catch (error) {
    
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countries = [{ label: "Nigeria", value: "NG" }];

  return (
    <AppForm
      initialValues={{
        country: formValues.country || "",
        bvn: formValues.bvn || "",
        accountNumber: formValues.accountNumber || "",
        firstName: formValues.firstName || "",
        lastName: formValues.lastName || "",
        bank: formValues.bank || "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormValues((prev) => ({ ...prev, ...values }));
        onClose(values);
      }}
    >
      <View style={styles.formFields}>
        <View style={styles.field}>
          <AppFormPicker
            placeholder={{ label: "Select a Country", value: null }}
            name="country"
            items={countries}
          />
        </View>

        <View style={styles.field}>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            name="bvn"
            placeholder="Enter your BVN"
          />
          <AppText style={styles.warning}>
            Ensure this matches your real account name details.
          </AppText>
        </View>

        <View style={styles.field}>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            name="accountNumber"
            placeholder="Enter your 10-digit account number"
          />
          <AppText style={styles.warning}>
            Please enter a valid 10-digit Nigerian bank account number.
          </AppText>
        </View>

        <View style={styles.field}>
          <AppFormField
            autoCapitalize="words"
            autoCorrect={false}
            keyboardType="default"
            name="firstName"
            placeholder="First Name"
          />
        </View>

        <View style={styles.field}>
          <AppFormField
            autoCapitalize="words"
            autoCorrect={false}
            keyboardType="default"
            name="lastName"
            placeholder="Last Name"
          />
        </View>

        <View style={styles.field}>
          <AppFormDropDownPickerWithSearch
            data={banks || []}
            name="bankCode"
            placeholder="Select Bank"
          />
        </View>
      </View>

      <View style={{ width: "90%" }}>
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
          title="Log In"
        />
      </View>
    </AppForm>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.app.primary,
    width: "100%",
    color: Colors.app.white,
  },
  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
  btnTitleStyle: {
    fontFamily: "DM Sans",
    color: Colors.app.white,
    fontWeight: "400",
    lineHeight: 20,
  },
  label: {
    fontFamily: "DM Sans",
    fontSize: 14,
    fontWeight: "600",
    height: 20,
    color: Colors.app.dark,
    alignSelf: "flex-start",
  },
  warning: {
    fontSize: 14,
    color: "red",
    alignSelf: "flex-start",
  },
  field: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },
  formFields: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    width: "90%",
    alignSelf: "center",
  },
});

export default KYC;
