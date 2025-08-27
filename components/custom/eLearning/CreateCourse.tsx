import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import AppFormImagePicker from "../forms/AppFormImagePicker";
import SubmitButton from "../forms/SubmitButton";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

import elearning from "@/app/api/elearning";

export interface UploadVideoResponse {
  uploadUrl: string;
  publicUrl: string;
}

interface CreateCourseProps {
  isVisible: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  duration: Yup.string().required("Duration is required"),
  price: Yup.number().required("Price is required"),
  discount_price: Yup.number().min(0, "Discount must be 0 or more"),
  introductoryVideoUrl: Yup.string(),
  courseThumbnail: Yup.mixed().required("Thumbnail is required"),
  projectTitle: Yup.string().required("Project title is required"),
  projectDescription: Yup.string().required("Project description is required"),
  tags: Yup.string().required("At least one tag is required"),
});

const CreateCourse: React.FC<CreateCourseProps> = ({ isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [introVideoFile, setIntroVideoFile] = useState<any | null>(null);
  const [courseProjectFile, setCourseProjectFile] = useState<any | null>(null);

  const getMimeType = (uri: string): string => {
    const ext = uri.split(".").pop()?.toLowerCase();
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    return "image/jpeg";
  };

  const pickIntroVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      setIntroVideoFile(file);
      Alert.alert(
        "Success",
        "Intro video selected. It will be uploaded when you submit."
      );
    } catch (error) {
      console.error("Video selection failed", error);
      Alert.alert("Error", "Failed to select video");
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

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      let introVideoUrl = "";

      if (introVideoFile) {
        const fileName = introVideoFile.name;
        const fileType = introVideoFile.mimeType || "video/mp4";

        // Step 1: Get signed URL
        const data = (await elearning.uploadIntro(fileName, fileType))
          .data as UploadVideoResponse;

        // Step 2: Fetch blob
        const videoBlob = await fetch(introVideoFile.uri).then((res) =>
          res.blob()
        );

        // Step 3: Upload to Google
        const res = await elearning.uploadToGoogle(
          data.uploadUrl,
          videoBlob,
          fileType
        );

        console.log(res);

        // Step 4: Check for success
        if (res.status === 200) {
          introVideoUrl = data.publicUrl;
        } else {
          Alert.alert("Error", "Failed to submit an intro video");
          setLoading(false);
          return;
        }
      } else {
        Alert.alert("Error", "Please select an intro video before submitting.");
        setLoading(false);
        return;
      }

      // Continue with form submission
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("duration", values.duration);
      formData.append("price", values.price);
      formData.append("discount_price", values.discount_price || "");
      formData.append("introductoryVideoUrl", introVideoUrl);
      formData.append("tags[]", values.tags);
      formData.append("projectTitle", values.projectTitle);
      formData.append("projectDescription", values.projectDescription);

      // Append thumbnail
      const thumbnailMime = getMimeType(values.courseThumbnail);
      const ext = thumbnailMime.split("/")[1];
      formData.append("courseThumbnail", {
        uri: values.courseThumbnail,
        name: `thumbnail.${ext}`,
        type: thumbnailMime,
      } as any);

      // Append project
      if (!courseProjectFile) {
        Alert.alert("Error", "Please select a course project file");
        setLoading(false);
        return;
      }

      formData.append("courseProject", {
        uri: courseProjectFile.uri,
        name: courseProjectFile.name,
        type: courseProjectFile.mimeType || "application/octet-stream",
      } as any);

      // Submit the course
      const result = await elearning.createCourse(formData);

      if (!result.ok) {
        setResponseMessage("Submission failed");
        showModal("error");
      } else {
        setResponseMessage("Course created successfully");
        showModal("success");
      }
    } catch (error) {
      console.error("Course creation error:", error);
      setResponseMessage("An error occurred while creating the course");
      showModal("error");
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

          <AppText style={styles.labelTitle}>Create Course</AppText>

          <ScrollView contentContainerStyle={styles.scrollView}>
            <AppForm
              initialValues={{
                title: "",
                description: "",
                category: "",
                duration: "",
                price: 0,
                discount_price: 0,
                introductoryVideoUrl: "",
                courseThumbnail: null,

                projectTitle: "",
                projectDescription: "",
                tags: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppText style={styles.label}>Title</AppText>
              <AppFormField name="title" placeholder="e.g. Intro to React" />

              <AppText style={styles.label}>Description</AppText>
              <AppFormField
                name="description"
                placeholder="Course description..."
                multiline
              />

              <AppText style={styles.label}>Category</AppText>
              <AppFormField name="category" placeholder="e.g. Programming" />

              <AppText style={styles.label}>Duration</AppText>
              <AppFormField name="duration" placeholder="e.g. 6 weeks" />

              <AppText style={styles.label}>Price</AppText>
              <AppFormField
                name="price"
                placeholder="e.g. 100"
                keyboardType="numeric"
              />

              <AppText style={styles.label}>Discount Price</AppText>
              <AppFormField
                name="discount_price"
                placeholder="e.g. 80"
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickIntroVideo}
              >
                <AppText style={styles.uploadBtnText}>
                  {introVideoFile
                    ? "Intro Video Selected ✅"
                    : "Select Intro Video"}
                </AppText>
              </TouchableOpacity>

              <AppText style={styles.label}>Thumbnail Image</AppText>
              <AppFormImagePicker name="courseThumbnail" />

              <AppText style={styles.label}>Tags</AppText>
              <AppFormField
                name="tags"
                placeholder="e.g. programming, backend"
              />

              <AppText style={styles.label}>Project Title</AppText>
              <AppFormField
                name="projectTitle"
                placeholder="e.g. Final Project"
              />

              <AppText style={styles.label}>Project Description</AppText>
              <AppFormField
                name="projectDescription"
                placeholder="Describe the final project"
                multiline
              />

              <AppText style={styles.label}>Course Project File</AppText>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={async () => {
                  try {
                    const result = await DocumentPicker.getDocumentAsync({
                      type: [
                        "application/zip",
                        "application/x-zip-compressed",
                        "application/pdf",
                        "application/msword",
                      ],
                      copyToCacheDirectory: true,
                    });

                    if (result.canceled || !result.assets?.[0]) return;

                    const file = result.assets[0];
                    setCourseProjectFile(file);
                    Alert.alert("Success", "Course project file selected ✅");
                  } catch (error) {
                    console.error("Project file selection failed", error);
                    Alert.alert("Error", "Failed to select project file");
                  }
                }}
              >
                <AppText style={styles.uploadBtnText}>
                  {courseProjectFile
                    ? "Project File Selected ✅"
                    : "Select Project File"}
                </AppText>
              </TouchableOpacity>

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
          responseText={responseMessage || "Course created successfully"}
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
  uploadBtn: {
    backgroundColor: Colors.app.primary,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  uploadBtnText: {
    color: Colors.app.white,
    fontWeight: "bold",
  },
});

export default CreateCourse;
