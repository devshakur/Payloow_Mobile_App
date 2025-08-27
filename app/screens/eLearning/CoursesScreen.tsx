import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Course, {
  CourseType,
} from "../../../components/custom/eLearning/Course";
import { GetCoursesResponse } from "../../../components/custom/eLearning/CourseList";
import SearchCourseModal from "../../../components/custom/eLearning/SearchCourseModal";
import Screen from "../../../components/custom/Screen";
import SearchBar from "../../../components/custom/SearchBar";
import { Colors } from "../../../constants/Colors";
import elearning from "../../api/elearning";
import routes from "../../navigations/routes";

type RootStackParamList = {
  CourseCardDetail: { courseId: string };
  CourseDetailPage: { course: CourseType };
};

interface CoursesScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface ErroResponse {
  error: string;
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchCourse, setIsSearchCourse] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiResponse = await elearning.getCourses();

      if (apiResponse.ok) {
        const data = apiResponse.data as GetCoursesResponse;
        setCourses(data.courses as CourseType[]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load courses");
    }
  };
  const topRowCourses = courses.filter((_, i) => i % 2 === 0);
  const bottomRowCourses = courses.filter((_, i) => i % 2 !== 0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([
      fetchCourses(), // added here
    ]).finally(() => setRefreshing(false));
  }, []);

  const createCart = async (courseId: string) => {
    try {
      setRefreshing(true);

      const result = await elearning.addToCart(courseId);

      if (result.ok) {
        navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
      } else {
        const errorRes = result.data as ErroResponse;
        if (errorRes.error === "Course already in cart") {
          navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
        }

        throw new Error("Failed to add to card");
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleClick = (course: CourseType) => {
    Alert.alert(
      course.title,
      "Choose a screen to navigate to:",
      [
        {
          text: "Show details",
          onPress: () =>
            navigation.navigate(routes.COURSE_DETAIL_PAGE, {
              course: course,
            }),
        },
        {
          text: "Show and add to cart",
          onPress: async () => await createCart(course._id),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiResponse = await elearning.getCoursesByTutor();
        const data = apiResponse.data as GetCoursesResponse;
        setCourses(data.courses);
      } catch (err) {
        Alert.alert("Error", "Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <Screen backgroundColor={Colors.app.white}>
      <View style={styles.container}>
        <Text style={styles.heading}>Explore Courses</Text>
        <SearchBar
          style={{
            width: "100%",
            alignSelf: "center",
          }}
          onPress={() => setIsSearchCourse(true)}
        />

        <View style={{ gap: 16 }}>
          {/* Top Row */}
          <FlatList
            data={topRowCourses}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <Course course={item} onPress={() => handleClick(item)} />
            )}
          />

          {/* Bottom Row */}
          <FlatList
            data={bottomRowCourses}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <Course course={item} onPress={() => handleClick(item)} />
            )}
          />
        </View>
      </View>
      {isSearchCourse && (
        <SearchCourseModal
          handleCardSelect={(course) => handleClick(course)}
          onClose={() => setIsSearchCourse(false)}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.app.screen,
    paddingHorizontal: 10,
    paddingVertical: 5,
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

export default CoursesScreen;
