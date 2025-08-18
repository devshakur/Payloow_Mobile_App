import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import { CourseType } from "../../components/custom/eLearning/Course";
import CoursesScreen from "../screens/eLearning/CoursesScreen";
import CourseCardDetail from "../screens/eLearning/student/CourseCardDetail";
import CourseDetailPage from "../screens/eLearning/student/CourseDetailPage";

type RootStackParamList = {
  CourseCardDetail: { courseId: string };
  CourseDetailPage: { course: CourseType };
  CoursesScreen: undefined;
};

interface CoursesNavigatorProps {}

const Stack = createNativeStackNavigator<RootStackParamList>();

const CoursesNavigator: FunctionComponent<CoursesNavigatorProps> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoursesScreen" component={CoursesScreen} />
      <Stack.Screen name="CourseDetailPage" component={CourseDetailPage} />
      <Stack.Screen name="CourseCardDetail" component={CourseCardDetail} />
    </Stack.Navigator>
  );
};

export default CoursesNavigator;
