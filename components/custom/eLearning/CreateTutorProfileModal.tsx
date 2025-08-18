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
  tutorName: Yup.string().required("Tutor name is required"),
  tutorEmail: Yup.string().email().required("Tutor email is required"),
  tutorPhone: Yup.string().required("Tutor phone is required"),
  tutorAbout: Yup.string().required("About is required"),
  tutorImage: Yup.string().url().required("Image URL is required"),
  tutorQualification: Yup.string().required("Qualification is required"),
  tutorExperience: Yup.string().required("Experience is required"),
  tutorAchievements: Yup.string().required("Achievements are required"),
  tutorFacebook: Yup.string().url().nullable(),
  tutorTwitter: Yup.string().url().nullable(),
  tutorLinkedIn: Yup.string().url().nullable(),
  tutorInstagram: Yup.string().url().nullable(),
});

interface CreateTutorProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface errorResponse {
  error: string;
}

const CreateTutorProfileModal: React.FC<CreateTutorProfileModalProps> = ({
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
      // Destructure and pass profile payload
      const profileResult = await elearning.createTutorProfile(
        values.tutorName,
        values.tutorEmail,
        values.tutorPhone,
        values.tutorAbout,
        values.tutorImage,
        values.tutorQualification,
        values.tutorExperience,
        values.tutorAchievements,
        values.tutorFacebook,
        values.tutorTwitter,
        values.tutorLinkedIn,
        values.tutorInstagram
      );
      if (!profileResult.ok) {
        const msg =
          (profileResult.data as errorResponse).error || "Submission failed";
        setResponseMessage(msg);
        showModal("error");
        setLoading(false);
        return;
      } else {
        setResponseMessage("Profile created");
        showModal("success");
      }
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
          <AppText style={styles.labelTitle}>Create Tutor Profile</AppText>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                tutorName: "",
                tutorEmail: "",
                tutorPhone: "",
                tutorAbout: "",
                tutorImage: "",
                tutorQualification: "",
                tutorExperience: "",
                tutorAchievements: "",
                tutorFacebook: "",
                tutorTwitter: "",
                tutorLinkedIn: "",
                tutorInstagram: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField name="tutorName" placeholder="Tutor Name" />
              <AppFormField
                name="tutorEmail"
                placeholder="Tutor Email"
                keyboardType="email-address"
              />
              <AppFormField name="tutorPhone" placeholder="Tutor Phone" />
              <AppFormField name="tutorAbout" placeholder="About" multiline />
              <AppFormField name="tutorImage" placeholder="Image URL" />
              <AppFormField
                name="tutorQualification"
                placeholder="Qualification"
              />
              <AppFormField
                name="tutorExperience"
                placeholder="Experience"
                multiline
              />
              <AppFormField
                name="tutorAchievements"
                placeholder="Achievements"
                multiline
              />
              <AppFormField name="tutorFacebook" placeholder="Facebook URL" />
              <AppFormField name="tutorTwitter" placeholder="Twitter URL" />
              <AppFormField name="tutorLinkedIn" placeholder="LinkedIn URL" />
              <AppFormField name="tutorInstagram" placeholder="Instagram URL" />
              <SubmitButton
                title="Create Profile"
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
          responseText={responseMessage || "Profile created"}
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

export default CreateTutorProfileModal;
