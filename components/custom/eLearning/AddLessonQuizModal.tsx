import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import elearning from "../../../app/api/elearning";
import { Colors } from "../../../constants/Colors";
import AppText from "../AppText";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";

interface Props {
  visible: boolean;
  onClose: () => void;
  courseId: string;
  lessonId: string;
}

const AddLessonQuizModal: React.FC<Props> = ({
  visible,
  onClose,
  courseId,
  lessonId,
}) => {
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question_text: "",
      options: [
        { option: "", is_correct: false },
        { option: "", is_correct: false },
      ],
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ option: "", is_correct: false });
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { option: "", is_correct: false },
          { option: "", is_correct: false },
        ],
      },
    ]);
  };

  const showModal = (modalName: string) => {
    setCurrentModal(modalName);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentModal(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await elearning.addLessonQuiz(
        title,
        courseId,
        lessonId,
        questions
      );

      if (!result.ok) {
        setResponseMessage("Failed to create announcement");
        showModal("error");
      } else {
        setResponseMessage("Quiz created successfully");
        showModal("success");
      }
      setQuestions([
        {
          question_text: "",
          options: [
            { option: "", is_correct: false },
            { option: "", is_correct: false },
          ],
        },
      ]);
    } catch (err) {
      console.error("Quiz creation failed:", err);
      Alert.alert("Error", "Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AppText style={styles.header}>Create Lesson Quiz</AppText>

            <TextInput
              style={styles.input}
              placeholder="Quiz Title"
              value={title}
              onChangeText={setTitle}
            />

            {questions.map((question, qIndex) => (
              <View key={qIndex} style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Question {qIndex + 1}</Text>
                <TextInput
                  placeholder="Question Text"
                  style={styles.input}
                  value={question.question_text}
                  onChangeText={(text) => {
                    const updated = [...questions];
                    updated[qIndex].question_text = text;
                    setQuestions(updated);
                  }}
                />

                {question.options.map((opt, oIndex) => (
                  <View key={oIndex} style={styles.lessonContainer}>
                    <TextInput
                      placeholder={`Option ${oIndex + 1}`}
                      style={styles.input}
                      value={opt.option}
                      onChangeText={(text) => {
                        const updated = [...questions];
                        updated[qIndex].options[oIndex].option = text;
                        setQuestions(updated);
                      }}
                    />
                    <TouchableOpacity
                      style={[
                        styles.correctBtn,
                        opt.is_correct && {
                          backgroundColor: Colors.app.primary,
                        },
                      ]}
                      onPress={() => {
                        const updated = [...questions];
                        updated[qIndex].options = updated[qIndex].options.map(
                          (option, i) => ({
                            ...option,
                            is_correct: i === oIndex,
                          })
                        );
                        setQuestions(updated);
                      }}
                    >
                      <AppText style={{ color: "#fff" }}>
                        {opt.is_correct ? "Correct Answer" : "Mark as Correct"}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity onPress={() => handleAddOption(qIndex)}>
                  <Text style={styles.addLessonBtn}>
                    <Ionicons name="add-circle" size={18} /> Add Option
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={handleAddQuestion}>
              <Text style={styles.addLessonBtn}>
                <Ionicons name="add-circle" size={20} /> Add Question
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Quiz</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
            responseText={
              responseMessage || "Announcement created successfully"
            }
          />
        )}

        {loading && <LoadingModal visible={loading} />}
      </View>
    </Modal>
  );
};

export default AddLessonQuizModal;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: Colors.app.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: "90%", // This keeps the card shape even when scrollable
  },

  scrollContent: {
    paddingBottom: 40,
  },

  scrollView: {
    paddingBottom: 40,
    padding: 10,
  },
  scrollInner: {
    paddingHorizontal: 16, // horizontal side padding
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.app.primary,
    marginBottom: 20,
    textAlign: "center",
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
  focusedInput: {
    minHeight: 80,
  },
  lessonContainer: {
    marginBottom: 16,
  },
  correctBtn: {
    backgroundColor: Colors.app.gray,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
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
