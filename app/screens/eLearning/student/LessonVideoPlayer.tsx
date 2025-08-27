import AppText from "@/components/custom/AppText";
import { Lesson, Quiz } from "@/components/custom/eLearning/Course";
import { Colors } from "@/constants/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useVideoPlayer, VideoView } from "expo-video";
import { FunctionComponent, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import routes from "../../../navigations/routes";

const screenHeight = Dimensions.get("window").height;

type RootStackParamList = {
  LessonVideoPlayer: { lesson: Lesson };
  LessonQuizScreen: { quiz: Quiz };
};

interface LessonVideoPlayerProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

type LessonVideoRouteProp = RouteProp<RootStackParamList, "LessonVideoPlayer">;

const LessonVideoPlayer: FunctionComponent<LessonVideoPlayerProps> = ({
  navigation,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const route = useRoute<LessonVideoRouteProp>();

  let {
    lesson,
  }: {
    lesson: Lesson;
  } = route.params ?? {};

  const player = useVideoPlayer(lesson.videoUrl, (player) => {
    try {
      player.loop = false;
      player.play();
      // setIsVideoLoading(false);
    } catch (err) {
      console.error("Video Error:", err);
      setVideoError(true);
      // setIsVideoLoading(false);
    }
  });

  const videoHeight = screenHeight * 0.3;

  useEffect(() => {
    return () => {
      try {
        if (player && typeof player.pause === "function") {
          player.pause();
        }
      } catch (err) {
        console.warn("Error stopping video:", err);
      }
    };
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={{ height: videoHeight }}>
            {videoError ? (
              <AppText style={styles.errorText}>Video failed to load.</AppText>
            ) : isVideoLoading ? (
              <ActivityIndicator size="large" color={Colors.app.primary} />
            ) : (
              // <VideoView
              //   style={styles.video}
              //   player={player}
              //   allowsFullscreen
              //   allowsPictureInPicture={false}
              //   nativeControls
              //   showsTimecodes
              // />
              <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture={false}
                nativeControls
                showsTimecodes
                onLoad={() => setIsVideoLoading(false)}
                onError={() => {
                  setVideoError(true);
                  setIsVideoLoading(false);
                }}
              />
            )}
          </View>

          <View style={styles.lessonDetails}>
            <AppText style={styles.title}>{lesson.title}</AppText>

            <AppText style={styles.detail}>
              <AppText style={styles.label}>Duration: </AppText>
              {Math.floor(lesson.duration / 60)} min {lesson.duration % 60} sec
            </AppText>

            <AppText style={styles.detail}>
              <AppText style={styles.label}>Lesson Order: </AppText>
              {lesson.order}
            </AppText>

            <AppText style={styles.detail}>
              <AppText style={styles.label}>Created At: </AppText>
              {new Date(lesson.createdAt).toLocaleDateString()}
            </AppText>
          </View>

          {lesson.quizzes && lesson.quizzes.length > 0 && (
            <View style={styles.quizSection}>
              <AppText style={styles.quizTitle}>Quizzes</AppText>
            </View>
          )}
        </>
      }
      data={lesson.quizzes ?? []}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.quizItem}
          onPress={() =>
            navigation.navigate(routes.LESSON_QUIZ_SCREEN, {
              quiz: item,
            })
          }
        >
          <AppText style={styles.quizName}>{item.title}</AppText>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
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
  lessonDetails: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.app.dark,
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    marginVertical: 6,
    color: Colors.app.black,
  },
  label: {
    fontWeight: "bold",
    color: Colors.app.primary,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  quizSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.app.primary,
  },
  quizItem: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: Colors.app.primary,
    borderRadius: 8,
  },
  quizName: {
    fontSize: 16,
    color: Colors.app.white,
  },
});

export default LessonVideoPlayer;
