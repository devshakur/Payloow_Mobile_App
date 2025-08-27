// import { Colors } from "@/constants/Colors";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import AppButton from "../../../../components/custom/AppButton";
// import { Quiz } from "../../../../components/custom/eLearning/Course";
// import QuizResultsModal from "../../../../components/custom/eLearning/QuizResultsModal";
// import Screen from "../../../../components/custom/Screen";
// import elearning from "../../../api/elearning";

// interface LessonQuizScreenProps {
//   navigation: NativeStackNavigationProp<RootStackParamList>;
// }

// type RootStackParamList = {
//   LessonQuizScreen: { quiz: Quiz };
// };

// type LessonQuizScreenRouteProp = RouteProp<
//   RootStackParamList,
//   "LessonQuizScreen"
// >;

// const LessonQuizScreen: React.FC<LessonQuizScreenProps> = ({ navigation }) => {
//   const route = useRoute<LessonQuizScreenRouteProp>();
//   let {
//     quiz,
//   }: {
//     quiz: Quiz;
//   } = route.params ?? {};

//   const [answers, setAnswers] = useState<{ [key: string]: string }>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const handleSelect = (questionId: string, optionId: string) => {
//     if (!submitted) {
//       setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
//     }
//   };

//   const handleSubmit = async () => {
//     const formattedAnswers = Object.entries(answers).map(
//       ([question_id, option_id]) => {
//         const question = quiz.questions.find((q) => q._id === question_id);
//         const option = question?.options.find((opt) => opt._id === option_id);
//         return {
//           question_id,
//           selected_option: option?.option ?? "", // send the text
//         };
//       }
//     );

//     try {
//       await elearning.submitQuizAnswers(quiz._id, formattedAnswers);

//       const allCorrect = quiz.questions.every((question) => {
//         const selectedOptionId = answers[question._id];
//         const selectedOption = question.options.find(
//           (opt) => opt._id === selectedOptionId
//         );
//         return selectedOption?.is_correct === true;
//       });

//       setSubmitted(true);
//       setShowModal(true);

//       if (!allCorrect) {
//         // User failed, allow retry
//         alert("You didn't pass. Please try again.");
//       }
//     } catch (error) {
//       console.error("Submission failed:", error);
//       alert("An error occurred while submitting. Please try again.");
//     }
//   };

//   return (
//     <Screen>
//       <View style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.container}>
//           {quiz.questions.map((question, index) => (
//             <View key={question._id} style={styles.questionBlock}>
//               <Text style={styles.questionText}>
//                 {index + 1}. {question.question_text}LessonQuizScreen
//               </Text>

//               {question.options.map((option) => {
//                 const selected = answers[question._id] === option._id;

//                 return (
//                   <TouchableOpacity
//                     key={option._id}
//                     style={[
//                       styles.optionButton,
//                       selected && styles.selectedOption,
//                     ]}
//                     onPress={() => handleSelect(question._id, option._id)}
//                   >
//                     <Text style={styles.optionText}>{option.option}</Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           ))}

//           {submitted &&
//             !quiz.questions.every(
//               (q) =>
//                 q.options.find((opt) => opt._id === answers[q._id])?.is_correct
//             ) && (
//               <AppButton
//                 title="Retry Quiz"
//                 btnContainerStyle={{ backgroundColor: Colors.app.primary }}
//                 titleStyle={{ color: "#fff" }}
//                 onPress={() => {
//                   setSubmitted(false);
//                   setAnswers({});
//                 }}
//               />
//             )}
//         </ScrollView>

//         <QuizResultsModal
//           visible={showModal}
//           onClose={() => setShowModal(false)}
//           questions={quiz.questions}
//           answers={answers}
//         />
//       </View>
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     paddingBottom: 32,
//     backgroundColor: "#fff",
//   },
//   questionBlock: {
//     marginBottom: 24,
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: "#f9f9f9",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   questionText: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//     color: "#333",
//   },
//   optionButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginBottom: 10,
//     borderRadius: 10,
//     backgroundColor: "#e6e6e6",
//   },
//   selectedOption: {
//     backgroundColor: Colors.app.primary,
//   },
//   optionText: {
//     fontSize: 15,
//     color: "#000",
//   },
// });

// export default LessonQuizScreen;

import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../../../components/custom/AppButton";
import { Quiz } from "../../../../components/custom/eLearning/Course";
import QuizResultsModal from "../../../../components/custom/eLearning/QuizResultsModal";
import Screen from "../../../../components/custom/Screen";
import elearning from "../../../api/elearning";

interface LessonQuizScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  LessonQuizScreen: { quiz: Quiz };
};

type LessonQuizScreenRouteProp = RouteProp<
  RootStackParamList,
  "LessonQuizScreen"
>;

const LessonQuizScreen: React.FC<LessonQuizScreenProps> = ({ navigation }) => {
  const route = useRoute<LessonQuizScreenRouteProp>();
  const { quiz } = route.params ?? {};

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([question_id, option_id]) => {
        const question = quiz.questions?.find((q) => q._id === question_id);
        const option = question?.options.find((opt) => opt._id === option_id);
        return {
          question_id,
          selected_option: option?.option ?? "", // send the actual text
        };
      }
    );

    try {
      await elearning.submitQuizAnswers(quiz._id, formattedAnswers);

      const allCorrect = quiz.questions?.every((question) => {
        const selectedOptionId = answers[question._id];
        const selectedOption = question.options.find(
          (opt) => opt._id === selectedOptionId
        );
        return selectedOption?.is_correct === true;
      });

      setPassed(allCorrect || false);
      setSubmitted(true);
      setShowModal(true);

      if (!allCorrect) {
        Alert.alert("Quiz Failed", "You didn't pass. Please try again.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      Alert.alert("Submission Error", "Please try again later.");
    }
  };

  const allAnswered = quiz.questions?.every((q) => answers[q._id]);

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {quiz.questions?.map((question, index) => (
            <View key={question._id} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {index + 1}. {question.question_text}
              </Text>

              {question.options.map((option) => {
                const selected = answers[question._id] === option._id;
                return (
                  <TouchableOpacity
                    key={option._id}
                    style={[
                      styles.optionButton,
                      selected && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(question._id, option._id)}
                  >
                    <Text style={styles.optionText}>{option.option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {!submitted && (
            <AppButton
              title="Submit Quiz"
              disabled={!allAnswered}
              btnContainerStyle={{
                backgroundColor: allAnswered ? Colors.app.primary : "#ccc",
              }}
              titleStyle={{ color: "#fff" }}
              onPress={handleSubmit}
            />
          )}

          {submitted && !passed && (
            <AppButton
              title="Retry Quiz"
              btnContainerStyle={{ backgroundColor: Colors.app.primary }}
              titleStyle={{ color: "#fff" }}
              onPress={() => {
                setSubmitted(false);
                setAnswers({});
                setShowModal(false);
                setPassed(false);
              }}
            />
          )}
        </ScrollView>

        <QuizResultsModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          questions={quiz.questions || []}
          answers={answers}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  questionBlock: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
  },
  selectedOption: {
    backgroundColor: Colors.app.primary,
  },
  optionText: {
    fontSize: 15,
    color: "#000",
  },
});

export default LessonQuizScreen;
