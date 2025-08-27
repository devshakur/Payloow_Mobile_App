import { Colors } from "@/constants/Colors";
import React, { FunctionComponent, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

import elearning from "../../../app/api/elearning";
import routes from "../../../app/navigations/routes";
import LoadingModal from "../LoadingModal";
import Course from "./Course";

interface CourseListProps {
  navigation?: any;
  courses: CourseType[];
}

export interface GetCoursesResponse {
  courses: CourseType[];
}

interface ErroResponse {
  error: string;
}

const GeneralCourseList: FunctionComponent<CourseListProps> = ({
  navigation,
  courses,
}) => {
  const [loading, setLoading] = useState(false);

  const createCart = async (courseId: string) => {
    try {
      setLoading(true);
      const result = await elearning.addToCart(courseId);

      if (result.ok) {
        navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
      } else {
        const errorRes = result.data as ErroResponse;
        if (errorRes.error === "Course already in cart") {
          navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
        }
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      // logOut();
    } finally {
      setLoading(false);
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

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Course course={item} onPress={() => handleClick(item)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          //   contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
      {loading && <LoadingModal visible={loading} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.app.screen,
    gap: 2,
    paddingVertical: 10,
  },
});

export default GeneralCourseList;
