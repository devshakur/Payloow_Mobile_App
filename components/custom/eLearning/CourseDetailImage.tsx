import routes from "@/app/navigations/routes";
import AppText from "@/components/custom/AppText";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { FunctionComponent } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface CourseDetailImageProps {
  navigation: any;
  title?: string;
  thumbnailUrl?: string;
  likes?: number;
  comments?: number;
}

const DEFAULT_THUMBNAIL =
  "https://img.youtube.com/vi/YE7VzlLtp-4/maxresdefault.jpg";

const CourseDetailImage: FunctionComponent<CourseDetailImageProps> = ({
  navigation,
  title = "Course Title",
  thumbnailUrl = DEFAULT_THUMBNAIL,
  likes = 0,
  comments = 0,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(routes.COURSE_CHECKOUT, {
            // Add course params if needed
          })
        }
        style={styles.card}
        activeOpacity={0.8}
      >
        <Image source={{ uri: thumbnailUrl }} style={styles.image} />
      </TouchableOpacity>
      <AppText style={styles.title}>{title}</AppText>
      <View style={styles.likeAndCommentRow}>
        <View style={styles.likeCommentInner}>
          <MaterialIcons name="favorite" color={Colors.app.failed} size={22} />
          <AppText style={styles.count}>{likes}</AppText>
        </View>
        <View style={styles.likeCommentInner}>
          <MaterialIcons
            name="chat-bubble-outline"
            color={Colors.app.primary}
            size={22}
          />
          <AppText style={styles.count}>{comments}</AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "48%",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: Colors.app.white,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "cover",
    borderRadius: 16,
  },
  likeAndCommentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 8,
    gap: 18,
  },
  likeCommentInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    color: Colors.app.black,
  },
  count: {
    fontSize: 14,
    marginLeft: 2,
    color: Colors.app.dark,
  },
});

export default CourseDetailImage;
