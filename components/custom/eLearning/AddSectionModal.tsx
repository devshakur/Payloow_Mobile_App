import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useRef, useState } from "react";
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
import { Colors } from "../../../constants/Colors";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

export interface UploadVideoResponse {
  uploadUrl: string;
  publicUrl: string;
}

interface Lesson {
  title: string;
  duration: number;
  videoUrl: string;
}

interface Section {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  courseId: string;
}

interface ErrorResponse {
  error: string;
}

const AddSectionModal: React.FC<Props> = ({ visible, onClose, courseId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const [sections, setSections] = useState<Section[]>([
    {
      title: "",
      description: "",
      lessons: [{ title: "", duration: 0, videoUrl: "" }],
    },
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState<{
    section: number;
    lesson: number;
  } | null>(null);

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const handleVideoUpload = async (
    sectionIndex: number,
    lessonIndex: number
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });



      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];

      setUploadingVideoIndex({ section: sectionIndex, lesson: lessonIndex });

      const fileName = file.name;
      const fileType = file.mimeType || "video/mp4";

      const data = (await elearning.uploadLesson(fileName, fileType, courseId))
        .data as UploadVideoResponse;

      const videoBlob = await fetch(file.uri).then((res) => res.blob());

      const res = await elearning.uploadToGoogle(
        data.uploadUrl,
        videoBlob,
        fileType
      );

      if (res.status === 200) {
        const updated = [...sections];
        updated[sectionIndex].lessons[lessonIndex].videoUrl = (
          data as UploadVideoResponse
        ).publicUrl;
        setSections(updated);
      }

      Alert.alert("Success", "Video uploaded successfully!");
    } catch (err) {
      console.error("Video upload failed", err);
      Alert.alert("Error", "Failed to upload video");
    } finally {
      setUploadingVideoIndex(null);
    }
  };

  const handleAddLesson = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].lessons.push({
      title: "",
      duration: 0,
      videoUrl: "",
    });
    setSections(updated);
  };
  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        lessons: [{ title: "", duration: 0, videoUrl: "" }],
      },
    ]);

    const newIndex = sections.length; // Index of the new section
    setActiveSectionIndex(newIndex);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleCreate = async () => {
    try {
      setUploading(true);
      const failedSections: string[] = [];
      const successfulSections: string[] = [];

      for (const [sectionIndex, section] of sections.entries()) {
        const lessonsPayload = section.lessons.map((lesson, lessonIndex) => ({
          title: lesson.title,
          duration: Number(lesson.duration),
          videoUrl: lesson.videoUrl,
          order: lessonIndex + 1,
        }));

        const result = await elearning.createSection(
          courseId,
          section.title,
          section.description,
          lessonsPayload
        );

      
        let errorMessage = "Unknown error";

        if (!result.ok) {
          try {
            const errorData = result.data as ErrorResponse;
            if (errorData?.error) {
              errorMessage = errorData.error;
            } else if (typeof result.data === "string") {
              errorMessage = result.data;
            }
          } catch (err) {
            console.error("Error parsing error message:", err);
          }

          failedSections.push(
            `Section ${sectionIndex + 1}: ${
              section.title
            }\n→ Error: ${errorMessage}`
          );
        } else {
          successfulSections.push(
            `Section ${sectionIndex + 1}: ${section.title}`
          );
        }
      }

      if (failedSections.length > 0) {
        const msg = `Some sections failed:\n\n${failedSections.join(
          "\n"
        )}\n\nOthers may have succeeded.`;
        setResponseMessage(msg);
        showModal("error");
      } else {
        setResponseMessage("All sections created successfully");
        showModal("success");
      }
    } catch (err) {
      console.error("Section creation failed", err);
      Alert.alert("Error", "Failed to create section");
    } finally {
      setUploading(false);
    }
  };

  const renderSection = (section: Section, sectionIndex: number) => (
    <ScrollView
      key={sectionIndex}
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.sectionHeader}>Section {sectionIndex + 1}</Text>
      <TextInput
        placeholder="Section Title"
        style={styles.input}
        value={section.title}
        onChangeText={(text) => {
          const updated = [...sections];
          updated[sectionIndex].title = text;
          setSections(updated);
        }}
      />
      <TextInput
        placeholder="Section Description"
        style={styles.input}
        value={section.description}
        onChangeText={(text) => {
          const updated = [...sections];
          updated[sectionIndex].description = text;
          setSections(updated);
        }}
      />
      {section.lessons.map((lesson, lessonIndex) => (
        <View key={lessonIndex} style={styles.lessonContainer}>
          <Text style={styles.lessonLabel}>Lesson {lessonIndex + 1}</Text>
          <TextInput
            placeholder="Lesson Title"
            style={styles.input}
            value={lesson.title}
            onChangeText={(text) => {
              const updated = [...sections];
              updated[sectionIndex].lessons[lessonIndex].title = text;
              setSections(updated);
            }}
          />
          <TextInput
            placeholder="Duration (mins)"
            keyboardType="numeric"
            style={styles.input}
            value={lesson.duration.toString()}
            onChangeText={(text) => {
              const updated = [...sections];
              updated[sectionIndex].lessons[lessonIndex].duration = parseInt(
                text || "0"
              );
              setSections(updated);
            }}
          />
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => handleVideoUpload(sectionIndex, lessonIndex)}
          >
            <AppText style={{ color: "#fff" }}>
              {uploadingVideoIndex?.section === sectionIndex &&
              uploadingVideoIndex?.lesson === lessonIndex ? (
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
      <TouchableOpacity onPress={() => handleAddLesson(sectionIndex)}>
        <Text style={styles.addLessonBtn}>
          <Ionicons name="add-circle" size={20} /> Add Lesson
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <AppText style={styles.header}>Add New Sections</AppText>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {sections.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor:
                    activeSectionIndex === index ? "#007bff" : "#ccc",
                  marginHorizontal: 4,
                  marginVertical: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setActiveSectionIndex(index)}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {sections.map((section, index) => {
            if (index !== activeSectionIndex) return null;
            return renderSection(section, index);
          })}

          <TouchableOpacity onPress={handleAddSection}>
            <Text style={styles.addLessonBtn}>
              <Ionicons name="add-circle" size={20} /> Add Section
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreate}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Sections</Text>
            )}
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

export default AddSectionModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 30,
  },

  modalBackground: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Colors.app.screen,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    height: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    paddingBottom: 150,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.app.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.app.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  lessonContainer: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  lessonLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  uploadBtn: {
    backgroundColor: Colors.app.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: Colors.app.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    color: Colors.app.failed,
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
  },
  addLessonBtn: {
    color: Colors.app.primary,
    marginTop: 12,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
});
