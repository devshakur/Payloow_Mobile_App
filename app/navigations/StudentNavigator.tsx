import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import {
  Lesson,
  Quiz,
  Section,
} from "../../components/custom/eLearning/Course";
import ChatScreen from "../screens/eLearning/ChatScreen";
import MessageTutor from "../screens/eLearning/MessageTutor";
import CourseCardDetail from "../screens/eLearning/student/CourseCardDetail";
import CourseDetailPage from "../screens/eLearning/student/CourseDetailPage";
import EnrolledCourseDetail from "../screens/eLearning/student/EnrolledCourseDetail";
import LessonQuizScreen from "../screens/eLearning/student/LessonQuizScreen";
import LessonVideoPlayer from "../screens/eLearning/student/LessonVideoPlayer";
import StudentDashboard from "../screens/eLearning/student/StudentDashboard";
import BillStuff from "./Bills";

type RootStackParamList = {
  Airtime: undefined;
  Electricity: undefined;
  TVSub: undefined;
  AirtimeSummary: undefined;
  ElectricitySummary: undefined;
  ErrorScreen: undefined;
  SuccessScreen: undefined;
  TVSubSummary: undefined;
  Data: undefined;
  DataSummary: undefined;
  ProductDetailWithCompare: undefined;
  ProductDetail: undefined;
  CompareFeatureScreen: undefined;
  StudentHomePage: undefined;
  ElearningHomePage: undefined;
  StudentUtility: undefined;
  MyCourses: undefined;
  CourseCheckOut: undefined;
  Bills: undefined;
  CourseDetailPage: undefined;
  EnrolledCourseDetail: { sections: Section[] };
  LessonVideoPlayer: {
    lesson: Lesson;
  };
  LessonQuizScreen: {
    quiz: Quiz;
  };
  CourseCardDetail: undefined;
  ChatScreen: {
    chatId: string;
    tutorId: string;
    courseTitle: string;
  };
  CourseChatDashboard: undefined;
  Chat: undefined;
  MessageTutor: { receiverId: string };
  ConversationList: undefined;
};

interface StudentNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const StudentNavigator: FunctionComponent<StudentNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentHomePage" component={StudentDashboard} />
      <Stack.Screen name="Bills" component={BillStuff} />
      <Stack.Screen name="CourseDetailPage" component={CourseDetailPage} />

      <Stack.Screen
        name="EnrolledCourseDetail"
        component={EnrolledCourseDetail}
      />
      <Stack.Screen name="LessonVideoPlayer" component={LessonVideoPlayer} />
      <Stack.Screen name="LessonQuizScreen" component={LessonQuizScreen} />
      <Stack.Screen name="CourseCardDetail" component={CourseCardDetail} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="MessageTutor" component={MessageTutor} />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
