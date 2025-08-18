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
import { UploadVideoResponse } from "./CreateCourse";

// Updated interfaces to match your API schema
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
  existingSections: Section[];
}

const UpdateSectionModal: React.FC<Props> = ({
  visible,
  onClose,
  courseId,
  existingSections,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState<{
    section: number;
    lesson: number;
  } | null>(null);

  useEffect(() => {
    if (visible) setSections(existingSections);
  }, [visible, existingSections]);

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

  const handleUpdate = async () => {
    try {
      setUploading(true);
      for (const section of sections) {
        const lessonsPayload = section.lessons.map((lesson, index) => {
          const payload = {
            title: lesson.title,
            duration: Number(lesson.duration),
            videoUrl: lesson.videoUrl,
            order: index + 1,
          };
          return lesson._id ? { ...payload, _id: lesson._id } : payload;
        });

        await elearning.updateSection({
          courseId,
          sectionId: section._id,
          title: section.title,
          description: section.description,
          lessons: lessonsPayload,
        });
      }

      Alert.alert("Success", "Sections updated successfully.");
      onClose();
    } catch (err) {
      console.error("Section update failed", err);
      Alert.alert("Error", "Failed to update section");
    } finally {
      setUploading(false);
    }
  };

  const renderSection = (section: Section, sectionIndex: number) => (
    <View key={section._id || sectionIndex} style={styles.sectionContainer}>
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
        <View key={lesson._id || lessonIndex} style={styles.lessonContainer}>
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
            value={lesson.duration?.toString() || ""}
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
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <ScrollView contentContainerStyle={styles.container}>
          <AppText style={styles.header}>Update Sections</AppText>
          {sections.map(renderSection)}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleUpdate}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default UpdateSectionModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 30,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
