import AppText from "@/components/custom/AppText";
import List from "@/components/custom/list/List";
import { Colors } from "@/constants/Colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import {
  CourseType,
  Section,
} from "../../../../components/custom/eLearning/Course";
import { GetCoursesResponse } from "../../../../components/custom/eLearning/CourseList";
import Screen from "../../../../components/custom/Screen";
import elearning from "../../../api/elearning";
import routes from "../../../navigations/routes";

type RootStackParamList = {
  CourseDetailPage: { course: CourseType };
  EnrolledCourseDetail: { sections: Section[] };
};

interface MyCoursesProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const MyCourses: FunctionComponent<MyCoursesProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<CourseType[]>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const apiResponse = await elearning.myCourses();
      const data = apiResponse.data as GetCoursesResponse;
      setCourses(data.courses as CourseType[]);
    } catch (err) {
      Alert.alert("Error", "Failed to load courses");
    }
  };

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
        <AppText style={styles.header}>My Courses</AppText>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const progressValue = item.progress?.progress_percentage
              ? item.progress.progress_percentage / 100
              : 0;

            return (
              <List
                leftImageSource={{
                  uri: item.thumbnailUrl || "https://via.placeholder.com/100",
                }}
                leftTopLabel={item.title}
                leftBottomContainer={
                  <View style={styles.courseDetails}>
                    <AppText style={styles.instructor}>
                      Tag: {item.tags || "Unknown"}
                    </AppText>
                    <Progress.Bar
                      style={{ alignSelf: "flex-start" }}
                      progress={progressValue}
                      width={200}
                      color={Colors.app.primary}
                    />
                    <AppText style={styles.percentage}>
                      {(progressValue * 100).toFixed(0)}%
                    </AppText>
                  </View>
                }
                leftTopLabelStyle={{ fontWeight: "bold" }}
                listStyle={styles.listItem}
                onPress={() =>
                  navigation.navigate(routes.COURSE_DETAIL_PAGE, {
                    course: item || [],
                  })
                }
              />
            );
          }}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.app.white,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.app.primary,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    marginBottom: 8,
  },
  courseDetails: {
    alignItems: "flex-start",
    gap: 10,
    justifyContent: "center",
  },
  instructor: {
    fontSize: 12,
    color: Colors.app.light,
  },
  percentage: {
    color: Colors.app.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MyCourses;
