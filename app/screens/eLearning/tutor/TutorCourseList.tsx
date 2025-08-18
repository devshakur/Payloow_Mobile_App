import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CourseType } from "../../../../components/custom/eLearning/Course";
import { GetCoursesResponse } from "../../../../components/custom/eLearning/CourseList";
import CreateCourse from "../../../../components/custom/eLearning/CreateCourse";
import TutorCourseCard from "../../../../components/custom/eLearning/TutorCourseCard";
import Screen from "../../../../components/custom/Screen";
import { Colors } from "../../../../constants/Colors";
import elearning from "../../../api/elearning";
import routes from "../../../navigations/routes";

type RootStackParamList = {
  TutorCourseDetailPage: {
    course: CourseType;
  };
};

interface TutorCourseListProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const TutorCourseList: React.FC<TutorCourseListProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);



  const fetchCourses = async () => {
    try {
      const apiResponse = await elearning.getCoursesByTutor();
      const data = apiResponse.data as GetCoursesResponse;
      setCourses(data.courses);
    } catch (err) {
      Alert.alert("Error", "Failed to load courses");
    }
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchCourses()]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <Text style={styles.heading}>My Courses</Text>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TutorCourseCard
              course={item}
              onPress={() =>
                navigation.navigate(routes.TUTOR_COURSE_DETAIL_PAGE, {
                  course: item,
                })
              }
            />
          )}
        />
      </View>
      {modalVisible && (
        <CreateCourse
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons
          name="plus"
          size={24}
          color={Colors.app.white}
        />
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: Colors.app.primary,
    borderRadius: 30, // Makes it round
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default TutorCourseList;
