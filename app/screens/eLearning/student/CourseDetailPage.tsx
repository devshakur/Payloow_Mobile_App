import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { FunctionComponent, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../../../../components/custom/AppButton";
import AppText from "../../../../components/custom/AppText";
import {
  CourseType,
  Section,
} from "../../../../components/custom/eLearning/Course";
import ErrorModal from "../../../../components/custom/ErrorModal";
import LoadingModal from "../../../../components/custom/LoadingModal";
import Screen from "../../../../components/custom/Screen";
import SuccessModal from "../../../../components/custom/SuccessModal";
import elearning from "../../../api/elearning";
import routes from "../../../navigations/routes";

const screenHeight = Dimensions.get("window").height;
const DEFAULT_VIDEO_URL =
  "https://res.cloudinary.com/dfm4vg6vz/video/upload/v1711804182/course-intro-video_e4gvkz.mp4";

// Define stack params
type RootStackParamList = {
  CourseDetailPage: { course: CourseType };
  EnrolledCourseDetail: { sections: Section[]; courseId: string };
  MessageTutor: { receiverId: string };
  TutorScreen: { receiverId: string };
};

type CourseDetailPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CourseDetailPage">;
};

type CourseDetailPageRouteProp = RouteProp<
  RootStackParamList,
  "CourseDetailPage"
>;

interface ErroResponse {
  error: string;
}

const CourseDetailPage: FunctionComponent<CourseDetailPageProps> = ({
  navigation,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const route = useRoute<CourseDetailPageRouteProp>();

  let {
    course,
  }: {
    course: CourseType;
  } = route.params ?? {};

  const videoUri = course.introductory_video_url || DEFAULT_VIDEO_URL;
  const videoHeight = screenHeight * 0.3;

  const player = useVideoPlayer(videoUri, (player) => {
    try {
      player.loop = true;
      player.play();
      setIsVideoLoading(false);
    } catch (err) {
      console.error("Video Error:", err);
      setVideoError(true);
      setIsVideoLoading(false);
    }
  });

  const checkOut = async () => {
    try {
      setLoading(true);
      const result = await elearning.directEnroll(course._id);

      if (result.ok) {
        setSuccessMessage("Success");
      }
      const data = result.data as ErroResponse;
      setErrorMessage(data.error);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Video Section */}
        <View style={{ height: videoHeight }}>
          {videoError ? (
            <AppText style={styles.errorText}>Video failed to load.</AppText>
          ) : isVideoLoading ? (
            <ActivityIndicator size="large" color={Colors.app.primary} />
          ) : (
            <VideoView
              style={styles.video}
              player={player}
              allowsFullscreen={true}
              allowsPictureInPicture={false}
              nativeControls
              showsTimecodes
            />
          )}
        </View>

        {/* Course Details Section */}
        <View style={styles.moreDetailsContents}>
          <AppText style={styles.title}>{course.title}</AppText>

          <AppText style={styles.text}>
            {course.description || "No description available."}
          </AppText>

          <AppText style={styles.text}>
            <AppText style={styles.label}>Category: </AppText>
            {course.category || "Uncategorized"}
          </AppText>

          <AppText style={styles.text}>
            <AppText style={styles.label}>Tags: </AppText>
            {(course.tags || []).join(", ") || "No tags"}
          </AppText>

          <AppText style={styles.text}>
            <AppText style={styles.label}>Sections: </AppText>
            {course.sections?.length || 0} sections
          </AppText>
        </View>
        <View style={styles.messageTutorSection}>
          <AppText style={styles.messageLabel}>
            Need help or have questions about this course?
          </AppText>
          <AppButton
            onPress={() =>
              navigation.navigate(routes.MESSAGE_TUTOR, {
                receiverId: course.tutor_id,
              })
            }
            btnContainerStyle={styles.btn}
            titleStyle={styles.titleStyle}
            title=" Message the Tutor"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate(routes.ENROLLED_COURSE, {
              sections: course.sections,
              courseId: course._id,
            })
          }
        >
          <AppText style={styles.buttonText}>Go to Course</AppText>
        </TouchableOpacity>
      </ScrollView>
      {loading && <LoadingModal visible={loading} />}

      <ErrorModal
        responseText={errorMessage}
        visible={Boolean(errorMessage)}
        onClose={() => setErrorMessage("")}
      />

      <SuccessModal
        responseText={successMessage}
        visible={Boolean(successMessage)}
        onClose={() => setSuccessMessage("")}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  moreDetailsContents: {
    padding: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.app.dark,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
    color: Colors.app.black,
  },
  label: {
    fontWeight: "bold",
    color: Colors.app.light,
  },

  messageTutorSection: {
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  messageLabel: {
    fontSize: 14,
    color: Colors.app.dark,
    marginBottom: 8,
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: Colors.app.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  btn: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: Colors.app.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },

  titleStyle: {
    fontWeight: "normal",
    fontSize: 16,
    color: Colors.app.white,
  },
});

export default CourseDetailPage;
