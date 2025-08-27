// import React from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { CourseType } from "../../../components/custom/eLearning/Course";

// interface TutorCourseCardProps {
//   course: CourseType;
//   onPress?: () => void;
// }

// const TutorCourseCard: React.FC<TutorCourseCardProps> = ({
//   course,
//   onPress,
// }) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
//       <View style={styles.content}>
//         <Text style={styles.title}>{course.title}</Text>
//         <Text style={styles.description}>{course.description}</Text>
//         <Text style={styles.duration}>Duration: {course.duration}</Text>
//         <Text style={styles.price}>
//           ₦{course.discount_price}
//           <Text style={styles.originalPrice}>₦{course.price}</Text>
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginVertical: 10,
//     marginHorizontal: 16,
//     overflow: "hidden",
//     elevation: 3,
//   },
//   thumbnail: {
//     width: 100,
//     height: 100,
//   },
//   content: {
//     flex: 1,
//     padding: 10,
//     justifyContent: "space-between",
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   description: {
//     fontSize: 13,
//     color: "#555",
//   },
//   duration: {
//     fontSize: 12,
//     color: "#888",
//   },
//   price: {
//     fontWeight: "bold",
//     fontSize: 14,
//     color: "#1e90ff",
//   },
//   originalPrice: {
//     textDecorationLine: "line-through",
//     fontSize: 12,
//     color: "#999",
//   },
// });

// export default TutorCourseCard;

import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CourseType } from "../../../components/custom/eLearning/Course";

interface TutorCourseCardProps {
  course: CourseType;
  onPress?: () => void;
}

const TutorCourseCard: React.FC<TutorCourseCardProps> = ({
  course,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Full-width image */}
      <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />

      {/* Text content below */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {course.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>
        <Text style={styles.duration}>Duration: {course.duration}</Text>
        <Text style={styles.price}>
          ₦{course.discount_price}{" "}
          <Text style={styles.originalPrice}>₦{course.price}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 239, // fixed width for horizontal scroll
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    // elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 75,
    resizeMode: "cover",
  },
  content: {
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  duration: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  price: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1e90ff",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
});

export default TutorCourseCard;
