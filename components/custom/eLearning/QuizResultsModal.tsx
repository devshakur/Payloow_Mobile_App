// components/QuizResultsModal.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Question } from "./Course";

interface Props {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  answers: { [key: string]: string };
}

const QuizResultsModal: React.FC<Props> = ({
  visible,
  onClose,
  questions,
  answers,
}) => {
  const isCorrect = (question: Question, optionId: string) => {
    const selected = question.options.find((o) => o._id === optionId);
    return selected?.is_correct;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Quiz Results</Text>

            {questions.map((q, i) => {
              const userAnswerId = answers[q._id];
              const correct = isCorrect(q, userAnswerId);

              return (
                <View key={q._id} style={styles.resultBlock}>
                  <Text style={styles.question}>
                    {i + 1}. {q.question_text}
                  </Text>

                  {q.options.map((option) => {
                    const selected = option._id === userAnswerId;
                    return (
                      <Text
                        key={option._id}
                        style={[
                          styles.option,
                          selected &&
                            (option.is_correct
                              ? styles.correct
                              : styles.incorrect),
                        ]}
                      >
                        {option.option}
                        {selected &&
                          (option.is_correct ? " ✔️ Correct" : " ❌ Incorrect")}
                      </Text>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default QuizResultsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: "80%",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.app.primary,
  },
  resultBlock: {
    marginBottom: 16,
  },
  question: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: Colors.app.dark,
  },
  option: {
    fontSize: 15,
    marginLeft: 12,
    marginVertical: 2,
  },
  correct: {
    color: "green",
  },
  incorrect: {
    color: "red",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: Colors.app.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
