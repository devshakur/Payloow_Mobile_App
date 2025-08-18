import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AddSectionModal from "../../../../components/custom/eLearning/AddSectionModal";
import {
  Announcement,
  CourseType,
  Lesson,
  Quiz,
  Section,
} from "../../../../components/custom/eLearning/Course";
import CreateAnnouncement from "../../../../components/custom/eLearning/CreateAnnouncement";
import TutorModalScreen from "../../../../components/custom/eLearning/TutorModalScreen";
import UpdateCourse from "../../../../components/custom/eLearning/UpdateCourse";
import UpdateSectionModal from "../../../../components/custom/eLearning/UpdateSectionModal";
import VideoPreview from "../../../../components/custom/eLearning/VideoPreview";
import Screen from "../../../../components/custom/Screen";
import elearning from "../../../api/elearning";
import routes from "../../../navigations/routes";

interface TutorCourseDetailPageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const emptySection: Section = {
  _id: "",
  title: "",
  description: "",
  course_id: "",
  lessons: [],
  exercises: [],
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

type RootStackParamList = {
  TutorCourseDetailPage: {
    course: CourseType;
  };
  TutorLessonVideoPlayer: {
    lesson: Lesson;
    courseId: string;
  };
  TutorLessonQuizScreen: {
    quiz: Quiz;
  };
};

type TutorCourseDetailPageRouteProp = RouteProp<
  RootStackParamList,
  "TutorCourseDetailPage"
>;

const TutorCourseDetailPage: React.FC<TutorCourseDetailPageProps> = ({
  navigation,
}) => {
  const route = useRoute<TutorCourseDetailPageRouteProp>();
  let {
    course,
  }: {
    course: CourseType;
  } = route.params ?? {};

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    course.sections[0]?._id ?? ""
  );

  const selectedSection = course.sections.find(
    (s) => s._id === selectedSectionId
  );


  const [isAddSection, setIsAddSection] = useState(false);
  const [isEditSection, setIsEditSection] = useState(false);
  const [isEditCourse, setIsEditCourse] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddAnnouncement, setIsAddAnnouncement] = useState(false);
  const [isAnnouncementTabActive, setIsAnnouncementTabActive] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await elearning.getAnnouncement();
        const allAnnouncements = res.data as Announcement[];

        // Filter announcements by course ID
        const filteredAnnouncements: Announcement[] = allAnnouncements.filter(
          (ann: Announcement) => ann.course_id === course._id
        );

        // Save filtered announcements to state
        setAnnouncements(filteredAnnouncements);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        Alert.alert("Error", "Could not load announcements.");
      }
    };

    if (isAnnouncementTabActive) {
      fetchAnnouncements();
    }
  }, [isAnnouncementTabActive, course._id]);

  return (
    <Screen backgroundColor={Colors.app.white}>
      {/* Section Tabs */}
      <View style={styles.sectionListContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {course.sections.map((item) => {
            const isActive =
              item._id === selectedSectionId && !isAnnouncementTabActive;
            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  setSelectedSectionId(item._id);
                  setIsAnnouncementTabActive(false);
                }}
                style={[
                  styles.sectionItem,
                  isActive && styles.activeSectionItem,
                ]}
              >
                <AppText
                  style={[
                    styles.sectionTitle,
                    isActive && styles.activeSectionTitle,
                  ]}
                >
                  {item.title}
                </AppText>
              </TouchableOpacity>
            );
          })}

          {/* Add Announcements Tab */}
          <TouchableOpacity
            onPress={() => {
              setIsAnnouncementTabActive(true);
              setSelectedSectionId(""); // clear section selection
            }}
            style={[
              styles.sectionItem,
              isAnnouncementTabActive && styles.activeSectionItem,
            ]}
          >
            <AppText
              style={[
                styles.sectionTitle,
                isAnnouncementTabActive && styles.activeSectionTitle,
              ]}
            >
              Announcements
            </AppText>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.divider} />
      </View>

      {isAnnouncementTabActive ? (
        <ScrollView style={styles.container}>
          <AppText style={styles.sectionHeader}>Course Announcements</AppText>

          {announcements.map((announcement) => (
            <View key={announcement._id} style={styles.announcementItem}>
              <AppText style={styles.announcementTitle}>
                {announcement.title}
              </AppText>
              <AppText style={styles.announcementDesc}>
                {announcement.description}
              </AppText>
              <AppText style={styles.announcementDate}>
                {new Date(announcement.created_at).toLocaleDateString()}
              </AppText>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <AppText style={styles.sectionHeader}>
            {selectedSection?.title}
          </AppText>
          <ScrollView style={styles.container}>
            <View style={styles.lessonContainer}>
              {(selectedSection?.lessons ?? []).map((lesson) => (
                <View key={lesson._id} style={styles.lessonItem}>
                  <VideoPreview
                    url={lesson.videoUrl}
                    onPress={() =>
                      navigation.navigate(routes.TUTOR_LESSON_VIDEO_PLAYER, {
                        lesson,
                        courseId: course._id,
                      })
                    }
                  />
                  <AppText style={styles.lessonTitle}>{lesson.title}</AppText>
                  <AppText style={styles.duration}>
                    Duration: {Math.floor(lesson.duration / 60)} min
                  </AppText>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {isEditCourse && (
        <UpdateCourse
          course={course}
          isVisible={isEditCourse}
          onClose={() => setIsEditCourse(false)}
        />
      )}

      {isAddSection && (
        <AddSectionModal
          courseId={course._id}
          visible={isAddSection}
          onClose={() => setIsAddSection(false)}
        />
      )}

      {isEditSection && (
        <UpdateSectionModal
          courseId={course._id}
          existingSection={selectedSection || emptySection}
          visible={isEditSection}
          onClose={() => setIsEditSection(false)}
        />
      )}

      {isAddAnnouncement && (
        <CreateAnnouncement
          courseId={course._id}
          isVisible={isAddAnnouncement}
          onClose={() => setIsAddAnnouncement(false)}
        />
      )}

      {modalVisible && (
        <TutorModalScreen
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onPressBtn={(btn) => {
         
            if (btn === "add-section") {
              setModalVisible(false);
              setIsAddSection(true);
            } else if (btn === "edit-section") {
              setModalVisible(false);
              setIsEditSection(true);
            } else if (btn === "edit-course") {
              setModalVisible(false);
              setIsEditCourse(true);
            } else if (btn === "add-announcement") {
              setModalVisible(false);
              setIsAddAnnouncement(true);
            }
          }}
        />
      )}

      {!modalVisible && (
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
      )}
    </Screen>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sectionListContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sectionItem: {
    backgroundColor: Colors.app.gray,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  activeSectionItem: {
    backgroundColor: Colors.app.primary,
  },
  sectionTitle: {
    color: Colors.app.dark,
    fontSize: 14,
  },
  activeSectionTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.app.primary,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 10,
    color: Colors.app.dark,
  },
  lessonContainer: {
    paddingHorizontal: 15,
  },
  lessonItem: {
    backgroundColor: Colors.app.light,
    borderRadius: 12,
    marginBottom: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: Colors.app.dark,
  },
  duration: {
    fontSize: 14,
    color: Colors.app.gray,
    marginTop: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: Colors.app.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  announcementItem: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: Colors.app.primary,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.app.dark,
  },
  announcementDesc: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.app.gray,
  },
  announcementDate: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.app.gray,
    fontStyle: "italic",
  },
});

export default TutorCourseDetailPage;
