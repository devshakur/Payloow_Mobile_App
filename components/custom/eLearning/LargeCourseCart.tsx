import React, { FunctionComponent } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

import CourseBadge from "./CourseBadge";
import { Colors } from "@/constants/Colors";

interface LargeCourseCartProps {}

const LargeCourseCart: FunctionComponent<LargeCourseCartProps> = () => {
  return (
    <View style={styles.courseContainer}>
      <Image
        style={styles.img}
        source={require("../../../assets/images/custom/course-img.png")}
      />
      <View
        style={{
          alignSelf: "center",
          gap: 10,
          padding: 5,
          width: "90%",
        }}
      >
        <CourseBadge />
        <Progress.Bar progress={0.8} width={200} />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          Backend Development Crash Course
        </Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          Dive into the world of backend development withe the best mentor in
          the industry
        </Text>
        <Text style={styles.tutor}>By John Lui</Text>
        <Text style={styles.duration}>Lesson time: 10hrs</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.oldPrice}>₦4000.00</Text>
          <Text style={styles.newPrice}>₦4000.00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    width: 261,
    height: 355,
    backgroundColor: Colors.app.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  img: {},
  title: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    height: 18,
    fontStyle: "normal",
  },
  description: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    height: 18,
    fontStyle: "normal",
  },
  tutor: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    height: 18,
    fontStyle: "normal",
  },
  duration: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "500",
    height: 18,
    fontStyle: "normal",
  },
  priceContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    alignSelf: "flex-start",
  },
  oldPrice: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "500",
    height: 28,
    fontStyle: "normal",
  },
  newPrice: {
    color: Colors.app.black,
    fontFamily: "DM Sans",
    fontSize: 18,
    fontWeight: "500",
    height: 28,
    fontStyle: "normal",
  },
});
export default LargeCourseCart;
