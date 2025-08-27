import elearning from "@/app/api/elearning";
import AppText from "@/components/custom/AppText";
import ErrorModal from "@/components/custom/ErrorModal";
import AppForm from "@/components/custom/forms/AppForm";
import AppFormField from "@/components/custom/forms/AppFormField";
import SubmitButton from "@/components/custom/forms/SubmitButton";
import LoadingModal from "@/components/custom/LoadingModal";
import SuccessModal from "@/components/custom/SuccessModal";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

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

const UpdateTutorProfile: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const result = await elearning.updateTutorProfile(
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
      if (!result.ok) {
        setResponseMessage("Update failed");
        showModal("error");
      } else {
        setResponseMessage("Profile updated");
        showModal("success");
      }
    } catch (error) {
      setResponseMessage("Update failed");
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
    <ScrollView contentContainerStyle={styles.container}>
      <AppText style={styles.header}>Update Tutor Profile</AppText>
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
        <AppFormField name="tutorQualification" placeholder="Qualification" />
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
          title="Update Profile"
          btnContainerStyle={styles.btn}
          titleStyle={styles.titleStyle}
        />
      </AppForm>
      {currentModal === "error" && (
        <ErrorModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Update failed"}
        />
      )}
      {currentModal === "success" && (
        <SuccessModal
          visible={modalVisible}
          onClose={hideModal}
          responseText={responseMessage || "Profile updated"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.app.screen,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 16,
    fontFamily: "DM Sans",
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

export default UpdateTutorProfile;
