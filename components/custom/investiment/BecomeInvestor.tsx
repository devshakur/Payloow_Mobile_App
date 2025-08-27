// BecomeInvestor.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { Colors } from "@/constants/Colors";
import investment from "../../../app/api/investment";
import AppText from "../../../components/custom/AppText";
import ErrorModal from "../../../components/custom/ErrorModal";
import AppForm from "../../../components/custom/forms/AppForm";
import AppFormField from "../../../components/custom/forms/AppFormField";
import SubmitButton from "../../../components/custom/forms/SubmitButton";
import LoadingModal from "../../../components/custom/LoadingModal";
import SuccessModal from "../../../components/custom/SuccessModal";
import AppFormMultiSelect from "../forms/AppFormMultiSelect";

const industries = [
  { label: "Fintech", value: "fintech" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Healthcare", value: "healthcare" },
];

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  phoneNumber: Yup.string().required("Required"),
  industries: Yup.array().min(1, "Select at least one industry"),
});

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const BecomeInvestor: React.FC<Props> = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<"success" | "error" | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const showModal = (type: "success" | "error", message: string) => {
    setCurrentModal(type);
    setResponseMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const handleSubmit = async (values: {
    email: string;
    phoneNumber: string;
    industries: string[];
  }) => {
    setLoading(true);
    const payload = {
      ...values,
      userType: "investor",
    };

    try {
      const response = await investment.becomeInvestor(values);

      if (response.ok) {
        showModal("success", "Submitted successfully!");
      } else {
        showModal("error", "Submission failed");
      }
    } catch {
      showModal("error", "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalBackground}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              color={Colors.app.black}
              size={24}
            />
          </TouchableOpacity>

          <AppText style={styles.labelTitle}>Join as Investor</AppText>

          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollView}
          >
            <AppForm
              initialValues={{
                email: "",
                phoneNumber: "",
                industries: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <AppText style={styles.label}>Industries</AppText>
              <AppFormMultiSelect
                name="industries"
                data={industries}
                placeholder="Select Industries"
                onFocus={handleFocus}
              />

              <AppText style={styles.label}>Email</AppText>
              <AppFormField
                name="email"
                placeholder="Email"
                keyboardType="email-address"
              />

              <AppText style={styles.label}>Phone Number</AppText>
              <AppFormField
                name="phoneNumber"
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />

              <SubmitButton
                title="Submit"
                btnContainerStyle={styles.btn}
                titleStyle={styles.titleStyle}
              />
            </AppForm>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={currentModal === "success" && modalVisible}
        onClose={() => {
          hideModal();
          onClose();
        }}
        responseText={responseMessage || ""}
      />
      <ErrorModal
        visible={currentModal === "error" && modalVisible}
        onClose={hideModal}
        responseText={responseMessage || ""}
      />
      {loading && <LoadingModal visible />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    marginTop: 10,
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

export default BecomeInvestor;
