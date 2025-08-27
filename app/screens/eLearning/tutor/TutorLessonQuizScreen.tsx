import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AddLessonQuizModal from "../../../../components/custom/eLearning/AddLessonQuizModal";
import { Quiz } from "../../../../components/custom/eLearning/Course";
import TutorLessonModal from "../../../../components/custom/eLearning/TutorLessonModal";
import Screen from "../../../../components/custom/Screen";

interface TutorLessonQuizScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  TutorLessonQuizScreen: { quiz: Quiz };
};

type TutorLessonQuizScreenRouteProp = RouteProp<
  RootStackParamList,
  "TutorLessonQuizScreen"
>;

const TutorLessonQuizScreen: React.FC<TutorLessonQuizScreenProps> = () => {
  const route = useRoute<TutorLessonQuizScreenRouteProp>();
  const { quiz } = route.params;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>

        {quiz.questions.map((question, index) => (
          <View key={question._id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {index + 1}. {question.question_text}
            </Text>

            {question.options.map((option) => (
              <View key={option._id} style={styles.optionContainer}>
                <Text
                  style={[
                    styles.optionText,
                    option.is_correct && styles.correctOption,
                  ]}
                >
                  • {option.option}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.app.primary,
  },
  questionContainer: {
    marginBottom: 24,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 6,
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  correctOption: {
    color: Colors.app.success,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: Colors.app.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default TutorLessonQuizScreen;
