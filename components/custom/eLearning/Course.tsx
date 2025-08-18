// Course.tsx
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import CourseBadge from "./CourseBadge";

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

const Course: FunctionComponent<CourseProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.courseContainer}>
      <Image
        style={styles.img}
        source={
          course.thumbnailUrl
            ? { uri: course.thumbnailUrl }
            : require("../../../assets/images/custom/course-img.png")
        }
        resizeMode="cover"
      />

      <View style={styles.content}>
        <CourseBadge category={course.category || "Course"} />
        <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
          {course.title}
        </Text>
        <Text style={styles.lessons}>{course.lessons_count || 0} Lessons</Text>
        {/* <Progress.Bar
          style={{ alignSelf: "flex-start" }}
          progress={0}
          width={200}
          color={Colors.app.primary}
        /> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    height: 220,
    width: 160,
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  img: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    alignSelf: "center",
    gap: 10,
    padding: 5,
    width: "90%",
  },
  label: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 12,
    fontWeight: "500",
  },
  lessons: {
    alignSelf: "flex-end",
  },
});

export default Course;
