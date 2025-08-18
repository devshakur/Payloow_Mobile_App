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

// 545611

import { Colors } from "@/constants/Colors";
import elearning from "../../../app/api/elearning";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

interface CreateAnnouncementProps {
  isVisible: boolean;
  onClose: () => void;
  courseId: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
});

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({
  isVisible,
  onClose,
  courseId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    setLoading(true);
    try {
      const result = await elearning.createAnnouncement(
        courseId || "",
        title,
        description
      );

      if (!result.ok) {
        setResponseMessage("Failed to create announcement");
        showModal("error");
      } else {
        setResponseMessage("Announcement created successfully");
        showModal("success");
      }
    } catch (error) {
      console.error("Announcement error:", error);
      setResponseMessage("An unexpected error occurred.");
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

          <AppText style={styles.labelTitle}>Create Announcement</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                title: "",
                description: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppText style={styles.label}>Title</AppText>
              <AppFormField
                name="title"
                placeholder="e.g. New Course Updates"
              />

              <AppText style={styles.label}>Description</AppText>
              <AppFormField
                name="description"
                placeholder="Your message here..."
                multiline
              />

              <SubmitButton
                title="Submit"
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
          onClose={() => hideModal()}
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
          responseText={responseMessage || "Announcement created successfully"}
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

export default CreateAnnouncement;
