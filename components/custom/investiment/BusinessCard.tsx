import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import investmentApi from "../../../app/api/investment";
import { useUser } from "../../../app/context/UserProvider";
import {
  Business,
  RepaymentSchedule,
} from "../../../app/screens/investiment/Request";
import AppButton from "../AppButton";
import ErrorModal from "../ErrorModal";
import SuccessModal from "../SuccessModal";

interface Props {
  images: string[];
}

const HorizontalImageScroll = ({ images }: Props) => {
  if (!images || images.length === 0) return null;
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface BusinessCardProps {
  business: Business;
  showApprovalButtons?: boolean;
  showRepaymentDropdown?: boolean;
  repaymentSchedule?: RepaymentSchedule[];
  investmentId?: string; // <-- use this instead of passing the whole Investment object
  onLoading: (val: boolean) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  showApprovalButtons = false,
  showRepaymentDropdown = false,
  repaymentSchedule,
  investmentId,
  onLoading,
}) => {
  const [selectedInstallments, setSelectedInstallments] = useState<string[]>(
    []
  );

  const { user, setUser } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<"success" | "error" | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState("");

  const repaymentOptions =
    repaymentSchedule?.map((repayment) => ({
      label: `Installment ${repayment.installment} - ₦${repayment.amount.$numberDecimal}`,
      value: repayment._id,
      amount: Number(repayment.amount.$numberDecimal),
    })) || [];



  const submitRepayment = async ({
    investmentId,
    payments,
  }: {
    investmentId: string | null;
    payments: { installmentId: string; amount: number }[];
  }) => {
    try {
      onLoading(true);
      const response = await investmentApi.repay(investmentId || "", payments);
  
      if (response.ok) {
        onLoading(false);
        setCurrentModal("success");
        setResponseMessage("Request submitted successfully!");
        setTimeout(() => setModalVisible(false), 2000);
      } else {
        onLoading(false);
        setCurrentModal("error");
        setResponseMessage("Failed to submit request.");
      }
    } catch (err) {
      console.error("Repayment error:", err);
    }
  };

  const handleSubmit = async (investmentId: string, status: string) => {
    setModalVisible(true);
    onLoading(true);
    try {
      const response = await investmentApi.approve(investmentId, status);
      const data = response.data as Response;

      if (response.ok) {
        onLoading(false);
        setCurrentModal("success");
        setResponseMessage("Request submitted successfully!");
        setTimeout(() => setModalVisible(false), 2000);
      } else {
        onLoading(false);
        setCurrentModal("error");
        setResponseMessage("Failed to submit request.");
      }
    } catch (error: any) {
      onLoading(false);
      setCurrentModal("error");
      setResponseMessage(error?.message || "Failed to submit request.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{business.business_name}</Text>
      <Text style={styles.desc}>{business.business_description}</Text>

      <Text style={styles.tag}>Stage: {business.business_stage}</Text>
      <Text style={styles.tag}>Model: {business.customer_model}</Text>
      <Text style={styles.tag}>Industries: {business.industry.join(", ")}</Text>

      {business.loan && user?.data.investmentRole === "investor" && (
        <View style={styles.loanContainer}>
          <Text style={styles.loanTitle}>Loan Details:</Text>
          <Text>Amount: ₦{business.loan.loan_amount}</Text>
          <Text>Collateral: {business.loan.collateral}</Text>
          <Text>Credit Score: {business.loan.credit_score}</Text>
          <Text>Status: {business.loan.status}</Text>
          <Text>Amount Disbursed: ₦{business.loan.amount_disbursed}</Text>
        </View>
      )}

      <HorizontalImageScroll
        images={[
          business.financial_statements[0],
          business.growth_plans[0],
          business.loan_requirements[0],
        ].filter(Boolean)}
      />

      {showRepaymentDropdown && (
        <View
          style={{
            marginTop: 12,
            minHeight: 100,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Select Repayments:
          </Text>

          <View style={{ zIndex: 1 }}>
            <MultiSelect
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 6,
              }}
              containerStyle={{
                maxHeight: 250,
                zIndex: 1,
                width: "50%",
              }}
              data={repaymentOptions}
              labelField="label"
              valueField="value"
              placeholder="Select repayments"
              value={selectedInstallments}
              onChange={setSelectedInstallments}
            />
          </View>

          <AppButton
            title="Submit Repayment"
            onPress={() => {
              const payments = repaymentOptions
                .filter((opt) => selectedInstallments.includes(opt.value))
                .map((opt) => ({
                  installmentId: opt.value,
                  amount: opt.amount,
                }));

              submitRepayment?.({
                investmentId: investmentId || "",
                payments: payments,
              });
            }}
            btnContainerStyle={{
              backgroundColor: Colors.app.primary,
              marginTop: 10,
            }}
            titleStyle={{ color: Colors.app.white }}
          />
        </View>
      )}

      {/* Approval Section */}
      {showApprovalButtons && (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <AppButton
            title="Accept"
            onPress={() => handleSubmit?.(investmentId || "", "approved")}
            btnContainerStyle={{ backgroundColor: "green", flex: 1 }}
            titleStyle={{ color: Colors.app.white }}
          />
          <AppButton
            title="Decline"
            onPress={() => handleSubmit?.(investmentId || "", "declined")}
            btnContainerStyle={{ backgroundColor: "red", flex: 1 }}
            titleStyle={{ color: Colors.app.white }}
          />
        </View>
      )}

      {/* Feedback Modals */}
      {modalVisible && currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          responseText={responseMessage}
        />
      )}
      {modalVisible && currentModal === "error" && (
        <ErrorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          responseText={responseMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
  },
  tag: {
    fontSize: 13,
    marginBottom: 2,
    color: "#555",
  },
  loanContainer: {
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  loanTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    gap: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
});

export default BusinessCard;
