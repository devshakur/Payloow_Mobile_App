import * as Linking from "expo-linking";
import React, { FC, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import * as Yup from "yup";

import AppText from "@/components/custom/AppText";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import AppFormPicker from "@/components/custom/forms/AppFormPicker";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import List from "@/components/custom/list/List";
import AppButton from "../../../../components/custom/AppButton";
import ErrorModal from "../../../../components/custom/ErrorModal";
import LoadingModal from "../../../../components/custom/LoadingModal";
import Screen from "../../../../components/custom/Screen";
import SuccessModal from "../../../../components/custom/SuccessModal";

import { Colors } from "../../../../constants/Colors";
import easyBuy from "../../../api/easyBuy";

export interface Installment {
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
  paymentDate: string | null;
  _id: string;
}

export interface CalculateInstallmentData {
  initialPayment: number;
  installmentBase: number;
  interestAmount: number;
  totalAmount: number;
  installments: Installment[];
}

export interface CalculateInstallmentResponse {
  message: string;
  data: CalculateInstallmentData;
  success: boolean;
}

interface CheckoutInstallmentDetails {
  isInstallment: boolean;
  installmentPlan: string;
  installments: Installment[];
  orderId: string;
}

interface CartItem {
  product: string;
  quantity: number;
  price: number;
  partner: string;
  _id: string;
}

interface Order {
  user: string;
  cartItems: CartItem[];
  paymentStatus: string;
  totalAmount: number;
  discountedAmount: number;
  orderStatus: string;
  paymentMethod: string;
  isDiscounted: boolean;
  transactionReference: string;
  installmentDetails: CheckoutInstallmentDetails;
  paystackAuthorization: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CheckoutResponse {
  message: string;
  data: {
    result: {
      order: Order;
      checkout_url: string;
    };
    paidWithWallet: boolean;
  };
  success: boolean;
}

const installmentPlans = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const validationSchema = Yup.object().shape({
  amount: Yup.number().required().label("Amount"),
  installmentPlan: Yup.string().required().label("Installment Plan"),
  numberOfInstallments: Yup.string()
    .required()
    .matches(/^\d+$/, "Must be a number")
    .label("Number Of Installments"),
});

const InstallmentPlan: FC = () => {
  const [options, setOptions] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [installmentPayload, setInstallmentPayload] = useState<{
    installmentPlan: string;
    numberOfInstallments: string;
  } | null>(null);

  const handleSubmit = async (
    values: {
      amount: string;
      installmentPlan: string;
      numberOfInstallments: string;
    },
    { resetForm }: any
  ) => {
    try {
      const parsedAmount = parseFloat(values.amount);
      if (isNaN(parsedAmount)) return;

      const res = await easyBuy.getInstallmentPlans(
        parsedAmount,
        values.installmentPlan,
        values.numberOfInstallments
      );

      if (res.ok && res.data) {
        const breakdown = res.data as CalculateInstallmentResponse;

        setOptions(breakdown.data.installments);
        setInstallmentPayload({
          installmentPlan: values.installmentPlan,
          numberOfInstallments: values.numberOfInstallments,
        });
        resetForm();
      }
    } catch (error) {
      console.error("Failed to fetch installment plan:", error);
    }
  };

  const handlePaystack = async () => {
    try {
      setLoading(true);

      const paymentMethod = "paystack";
      const result = await easyBuy.checkOut(
        paymentMethod,
        installmentPayload?.installmentPlan,
        Number(installmentPayload?.numberOfInstallments)
      );

      if (result.ok && result.data) {
        const data = result.data as CheckoutResponse;
        const checkoutUrl = data.data.result.checkout_url;

        if (checkoutUrl) {
          Linking.openURL(checkoutUrl); // ✅ Open Paystack checkout page in browser
        } else {
          setResponseMessage("Invalid checkout URL");
          showModal("error");
        }
      } else {
        setResponseMessage("Checkout failed");
        showModal("error");
      }
    } catch (error) {
      console.error("Paystack checkout failed:", error);
      setResponseMessage("An error occurred");
      showModal("error");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  return (
    <Screen backgroundColor={Colors.app.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.heading}>Add Installment Option</AppText>

        <AppForm
          initialValues={{
            amount: "",
            installmentPlan: "",
            numberOfInstallments: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <AppFormField
            name="amount"
            placeholder="Amount"
            keyboardType="numeric"
          />
          <AppFormPicker name="installmentPlan" items={installmentPlans} />
          <AppFormField
            name="numberOfInstallments"
            placeholder="Number of Installments"
            keyboardType="numeric"
          />
          <SubmitButton
            titleStyle={styles.titleStyle}
            btnContainerStyle={styles.btn}
            title="Add Option"
          />
        </AppForm>

        <AppButton
          titleStyle={styles.titleStyle}
          btnContainerStyle={styles.btn}
          title="Make the payment"
          onPress={handlePaystack}
        />

        <View style={styles.listContainer}>
          {options.map((opt, index) => (
            <View key={index} style={styles.optionCard}>
              <List
                leftTopLabel={`${opt.dueDate} Installments`}
                leftBottomLabel={`₦${opt.amount}`}
              />
            </View>
          ))}
        </View>

        {currentModal === "error" && (
          <ErrorModal
            visible={modalVisible}
            onClose={hideModal}
            responseText={responseMessage || "Submission failed"}
          />
        )}
        {currentModal === "success" && (
          <SuccessModal
            visible={modalVisible}
            onClose={hideModal}
            responseText={responseMessage || "Payment completed"}
          />
        )}
        {loading && <LoadingModal visible={loading} />}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContainer: {
    marginTop: 24,
  },
  optionCard: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titleStyle: {
    fontSize: 14,
    color: Colors.app.black,
    fontWeight: "500",
    fontFamily: "DM Sans",
    lineHeight: 20,
  },
  btn: {
    backgroundColor: Colors.app.white,
    width: "45%",
    height: 50,
    borderColor: Colors.app.light,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default InstallmentPlan;
