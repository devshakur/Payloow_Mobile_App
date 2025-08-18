import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import {
  Lesson,
  Quiz,
  Section,
} from "../../components/custom/eLearning/Course";
import EnrolledCourseDetail from "../screens/eLearning/student/ EnrolledCourseDetail";
import CourseDetailPage from "../screens/eLearning/student/CourseDetailPage";
import LessonQuizScreen from "../screens/eLearning/student/LessonQuizScreen";
import LessonVideoPlayer from "../screens/eLearning/student/LessonVideoPlayer";
import MyCourses from "../screens/eLearning/student/MyCourses";

type RootStackParamList = {
  MyCourses: undefined;
  CourseDetailPage: undefined;
  EnrolledCourseDetail: { sections: Section[] };
  LessonVideoPlayer: {
    lesson: Lesson;
  };
  LessonQuizScreen: {
    quiz: Quiz;
  };
};

interface MyCoursesNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyCoursesNavigator: FunctionComponent<MyCoursesNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyCourses" component={MyCourses} />
      <Stack.Screen name="CourseDetailPage" component={CourseDetailPage} />
      <Stack.Screen
        name="EnrolledCourseDetail"
        component={EnrolledCourseDetail}
      />
      <Stack.Screen name="LessonVideoPlayer" component={LessonVideoPlayer} />
      <Stack.Screen name="LessonQuizScreen" component={LessonQuizScreen} />
      
    </Stack.Navigator>
  );
};

export default MyCoursesNavigator;
