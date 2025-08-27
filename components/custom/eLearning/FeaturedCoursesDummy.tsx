import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Course from "./Course";

const { width } = Dimensions.get("window");

// Dummy course data
const dummyCourses = [
  {
    id: "1",
    title: "React Native for Beginners",
    description: "Learn to build mobile apps with React Native and Expo.",
    category: "Mobile",
    price: 120,
    discount_price: 99,
    thumbnailUrl: "https://picsum.photos/id/1011/400/300",
    students_enrolled: 230,
    created_at: "2025-08-01T00:00:00Z",
    numberOfReviews: 45,
  },
  // ... more courses
];

const FeaturedCoursesDummy = ({
  onCoursePress,
}: {
  onCoursePress?: (course: any) => void;
}) => {
  const [loading, setLoading] = useState(true);

  // simple fade animation loop for skeleton shimmer
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fake API call delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [opacity]);

  if (loading) {
    // Skeleton loader (mimicking course cards)
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item.toString()} style={{ marginRight: 12 }}>
              <Animated.View style={[styles.skeletonCard, { opacity }]}>
                <View style={styles.skeletonThumbnail} />
                <View style={styles.skeletonText} />
                <View style={[styles.skeletonText, { width: "60%" }]} />
              </Animated.View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {dummyCourses.map((course, index) => (
          <View key={course.id} style={{ marginRight: index < dummyCourses.length - 1 ? 12 : 0 }}>
            <Course course={course} onPress={() => onCoursePress?.(course)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedCoursesDummy;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
  },
  skeletonCard: {
    width: width * 0.6,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  skeletonThumbnail: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  skeletonText: {
    height: 15,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    width: "80%",
  },
});
