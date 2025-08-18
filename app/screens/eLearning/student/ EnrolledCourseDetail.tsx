import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
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
import {
  Announcement,
  Lesson,
  Section,
} from "../../../../components/custom/eLearning/Course";
import VideoPreview from "../../../../components/custom/eLearning/VideoPreview";
import Screen from "../../../../components/custom/Screen";
import elearning from "../../../api/elearning";
import routes from "../../../navigations/routes";

interface EnrolledCourseProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type RootStackParamList = {
  EnrolledCourseDetail: {
    sections: Section[];
    courseId: string;
  };
  LessonVideoPlayer: {
    lesson: Lesson;
  };
};

type EnrolledCourseRouteProp = RouteProp<
  RootStackParamList,
  "EnrolledCourseDetail"
>;

const EnrolledCourseDetail: React.FC<EnrolledCourseProps> = ({
  navigation,
}) => {
  const route = useRoute<EnrolledCourseRouteProp>();

  let {
    sections,
    courseId,
  }: {
    sections: Section[];
    courseId: string;
  } = route.params ?? {};

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections[0]?._id ?? ""
  );

  const [isAnnouncementTabActive, setIsAnnouncementTabActive] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);



  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await elearning.getAnnouncement();
        const allAnnouncements = res.data as Announcement[];

        // Filter announcements by course ID
        const filteredAnnouncements: Announcement[] = allAnnouncements.filter(
          (ann: Announcement) => ann.course_id === courseId
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
  }, [isAnnouncementTabActive, courseId]);

  const selectedSection = sections.find((s) => s._id === selectedSectionId);

  return (
    <Screen backgroundColor={Colors.app.white}>
      {/* Section Tabs */}
      <View style={styles.sectionListContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sections.map((item) => {
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
                      navigation.navigate(routes.LESSON_VIEW, {
                        lesson,
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
    </Screen>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
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

export default EnrolledCourseDetail;
