import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import elearning from "../../../app/api/elearning";
import Course, { CourseType } from "./Course";
import { GetCoursesResponse } from "./CourseList";

interface SearchCourseModalProps {
  visible?: boolean;
  onClose?: () => void;
  handleCardSelect: (product: CourseType) => void;
  navigation?: any;
}

const SearchCourseModal: FunctionComponent<SearchCourseModalProps> = ({
  visible,
  onClose,
  handleCardSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState<CourseType[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);

  const fetchCourses = async () => {
    try {
      const apiResponse = await elearning.getCourses();
      if (apiResponse.ok) {
        const data = apiResponse.data as GetCoursesResponse;
        setCourses(data.courses as CourseType[]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load courses");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.all([fetchCourses()]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchQuery === "") {
      setFiltered([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      const results = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(results);

      setRefreshing(false);
    }, 1000);

    setTypingTimeout(timeout as unknown as number);

    return () => clearTimeout(timeout);
  }, [searchQuery, courses]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Modal visible={visible} animationType="slide" transparent={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={24}
              color={Colors.app.dark}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search for a phone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <Course course={item} onPress={() => handleCardSelect(item)} />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.app.white,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default SearchCourseModal;
