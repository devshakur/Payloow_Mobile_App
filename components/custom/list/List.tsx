import { Colors } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../AppText";

// Define the props for the List component
interface ListProps {
  rightLabel?: string;
  rightTopLabel?: string;
  rightBottomLabel?: string;
  leftLabel?: string;
  leftImageSource?: any;
  leftIcon?: any;
  rightIcon?: any;
  leftTopLabel?: string;
  leftBottomLabel?: string;
  leftBottomIcon?: any;
  onPress?: any;
  listStyle?: any;
  rightLabelStyle?: any;
  leftTopLabelStyle?: any;
  leftBottomLabelStyle?: any;
  rightTopLabelStyle?: any;
  rightBottomLabelStyle?: any;
  leftBottomContainer?: any;
}

const List: React.FC<ListProps> = ({
  rightLabel,
  rightTopLabel,
  rightBottomLabel,
  leftLabel,
  leftImageSource,
  rightIcon,
  leftIcon,
  leftTopLabel,
  leftBottomLabel,
  leftBottomIcon = null,
  listStyle,
  rightLabelStyle,
  leftBottomLabelStyle,
  leftTopLabelStyle,
  rightTopLabelStyle,
  rightBottomLabelStyle,
  leftBottomContainer,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.listContainer, listStyle]}>
        {/* Left list contents */}
        <View style={styles.innerContainer}>
          {leftImageSource && (
            <Image style={styles.iconStyle} source={leftImageSource} />
          )}
          {leftIcon && leftIcon}
          <View style={[styles.textContainer]}>
            {leftTopLabel && (
              <AppText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.leftTopLabel, leftTopLabelStyle]}
              >
                {leftTopLabel}
              </AppText>
            )}
            {leftLabel && (
              <AppText style={styles.leftLabel}>{leftLabel}</AppText>
            )}
            {leftBottomLabel && leftBottomIcon === null && (
              <AppText style={[styles.leftBottomLabel, leftBottomLabelStyle]}>
                {leftBottomLabel}
              </AppText>
            )}
            {leftBottomLabel && leftBottomIcon && (
              <View style={styles.leftBottomLabelIcon}>
                {leftBottomIcon}
                <AppText style={styles.leftBottomLabel}>
                  {leftBottomLabel}
                </AppText>
              </View>
            )}
            {leftBottomContainer}
          </View>
        </View>

        {/* Right list contents */}
        <View style={styles.innerContainer}>
          <View style={[styles.textContainer]}>
            {rightLabel && (
              <AppText style={[styles.rightLabel, rightLabelStyle]}>
                {rightLabel}
              </AppText>
            )}
            {rightTopLabel && (
              <AppText style={[styles.rightTopLabel, rightTopLabelStyle]}>
                {rightTopLabel}
              </AppText>
            )}
            {rightBottomLabel && (
              <AppText style={[styles.rightBottomLabel, rightBottomLabelStyle]}>
                {rightBottomLabel}
              </AppText>
            )}
          </View>
          {rightIcon && rightIcon}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
    marginBottom: 5,
    alignSelf: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "center",
  },
  iconStyle: {
    borderRadius: 8,
    width: 80,
    height: 80,
  },
  textContainer: {
    gap: 4,
  },
  leftTopLabel: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: Colors.app.black,
  },
  leftLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  leftBottomLabel: {
    fontSize: 12,
    color: "#666666",
  },
  rightLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  rightTopLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.app.white,
  },
  rightBottomLabel: {
    fontSize: 12,
    color: "#666666",
  },
  leftBottomLabelIcon: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default List;
