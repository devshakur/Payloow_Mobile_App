import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import {
  CourseType,
  Lesson,
  Quiz,
} from "../../components/custom/eLearning/Course";
import TutorCourseDetailPage from "../screens/eLearning/tutor/TutorCourseDetailPage";
import TutorCourseList from "../screens/eLearning/tutor/TutorCourseList";
import TutorLessonQuizScreen from "../screens/eLearning/tutor/TutorLessonQuizScreen";
import TutorLessonVideoPlayer from "../screens/eLearning/tutor/TutorLessonVideoPlayer";

type RootStackParamList = {
  MyCourses: undefined;
  CourseDetailPage: undefined;
  TutorCourseDetailPage: { course: CourseType };
  LessonVideoPlayer: {
    lesson: Lesson;
  };
  TutorCourseList: undefined;
  TutorLessonVideoPlayer: { lesson: Lesson; courseId: string };
  TutorLessonQuizScreen: { quiz: Quiz };
};

interface TutorCoursesNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const TutorCoursesNavigator: FunctionComponent<
  TutorCoursesNavigatorProps
> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TutorCourseList" component={TutorCourseList} />
      <Stack.Screen
        name="TutorCourseDetailPage"
        component={TutorCourseDetailPage}
      />
      <Stack.Screen
        name="TutorLessonVideoPlayer"
        component={TutorLessonVideoPlayer}
      />
      <Stack.Screen
        name="TutorLessonQuizScreen"
        component={TutorLessonQuizScreen}
      />
    </Stack.Navigator>
  );
};

export default TutorCoursesNavigator;
