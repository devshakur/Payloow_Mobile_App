import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import elearning from "../../../app/api/elearning";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";
import { UploadVideoResponse } from "./CreateCourse";

interface Lesson {
  _id?: string;
  section_id?: string;
  title: string;
  videoUrl: string;
  duration: number;
  order?: number;
  quizzes?: any[];
  exercises?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Section {
  _id: string;
  course_id?: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exercises?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  courseId: string;
  existingSection: Section;
}

const UpdateSectionModal: React.FC<Props> = ({
  visible,
  onClose,
  courseId,
  existingSection,
}) => {
  const [section, setSection] = useState<Section | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (visible) setSection(existingSection);
  }, [visible, existingSection]);

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const handleVideoUpload = async (lessonIndex: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0] || !section) return;

      const file = result.assets[0];
      setUploadingVideoIndex(lessonIndex);

      const fileName = file.name;
      const fileType = file.mimeType || "video/mp4";

      const uploadData = (
        await elearning.uploadLesson(fileName, fileType, courseId)
      ).data as UploadVideoResponse;
      const videoBlob = await fetch(file.uri).then((res) => res.blob());

      const res = await elearning.uploadToGoogle(
        uploadData.uploadUrl,
        videoBlob,
        fileType
      );

      if (res.status === 200) {
        const updatedLessons = [...section.lessons];
        updatedLessons[lessonIndex].videoUrl = uploadData.publicUrl;
        setSection({ ...section, lessons: updatedLessons });

        Alert.alert("Success", "Video uploaded successfully!");
      }
    } catch (err) {
      console.error("Video upload failed", err);
      Alert.alert("Error", "Failed to upload video");
    } finally {
      setUploadingVideoIndex(null);
    }
  };

  const handleAddLesson = () => {
    if (!section) return;
    const updatedLessons = [...section.lessons];
    updatedLessons.push({
      title: "",
      duration: 0,
      videoUrl: "",
    });
    setSection({ ...section, lessons: updatedLessons });
  };

  const handleUpdate = async () => {
    setLoading(true);
    if (!section) return;
    try {
      setUploading(true);

      const lessonsPayload = section.lessons.map((lesson, index) => {
        const payload = {
          title: lesson.title,
          duration: Number(lesson.duration),
          videoUrl: lesson.videoUrl,
          order: index + 1,
        };
        return lesson._id ? { ...payload, _id: lesson._id } : payload;
      });

      const result = await elearning.updateSection(
        section._id,
        courseId,
        section.title,
        section.description,
        lessonsPayload
      );

      if (result.ok) {
        setResponseMessage("Successfully edited a section");
        showModal("success");
        setLoading(false);
      }

      setResponseMessage("Successfully edited a section");
      showModal("success");
      setLoading(false);
    } catch (err) {
      console.error("Section update failed", err);
      Alert.alert("Error", "Failed to update section");
    } finally {
      setUploading(false);
    }
  };

  if (!section) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <AppText style={styles.header}>Update Section</AppText>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <TextInput
              placeholder="Section Title"
              style={styles.input}
              value={section.title}
              onChangeText={(text) => setSection({ ...section, title: text })}
            />
            <TextInput
              placeholder="Section Description"
              style={styles.input}
              value={section.description}
              onChangeText={(text) =>
                setSection({ ...section, description: text })
              }
            />

            {section.lessons.map((lesson, lessonIndex) => (
              <View
                key={lesson._id || lessonIndex}
                style={styles.lessonContainer}
              >
                <Text style={styles.lessonLabel}>Lesson {lessonIndex + 1}</Text>
                <TextInput
                  placeholder="Lesson Title"
                  style={styles.input}
                  value={lesson.title}
                  onChangeText={(text) => {
                    const updatedLessons = [...section.lessons];
                    updatedLessons[lessonIndex].title = text;
                    setSection({ ...section, lessons: updatedLessons });
                  }}
                />
                <TextInput
                  placeholder="Duration (mins)"
                  keyboardType="numeric"
                  style={styles.input}
                  value={lesson.duration?.toString() || ""}
                  onChangeText={(text) => {
                    const updatedLessons = [...section.lessons];
                    updatedLessons[lessonIndex].duration = parseInt(
                      text || "0"
                    );
                    setSection({ ...section, lessons: updatedLessons });
                  }}
                />
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => handleVideoUpload(lessonIndex)}
                >
                  <AppText style={{ color: "#fff" }}>
                    {uploadingVideoIndex === lessonIndex ? (
                      <ActivityIndicator color="#fff" />
                    ) : lesson.videoUrl ? (
                      "Replace Video"
                    ) : (
                      "Upload Video"
                    )}
                  </AppText>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={handleAddLesson}>
              <Text style={styles.addLessonBtn}>
                <Ionicons name="add-circle" size={20} /> Add Lesson
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleUpdate}
            disabled={uploading}
          >
            <Text style={styles.submitText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
          responseText={responseMessage || "Sections created successfully"}
        />
      )}
      {loading && <LoadingModal visible={loading} />}
    </Modal>
  );
};

export default UpdateSectionModal;

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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.app.primary,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  lessonContainer: {
    marginBottom: 15,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  lessonLabel: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  uploadBtn: {
    backgroundColor: Colors.app.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: Colors.app.primary,
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginVertical: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelText: {
    color: Colors.app.primary,
    textAlign: "center",
    fontSize: 16,
  },
  addLessonBtn: {
    color: Colors.app.primary,
    marginTop: 10,
    textAlign: "center",
  },
});
