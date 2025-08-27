import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { Colors } from "@/constants/Colors";
import investment from "../../../app/api/investment";
import { Business } from "../../../app/screens/investiment/Request";
import AppText from "../../../components/custom/AppText";
import ErrorModal from "../../../components/custom/ErrorModal";
import AppFormField from "../../../components/custom/forms/AppFormField";
import LoadingModal from "../../../components/custom/LoadingModal";
import SuccessModal from "../../../components/custom/SuccessModal";
import AppForm from "../forms/AppForm";
import AppFormPicker from "../forms/AppFormPicker";
import SubmitButton from "../forms/SubmitButton";

interface InvestProps {
  isVisible: boolean;
  onClose: () => void;
  businesses: Business[];
}

const validationSchema = Yup.object().shape({
  businessId: Yup.string().required("Business ID is required"),
  investmentAmount: Yup.string().required("Investment amount is required"),
  expectedRoi: Yup.string().required("Expected ROI is required"),
  paymentFrequency: Yup.string().required("Payment frequency is required"),
  paymentTerm: Yup.number().required("Payment term is required"),
});

const Invest: React.FC<InvestProps> = ({ isVisible, onClose, businesses }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const showModal = (type: "success" | "error", message: string) => {
    setCurrentModal(type);
    setResponseMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
  

    try {
      // Convert paymentTerm to number for API
      const result = await investment.invest(
        values.businessId,
        Number(values.investmentAmount),
        Number(values.expectedRoi),
        values.paymentFrequency,
        Number(values.paymentTerm)
      );

      if (result.ok) {
        showModal("success", "Investment submitted successfully.");
      } else {
        showModal("error", "Investment submitted failed.");
      }
    } catch (error) {
      showModal("error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.nutch} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={Colors.app.black}
            />
          </TouchableOpacity>

          <AppText style={styles.labelTitle}>Invest in Business</AppText>

          <AppForm
            initialValues={{
              businessId: "",
              investmentAmount: "",
              expectedRoi: "",
              paymentFrequency: "",
              paymentTerm: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={{ marginBottom: 10 }}>
                <AppText style={styles.label}>Business</AppText>
                <AppFormPicker
                  name="businessId"
                  items={businesses.map((b) => ({
                    label: b.business_name,
                    value: b._id,
                  }))}
                  placeholder={{ label: "Select Business", value: null }}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <AppText style={styles.label}>Investment Amount</AppText>
                <AppFormField
                  name="investmentAmount"
                  placeholder="Investment Amount"
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <AppText style={styles.label}>Expected ROI</AppText>
                <AppFormField name="expectedRoi" placeholder="Expected ROI" />
              </View>
              <View style={{ marginBottom: 10 }}>
                <AppText style={styles.label}>Payment Frequency</AppText>
                <AppFormPicker
                  name="paymentFrequency"
                  items={[
                    { label: "Yearly", value: "yearly" },
                    { label: "Monthly", value: "monthly" },
                  ]}
                  placeholder={{ label: "Select Frequency", value: "" }}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <AppText style={styles.label}>Payment Term (years)</AppText>
                <AppFormField
                  name="paymentTerm"
                  placeholder="Payment Term (years)"
                  keyboardType="numeric"
                />
              </View>

              <SubmitButton
                title="Submit"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
            </ScrollView>
          </AppForm>
        </View>

        {currentModal === "error" && (
          <ErrorModal
            visible={modalVisible}
            onClose={() => {
              hideModal();
              onClose();
            }}
            responseText={responseMessage || "Submission failed"}
          />
        )}
        {currentModal === "success" && (
          <SuccessModal
            visible={modalVisible}
            onClose={() => {
              hideModal();
              onClose();
            }}
            responseText={
              responseMessage || "Investment submitted successfully"
            }
          />
        )}
        {loading && <LoadingModal visible={loading} />}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.app.screen,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    maxHeight: "90%",
    marginTop: 50,
  },
  nutch: {
    width: 120,
    height: 5,
    backgroundColor: Colors.app.black,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  closeBtn: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 10,
    padding: 10,
  },
  labelTitle: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.black,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 10,
    color: Colors.app.black,
  },
  btn: {
    marginTop: 20,
    backgroundColor: Colors.app.primary,
  },
  titleStyle: {
    color: Colors.app.white,
    fontWeight: "bold",
  },
});

export default Invest;
