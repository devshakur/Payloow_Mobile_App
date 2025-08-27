import { Colors } from "@/constants/Colors";
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CourseBadge from "./CourseBadge";

interface CourseProps {
  course: CourseType;
  onPress: () => void;
}

const Course: FunctionComponent<CourseProps> = ({ course, onPress }) => {
  // random stats
  const students = Math.floor(Math.random() * 500) + 20;
  const likes = Math.floor(Math.random() * 200) + 10;
  const courseDate = "12 Aug 2025";

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.img}
          source={
            course.thumbnailUrl
              ? { uri: course.thumbnailUrl }
              : require("../../../assets/images/custom/course-img.png")
          }
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          style={styles.gradientOverlay}
        />
        <CourseBadge
          category={course.category || "Course"}
          style={styles.badge}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {course?.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
          {course?.description}
        </Text>
        {course.price && (
          <Text style={styles.price}>
            ${course.discount_price ? course.discount_price : course.price}
          </Text>
        )}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="user-friends" size={14} color="#6B7280" />
            <Text style={styles.statText}>{course?.students_enrolled}</Text>
          </View>
          <View style={styles.statItem}>
            <Entypo name="calendar" size={14} color="#6B7280" />
            <Text style={styles.statText}>
              {course?.created_at?.split("T")[0]}
            </Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.statText}>{course?.numberOfReviews}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 240,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: Colors.app.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  imageWrapper: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "DM Sans",
    color: "#111827", // dark but elegant
  },
  desc: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: "700",
    fontFamily: "DM Sans",
    color: "#111827", // dark but elegant
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5A5F", // more eye-catching
    marginTop: 4,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
  },
});

export default Course;
