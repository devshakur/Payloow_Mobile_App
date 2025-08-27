import { Colors } from "@/constants/Colors";
import { FunctionComponent, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import elearning from "../../../app/api/elearning";
import routes from "../../../app/navigations/routes";
import LoadingModal from "../LoadingModal";
import AutoScrollCourse from "../easyBuy/AutoScrollCourse";
import FeaturedCoursesDummy from "./FeaturedCoursesDummy";

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

// const DummyCourseList: FunctionComponent<CourseListProps> = ({
//   navigation,
//   courses,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const createCart = async (courseId: string) => {
//     try {
//       setLoading(true);
//       const result = await elearning.addToCart(courseId);

//       if (result.ok) {
//         navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
//       } else {
//         const errorRes = result.data as ErroResponse;
//         if (errorRes.error === "Course already in cart") {
//           navigation.navigate(routes.COURSE_CARD_DETAIL, { courseId });
//         }
//         throw new Error("Failed to add to cart");
//       }
//     } catch (error) {
//       // logOut();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClick = (course: CourseType) => {
//     Alert.alert(
//       course.title,
//       "Choose a screen to navigate to:",
//       [
//         {
//           text: "Show details",
//           onPress: () =>
//             navigation.navigate(routes.COURSE_DETAIL_PAGE, {
//               course: course,
//             }),
//         },
//         {
//           text: "Show and add to cart",
//           onPress: async () => await createCart(course._id),
//         },
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         <AutoScrollCourse
//           items={courses}
//           renderItem={(course) => (
//             <FeaturedCoursesDummy onCoursePress={() => handleClick(course)} />
//           )}
//           spacing={16}
//           speed={0.8}
//         />
//       </View>
//       {loading && <LoadingModal visible={loading} />}
//     </>
//   );
// };

const DummyCourseList: FunctionComponent<CourseListProps> = ({
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
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <View style={styles.container}>
        {!courses || courses.length === 0 ? (
          // 👉 show skeleton while no courses
          <FeaturedCoursesDummy />
        ) : (
          // 👉 show auto-scroll list when data is ready
          <AutoScrollCourse
            items={courses}
            renderItem={(course) => (
              <FeaturedCoursesDummy onCoursePress={() => handleClick(course)} />
            )}
            spacing={16}
            speed={0.8}
          />
        )}
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

export default DummyCourseList;
