// components/Bubbles.tsx
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BubbleProps {
  cx: number;
  r: number;
  color: string;
  opacity: number;
  duration: number;
}

const Bubble: React.FC<BubbleProps> = ({ cx, r, color, opacity, duration }) => {
  const y = useSharedValue(height + Math.random() * 200);

  useEffect(() => {
    y.value = withRepeat(
      withTiming(-50, { duration }), // float upwards
      -1, // infinite
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    cy: y.value,
  }));

  return (
    <AnimatedCircle
      cx={cx}
      r={r}
      fill={color}
      opacity={opacity}
      animatedProps={animatedProps}
    />
  );
};

const Bubbles = () => {
  const bubbleCount = 20;
  const colors = ["#3B82F6", "#60A5FA", "#06B6D4", "#6366F1"];

  return (
    <Svg
      height="100%"
      width="100%"
      pointerEvents="none" // 🔑 lets scroll/taps pass through
      style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}
    >
      {Array.from({ length: bubbleCount }).map((_, i) => (
        <Bubble
          key={i}
          cx={Math.random() * width}
          r={Math.random() * 15 + 8}
          color={colors[Math.floor(Math.random() * colors.length)]}
          opacity={Math.random() * 0.3 + 0.05}
          duration={Math.random() * 6000 + 4000}
        />
      ))}
    </Svg>
  );
};

export default Bubbles;
