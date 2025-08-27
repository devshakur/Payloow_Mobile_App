// import AppText from "@/components/custom/AppText";
// import List from "@/components/custom/list/List";
// import { Colors } from "@/constants/Colors";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, {
//   FunctionComponent,
//   useCallback,
//   useEffect,
//   useState,
// } from "react";
// import {
//   Alert,
//   FlatList,
//   RefreshControl,
//   StyleSheet,
//   View,
// } from "react-native";
// import * as Progress from "react-native-progress";
// import {
//   CourseType,
//   Section,
// } from "../../../../components/custom/eLearning/Course";
// import { GetCoursesResponse } from "../../../../components/custom/eLearning/CourseList";
// import Screen from "../../../../components/custom/Screen";
// import elearning from "../../../api/elearning";
// import routes from "../../../navigations/routes";

// type RootStackParamList = {
//   CourseDetailPage: { course: CourseType };
//   EnrolledCourseDetail: { sections: Section[] };
// };

// interface MyCoursesProps {
//   navigation: NativeStackNavigationProp<RootStackParamList>;
// }

// const MyCourses: FunctionComponent<MyCoursesProps> = ({ navigation }) => {
//   const [courses, setCourses] = useState<CourseType[]>();
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchCourses = async () => {
//     try {
//       const apiResponse = await elearning.myCourses();
//       const data = apiResponse.data as GetCoursesResponse;
//       setCourses(data.courses as CourseType[]);
//     } catch (err) {
//       Alert.alert("Error", "Failed to load courses");
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);

//     Promise.all([fetchCourses()]).finally(() => setRefreshing(false));
//   }, []);

//   useEffect(() => {
//     onRefresh();
//   }, []);

//   return (
//     <Screen backgroundColor={Colors.app.white}>
//       <View style={styles.container}>
//         <AppText style={styles.header}>Continue Watching</AppText>
//         <FlatList
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//           data={courses}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => {
//             const progressValue = item.progress?.progress_percentage
//               ? item.progress.progress_percentage / 100
//               : 0;

//             return (
//               <List
//                 leftImageSource={{
//                   uri: item.thumbnailUrl || "https://via.placeholder.com/100",
//                 }}
//                 leftTopLabel={item.title}
//                 leftBottomContainer={
//                   <View style={styles.courseDetails}>
//                     <AppText style={styles.instructor}>
//                       Tag: {item.tags || "Unknown"}
//                     </AppText>
//                     <Progress.Bar
//                       style={{ alignSelf: "flex-start" }}
//                       progress={progressValue}
//                       width={200}
//                       color={Colors.app.primary}
//                     />
//                     <AppText style={styles.percentage}>
//                       {(progressValue * 100).toFixed(0)}%
//                     </AppText>
//                   </View>
//                 }
//                 leftTopLabelStyle={{ fontWeight: "bold" }}
//                 listStyle={styles.listItem}
//                 onPress={() =>
//                   navigation.navigate(routes.COURSE_DETAIL_PAGE, {
//                     course: item || [],
//                   })
//                 }
//               />
//             );
//           }}
//           contentContainerStyle={styles.listContainer}
//         />
//       </View>
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.app.white,
//     padding: 16,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 16,
//     color: Colors.app.primary,
//   },
//   listContainer: {
//     gap: 12,
//   },
//   listItem: {
//     marginBottom: 8,
//   },
//   courseDetails: {
//     alignItems: "flex-start",
//     gap: 10,
//     justifyContent: "center",
//   },
//   instructor: {
//     fontSize: 12,
//     color: Colors.app.light,
//   },
//   percentage: {
//     color: Colors.app.primary,
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default MyCourses;

import GeneralCourseList from "@/components/custom/eLearning/GeneralCourseList";
import { Colors } from "@/constants/Colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 290;
const SPACING = 16;

const MyCourses: FunctionComponent<MyCoursesProps> = ({ navigation }) => {
  const [courses, setCourses] = useState<CourseType[]>();
  const [refreshing, setRefreshing] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

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

  const renderCourseCard = ({
    item,
    index,
  }: {
    item: CourseType;
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    const progressValue = item.progress?.progress_percentage
      ? item.progress.progress_percentage / 100
      : 0;

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate(routes.COURSE_DETAIL_PAGE, {
              course: item || [],
            })
          }
        >
          {/* Thumbnail */}
          <Image
            source={{
              uri: item.thumbnailUrl || "https://via.placeholder.com/150",
            }}
            style={styles.thumbnail}
          />

          {/* Content */}
          <View style={styles.cardContent}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title || "Untitled"}
            </Text>

            {/* Tags */}
            <Text style={styles.tag}>
              Tag:{" "}
              {Array.isArray(item.tags) && item.tags.length > 0
                ? item.tags.join(", ")
                : "Unknown"}
            </Text>

            {/* Progress */}
            <Progress.Bar
              style={{ marginTop: 10 }}
              progress={progressValue}
              width={CARD_WIDTH * 0.6}
              color={Colors.app.primary}
              height={6}
              borderRadius={4}
            />
            <Text style={styles.percentage}>
              {(progressValue * 100).toFixed(0)}%
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Screen backgroundColor={Colors.app.white}>
      {/* <Bubbles /> */}
      <View style={styles.container}>
        <Text style={styles.header}>Continue Watching</Text>

        <Animated.FlatList
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{
            paddingHorizontal: (width - CARD_WIDTH) / 2,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <View style={{ marginTop: 30 }}>
          <Text style={styles.header}>Recommended Course</Text>
          <View style={styles.bottomContentsTitleContainer}>
            <GeneralCourseList courses={courses} navigation={navigation} />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  header: {
    fontSize: 16,
    fontWeight: "800", // stronger emphasis
    marginBottom: 8,
    marginTop: 10,
    color: "#1A237E", // deep indigo, modern and professional
    paddingHorizontal: 16,
    letterSpacing: 0.5, // slight spacing for readability
  },

  bottomContentsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.app.white, // water-like aqua
    borderRadius: 20,
    marginHorizontal: SPACING / 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: "hidden",
  },

  thumbnail: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.app.dark,
    textAlign: "center",
  },
  tag: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.app.light,
  },
  percentage: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.app.primary,
  },
});

export default MyCourses;
