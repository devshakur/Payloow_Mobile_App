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
  if (!business) {
    return (
      <View style={styles.noBusinessContainer}>
        <Text style={styles.noBusinessText}>No business found.</Text>
      </View>
    );
  }
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
    <View>
      <View style={styles.card}>
        <View style={styles.cards}>
          {" "}
          <Text style={styles.title}>{business.business_name}</Text>
        </View>
        <Text style={styles.desc}>{business.business_description}</Text>

        <View style={styles.tagContainer}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Stage: {business.business_stage}</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Model: {business.customer_model}</Text>
          </View>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>
              Industries: {business.industry.join(", ")}
            </Text>
          </View>
        </View>
      </View>

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

      {/* {showRepaymentDropdown && (
        <>
          <View style={styles.repaymentWrapper}>
            <Text style={styles.repaymentTitle}>Select Repayments:</Text>

            <View style={styles.multiSelectWrapper}>
              <MultiSelect
                style={styles.multiSelect}
                containerStyle={styles.multiSelectContainer}
                data={repaymentOptions}
                labelField="label"
                valueField="value"
                placeholder="Select repayments"
                value={selectedInstallments}
                onChange={setSelectedInstallments}
                selectedStyle={{ backgroundColor: Colors.app.primary + "33" }}
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
                  payments,
                });
              }}
              btnContainerStyle={styles.submitBtn}
              titleStyle={{ color: Colors.app.white }}
            />
          </View>
        </>
      )} */}
      {showRepaymentDropdown && (
        <View style={styles.repaymentWrapper}>
          <Text style={styles.repaymentTitle}>Select Repayments:</Text>

          {repaymentOptions.length > 0 ? (
            <View style={styles.multiSelectWrapper}>
              <MultiSelect
                style={styles.multiSelect}
                containerStyle={styles.multiSelectContainer}
                data={repaymentOptions}
                labelField="label"
                valueField="value"
                placeholder="Select repayments"
                value={selectedInstallments}
                onChange={setSelectedInstallments}
                selectedStyle={{ backgroundColor: Colors.app.primary + "33" }}
              />
            </View>
          ) : (
            <View style={styles.emptyRepaymentContainer}>
              <Text style={styles.emptyRepaymentText}>
                No repayments available.
              </Text>
            </View>
          )}

          {repaymentOptions.length > 0 && (
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
                  payments,
                });
              }}
              btnContainerStyle={styles.submitBtn}
              titleStyle={{ color: Colors.app.white }}
            />
          )}
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
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: "column",
  },
  repayHeaderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  emptyRepaymentContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyRepaymentText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },

  repayTextContainer: { flex: 1, paddingRight: 10 },
  repayHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  repaySubheading: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  repayButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  repayButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  repayImage: { width: 100, height: 100 },

  cards: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: "column",
  },
  repaymentWrapper: {
    marginTop: -4,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  repaymentTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
    color: Colors.app.dark,
  },
  multiSelectWrapper: {
    zIndex: 1,
    marginBottom: 12,
  },
  multiSelect: {
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    fontSize: 14,
  },
  multiSelectContainer: {
    maxHeight: 250,
    zIndex: 1,
    width: "100%",
  },
  submitBtn: {
    backgroundColor: Colors.app.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
    color: "#222",
  },
  noBusinessContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  noBusinessText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },

  desc: {
    fontSize: 14,
    marginBottom: 12,
    color: "#555",
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // for spacing between badges
  },
  tagBadge: {
    backgroundColor: "#eef2f5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
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
