// components/AutoScrollRow.tsx
import { Marquee } from "@animatereactnative/marquee";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AutoScrollRowProps<T> {
  items: T[];
  speed?: number; // pixels per second
  reverse?: boolean;
  spacing?: number; // space between items
  renderItem: (item: T) => React.ReactNode;
}

function AutoScrollCourse<T>({
  items,
  speed = 1.2,
  reverse = false,
  spacing = 16,
  renderItem,
}: AutoScrollRowProps<T>) {
  if (!items?.length) return null;

  return (
    <View style={styles.container}>
      <Marquee
        direction="horizontal"
        speed={speed}
        spacing={spacing}
        reverse={reverse}
        style={{ height: 290 }} // match course card height
      >
        <View style={styles.row}>
          {items.map((item, index) => (
            <View key={index} style={{ marginHorizontal: spacing / 2 }}>
              {renderItem(item)}
            </View>
          ))}
        </View>
      </Marquee>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center" },
});

export default AutoScrollCourse;
