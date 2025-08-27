import { Colors } from "@/constants/Colors";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import AppText from "../AppText";

interface AnimatedTitleRotatorProps {
  titles: string[];
  interval?: number; // in ms
}

const AnimatedTitleRotator: React.FC<AnimatedTitleRotatorProps> = ({
  titles,
  interval = 4000,
}) => {
  const [index, setIndex] = useState(0);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycleTitles = setInterval(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % titles.length);

        translateY.setValue(20);
        opacity.setValue(0);

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1.1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }).start();
        });
      });
    }, interval);

    return () => clearInterval(cycleTitles);
  }, [interval, titles.length]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.animatedText,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <MaskedView
          maskElement={
            <AppText style={[styles.bottomContentsTitle]}>
              {titles[index]}
            </AppText>
          }
        >
          <LinearGradient
            colors={[Colors.app.primary, "#FF7A00", "#FF3D00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <AppText style={[styles.bottomContentsTitle, { opacity: 0 }]}>
              {titles[index]}
            </AppText>
          </LinearGradient>
        </MaskedView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  animatedText: {
    minHeight: 40,
    justifyContent: "center",
  },
  bottomContentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "DM Sans",
    textAlign: "center",
    letterSpacing: 1,
  },
});

export default AnimatedTitleRotator;
