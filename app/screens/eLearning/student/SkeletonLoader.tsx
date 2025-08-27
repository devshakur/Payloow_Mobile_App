import React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const SkeletonLoader = ({ width = "100%", height = 200, borderRadius = 8 }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Convert width to number for animation
  const numericWidth = typeof width === "string" ? 200 : width;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-numericWidth, numericWidth],
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});

export default SkeletonLoader;
