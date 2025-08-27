// Course.tsx
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import CourseBadge from "./CourseBadge";
import SubscriberAvatars from "./SubscriberAvatar";

export interface Option {
  option: string;
  is_correct: boolean;
  _id: string;
}

export interface Question {
  _id: string;
  question_text: string;
  options: Option[];
  created_at: string;
  updated_at: string;
  __v: number;
  quiz_id: string;
}

export interface Quiz {
  _id: string;
  title: string;
  course_id?: string;
  lesson_id?: string;
  tutor_id?: string;
  questions?: Question[];
  created_at?: string;
  updated_at?: string;
  __v: number;
}

export interface Lesson {
  _id: string;
  section_id: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
  quizzes: Quiz[];
  exercises: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Section {
  _id: string;
  course_id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exercises: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Announcement {
  _id: string;
  course_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface Project {
  _id: string;
  course_id: string;
  title: string;
  description: string;
  projectFileUrl: string;
  submissions: any[];
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface CourseProgress {
  is_completed: boolean;
  progress_percentage: number;
  _id: string;
  user_id: string;
  course_id: string;
  completed_lessons: any[];
  completed_sections: any[];
  percentage: number;
  completed_quizzes: any[];
  completed_exercises: any[];
  completed_projects?: any[];
  notes: any[];
  feedback: string;
  last_accessed: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
  last_updated: string;
}

export interface CourseType {
  _id: string;
  title: string;
  description?: string;
  tutor_id: string;
  duration?: string;
  price?: number;
  discount_price?: number;
  category?: string;
  tags?: string[];
  sections: Section[];
  isEnrolled?: boolean;
  lessons_count?: number;
  students_enrolled?: number;
  averageRating?: number;
  numberOfReviews?: number;
  thumbnailUrl?: string;
  introductory_video_url?: string;
  projects?: Project[];
  announcements?: Announcement[];
  created_at?: string;
  updated_at?: string;
  __v?: number;
  progress?: CourseProgress | null;
}

export interface CoursesResponse {
  courses: CourseType[];
}

interface CourseProps {
  course: CourseType;
  onPress: () => void;
}

const StudentCourse: FunctionComponent<CourseProps> = ({ course, onPress }) => {
  const getStars = (rating?: number) => {
    if (!rating) return "⭐"; // fallback
    if (rating > 10) return "⭐⭐⭐";
    if (rating > 5) return "⭐⭐";
    return "⭐";
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.courseContainer}>
      <View style={styles.imageWrapper}>
        <Image
          style={[styles.img, { resizeMode: "cover" }]}
          source={
            course.thumbnailUrl
              ? { uri: course.thumbnailUrl }
              : require("../../../assets/images/custom/course-img.png")
          }
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          style={styles.gradientOverlay}
        />
      </View>

      <View style={styles.content}>
        <CourseBadge category={course.category || "Course"} />
        <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
          {course.title}
        </Text>
        <View style={styles.bottom}>
          <Text>
            <SubscriberAvatars enrolled={course.students_enrolled || 0} />
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16 }}>
              {getStars(course.averageRating)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    // height: 220,
    width: 290,
    backgroundColor: Colors.app.white,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 0,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
    alignSelf: "flex-start",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  content: {
    alignSelf: "center",
    gap: 10,
    padding: 5,
    width: "90%",
  },
  label: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "DM Sans",
    color: "#111827", // dark but elegant
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  lessons: {
    // alignSelf: "flex-end",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  more: {
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentCourse;
