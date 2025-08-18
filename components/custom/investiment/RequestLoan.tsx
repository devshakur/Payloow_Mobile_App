import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import investment from "@/app/api/investment";
import { Colors } from "@/constants/Colors";
import { Business } from "../../../app/screens/investiment/Request";
import AppText from "../../../components/custom/AppText";
import ErrorModal from "../../../components/custom/ErrorModal";
import AppForm from "../../../components/custom/forms/AppForm";
import AppFormField from "../../../components/custom/forms/AppFormField";
import AppFormImagePicker from "../../../components/custom/forms/AppFormImagePicker";
import AppFormPicker from "../../../components/custom/forms/AppFormPicker";
import SubmitButton from "../../../components/custom/forms/SubmitButton";
import LoadingModal from "../../../components/custom/LoadingModal";
import SuccessModal from "../../../components/custom/SuccessModal";

const validationSchema = Yup.object().shape({
  businessId: Yup.string().required("Business is required"),
  loan_amount: Yup.string().required("Loan amount is required"),
  credit_score: Yup.string().required("Credit score is required"),
  collateral: Yup.string().required("Collateral is required"),
  proofOfCreditScoreFile: Yup.mixed().required(
    "Proof of credit score is required"
  ),
  proofOfCollateralFile: Yup.mixed().required(
    "Proof of collateral is required"
  ),
});

interface RequestLoanProps {
  isVisible: boolean;
  onClose: () => void;
}

interface BusinessType {
  label: string;
  value: string;
}

interface LoanFormValues {
  businessId: string;
  loan_amount: string;
  credit_score: string;
  collateral: string;
  proofOfCreditScoreFile: {
    uri: string;
    name?: string;
    type?: string;
  } | null;
  proofOfCollateralFile: {
    uri: string;
    name?: string;
    type?: string;
  } | null;
}

const RequestLoan: React.FC<RequestLoanProps> = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const fetchBusinesses = async () => {
      try {
        const response = (await investment.getBusiness()).data as Business[];
        const formatted = response.map((b: Business) => ({
          label: b.business_name,
          value: b._id,
        }));
        setBusinesses([...formatted]);
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };

    fetchBusinesses();
  }, [isVisible]);

  const showModal = (type: "success" | "error", message: string) => {
    setCurrentModal(type);
    setResponseMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg";
  };

  const handleSubmit = async (values: LoanFormValues) => {
    setLoading(true);
    const formData = new FormData();

    // Append text fields
    formData.append("businessId", values.businessId);
    formData.append("loan_amount", values.loan_amount);
    formData.append("credit_score", values.credit_score);
    formData.append("collateral", values.collateral);

    if (values.proofOfCreditScoreFile) {
      const mime = getMimeType(values.proofOfCreditScoreFile.uri);
      const ext = mime.split("/")[1];
      formData.append("proofOfCreditScoreFile", {
        uri: values.proofOfCreditScoreFile.uri,
        name: `creditScore.${ext}`,
        type: mime,
      } as any);
    }

    if (values.proofOfCollateralFile) {
      const mime = getMimeType(values.proofOfCollateralFile.uri);
      const ext = mime.split("/")[1];
      formData.append("proofOfCollateralFile", {
        uri: values.proofOfCollateralFile.uri,
        name: `collateral.${ext}`,
        type: mime,
      } as any);
    }

    try {
    
      const result = await investment.addLoan(formData);
  
      if (result.ok) {
        showModal("success", "Loan created successfully.");
      } else {
        showModal("error", "Failed to create loan.");
      }
    } catch (error) {
      console.error("Error submitting loan:", error);
      showModal("error", "Something went wrong.");
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
              color={Colors.app.black}
              size={24}
            />
          </TouchableOpacity>

          <AppText style={styles.labelTitle}>Create Loan</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                businessId: "",
                loan_amount: "",
                credit_score: "",
                collateral: "",
                proofOfCreditScoreFile: null,
                proofOfCollateralFile: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <AppText style={styles.label}>Business</AppText>
              <AppFormPicker
                name="businessId"
                items={businesses}
                placeholder={{ label: "Select Business", value: null }}
              />

              <AppText style={styles.label}>Loan Amount</AppText>
              <AppFormField
                name="loan_amount"
                placeholder="Loan Amount"
                keyboardType="numeric"
                icon="currency-ngn"
              />

              <AppText style={styles.label}>Credit Score</AppText>
              <AppFormField
                name="credit_score"
                placeholder="Credit Score"
                keyboardType="numeric"
                icon="star"
              />

              <AppText style={styles.label}>Collateral</AppText>
              <AppFormField
                name="collateral"
                placeholder="Collateral"
                icon="shield-lock"
              />

              <AppText style={styles.label}>Proof of Credit Score</AppText>
              <AppFormImagePicker name="proofOfCreditScoreFile" />

              <AppText style={styles.label}>Proof of Collateral</AppText>
              <AppFormImagePicker name="proofOfCollateralFile" />

              <SubmitButton
                title="Submit Loan Request"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
            </AppForm>
          </ScrollView>
        </View>
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
          onClose={() => {
            hideModal();
            onClose();
          }}
          responseText={responseMessage || "Loan created successfully"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
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
    marginBottom: 5,
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

export default RequestLoan;
