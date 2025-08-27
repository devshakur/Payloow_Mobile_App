import elearning from "@/app/api/elearning";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CourseType } from "../../../../components/custom/eLearning/Course";
import { GetCoursesResponse } from "../../../../components/custom/eLearning/CourseList";
import Screen from "../../../../components/custom/Screen";
import { useUser } from "../../../context/UserProvider";

// This must match your stack navigator type
type RootStackParamList = {
  Chat: {
    receiverId: string;
  };
};

interface CourseChatDashboardProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Chat">;
}

const CourseChatDashboard: React.FC<CourseChatDashboardProps> = ({
  navigation,
}) => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiResponse = await elearning.getCourses();
        const data = apiResponse.data as GetCoursesResponse;
        setCourses(data.courses);
      } catch (err) {
        Alert.alert("Error", "Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  const openChat = (course: CourseType) => {
    if (!user?.data._id || !course.tutor_id) {
      Alert.alert("Error", "User or tutor ID is missing");
      return;
    }

    navigation.navigate("Chat", {
      receiverId: course.tutor_id,
    });
  };

  return (
    <Screen>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openChat(item)}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>Tap to chat with tutor</Text>
              <Text style={styles.subtitle}>Tutor ID: {item.tutor_id}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    color: "#555",
  },
});

export default CourseChatDashboard;
