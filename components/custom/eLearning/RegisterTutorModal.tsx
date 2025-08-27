import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import elearning from "../../../app/api/elearning";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  password: Yup.string().required("Password is required"),
  phone: Yup.number().required("Phone is required"),
  email: Yup.string().email().required("Email is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  address: Yup.string().required("Address is required"),
});

interface RegisterTutorModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const RegisterTutorModal: React.FC<RegisterTutorModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Destructure and pass registration payload
      const registerResult = await elearning.registerTutor(
        values.firstName,
        values.lastName,
        values.password,
        values.phone,
        values.email,
        values.country,
        values.state,
        values.address
      );
      if (!registerResult.ok) {
        setResponseMessage("Submission failed");
        showModal("error");
        setLoading(false);
        return;
      }
      setResponseMessage("Successfully registered");
      showModal("success");
    } catch (error) {
      setResponseMessage("Submission failed");
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
          <AppText style={styles.labelTitle}>Register Tutor</AppText>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                firstName: "",
                lastName: "",
                password: "",
                phone: "",
                email: "",
                country: "",
                state: "",
                address: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField name="firstName" placeholder="First Name" />
              <AppFormField name="lastName" placeholder="Last Name" />
              <AppFormField
                name="password"
                placeholder="Password"
                secureTextEntry
              />
              <AppFormField
                name="phone"
                placeholder="Phone"
                keyboardType="numeric"
              />
              <AppFormField
                name="email"
                placeholder="Email"
                keyboardType="email-address"
              />
              <AppFormField name="country" placeholder="Country" />
              <AppFormField name="state" placeholder="State" />
              <AppFormField name="address" placeholder="Address" />
              <SubmitButton
                title="Register"
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
          responseText={responseMessage || "Successfully registered"}
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
  btn: {
    marginTop: 20,
    backgroundColor: Colors.app.primary,
  },
  titleStyle: {
    color: Colors.app.white,
    fontWeight: "bold",
  },
});

export default RegisterTutorModal;
