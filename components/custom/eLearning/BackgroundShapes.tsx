// components/BackgroundShapes.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Ellipse, Rect } from "react-native-svg";

const BackgroundShapes = () => {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      {/* Top-left big circle */}
      <Circle cx="-50" cy="-30" r="150" fill="#3B82F6" opacity={0.12} />

      {/* Floating rectangle right */}
      <Rect
        x="280"
        y="120"
        width="180"
        height="180"
        rx="40"
        fill="#60A5FA"
        opacity={0.15}
      />

      {/* Bottom-left ellipse */}
      <Ellipse cx="50" cy="700" rx="120" ry="80" fill="#6366F1" opacity={0.1} />

      {/* Small floating circle */}
      <Circle cx="320" cy="500" r="60" fill="#06B6D4" opacity={0.12} />
    </Svg>
  );
};

export default BackgroundShapes;
